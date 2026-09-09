import { useEffect, useRef, useState } from "react";
import {
  CircleArrowUp,
  CircleArrowDown,
  CircleArrowLeft,
  CircleArrowRight,
  Orbit,
  Move,
} from "lucide-react";
import * as THREE from "three";
import { generateBuildingCells, type MatrixCell, type BuildingType } from "@/lib/building-shapes";

/**
 * Traces the true outline of the massing per level — a horizontal contour
 * ring following the actual occupied footprint (handles setbacks, wings,
 * courtyards, …) plus vertical struts only at real corners — instead of
 * outlining every individual voxel face. That's what keeps a wireframe
 * reading as a building's frame rather than a dense cube-grid mesh.
 */
function buildWireframeSegments(
  cells: MatrixCell[],
  cell: number,
  levelH: number,
  cx: number,
  cz: number,
): Float32Array {
  const occ = new Map<number, Set<string>>();
  let maxCols = 0;
  let maxRows = 0;
  for (const c of cells) {
    const i = Math.round(c.x / cell + cx);
    const j = Math.round(c.z / cell + cz);
    maxCols = Math.max(maxCols, i + 1);
    maxRows = Math.max(maxRows, j + 1);
    if (!occ.has(c.level)) occ.set(c.level, new Set());
    occ.get(c.level)!.add(`${i},${j}`);
  }

  const positions: number[] = [];
  const seg = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
    positions.push(x1, y1, z1, x2, y2, z2);
  };
  const wx = (i: number) => (i - cx) * cell;
  const wz = (j: number) => (j - cz) * cell;

  for (const [level, set] of occ) {
    const isOcc = (i: number, j: number) => set.has(`${i},${j}`);
    const y0 = level * levelH;
    const y1 = (level + 1) * levelH;

    for (const key of set) {
      const [i, j] = key.split(",").map(Number) as [number, number];
      const x0 = wx(i - 0.5);
      const x1w = wx(i + 0.5);
      const z0 = wz(j - 0.5);
      const z1w = wz(j + 0.5);

      if (!isOcc(i - 1, j)) {
        seg(x0, y0, z0, x0, y0, z1w);
        seg(x0, y1, z0, x0, y1, z1w);
      }
      if (!isOcc(i + 1, j)) {
        seg(x1w, y0, z0, x1w, y0, z1w);
        seg(x1w, y1, z0, x1w, y1, z1w);
      }
      if (!isOcc(i, j - 1)) {
        seg(x0, y0, z0, x1w, y0, z0);
        seg(x0, y1, z0, x1w, y1, z0);
      }
      if (!isOcc(i, j + 1)) {
        seg(x0, y0, z1w, x1w, y0, z1w);
        seg(x0, y1, z1w, x1w, y1, z1w);
      }
    }

    // vertical struts, only where the footprint boundary actually turns
    for (let p = 0; p <= maxCols; p++) {
      for (let q = 0; q <= maxRows; q++) {
        const sw = isOcc(p - 1, q - 1);
        const se = isOcc(p, q - 1);
        const nw = isOcc(p - 1, q);
        const ne = isOcc(p, q);
        const count = Number(sw) + Number(se) + Number(nw) + Number(ne);
        if (count === 0 || count === 4) continue;
        const x = wx(p - 0.5);
        const z = wz(q - 0.5);
        seg(x, y0, z, x, y1, z);
      }
    }
  }

  return new Float32Array(positions);
}

/**
 * Groups cells by level and keeps only the ones on the outer perimeter of
 * that level's occupied footprint — real voxels a comment marker can sit
 * on, instead of a synthetic point that may float outside the actual
 * massing for non-rectangular typologies (courtyards, wings, tapers).
 */
function computeLevelBoundaryCells(
  cells: MatrixCell[],
  cellSize: number,
  cx: number,
  cz: number,
): Map<number, MatrixCell[]> {
  const key = (i: number, j: number) => `${i},${j}`;
  const coord = new Map<MatrixCell, readonly [number, number]>();
  const occ = new Map<number, Set<string>>();
  for (const c of cells) {
    const i = Math.round(c.x / cellSize + cx);
    const j = Math.round(c.z / cellSize + cz);
    coord.set(c, [i, j]);
    if (!occ.has(c.level)) occ.set(c.level, new Set());
    occ.get(c.level)!.add(key(i, j));
  }
  const result = new Map<number, MatrixCell[]>();
  for (const c of cells) {
    const [i, j] = coord.get(c)!;
    const set = occ.get(c.level)!;
    const isBoundary =
      !set.has(key(i - 1, j)) ||
      !set.has(key(i + 1, j)) ||
      !set.has(key(i, j - 1)) ||
      !set.has(key(i, j + 1));
    if (isBoundary) {
      if (!result.has(c.level)) result.set(c.level, []);
      result.get(c.level)!.push(c);
    }
  }
  return result;
}

/** Deterministic string hash, used to pick a stable boundary cell per comment/note id. */
function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export type ViewMode = "perspective" | "plan" | "section";

