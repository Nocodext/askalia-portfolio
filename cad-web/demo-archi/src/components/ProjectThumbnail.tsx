import { useEffect, useRef } from "react";
import * as THREE from "three";
import { generateBuildingCells, type BuildingType } from "@/lib/building-shapes";

type Props = { buildingType: BuildingType; hovered: boolean };

export default function ProjectThumbnail({ buildingType, hovered }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const w = mount.clientWidth || 80;
    const h = mount.clientHeight || 80;
    const camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 500);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(6, 10, 7);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.55);
    fill.position.set(-8, 4, -6);
    scene.add(fill);

    // Same sky dome + grass field as the full studio viewport, scaled down,
    // so the model reads as sitting on a real site rather than in a void.
    const skyGeo = new THREE.SphereGeometry(220, 20, 12);
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
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    const floorCanvas = document.createElement("canvas");
    floorCanvas.width = floorCanvas.height = 128;
    const fctx = floorCanvas.getContext("2d")!;
    const fgrad = fctx.createRadialGradient(64, 64, 5, 64, 64, 64);
    fgrad.addColorStop(0, "#9cae87");
    fgrad.addColorStop(0.55, "#8da476");
    fgrad.addColorStop(1, "#ccd3c2");
    fctx.fillStyle = fgrad;
    fctx.fillRect(0, 0, 128, 128);
    const speckleColors = ["#89a171", "#7c9866", "#a8b994"];
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 128;
      const y = Math.random() * 128;
      fctx.fillStyle = speckleColors[i % speckleColors.length]!;
      fctx.globalAlpha = 0.12 + Math.random() * 0.1;
      fctx.beginPath();
      fctx.arc(x, y, 1 + Math.random() * 1.5, 0, Math.PI * 2);
      fctx.fill();
    }
    fctx.globalAlpha = 1;
    const floorTexture = new THREE.CanvasTexture(floorCanvas);

    const { cells, cell, levelH } = generateBuildingCells(buildingType, 12, 1);
    const xs = cells.map((c) => c.x);
    const ys = cells.map((c) => c.y);
    const zs = cells.map((c) => c.z);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cyMin = Math.min(...ys);
    const cyMax = Math.max(...ys);
    const cz = (Math.min(...zs) + Math.max(...zs)) / 2;
    const size = Math.max(Math.max(...xs) - Math.min(...xs), cyMax - cyMin, Math.max(...zs) - Math.min(...zs), 4);
    const groundY = -(cyMax - cyMin) / 2 - 0.05;

    const floorGeo = new THREE.CircleGeometry(size * 2.6, 40);
    const floorMat = new THREE.MeshBasicMaterial({ map: floorTexture });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = groundY;
    scene.add(floor);

    const trees = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(size * 0.02, size * 0.026, size * 0.13, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: "#7a6a52", roughness: 0.9 });
    const canopyGeo = new THREE.SphereGeometry(1, 6, 5);
    const canopyMat = new THREE.MeshStandardMaterial({ color: "#5f7a4c", roughness: 0.85 });
    const exclusionRadius = size * 0.75;
    for (let t = 0; t < 5; t++) {
      const angle = (t / 5) * Math.PI * 2 + 0.4;
      const dist = exclusionRadius + size * (0.25 + Math.random() * 0.5);
      const scale = size * 0.045 * (0.7 + Math.random() * 0.6);
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = size * 0.065;
      const canopy = new THREE.Mesh(canopyGeo, canopyMat);
      canopy.position.y = size * 0.15;
      canopy.scale.setScalar(scale);
      tree.add(trunk, canopy);
      tree.position.set(Math.cos(angle) * dist, groundY, Math.sin(angle) * dist);
      trees.add(tree);
    }
    scene.add(trees);

    const geo = new THREE.BoxGeometry(cell * 0.995, levelH * 0.995, cell * 0.995);
    const mat = new THREE.MeshStandardMaterial({ metalness: 0.05, roughness: 0.5 });
    const mesh = new THREE.InstancedMesh(geo, mat, cells.length);
    const dummy = new THREE.Object3D();
    const colA = new THREE.Color("#6b7684");
    const colB = new THREE.Color("#c3d0dc");
    cells.forEach((c, idx) => {
      dummy.position.set(c.x - cx, c.y - (cyMin + cyMax) / 2, c.z - cz);
      dummy.updateMatrix();
      mesh.setMatrixAt(idx, dummy.matrix);
      const t = (c.y - cyMin) / Math.max(1, cyMax - cyMin);
      mesh.setColorAt(idx, colA.clone().lerp(colB, 0.15 + t * 0.85));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    scene.add(mesh);

    // Same elevated "balcony" vantage point as the full studio viewport,
    // just scaled to this building's size, for a consistent house style.
    const dist = size * 3.4;
    const phi = 1.95;
    const yOffset = dist * (18 / 78);
    let angle = 0.9;

    const frame = () => {
      camera.position.set(
        dist * Math.sin(phi) * Math.cos(angle),
        dist * Math.cos(phi) * -1 + yOffset,
        dist * Math.sin(phi) * Math.sin(angle),
      );
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    frame();

    let raf = 0;
    const loop = () => {
      angle += 0.014;
      frame();
      raf = requestAnimationFrame(loop);
    };
    controlsRef.current = {
      start: () => {
        if (!raf) raf = requestAnimationFrame(loop);
      },
      stop: () => {
        cancelAnimationFrame(raf);
        raf = 0;
      },
    };

    return () => {
      cancelAnimationFrame(raf);
      geo.dispose();
      mat.dispose();
      skyGeo.dispose();
      skyMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      floorTexture.dispose();
      trunkGeo.dispose();
      trunkMat.dispose();
      canopyGeo.dispose();
      canopyMat.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [buildingType]);

  useEffect(() => {
    if (hovered) controlsRef.current?.start();
    else controlsRef.current?.stop();
  }, [hovered]);

  return <div ref={mountRef} className="h-full w-full" />;
}