export type MatrixSettings = {
  levels: number;
  density: number; // 1..3 voxel subdivisions
  mode: "solid" | "wire" | "ghost";
  activeLevel: number;
  autoRotate: boolean;
  buildingType: BuildingType;
  viewMode: ViewMode;
};

type Props = MatrixSettings & {
  onStats?: (s: { voxels: number; fps: number }) => void;
  /** Increment to animate the camera into a close-up on `activeLevel`. */
  focusRequestId?: number;
  /** Increment to animate the camera back out to the building's default
   * overview framing — the "balcony view" it opens on, not wherever the
   * close-up left the orbit. */
  unfocusRequestId?: number;
  /** While true, reports the active level marker's on-screen position
   * (client/viewport coordinates) every frame via `onMarkerPosition`, so a
   * connector line can track it live as the model rotates or zooms. Left
   * false the rest of the time so nothing gets recomputed for no reason. */
  markerActive?: boolean;
  /** The linked comment/note id — seeds which real boundary voxel the
   * marker physically sits on, so distinct comments on the same level
   * don't collapse onto the same point. */
  activeMarkerId?: string | undefined;
  /** True while a comment is focused (close-up) — keyboard nav steps get
   * much shorter, since this is a proximity/detail zone, not open travel. */
  closeUp?: boolean;
  /** Whether the focused comment/note is about the inside of the building
   * (a core, a courtyard, a lobby) rather than its outer massing — sets how
   * close focusLevel brings the camera to rest: standing on the floor of
   * that level vs. a stationary helicopter shot just outside it. */
  closeUpInterior?: boolean;
  onMarkerPosition?: (pos: { x: number; y: number } | null) => void;
  /** Comments/notes to project all at once, for the "show every marker"
   * overview — independent of the single `markerActive` one. */
  overviewMarkers?: { id: string; levelIndex: number }[];
  onOverviewPositions?: (positions: Record<string, { x: number; y: number } | null>) => void;
  /** Horizontal space (px) currently reserved by the comments panel, so the
   * on-canvas nav indicator can tuck into the corner without colliding. */
  panelInsetPx?: number;
};

type Direction = "up" | "down" | "left" | "right";

export default function MatrixCanvas(props: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const settingsRef = useRef(props);
  settingsRef.current = props;

  // Keyboard-orbit: held directly (no re-render) for the tick loop, mirrored
  // into state only to light up the on-screen indicator.
  const heldKeysRef = useRef<Record<Direction, boolean>>({
    up: false,
    down: false,
    left: false,
    right: false,
  });
  // Shift swaps the up/down keys from vertical tilt/pedestal to a forward/
  // backward dolly, reusing the same radius the mouse wheel already drives.
  const shiftHeldRef = useRef(false);
  const [activeKeys, setActiveKeys] = useState<Record<Direction, boolean>>({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  // Arrow keys either orbit around the model (default) or truck/pedestal
  // the camera in a straight line — a mode swap, not a modifier combo.
  const [navMode, setNavMode] = useState<"orbit" | "pan">("orbit");
  const navModeRef = useRef(navMode);
  navModeRef.current = navMode;
  // Ctrl (Windows) / Option (Mac) toggles the mode with a single press — no
  // need to hold it. modKeyDownRef guards against the browser's key-repeat
  // re-firing the toggle while the key stays physically down.
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
  const modKeyName = isMac ? "Alt" : "Control";
  const modKeyDownRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.Fog(0xced4c1, 90, 230);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 500);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.cursor = "grab";

    const root = new THREE.Group();
    scene.add(root);

    scene.add(new THREE.AmbientLight(0xc9ccd1, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(30, 48, 26);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x7f8a99, 0.7);
    rim.position.set(-34, 14, -28);
    scene.add(rim);

    // Sky dome: gives the model a bounded, enclosed volume instead of an
    // undefined void, whichever way the camera orbits.
    const skyGeo = new THREE.SphereGeometry(260, 32, 16);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0xe6edf0) },
        bottomColor: { value: new THREE.Color(0xced4c1) },
      },
      vertexShader: `
        varying vec3 vPos;
        void main() {
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        varying vec3 vPos;
        void main() {
          float h = clamp(normalize(vPos).y * 0.5 + 0.5, 0.0, 1.0);
          gl_FragColor = vec4(mix(bottomColor, topColor, h), 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // Countryside ground disc: a finite, minimal grass field the model
    // visibly rests on, instead of a grid stretching off into nothing.
    const floorCanvas = document.createElement("canvas");
    floorCanvas.width = floorCanvas.height = 512;
    const fctx = floorCanvas.getContext("2d")!;
    const fgrad = fctx.createRadialGradient(256, 256, 20, 256, 256, 256);
    fgrad.addColorStop(0, "#9cae87");
    fgrad.addColorStop(0.55, "#8da476");
    fgrad.addColorStop(1, "#ccd3c2");
    fctx.fillStyle = fgrad;
    fctx.fillRect(0, 0, 512, 512);
    const speckleColors = ["#89a171", "#7c9866", "#a8b994", "#93a87e"];
    for (let i = 0; i < 900; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const d = Math.hypot(x - 256, y - 256) / 256;
      if (Math.random() < d * 0.5) continue;
      fctx.fillStyle = speckleColors[i % speckleColors.length]!;
      fctx.globalAlpha = 0.12 + Math.random() * 0.1;
      fctx.beginPath();
      fctx.arc(x, y, 1.5 + Math.random() * 2.5, 0, Math.PI * 2);
      fctx.fill();
    }
    fctx.globalAlpha = 1;

    // scattered paved / concrete patches so the ground reads as a real,
    // lived-in site rather than a pure lawn
    const pavedColors = ["#b7b7b0", "#c3c2ba", "#aeada6"];
    for (let p = 0; p < 5; p++) {
      const px = 140 + Math.random() * 232;
      const py = 140 + Math.random() * 232;
      const pw = 40 + Math.random() * 70;
      const ph = 30 + Math.random() * 50;
      fctx.save();
      fctx.translate(px, py);
      fctx.rotate(Math.random() * Math.PI);
      fctx.globalAlpha = 0.5 + Math.random() * 0.25;
      fctx.fillStyle = pavedColors[p % pavedColors.length]!;
      fctx.beginPath();
      fctx.ellipse(0, 0, pw, ph, 0, 0, Math.PI * 2);
      fctx.fill();
      fctx.restore();
    }
    fctx.globalAlpha = 1;

    const floorTexture = new THREE.CanvasTexture(floorCanvas);

    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext("2d")!;
    const sgrad = sctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    sgrad.addColorStop(0, "rgba(30,32,36,0.32)");
    sgrad.addColorStop(0.7, "rgba(30,32,36,0.12)");
    sgrad.addColorStop(1, "rgba(30,32,36,0)");
    sctx.fillStyle = sgrad;
    sctx.fillRect(0, 0, 256, 256);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);

    const floorGeo = new THREE.CircleGeometry(220, 64);
    const floorMat = new THREE.MeshBasicMaterial({ map: floorTexture, fog: false });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // A handful of simple stylised trees scattered around the site, kept
    // well clear of the largest possible footprint so they never overlap
    // the model whatever the density.
    const trees = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(0.35, 0.45, 2.2, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: "#7a6a52", roughness: 0.9 });
    const canopyGeo = new THREE.SphereGeometry(1, 7, 6);
    const canopyMats = ["#5f7a4c", "#6d8858", "#547144"].map(
      (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.85 }),
    );
    const exclusionRadius = 20;
    for (let t = 0; t < 16; t++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = exclusionRadius + Math.random() * 45;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const scale = 0.7 + Math.random() * 0.7;
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.1 * scale;
      trunk.scale.set(scale, scale, scale);
      const canopy = new THREE.Mesh(canopyGeo, canopyMats[t % canopyMats.length]);
      canopy.position.y = 2.6 * scale;
      canopy.scale.set(1.3 * scale, 1.5 * scale, 1.3 * scale);
      tree.add(trunk, canopy);
      tree.position.set(x, 0, z);
      trees.add(tree);
    }
    scene.add(trees);

    let disposables: Array<{ dispose: () => void }> = [];
    let instanced: THREE.InstancedMesh | null = null;
    let edges: THREE.LineSegments | null = null;
    let highlight: THREE.Mesh | null = null;
    let shadow: THREE.Mesh | null = null;
    let floorSlabs: THREE.InstancedMesh | null = null;
    let lastTotalH = 0;
    let lastLevelH = 1;
    let lastFootprintX = 20;
    let lastFootprintZ = 16;
    let lastActiveLevel = 0;
    let lastCellSize = 1;
    let levelBoundaryCells = new Map<number, MatrixCell[]>();

    function buildMatrix() {
      const { levels, density, mode, activeLevel, buildingType, viewMode } = settingsRef.current;
      if (instanced) root.remove(instanced);
      if (edges) root.remove(edges);
      if (highlight) root.remove(highlight);
      if (shadow) root.remove(shadow);
      if (floorSlabs) root.remove(floorSlabs);
      disposables.forEach((d) => d.dispose());
      disposables = [];

      const generated = generateBuildingCells(buildingType, levels, density);
      const { cell, cols, rows, levelH } = generated;
      // Section view: slice away half the volume so the cut face reveals
      // the internal levels instead of the building's outer skin.
      const cells =
        viewMode === "section" ? generated.cells.filter((c) => c.x <= 0) : generated.cells;

      const geo = new THREE.BoxGeometry(cell * 0.995, levelH * 0.995, cell * 0.995);
      const mat = new THREE.MeshStandardMaterial({
        metalness: 0.08,
        roughness: 0.62,
        transparent: true,
        opacity: mode === "ghost" ? 0.28 : 0.96,
        wireframe: false,
      });
      disposables.push(geo, mat);

      instanced = new THREE.InstancedMesh(geo, mat, cells.length);
      const dummy = new THREE.Object3D();
      const colA = new THREE.Color("#4d5866");
      const colB = new THREE.Color("#a3b3c4");
      const active = new THREE.Color("#e0a568");
      cells.forEach((c, idx) => {
        dummy.position.set(c.x, c.y, c.z);
        dummy.updateMatrix();
        instanced!.setMatrixAt(idx, dummy.matrix);
        const t = c.level / Math.max(1, levels - 1);
        const col =
          c.level === activeLevel ? active : colA.clone().lerp(colB, 0.15 + t * 0.85);
        instanced!.setColorAt(idx, col);
      });
      instanced.instanceMatrix.needsUpdate = true;
      if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;
      if (mode !== "wire") root.add(instanced);

      if (mode !== "solid") {
        const positions = buildWireframeSegments(cells, cell, levelH, generated.cx, generated.cz);
        const eg = new THREE.BufferGeometry();
        eg.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const em = new THREE.LineBasicMaterial({
          color: mode === "wire" ? 0x3d4450 : 0x6b6f76,
          transparent: true,
          opacity: mode === "wire" ? 0.85 : 0.3,
        });
        disposables.push(eg, em);
        edges = new THREE.LineSegments(eg, em);
        root.add(edges);

        // A mix of material and matrix: thin concrete floor slabs at every
        // storey inside the wire cage, so it reads as a real building under
        // construction rather than a pure abstract frame.
        const slabGeo = new THREE.BoxGeometry(cell * 0.995, levelH * 0.1, cell * 0.995);
        const slabMat = new THREE.MeshStandardMaterial({
          color: "#c9cbce",
          metalness: 0.05,
          roughness: 0.85,
          transparent: true,
          opacity: 0.92,
        });
        disposables.push(slabGeo, slabMat);
        floorSlabs = new THREE.InstancedMesh(slabGeo, slabMat, cells.length);
        const slabDummy = new THREE.Object3D();
        cells.forEach((c, idx) => {
          slabDummy.position.set(c.x, c.y - levelH * 0.44, c.z);
          slabDummy.updateMatrix();
          floorSlabs!.setMatrixAt(idx, slabDummy.matrix);
        });
        floorSlabs.instanceMatrix.needsUpdate = true;
        root.add(floorSlabs);
      }

      // active level plane
      const planeW = cols * cell;
      const pg = new THREE.PlaneGeometry(planeW * 1.15, rows * cell * 1.15);
      const pm = new THREE.MeshBasicMaterial({
        color: 0xe0a568,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
      });
      disposables.push(pg, pm);
      highlight = new THREE.Mesh(pg, pm);
      highlight.rotation.x = -Math.PI / 2;
      highlight.position.y = activeLevel * levelH - levelH * 0.55;
      root.add(highlight);

      // contact shadow grounding the footprint to the studio floor
      const sg = new THREE.PlaneGeometry(planeW * 2.2, rows * cell * 2.2);
      const sm = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false,
        fog: false,
      });
      disposables.push(sg, sm);
      shadow = new THREE.Mesh(sg, sm);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -levelH * 0.55 + 0.02;
      root.add(shadow);

      const totalH = levels * levelH;
      root.position.y = -totalH / 2;
      floor.position.y = -totalH / 2 - 0.42;
      trees.position.y = floor.position.y;

      lastTotalH = totalH;
      lastLevelH = levelH;
      lastFootprintX = cols * cell;
      lastFootprintZ = rows * cell;
      lastActiveLevel = activeLevel;
      lastCellSize = cell;
      levelBoundaryCells = computeLevelBoundaryCells(cells, cell, generated.cx, generated.cz);

      return cells.length;
    }

    let voxelCount = buildMatrix();

    // camera orbit state — this is also the "balcony view" overview the
    // camera returns to when a close-up ends (see unfocusLevel below).
    const OVERVIEW_THETA = 0.9;
    const OVERVIEW_PHI = 1.95;
    const OVERVIEW_RADIUS = 78;
    let theta = OVERVIEW_THETA;
    let phi = OVERVIEW_PHI;
    let radius = OVERVIEW_RADIUS;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let velocity = 0.0016;

    // close-up "enter the zone" animation, triggered by focusRequestId
    let targetRadius = radius;
    let lookY = 0;
    let targetLookY = 0;
    // The look-at target's horizontal position — normally the vertical core
    // (0,0), but pulled onto the anchor's real x/z while focusing so the
    // marker actually lands centred on screen instead of merely visible
    // somewhere near the core's height.
    let lookX = 0;
    let targetLookX = 0;
    let lookZ = 0;
    let targetLookZ = 0;
    let targetTheta = theta;
    let targetPhi = phi;
    // The shared orbit is centred on a fixed world-space height (see the
    // literal below), tuned for the default overview. A close-up needs to
    // sit level with its own anchor instead — for a low level (a socle, a
    // parking level) or a high one, that anchor can be far from that fixed
    // centre, and no amount of radius can reach a level line of sight to it
    // while still orbiting around the wrong height (the tilt just gets
    // steeper — "no recul", grazing the ground). So the close-up moves the
    // orbit's own vertical centre to the anchor's height instead of trying
    // to compensate with phi.
    let cameraPivotY = 18;
    let targetCameraPivotY = 18;
    let focusing = false;
    let markerWasActive = false;
    let overviewWasActive = false;
    const markerWorld = new THREE.Vector3();
    // Straight-line pan offset (world space), applied equally to the camera
    // and its look-at target so the whole rig tracks sideways/up/down
    // without changing viewing angle — a truck/pedestal move, not an orbit.
    const panOffset = new THREE.Vector3();
    const targetPan = new THREE.Vector3();
    // shortest-path angle delta, so the focus turn never spins the long way around
    const angleDelta = (from: number, to: number) => {
      let d = (to - from) % (Math.PI * 2);
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      return d;
    };

    // Real, physical anchor for a comment/note: a boundary voxel of that
    // level, nudged out to its outer face — `seed` (the comment/note id)
    // picks a stable one so several markers on the same level don't
    // collapse onto the same spot. Falls back to a synthetic footprint
    // corner (still off the vertical rotation axis) if the level has no
    // real cells.
    const getAnchorPoint = (levelIndex: number, seed: string) => {
      const boundary = levelBoundaryCells.get(levelIndex);
      if (boundary && boundary.length > 0) {
        const cell = boundary[hashSeed(seed) % boundary.length]!;
        const len = Math.hypot(cell.x, cell.z) || 1;
        const nudge = lastCellSize * 0.55;
        return {
          x: cell.x + (cell.x / len) * nudge,
          y: cell.y - lastTotalH / 2,
          z: cell.z + (cell.z / len) * nudge,
        };
      }
      return {
        x: lastFootprintX * 0.42,
        y: levelIndex * lastLevelH - lastTotalH / 2,
        z: lastFootprintZ * 0.42,
      };
    };

    const el = renderer.domElement;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      focusing = false;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      theta -= dx * 0.006;
      phi = Math.min(Math.PI - 0.15, Math.max(0.15, phi - dy * 0.005));
      velocity = -dx * 0.0006;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
      el.style.cursor = "grab";
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      radius = Math.min(180, Math.max(28, radius + e.deltaY * 0.06));
      focusing = false;
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    const arrowToDirection: Record<string, Direction> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        shiftHeldRef.current = true;
        return;
      }
      if (e.key === modKeyName) {
        if (!modKeyDownRef.current) {
          modKeyDownRef.current = true;
          setNavMode((m) => (m === "orbit" ? "pan" : "orbit"));
        }
        return;
      }
      const direction = arrowToDirection[e.key];
      if (!direction) return;
      const activeTag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") return;
      if ((document.activeElement as HTMLElement | null)?.isContentEditable) return;
      e.preventDefault();
      focusing = false;
      shiftHeldRef.current = e.shiftKey;
      if (heldKeysRef.current[direction]) return;
      heldKeysRef.current = { ...heldKeysRef.current, [direction]: true };
      setActiveKeys(heldKeysRef.current);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        shiftHeldRef.current = false;
        return;
      }
      if (e.key === modKeyName) {
        modKeyDownRef.current = false;
        return;
      }
      const direction = arrowToDirection[e.key];
      if (!direction) return;
      shiftHeldRef.current = e.shiftKey;
      heldKeysRef.current = { ...heldKeysRef.current, [direction]: false };
      setActiveKeys(heldKeysRef.current);
    };
    const onBlur = () => {
      heldKeysRef.current = { up: false, down: false, left: false, right: false };
      shiftHeldRef.current = false;
      modKeyDownRef.current = false;
      setActiveKeys(heldKeysRef.current);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let raf = 0;
    let frames = 0;
    let lastFps = performance.now();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const viewMode = settingsRef.current.viewMode;
      const held = heldKeysRef.current;
      const keyHeld = held.up || held.down || held.left || held.right;
      const keyOrbiting = keyHeld && navModeRef.current === "orbit";
      const keyPanning = keyHeld && navModeRef.current === "pan";
      // Close-up is a proximity/detail zone, not open travel — every step
      // (orbit, pan, dolly) gets much shorter so it stays about nudging a
      // few voxels into view, not crossing the building.
      const closeUpFactor = settingsRef.current.closeUp ? 0.18 : 1;
      if (!dragging && viewMode === "perspective") {
        if (keyHeld && shiftHeldRef.current) {
          // Shift steals up/down for a straight forward/backward walk, in
          // either nav mode — added to the same pan offset as strafing, so
          // it's a genuine straight line (not an orbital radius change)
          // that can travel as far as the shared pan range allows.
          const dollySpeed = Math.max(0.6, lastFootprintX * 0.03) * closeUpFactor;
          const forwardX = -Math.cos(theta);
          const forwardZ = -Math.sin(theta);
          if (held.up) {
            panOffset.x += forwardX * dollySpeed;
            panOffset.z += forwardZ * dollySpeed;
          }
          if (held.down) {
            panOffset.x -= forwardX * dollySpeed;
            panOffset.z -= forwardZ * dollySpeed;
          }
        }
        if (keyOrbiting) {
          const keySpeed = 0.02 * closeUpFactor;
          if (held.left) theta -= keySpeed;
          if (held.right) theta += keySpeed;
          if (!shiftHeldRef.current) {
            if (held.up) phi = Math.max(0.15, phi - keySpeed);
            if (held.down) phi = Math.min(Math.PI - 0.15, phi + keySpeed);
          }
          velocity = 0;
        } else if (keyPanning) {
          const panSpeed = Math.max(0.3, lastFootprintX * 0.012) * closeUpFactor;
          const rightX = Math.sin(theta);
          const rightZ = -Math.cos(theta);
          if (held.right) {
            panOffset.x += rightX * panSpeed;
            panOffset.z += rightZ * panSpeed;
          }
          if (held.left) {
            panOffset.x -= rightX * panSpeed;
            panOffset.z -= rightZ * panSpeed;
          }
          if (!shiftHeldRef.current) {
            if (held.up) panOffset.y += panSpeed;
            if (held.down) panOffset.y -= panSpeed;
          }
          velocity = 0;
        } else if (settingsRef.current.autoRotate) {
          theta += 0.0022;
        } else {
          theta += velocity;
          velocity *= 0.94;
        }
        // shared clamp — keeps both strafing and the shift-dolly walk from
        // drifting off into the void, whichever branch touched panOffset
        const maxHoriz = lastFootprintX + lastFootprintZ;
        const horizLen = Math.hypot(panOffset.x, panOffset.z);
        if (horizLen > maxHoriz) {
          const s = maxHoriz / horizLen;
          panOffset.x *= s;
          panOffset.z *= s;
        }
        const maxVert = Math.max(20, lastTotalH * 0.8);
        panOffset.y = Math.min(maxVert, Math.max(-maxVert, panOffset.y));
      }
      if (viewMode === "plan") {
        // Straight overhead plan: near-orthographic reading of the footprint.
        camera.up.set(0, 0, -1);
        const h = Math.max(70, lastTotalH * 1.6 + lastFootprintX * 1.4);
        camera.position.set(0.001, h, 0.001);
        camera.lookAt(0, 0, 0);
      } else if (viewMode === "section") {
        // Side-on cut through the active level, looking into the slice.
        camera.up.set(0, 1, 0);
        const activeY = lastActiveLevel * lastLevelH - lastTotalH / 2;
        const dist = lastFootprintX * 1.3 + 30;
        camera.position.set(dist, activeY + lastLevelH * 2, 0.001);
        camera.lookAt(0, activeY, 0);
      } else {
        camera.up.set(0, 1, 0);
        if (focusing) {
          radius += (targetRadius - radius) * 0.08;
          lookY += (targetLookY - lookY) * 0.08;
          lookX += (targetLookX - lookX) * 0.08;
          lookZ += (targetLookZ - lookZ) * 0.08;
          theta += angleDelta(theta, targetTheta) * 0.08;
          phi += (targetPhi - phi) * 0.08;
          cameraPivotY += (targetCameraPivotY - cameraPivotY) * 0.08;
          panOffset.lerp(targetPan, 0.08);
          if (
            Math.abs(radius - targetRadius) < 0.3 &&
            Math.abs(lookY - targetLookY) < 0.3 &&
            Math.abs(lookX - targetLookX) < 0.3 &&
            Math.abs(lookZ - targetLookZ) < 0.3 &&
            Math.abs(angleDelta(theta, targetTheta)) < 0.01 &&
            Math.abs(phi - targetPhi) < 0.01 &&
            Math.abs(cameraPivotY - targetCameraPivotY) < 0.3 &&
            panOffset.distanceTo(targetPan) < 0.05
          ) {
            radius = targetRadius;
            lookY = targetLookY;
            lookX = targetLookX;
            lookZ = targetLookZ;
            theta = targetTheta;
            phi = targetPhi;
            cameraPivotY = targetCameraPivotY;
            panOffset.copy(targetPan);
            focusing = false;
          }
        }
        // A close-up on a low level (the socle, a parking level) swings
        // phi and shrinks radius a long way from wherever the camera
        // started — a low-level comment right after the wide overview is
        // the biggest such swing. Lerping raw spherical params doesn't
        // guarantee the in-between path stays above ground even when both
        // ends of the swing are fine, so the camera would graze or dip
        // through the ground plane mid-transition. Clamp it above the
        // floor mesh at all times instead of only fixing the endpoints.
        const camY = Math.max(
          radius * Math.cos(phi) * -1 + cameraPivotY + panOffset.y,
          floor.position.y + 1.2,
        );
        camera.position.set(
          radius * Math.sin(phi) * Math.cos(theta) + panOffset.x,
          camY,
          radius * Math.sin(phi) * Math.sin(theta) + panOffset.z,
        );
        camera.lookAt(lookX + panOffset.x, lookY + panOffset.y, lookZ + panOffset.z);
      }
      renderer.render(scene, camera);

      // Report the active level marker's screen position for the comment
      // connector line, in viewport/client coordinates — but only while a
      // link is actually active AND the camera is actually orbiting freely
      // around it (perspective mode). In Plan/Coupe, the camera re-centres
      // itself on the active level with a fixed offset, so a marker pinned
      // to that same level would always land on the same screen spot no
      // matter what — indistinguishable from "not following" — so we hide
      // the connector there instead of showing a dot that looks frozen.
      const projectAnchor = (levelIndex: number, seed: string) => {
        const anchor = getAnchorPoint(levelIndex, seed);
        markerWorld.set(anchor.x, anchor.y, anchor.z);
        markerWorld.project(camera);
        if (markerWorld.z > 1 || markerWorld.z < -1) return null;
        const rect = mount.getBoundingClientRect();
        return {
          x: rect.left + (markerWorld.x * 0.5 + 0.5) * rect.width,
          y: rect.top + (1 - (markerWorld.y * 0.5 + 0.5)) * rect.height,
        };
      };

      // Hidden while auto-rotating: a connector chasing a spinning building
      // is just visual noise, not a useful anchor.
      const canShowConnectors = viewMode === "perspective" && !settingsRef.current.autoRotate;
      // The "show all" overview is a deliberate, standing choice (not a
      // transient chase target) — sweeping past every marker while the
      // building turns is a feature, not noise, so it stays up through
      // auto-rotate too. Still tied to perspective mode for the same
      // frozen-marker reason as above.
      const canShowOverview = viewMode === "perspective";

      if (props.onMarkerPosition) {
        if (settingsRef.current.markerActive && canShowConnectors) {
          markerWasActive = true;
          const level = settingsRef.current.activeLevel;
          const seed = settingsRef.current.activeMarkerId ?? String(level);
          props.onMarkerPosition(projectAnchor(level, seed));
        } else if (markerWasActive) {
          markerWasActive = false;
          props.onMarkerPosition(null);
        }
      }

      if (props.onOverviewPositions) {
        const items = settingsRef.current.overviewMarkers;
        if (items && items.length > 0 && canShowOverview) {
          overviewWasActive = true;
          const result: Record<string, { x: number; y: number } | null> = {};
          for (const it of items) result[it.id] = projectAnchor(it.levelIndex, it.id);
          props.onOverviewPositions(result);
        } else if (overviewWasActive) {
          overviewWasActive = false;
          props.onOverviewPositions({});
        }
      }

      frames++;
      const now = performance.now();
      if (now - lastFps > 1000) {
        props.onStats?.({ voxels: voxelCount, fps: Math.round((frames * 1000) / (now - lastFps)) });
        frames = 0;
        lastFps = now;
      }
    };
    tick();

    const rebuild = () => {
      voxelCount = buildMatrix();
    };
    (mount as HTMLDivElement & { __rebuild?: () => void }).__rebuild = rebuild;

    const focusLevel = () => {
      const level = settingsRef.current.activeLevel;
      const seed = settingsRef.current.activeMarkerId ?? String(level);
      const anchor = getAnchorPoint(level, seed);
      targetLookY = anchor.y;
      // Aim squarely at the anchor's real x/z too — not just its height —
      // so the marker actually lands centred on screen, instead of merely
      // visible somewhere near the top or bottom edge.
      targetLookX = anchor.x;
      targetLookZ = anchor.z;
      // `radius` orbits around the building's central vertical axis, but the
      // anchor itself sits out on the footprint's edge, roughly
      // lastFootprintX / 2 from that axis. Bringing the camera in tighter
      // than that distance doesn't zoom in on the anchor — it pushes the
      // camera past the facade to the inside, grazing along the floor
      // slabs edge-on with nothing recognizable in frame. So the close-up
      // never targets an absolute radius; it targets a standoff *beyond*
      // the facade, which is what actually reads as "closer" or "further".
      // Interior spots (a core, a courtyard, a lobby) read like standing
      // right at that window, so they hold a thin standoff; exterior ones
      // (a facade, a wing, the roof) read like a stationary helicopter shot
      // just off the building, so they hold back further.
      const halfFootprint = lastFootprintX / 2;
      const standoff = settingsRef.current.closeUpInterior
        ? Math.max(6, Math.min(10, lastFootprintX * 0.22))
        : Math.max(14, Math.min(24, lastFootprintX * 0.55));
      targetRadius = halfFootprint + standoff;
      // A truly level, face-on shot: move the orbit's own vertical centre
      // to the anchor's height and hold the camera at the equator (phi =
      // 90°) instead of solving for a tilt that fakes the same height from
      // the shared y=18 pivot. That old approach needed more tilt (and,
      // for anchors far from y=18, more distance than any reasonable
      // standoff could give) the further the anchor sat from 18 — a low
      // level like a socle or parking level would run out of room and
      // pitch nearly straight down at it, "no recul", grazing the ground.
      // Re-centring the pivot makes every level equally reachable at the
      // same close standoff, independent of how far it is from the
      // building's midpoint.
      targetCameraPivotY = targetLookY;
      targetPhi = Math.PI / 2;
      // Swing the camera so the marker's real anchor point faces the
      // viewer instead of possibly sitting on the far, hidden side.
      const anchorAzimuth = Math.atan2(anchor.z, anchor.x);
      targetTheta = theta + angleDelta(theta, anchorAzimuth);
      targetPan.set(0, 0, 0);
      focusing = true;
    };
    (mount as HTMLDivElement & { __focusLevel?: () => void }).__focusLevel = focusLevel;

    const unfocusLevel = () => {
      targetLookX = 0;
      targetLookY = 0;
      targetLookZ = 0;
      targetRadius = OVERVIEW_RADIUS;
      targetPhi = OVERVIEW_PHI;
      targetCameraPivotY = 18;
      targetTheta = theta + angleDelta(theta, OVERVIEW_THETA);
      targetPan.set(0, 0, 0);
      focusing = true;
    };
    (mount as HTMLDivElement & { __unfocusLevel?: () => void }).__unfocusLevel = unfocusLevel;

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      disposables.forEach((d) => d.dispose());
      skyGeo.dispose();
      skyMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      floorTexture.dispose();
      shadowTexture.dispose();
      trunkGeo.dispose();
      trunkMat.dispose();
      canopyGeo.dispose();
      canopyMats.forEach((m) => m.dispose());
      renderer.dispose();
      mount.removeChild(el);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // rebuild geometry when settings change
  useEffect(() => {
    const mount = mountRef.current as (HTMLDivElement & { __rebuild?: () => void }) | null;
    mount?.__rebuild?.();
  }, [props.levels, props.density, props.mode, props.activeLevel, props.buildingType, props.viewMode]);

  // animate a close-up on the active level, e.g. when locating a comment
  useEffect(() => {
    if (props.focusRequestId === undefined) return;
    const mount = mountRef.current as (HTMLDivElement & { __focusLevel?: () => void }) | null;
    mount?.__focusLevel?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.focusRequestId]);

  // animate back out to the default overview framing, e.g. on Escape
  useEffect(() => {
    if (props.unfocusRequestId === undefined) return;
    const mount = mountRef.current as (HTMLDivElement & { __unfocusLevel?: () => void }) | null;
    mount?.__unfocusLevel?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.unfocusRequestId]);

  const dPadKey = (direction: Direction, Icon: typeof CircleArrowUp, gridArea: string) => (
    <div
      style={{ gridArea }}
      className={`flex h-5 w-5 items-center justify-center transition-colors ${
        activeKeys[direction] ? "text-primary" : "text-foreground/50"
      }`}
    >
      <Icon className="h-full w-full" strokeWidth={2} />
    </div>
  );

  return (
    <div className="relative h-full w-full">
      <div ref={mountRef} className="h-full w-full" />
      <div
        className={`absolute bottom-4 z-40 flex flex-col items-end gap-1.5 transition-opacity ${
          props.viewMode !== "perspective" ? "opacity-40" : ""
        }`}
        style={{ right: `${props.panelInsetPx ?? 16}px` }}
      >
        <div className="flex items-center gap-0.5 rounded-md border border-border/50 bg-surface/70 p-0.5 shadow-sm backdrop-blur-md">
          <button
            type="button"
            onClick={() => setNavMode("orbit")}
            aria-label="Mode orbite"
            title={`Orbiter autour du bâtiment · Maj + haut/bas pour avancer/reculer · ${isMac ? "Option" : "Ctrl"} pour basculer`}
            className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
              navMode === "orbit"
                ? "bg-primary/25 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Orbit className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setNavMode("pan")}
            aria-label="Mode déplacement linéaire"
            title={`Se déplacer en ligne droite · Maj + haut/bas pour avancer/reculer · ${isMac ? "Option" : "Ctrl"} pour basculer`}
            className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
              navMode === "pan"
                ? "bg-primary/25 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Move className="h-3.5 w-3.5" />
          </button>
        </div>
        <div
          className="pointer-events-none grid gap-0.5 drop-shadow-md"
          style={{
            gridTemplateAreas: `". up ." "left . right" ". down ."`,
            gridTemplateColumns: "repeat(3, 1.375rem)",
            gridTemplateRows: "repeat(3, 1.375rem)",
          }}
        >
          {dPadKey("up", CircleArrowUp, "up")}
          {dPadKey("left", CircleArrowLeft, "left")}
          {dPadKey("right", CircleArrowRight, "right")}
          {dPadKey("down", CircleArrowDown, "down")}
        </div>
      </div>
    </div>
  );
}
