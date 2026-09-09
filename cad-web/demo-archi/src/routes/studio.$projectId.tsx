import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Boxes,
  ChevronLeft,
  Save,
  Share2,
  MessageSquare,
  X,
  HardDrive,
  Check,
  CircleDot,
  Grid3x3,
  Rotate3d,
  Layers,
  Search,
  Globe2,
  Link2,
  Send,
  SlidersHorizontal,
  Library,
  GripVertical,
  ChevronsRight,
  Box,
  Square,
  Rows3,
  ChevronDown,
  ChevronRight,
  Layers3,
  List,
  LayoutGrid,
  MapPin,
  MapPinOff,
  Lock,
  MessageCircle,
  Maximize,
  Minimize,
  ArrowLeftToLine,
  ArrowRightToLine,
  Waypoints,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  COMMENTS,
  DIRECTORY,
  LIBRARY,
  PRIVATE_NOTES,
  PROJECTS,
  QUOTA,
  type Person,
} from "@/lib/studio-data";
import { getSession } from "@/lib/session";
import type { ViewMode } from "@/components/MatrixCanvas";

const MatrixCanvas = lazy(() => import("@/components/MatrixCanvas"));
const ProjectThumbnail = lazy(() => import("@/components/ProjectThumbnail"));

// Vivid, mutually distinct hues for connector lines — deliberately clear of
// the viewport's own palette (muted grays/blues, olive greens, warm sand)
// so a marker never blends into the scene it's pointing at.
const CONNECTOR_PALETTE = [
  "#fb4171", // rose
  "#22d3ee", // cyan
  "#facc15", // gold
  "#a78bfa", // violet
  "#fb923c", // orange
  "#4ade80", // spring green
  "#60a5fa", // sky blue
  "#f472b6", // pink
];
function colorForId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return CONNECTOR_PALETTE[h % CONNECTOR_PALETTE.length]!;
}

// The two side panels collapse via whichever of these is assigned to
// COLLAPSE_MODE below — swap that one line to change both panels at once.
type CollapseStyle = { transform: string; opacity: number; transition: string };
type CollapseFn = (open: boolean, side: "left" | "right") => CollapseStyle;

const collapseLateral: CollapseFn = (open, side) => ({
  transform: `translateX(${open ? "0" : side === "left" ? "-110%" : "110%"})`,
  opacity: 1,
  transition: "transform 300ms ease",
});

const collapseVolet: CollapseFn = (open, side) => ({
  transform: `rotateY(${open ? 0 : side === "left" ? -100 : 100}deg)`,
  opacity: open ? 1 : 0,
  transition: "transform 420ms cubic-bezier(0.32,0.72,0.35,1), opacity 420ms ease",
});

const COLLAPSE_MODE: CollapseFn = collapseLateral; // collapseVolet kept for a future demo

export const Route = createFileRoute("/studio/$projectId")({
  head: () => ({
    meta: [
      { title: "Éditeur de matrice 3D — ACME Matrix Studio" },
      {
        name: "description",
        content:
          "Éditeur WebGL interactif : faites tourner la matrice volumétrique du bâtiment, ajustez la densité, annotez et partagez.",
      },
      { property: "og:title", content: "Éditeur de matrice 3D — ACME Studio" },
      {
        property: "og:description",
        content: "Manipulez la matrice 3D de votre bâtiment numérique en temps réel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudioRoute,
});

type Access = "Lecture" | "Commentaire" | "Édition";

function StudioRoute() {
  // Force a full remount on project change so every piece of local state
  // (matrix settings, view mode, comments, drafts…) resets instead of
  // leaking over from the previously open project.
  const { projectId } = Route.useParams();
  return <StudioPage key={projectId} />;
}

function StudioPage() {
  const navigate = useNavigate();
  const { projectId } = Route.useParams();
  const project = PROJECTS.find((p) => p.id === projectId) ?? PROJECTS[0]!;

  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!getSession()) navigate({ to: "/" });
    else setReady(true);
  }, [navigate]);

  const [levels, setLevels] = useState(22);
  const [density, setDensity] = useState(2);
  const [mode, setMode] = useState<"solid" | "wire" | "ghost">("wire");
  const [activeLevel, setActiveLevel] = useState(12);
  const [autoRotate, setAutoRotate] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("perspective");
  const [stats, setStats] = useState({ voxels: 0, fps: 60 });

  const [leftTab, setLeftTab] = useState<"settings" | "library">("settings");
  const [libraryQuery, setLibraryQuery] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };
  const [panelTab, setPanelTab] = useState<"messages" | "notes">("messages");
  const [comments, setComments] = useState(() =>
    COMMENTS.filter((c) => c.projectId === project.id),
  );
  const [draft, setDraft] = useState("");
  const [notes, setNotes] = useState(() =>
    PRIVATE_NOTES.filter((n) => n.projectId === project.id),
  );
  const [noteDraft, setNoteDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const [shareOpen, setShareOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [switcherQuery, setSwitcherQuery] = useState("");
  const [switcherLayout, setSwitcherLayout] = useState<"list" | "gallery">("list");
  const [switcherHoveredId, setSwitcherHoveredId] = useState<string | null>(null);

  // Visual connector line linking the active 3D marker to its comment/note
  const [linkedId, setLinkedId] = useState<string | null>(null);
  const [focusRequestId, setFocusRequestId] = useState(0);
  const [unfocusRequestId, setUnfocusRequestId] = useState(0);
  const linkedIdRef = useRef<string | null>(null);
  linkedIdRef.current = linkedId;
  const closeUpInterior = useMemo(() => {
    const comment = comments.find((c) => c.id === linkedId);
    const note = comment ? undefined : notes.find((n) => n.id === linkedId);
    return (comment ?? note)?.interior ?? false;
  }, [linkedId, comments, notes]);
  const drawerOpenRef = useRef(drawerOpen);
  drawerOpenRef.current = drawerOpen;
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const linkDotRef = useRef<SVGCircleElement | null>(null);
  const linkDotHaloRef = useRef<SVGCircleElement | null>(null);
  const linkPathRef = useRef<SVGPathElement | null>(null);
  const linkEndDotRef = useRef<SVGCircleElement | null>(null);
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  // Opacity is fully state-driven (never written imperatively): React only
  // triggers a real CSS transition when the *value it authored* actually
  // changes between renders. An imperative style.opacity write elsewhere
  // would leave React's bookkeeping out of sync with the DOM, so a later
  // state-driven change (0 -> 0 in React's eyes, even though the DOM was
  // forced to 1) gets silently skipped — no transition, just a hard cut.
  const [bubbleVisible, setBubbleVisible] = useState(false);
  // The bubble tracks the marker at first so the eye can follow the link,
  // then drifts up out of the way after a few seconds — "the finger
  // pointing at the problem" shouldn't permanently cover the problem. The
  // move itself never slides across the screen (tiring to track by eye):
  // a single CSS keyframe animation (see styles.css) fades it out in
  // place, jumps while invisible, then fades back in at rest — one atomic
  // timeline owned entirely by CSS, so there's no JS-vs-DOM bookkeeping to
  // get out of sync and no second timer to coordinate.
  const [bubbleSettled, setBubbleSettled] = useState(false);
  const bubbleSettledRef = useRef(false);
  bubbleSettledRef.current = bubbleSettled;
  useEffect(() => {
    setBubbleVisible(false);
    setBubbleSettled(false);
    if (!linkedId) return;
    const t = setTimeout(() => setBubbleSettled(true), 2800);
    return () => clearTimeout(t);
  }, [linkedId]);

  // "Show every marker at once" overview, scoped to whichever tab is open
  const [showAllArrows, setShowAllArrows] = useState(false);
  // 0 = docked in the foreground, 1 = fully receded into the scene depth —
  // continuously draggable via the grip on top of the panel header.
  const [recede, setRecede] = useState(0);
  const [isRecedeDragging, setIsRecedeDragging] = useState(false);
  const recedeDragRef = useRef<{ startX: number; startRecede: number } | null>(null);
  const onRecedeGripDown = (e: React.PointerEvent) => {
    e.preventDefault();
    recedeDragRef.current = { startX: e.clientX, startRecede: recede };
    setIsRecedeDragging(true);
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  const onRecedeGripMove = (e: React.PointerEvent) => {
    if (!recedeDragRef.current) return;
    const { startX, startRecede } = recedeDragRef.current;
    const next = Math.min(1, Math.max(0, startRecede + (e.clientX - startX) / 160));
    setRecede(next);
  };
  const onRecedeGripUp = (e: React.PointerEvent) => {
    recedeDragRef.current = null;
    setIsRecedeDragging(false);
    try {
      (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };

  // Clicking a connector flashes its card so the eye can trace back to it
  const [pulsingId, setPulsingId] = useState<string | null>(null);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashCard = useCallback((id: string) => {
    cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    setPulsingId(id);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = setTimeout(() => setPulsingId(null), 1600);
  }, []);
  const [messageQuery, setMessageQuery] = useState("");
  const filteredComments = useMemo(() => {
    const q = messageQuery.trim().toLowerCase();
    if (!q) return comments;
    return comments.filter(
      (c) =>
        c.author.toLowerCase().includes(q) ||
        c.body.toLowerCase().includes(q) ||
        c.level.toLowerCase().includes(q),
    );
  }, [comments, messageQuery]);
  const overviewItems = useMemo(
    () =>
      (panelTab === "messages" ? filteredComments : notes).filter(
        (it): it is typeof it & { levelIndex: number } => it.levelIndex !== undefined,
      ),
    [panelTab, filteredComments, notes],
  );
  const overviewItemsRef = useRef(overviewItems);
  overviewItemsRef.current = overviewItems;
  const overviewDotRefs = useRef<Record<string, SVGCircleElement | null>>({});
  const overviewPathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const overviewEndDotRefs = useRef<Record<string, SVGCircleElement | null>>({});
  // The currently-mounted comments/notes scroll container (only one of the
  // two tabs is ever in the DOM at once, so a single shared ref is enough).
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  // A card scrolled out of the panel still has a real (off-screen)
  // bounding rect — without clamping, the connector would keep tracking it
  // into empty space above the header or below the panel's bottom edge.
  const getCardEndpoint = (card: HTMLElement) => {
    const rect = card.getBoundingClientRect();
    const scrollRect = scrollAreaRef.current?.getBoundingClientRect();
    let y = rect.top + rect.height / 2;
    if (scrollRect) y = Math.min(Math.max(y, scrollRect.top), scrollRect.bottom);
    return { x: rect.left, y };
  };

  const handleOverviewPositions = useCallback(
    (positions: Record<string, { x: number; y: number } | null>) => {
      for (const item of overviewItemsRef.current) {
        const pos = positions[item.id];
        const card = cardRefs.current[item.id];
        const dot = overviewDotRefs.current[item.id];
        const path = overviewPathRefs.current[item.id];
        const endDot = overviewEndDotRefs.current[item.id];
        if (!pos || !card) {
          if (dot) dot.style.opacity = "0";
          if (path) path.style.opacity = "0";
          if (endDot) endDot.style.opacity = "0";
          continue;
        }
        const { x: endX, y: endY } = getCardEndpoint(card);
        const midX = (pos.x + endX) / 2;
        if (dot) {
          dot.setAttribute("cx", String(pos.x));
          dot.setAttribute("cy", String(pos.y));
          dot.style.opacity = "1";
        }
        if (path) {
          path.setAttribute(
            "d",
            `M ${pos.x} ${pos.y} C ${midX} ${pos.y}, ${midX} ${endY}, ${endX} ${endY}`,
          );
          path.style.opacity = "1";
        }
        if (endDot) {
          endDot.setAttribute("cx", String(endX));
          endDot.setAttribute("cy", String(endY));
          endDot.style.opacity = "1";
        }
      }
    },
    [],
  );

  const locateLevel = (id: string, levelIndex: number) => {
    setActiveLevel(Math.min(levelIndex, levels - 1));
    setAutoRotate(false);
    setLinkedId(id);
    setFocusRequestId((n) => n + 1);
    // Close-up mode: the panel would only show the same message twice over
    // (once in the list, once in the bubble) — collapse it out of the way.
    setDrawerOpen(false);
  };

  // Escape is the natural way out of close-up: bring the panel back and
  // drop the focus, no need to hunt for a button.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !linkedIdRef.current) return;
      setLinkedId(null);
      setDrawerOpen(true);
      setUnfocusRequestId((n) => n + 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Clicking a connector's tip: focus the camera on it and bring the
  // message into the scene, instead of tracing back to the 2D list.
  const focusItem = (id: string) => {
    const item = comments.find((c) => c.id === id) ?? notes.find((n) => n.id === id);
    if (item?.levelIndex !== undefined) locateLevel(id, item.levelIndex);
  };

  // Prev/next from the floating bubble itself: cycles through the current
  // tab's located items so you can walk the building's comments in order
  // instead of hunting for the next arrow tip by eye.
  const cycleFocus = (dir: 1 | -1) => {
    if (!linkedId || overviewItems.length === 0) return;
    const idx = overviewItems.findIndex((it) => it.id === linkedId);
    const next = overviewItems[(idx === -1 ? 0 : idx + dir + overviewItems.length) % overviewItems.length];
    if (next) focusItem(next.id);
  };

  const handleMarkerPosition = useCallback((pos: { x: number; y: number } | null) => {
    const id = linkedIdRef.current;
    const card = id ? cardRefs.current[id] : null;
    if (!pos || !card) {
      if (linkDotRef.current) linkDotRef.current.style.opacity = "0";
      if (linkDotHaloRef.current) linkDotHaloRef.current.style.opacity = "0";
      if (linkPathRef.current) linkPathRef.current.style.opacity = "0";
      if (linkEndDotRef.current) linkEndDotRef.current.style.opacity = "0";
      if (!bubbleSettledRef.current) setBubbleVisible(false);
      return;
    }
    if (linkDotRef.current) {
      linkDotRef.current.setAttribute("cx", String(pos.x));
      linkDotRef.current.setAttribute("cy", String(pos.y));
      linkDotRef.current.style.opacity = "1";
    }
    if (linkDotHaloRef.current) {
      linkDotHaloRef.current.setAttribute("cx", String(pos.x));
      linkDotHaloRef.current.setAttribute("cy", String(pos.y));
      linkDotHaloRef.current.style.opacity = "1";
    }
    // Close-up mode (panel collapsed): just the tip, no trail — there's no
    // visible card left for it to lead the eye toward.
    if (drawerOpenRef.current) {
      const { x: endX, y: endY } = getCardEndpoint(card);
      const midX = (pos.x + endX) / 2;
      if (linkPathRef.current) {
        linkPathRef.current.setAttribute(
          "d",
          `M ${pos.x} ${pos.y} C ${midX} ${pos.y}, ${midX} ${endY}, ${endX} ${endY}`,
        );
        linkPathRef.current.style.opacity = "1";
      }
      if (linkEndDotRef.current) {
        linkEndDotRef.current.setAttribute("cx", String(endX));
        linkEndDotRef.current.setAttribute("cy", String(endY));
        linkEndDotRef.current.style.opacity = "1";
      }
    } else {
      if (linkPathRef.current) linkPathRef.current.style.opacity = "0";
      if (linkEndDotRef.current) linkEndDotRef.current.style.opacity = "0";
    }
    // Once settled, the settle keyframe animation (styles.css) owns the
    // bubble's position and opacity entirely — stop pinning it to the
    // marker every frame. --bubble-x/y mirror left/top so the animation's
    // 0% keyframe can pick up exactly where tracking left off.
    if (bubbleRef.current && !bubbleSettledRef.current) {
      bubbleRef.current.style.left = `${pos.x}px`;
      bubbleRef.current.style.top = `${pos.y}px`;
      bubbleRef.current.style.setProperty("--bubble-x", `${pos.x}px`);
      bubbleRef.current.style.setProperty("--bubble-y", `${pos.y}px`);
    }
    if (!bubbleSettledRef.current) setBubbleVisible(true);
  }, []);

  const quotaPct = Math.round((QUOTA.usedGb / QUOTA.totalGb) * 100);
  const openCount = comments.filter((c) => !c.resolved).length;

  const filteredLibrary = useMemo(() => {
    const q = libraryQuery.trim().toLowerCase();
    if (!q) return LIBRARY;
    return LIBRARY.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (it) => it.name.toLowerCase().includes(q) || it.spec.toLowerCase().includes(q),
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [libraryQuery]);

  const handleSave = () => {
    setSaving(true);
    const id = toast.loading("Enregistrement de la matrice…", {
      description: `${project.name} · ${stats.voxels.toLocaleString("fr-FR")} voxels`,
    });
    setTimeout(() => {
      setSaving(false);
      toast.success("Projet enregistré", {
        id,
        description: `Version v${levels}.${density} publiée · ${project.name}`,
      });
      if (quotaPct >= 80) {
        setTimeout(
          () =>
            toast.warning("Quota disque à " + quotaPct + "%", {
              description: `${QUOTA.usedGb} Go sur ${QUOTA.totalGb} Go utilisés. Archivez des matrices pour libérer de l'espace.`,
            }),
          700,
        );
      }
    }, 1200);
  };

  if (!ready) return <div className="min-h-screen bg-background" />;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Top bar */}
      <header className="z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
        <Link
          to="/projects"
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Projets
        </Link>
        <div className="h-5 w-px bg-border" />
        <Popover open={switcherOpen} onOpenChange={setSwitcherOpen}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-secondary">
              <Boxes className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{project.name}</span>
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                {project.status}
              </Badge>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80 p-0">
            <div className="flex items-center gap-2 border-b border-border p-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  autoFocus
                  value={switcherQuery}
                  onChange={(e) => setSwitcherQuery(e.target.value)}
                  placeholder="Changer de projet…"
                  className="h-8 bg-background/60 pl-8 text-xs"
                />
              </div>
              <div className="flex items-center gap-0.5 rounded-md border border-border bg-background/40 p-0.5">
                <button
                  onClick={() => setSwitcherLayout("list")}
                  aria-label="Vue liste"
                  className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
                    switcherLayout === "list"
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setSwitcherLayout("gallery")}
                  aria-label="Vue galerie"
                  className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
                    switcherLayout === "gallery"
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {switcherLayout === "list" ? (
              <div className="max-h-80 overflow-y-auto p-1">
                {PROJECTS.filter((p) =>
                  (p.name + p.city + p.building).toLowerCase().includes(switcherQuery.toLowerCase()),
                ).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSwitcherOpen(false);
                      setSwitcherQuery("");
                      navigate({ to: "/studio/$projectId", params: { projectId: p.id } });
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-secondary ${
                      p.id === project.id ? "bg-secondary/60" : ""
                    }`}
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border/70"
                      style={{
                        background: `radial-gradient(circle at 30% 20%, oklch(0.55 0.19 ${p.accent} / 0.65), transparent 70%)`,
                      }}
                    >
                      <Layers3 className="h-4 w-4 text-foreground/80" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{p.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {p.building} · {p.city}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-[10px]">
                      {p.status}
                    </Badge>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto p-2">
                {PROJECTS.filter((p) =>
                  (p.name + p.city + p.building).toLowerCase().includes(switcherQuery.toLowerCase()),
                ).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSwitcherOpen(false);
                      setSwitcherQuery("");
                      navigate({ to: "/studio/$projectId", params: { projectId: p.id } });
                    }}
                    onMouseEnter={() => setSwitcherHoveredId(p.id)}
                    onMouseLeave={() => setSwitcherHoveredId((id) => (id === p.id ? null : id))}
                    className={`flex flex-col overflow-hidden rounded-lg border text-left transition-colors ${
                      p.id === project.id
                        ? "border-primary/50 bg-secondary/60"
                        : "border-border/70 hover:border-primary/40"
                    }`}
                  >
                    <div className="aspect-[4/3] w-full bg-viewport">
                      <Suspense
                        fallback={
                          <div
                            className="flex h-full w-full items-center justify-center"
                            style={{
                              background: `radial-gradient(circle at 30% 20%, oklch(0.7 0.17 ${p.accent} / 0.65), oklch(0.8 0.006 260))`,
                            }}
                          >
                            <Layers3 className="h-5 w-5 text-foreground/60" />
                          </div>
                        }
                      >
                        <ProjectThumbnail
                          buildingType={p.buildingType}
                          hovered={switcherHoveredId === p.id}
                        />
                      </Suspense>
                    </div>
                    <div className="p-1.5">
                      <p className="truncate text-[11px] font-medium">{p.name}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{p.city}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </PopoverContent>
        </Popover>

        <div className="ml-auto flex items-center gap-2">
          <div className="mr-2 hidden items-center gap-2 rounded-md border border-border/70 bg-background/50 px-2.5 py-1.5 lg:flex">
            <HardDrive className="h-3.5 w-3.5 text-warning" />
            <span className="font-mono text-[11px] text-muted-foreground">
              {QUOTA.usedGb} / {QUOTA.totalGb} Go
            </span>
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-warning" style={{ width: `${quotaPct}%` }} />
            </div>
            <span className="font-mono text-[11px] text-warning">{quotaPct}%</span>
          </div>
          <div className="flex -space-x-2">
            {["CR", "YB", "SM"].map((i) => (
              <div
                key={i}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-secondary text-[10px] font-semibold"
              >
                {i}
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
            title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <Popover open={shareOpen} onOpenChange={setShareOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" /> Partager
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-[420px] gap-0 border-viewport-border bg-viewport p-0 text-viewport-foreground shadow-2xl"
            >
              <SharePanel projectName={project.name} onDone={() => setShareOpen(false)} />
            </PopoverContent>
          </Popover>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? "Enregistrement…" : "Enregistrer le projet"}
          </Button>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        {/* Connector line: physically links the 3D marker to its comment/note */}
        <svg className="pointer-events-none fixed inset-0 z-[15] h-full w-full">
          <defs>
            <filter id="tip-halo-blur" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>
          <path
            ref={linkPathRef}
            fill="none"
            stroke={linkedId ? colorForId(linkedId) : "#fb4171"}
            strokeWidth={3}
            onClick={() => linkedId && flashCard(linkedId)}
            style={{ opacity: 0, transition: "opacity 150ms", pointerEvents: "auto", cursor: "pointer" }}
          />
          {/* Soft glow behind the tip — makes it read at a glance instead of
              disappearing against a busy wireframe facade. */}
          <circle
            ref={linkDotHaloRef}
            r={14}
            fill={linkedId ? colorForId(linkedId) : "#fb4171"}
            fillOpacity={0.5}
            filter="url(#tip-halo-blur)"
            style={{ opacity: 0, transition: "opacity 150ms" }}
          />
          <circle
            ref={linkDotRef}
            r={7}
            fill={linkedId ? colorForId(linkedId) : "#fb4171"}
            stroke="#ffffff"
            strokeWidth={2}
            onClick={() => linkedId && focusItem(linkedId)}
            style={{ opacity: 0, transition: "opacity 150ms", pointerEvents: "auto", cursor: "pointer" }}
          />
          <circle
            ref={linkEndDotRef}
            r={3.5}
            fill={linkedId ? colorForId(linkedId) : "#fb4171"}
            stroke="#ffffff"
            strokeWidth={1.25}
            style={{ opacity: 0, transition: "opacity 150ms" }}
          />
          {showAllArrows &&
            overviewItems
              .filter((item) => item.id !== linkedId)
              .map((item) => (
              <g key={`ov-${item.id}`}>
                <path
                  ref={(el) => {
                    overviewPathRefs.current[item.id] = el;
                  }}
                  fill="none"
                  stroke={colorForId(item.id)}
                  strokeWidth={2.25}
                  onClick={() => flashCard(item.id)}
                  style={{
                    opacity: 0,
                    transition: "opacity 150ms",
                    pointerEvents: "auto",
                    cursor: "pointer",
                  }}
                />
                <circle
                  ref={(el) => {
                    overviewDotRefs.current[item.id] = el;
                  }}
                  r={3.5}
                  fill={colorForId(item.id)}
                  stroke="#ffffff"
                  strokeWidth={1}
                  onClick={() => focusItem(item.id)}
                  style={{
                    opacity: 0,
                    transition: "opacity 150ms",
                    pointerEvents: "auto",
                    cursor: "pointer",
                  }}
                />
                <circle
                  ref={(el) => {
                    overviewEndDotRefs.current[item.id] = el;
                  }}
                  r={2.5}
                  fill={colorForId(item.id)}
                  stroke="#ffffff"
                  strokeWidth={1}
                  style={{ opacity: 0, transition: "opacity 150ms" }}
                />
              </g>
            ))}
        </svg>

        {/* Floating message bubble: appears over the marker's tip once a
            connector has been focused, bringing the comment into the scene
            instead of only tracing it back to the 2D list. */}
        {linkedId &&
          (() => {
            const comment = comments.find((c) => c.id === linkedId);
            const note = comment ? undefined : notes.find((n) => n.id === linkedId);
            const body = comment?.body ?? note?.body;
            if (!body) return null;
            const bubbleColor = colorForId(linkedId);
            return (
              <div
                ref={bubbleRef}
                className={
                  "pointer-events-none fixed z-[16]" +
                  (bubbleSettled ? " animate-bubble-settle" : "")
                }
                // Below the h-14 (56px) header, which isn't positioned so
                // has no real z-index of its own — the settle keyframes
                // (styles.css) read this as their rest position.
                style={
                  bubbleSettled
                    ? undefined
                    : {
                        opacity: bubbleVisible ? 1 : 0,
                        transition: "opacity 300ms ease",
                        transform: "translate(-50%, calc(-100% - 26px))",
                      }
                }
              >
                <div className="animate-bubble-float">
                  <div
                    className="relative w-56 rounded-2xl border-2 bg-viewport-card px-3.5 py-2.5 shadow-2xl pointer-events-auto"
                    style={{ borderColor: bubbleColor }}
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      {overviewItems.length > 1 ? (
                        <button
                          onClick={() => cycleFocus(-1)}
                          aria-label="Message précédent"
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-viewport-muted-foreground hover:bg-viewport-2 hover:text-viewport-foreground"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <span className="w-5" />
                      )}
                      <p className="truncate text-[11px] font-semibold text-viewport-muted-foreground">
                        {comment ? comment.author : "Note privée"}
                      </p>
                      {overviewItems.length > 1 ? (
                        <button
                          onClick={() => cycleFocus(1)}
                          aria-label="Message suivant"
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-viewport-muted-foreground hover:bg-viewport-2 hover:text-viewport-foreground"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <span className="w-5" />
                      )}
                    </div>
                    <div
                      className={
                        // Near the marker it has to stay small — floating
                        // in the middle of the 3D scene. Once settled at
                        // top-right, the comments panel is guaranteed
                        // collapsed, so it can use most of the viewport.
                        (bubbleSettled ? "max-h-[65vh]" : "max-h-24") + " overflow-y-auto pr-0.5"
                      }
                    >
                      <p className="text-xs leading-relaxed text-viewport-foreground">{body}</p>
                    </div>
                    {comment && (
                      <button
                        onClick={() => {
                          const willResolve = !comment.resolved;
                          setComments((prev) =>
                            prev.map((x) =>
                              x.id === comment.id ? { ...x, resolved: willResolve } : x,
                            ),
                          );
                          if (willResolve) {
                            toast.success("Commentaire résolu", {
                              description: `${comment.author} a été notifié·e de la résolution.`,
                            });
                          }
                        }}
                        className="mt-2 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-viewport-muted-foreground hover:bg-viewport-2 hover:text-viewport-foreground"
                      >
                        <Check className="h-3 w-3" /> {comment.resolved ? "Rouvrir" : "Résoudre"}
                      </button>
                    )}
                    <div
                      className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 bg-viewport-card"
                      style={{ borderColor: bubbleColor }}
                    />
                  </div>
                </div>
              </div>
            );
          })()}

        {/* Left tool panel: two icon+label tabs stand in for a rail */}
        <aside
          className="absolute left-0 top-4 bottom-4 z-20 hidden w-72 flex-col overflow-y-auto rounded-r-xl border border-l-0 border-border bg-surface shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] md:flex"
          style={{
            transform: `perspective(1400px) ${COLLAPSE_MODE(leftPanelOpen, "left").transform}`,
            transformOrigin: "left center",
            opacity: COLLAPSE_MODE(leftPanelOpen, "left").opacity,
            transition: COLLAPSE_MODE(leftPanelOpen, "left").transition,
          }}
        >
          <div className="flex shrink-0 items-center gap-2 border-b border-border p-2">
            <div className="grid flex-1 grid-cols-2 gap-1">
              <button
                onClick={() => setLeftTab("settings")}
                className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-colors ${
                  leftTab === "settings"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Réglages
              </button>
              <button
                onClick={() => setLeftTab("library")}
                className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-colors ${
                  leftTab === "library"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <Library className="h-3.5 w-3.5" />
                Bibliothèque
              </button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => setLeftPanelOpen(false)}
              aria-label="Réduire le panneau"
            >
              <ArrowLeftToLine className="h-4 w-4" />
            </Button>
          </div>

          {leftTab === "settings" ? (
            <div className="flex flex-col gap-5 p-4">
              <Section title="Matrice" icon={<Grid3x3 className="h-3.5 w-3.5" />}>
                <Control label="Niveaux" value={levels}>
                  <Slider min={6} max={34} step={1} value={[levels]} onValueChange={([v]) => setLevels(v!)} />
                </Control>
                <Control label="Densité voxel" value={`${density}×`}>
                  <Slider min={1} max={3} step={1} value={[density]} onValueChange={([v]) => setDensity(v!)} />
                </Control>
                <Control label="Niveau actif" value={`N${String(activeLevel).padStart(2, "0")}`}>
                  <Slider
                    min={0}
                    max={levels - 1}
                    step={1}
                    value={[Math.min(activeLevel, levels - 1)]}
                    onValueChange={([v]) => {
                      setActiveLevel(v!);
                      setLinkedId(null);
                    }}
                  />
                </Control>
              </Section>

              <Section title="Vue" icon={<Box className="h-3.5 w-3.5" />}>
                <div className="grid grid-cols-3 gap-1 rounded-md border border-border/70 bg-background/40 p-1">
                  {(
                    [
                      { id: "perspective", label: "3D", icon: Box },
                      { id: "plan", label: "Plan", icon: Square },
                      { id: "section", label: "Coupe", icon: Rows3 },
                    ] as const
                  ).map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setViewMode(v.id)}
                      className={`flex flex-col items-center gap-1 rounded px-1 py-1.5 text-[10px] transition-colors ${
                        viewMode === v.id
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <v.icon className="h-3.5 w-3.5" />
                      {v.label}
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Rendu" icon={<Layers className="h-3.5 w-3.5" />}>
                <Select value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
                  <SelectTrigger className="h-9 bg-background/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Volumes pleins</SelectItem>
                    <SelectItem value="wire">Filaire</SelectItem>
                    <SelectItem value="ghost">Fantôme</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center justify-between rounded-md border border-border/70 bg-background/40 px-3 py-2">
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Rotate3d className="h-3.5 w-3.5" /> Rotation auto
                  </span>
                  <Switch
                    checked={autoRotate}
                    onCheckedChange={setAutoRotate}
                    disabled={viewMode !== "perspective"}
                  />
                </div>
              </Section>

              <Section title="Statistiques" icon={<CircleDot className="h-3.5 w-3.5" />}>
                <Stat label="Voxels rendus" value={stats.voxels.toLocaleString("fr-FR")} />
                <Stat label="Images / s" value={String(stats.fps)} />
                <Stat label="Poids matrice" value={`${project.sizeGb} Go`} />
                <Stat label="Collisions" value="3" warn />
              </Section>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <HardDrive className="h-3 w-3 shrink-0" />
                <span className="shrink-0">Quota {quotaPct}%</span>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full ${quotaPct >= 80 ? "bg-warning" : "bg-muted-foreground/50"}`}
                    style={{ width: `${quotaPct}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="p-3 pb-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={libraryQuery}
                    onChange={(e) => setLibraryQuery(e.target.value)}
                    placeholder="Rechercher un élément…"
                    className="h-9 bg-background/60 pl-9 text-xs"
                  />
                </div>
              </div>
              <Accordion
                type="multiple"
                defaultValue={LIBRARY.map((c) => c.id)}
                className="flex-1 overflow-y-auto px-3"
              >
                {filteredLibrary.map((cat) => (
                  <AccordionItem key={cat.id} value={cat.id} className="border-border/70">
                    <AccordionTrigger className="py-2.5 text-xs font-medium hover:no-underline">
                      <span className="flex items-center gap-2">
                        {cat.label}
                        <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-normal text-muted-foreground">
                          {cat.audience}
                        </Badge>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-2 pt-0">
                      <div className="space-y-1">
                        {cat.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() =>
                              toast(item.name, {
                                description: `Ajouté au niveau N${String(activeLevel).padStart(2, "0")} · ${item.spec}`,
                              })
                            }
                            className="group flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-secondary"
                          >
                            <span
                              className="h-5 w-5 shrink-0 rounded-sm border border-border/70"
                              style={{
                                background: `oklch(0.6 0.07 ${item.accent})`,
                              }}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-xs">{item.name}</span>
                              <span className="block truncate font-mono text-[10px] text-muted-foreground">
                                {item.spec}
                              </span>
                            </span>
                            <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/0 group-hover:text-muted-foreground" />
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
                {filteredLibrary.length === 0 && (
                  <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                    Aucun élément ne correspond à « {libraryQuery} ».
                  </p>
                )}
              </Accordion>
            </div>
          )}
        </aside>

        {!leftPanelOpen && (
          <div className="absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-1 rounded-r-lg border border-l-0 border-border bg-surface p-1 shadow-lg md:flex">
            <button
              onClick={() => {
                setLeftTab("settings");
                setLeftPanelOpen(true);
              }}
              aria-label="Réglages"
              title="Réglages"
              className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
                leftTab === "settings"
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setLeftTab("library");
                setLeftPanelOpen(true);
              }}
              aria-label="Bibliothèque"
              title="Bibliothèque"
              className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
                leftTab === "library"
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
            >
              <Library className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Viewport */}
        <main className="relative min-w-0 flex-1 bg-viewport">
          <div className="absolute inset-0">
            <ClientOnly fallback={<ViewportSkeleton />}>
              <Suspense fallback={<ViewportSkeleton />}>
                <MatrixCanvas
                  levels={levels}
                  density={density}
                  mode={mode}
                  activeLevel={Math.min(activeLevel, levels - 1)}
                  autoRotate={autoRotate}
                  buildingType={project.buildingType}
                  viewMode={viewMode}
                  onStats={setStats}
                  focusRequestId={focusRequestId}
                  unfocusRequestId={unfocusRequestId}
                  markerActive={linkedId !== null}
                  onMarkerPosition={handleMarkerPosition}
                  activeMarkerId={linkedId ?? undefined}
                  closeUp={linkedId !== null}
                  closeUpInterior={closeUpInterior}
                  overviewMarkers={showAllArrows ? overviewItems : []}
                  panelInsetPx={comments.length > 0 || notes.length > 0 ? (drawerOpen ? 316 : 16) : 16}
                  onOverviewPositions={handleOverviewPositions}
                />
              </Suspense>
            </ClientOnly>
          </div>

          <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-border/60 bg-surface/70 px-3 py-2 backdrop-blur-md md:left-[19rem]">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Matrice volumétrique
            </p>
            <p className="mt-0.5 text-sm font-medium">
              {project.name} · N{String(Math.min(activeLevel, levels - 1)).padStart(2, "0")}
            </p>
          </div>

          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border/60 bg-surface/70 px-4 py-1.5 text-[11px] text-muted-foreground backdrop-blur-md">
            Glisser pour faire tourner · molette pour zoomer · flèches pour naviguer · Maj + haut/bas pour avancer/reculer
          </div>
        </main>

        {/* Comments & private notes: collapsible floating panel, 2 tabs — dark header, light body */}
        {(comments.length > 0 || notes.length > 0) && (
        <div
          className="absolute top-4 bottom-4 z-20 w-[300px] max-w-[85vw]"
          style={{
            right: `${recede * 90}px`,
            boxShadow: `0 ${20 + 50 * recede}px ${50 + 50 * recede}px ${-12 - 6 * recede}px rgba(0,0,0,${0.6 + 0.1 * recede})`,
            // Receding into the scene is a pure straight-back push
            // (perspective + translateZ only) — a tilt there reads as a
            // shutter swinging, not a lateral withdrawal. Collapsing the
            // panel is the actual open/close, so that's where COLLAPSE_MODE
            // applies.
            transform: `perspective(1400px) translateZ(${-2200 * recede}px) ${
              COLLAPSE_MODE(drawerOpen, "right").transform
            }`,
            transformOrigin: "right center",
            opacity: COLLAPSE_MODE(drawerOpen, "right").opacity,
            transition: isRecedeDragging
              ? "transform 0s, right 0s"
              : `right 250ms ease, box-shadow 250ms ease, ${COLLAPSE_MODE(drawerOpen, "right").transition}`,
          }}
        >
          <div
            onPointerDown={onRecedeGripDown}
            onPointerMove={onRecedeGripMove}
            onPointerUp={onRecedeGripUp}
            onPointerCancel={onRecedeGripUp}
            title="Glisser vers la droite pour reculer le panneau dans la scène"
            className="absolute -top-2.5 left-1/2 z-30 flex h-5 w-10 -translate-x-1/2 cursor-ew-resize touch-none items-center justify-center rounded-full border border-border bg-surface shadow-md"
          >
            <ChevronsRight className="h-3 w-3 text-muted-foreground" />
          </div>
          <div
            className="flex h-full w-full flex-col overflow-hidden border border-border"
            style={{
              borderTopLeftRadius: "0.75rem",
              borderBottomLeftRadius: "0.75rem",
              borderTopRightRadius: `${recede * 0.75}rem`,
              borderBottomRightRadius: `${recede * 0.75}rem`,
            }}
          >
          <div className="flex shrink-0 items-center gap-2 border-b border-border bg-surface p-2">
            <div className="grid flex-1 grid-cols-2 gap-1">
              <button
                onClick={() => setPanelTab("messages")}
                className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-colors ${
                  panelTab === "messages"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Messages
                {openCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-warning/20 px-1 text-[9px] font-semibold text-warning">
                    {openCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setPanelTab("notes")}
                className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-colors ${
                  panelTab === "notes"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <Lock className="h-3.5 w-3.5" />
                Notes privées
                {notes.length > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-muted px-1 text-[9px] font-semibold text-muted-foreground">
                    {notes.length}
                  </span>
                )}
              </button>
            </div>
            {panelTab === "notes" && overviewItems.length > 0 && (
              <Button
                variant={showAllArrows ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                onClick={() => setShowAllArrows((v) => !v)}
                aria-label="Afficher toutes les localisations"
                title="Afficher toutes les localisations d'un coup d'œil"
              >
                <Waypoints className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setDrawerOpen(false);
                setLinkedId(null);
              }}
              aria-label="Réduire le panneau"
            >
              <ArrowRightToLine className="h-4 w-4" />
            </Button>
          </div>

          {panelTab === "messages" ? (
          <>
          <div className="flex shrink-0 items-center gap-2 border-b border-border bg-surface p-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={messageQuery}
                onChange={(e) => setMessageQuery(e.target.value)}
                placeholder="Rechercher un message…"
                className="h-8 border-viewport-border bg-viewport-card pl-8 text-xs text-viewport-foreground placeholder:text-viewport-muted-foreground"
              />
            </div>
            {overviewItems.length > 0 && (
              <Button
                variant={showAllArrows ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                onClick={() => setShowAllArrows((v) => !v)}
                aria-label="Afficher toutes les localisations"
                title="Afficher toutes les localisations d'un coup d'œil"
              >
                <Waypoints className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div ref={scrollAreaRef} className="flex-1 space-y-3 overflow-y-auto bg-viewport p-3">
            {filteredComments.length === 0 && (
              <p className="px-2 py-6 text-center text-xs text-viewport-muted-foreground">
                Aucun message ne correspond à « {messageQuery} ».
              </p>
            )}
            {filteredComments.map((c) => (
              <div
                key={c.id}
                ref={(el) => {
                  cardRefs.current[c.id] = el;
                }}
                onClick={() => c.levelIndex !== undefined && locateLevel(c.id, c.levelIndex)}
                className={`rounded-lg border p-3 transition-colors ${
                  c.levelIndex !== undefined ? "cursor-pointer" : ""
                } ${
                  c.resolved
                    ? "border-viewport-border/60 bg-viewport-card/60 opacity-70"
                    : "border-viewport-border bg-viewport-card"
                } ${linkedId === c.id ? "ring-2 ring-warning/60" : ""} ${
                  pulsingId === c.id ? "animate-connector-flash" : ""
                }`}
                style={{ "--flash-color": colorForId(c.id) } as React.CSSProperties}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${
                      c.role === "Client"
                        ? "bg-warning/20 text-warning"
                        : "bg-primary/15 text-primary"
                    }`}
                  >
                    {c.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-viewport-foreground">{c.author}</p>
                    <p className="text-[10px] text-viewport-muted-foreground">{c.role}</p>
                  </div>
                  <span className="ml-auto font-mono text-[10px] text-viewport-muted-foreground">
                    {c.time}
                  </span>
                </div>
                {c.levelIndex !== undefined ? (
                  <span
                    className="mt-1.5 flex items-center gap-1.5 text-xs text-viewport-muted-foreground"
                    title="Cliquer la carte pour localiser ce niveau dans la matrice"
                  >
                    <MapPin className="h-3 w-3 shrink-0" style={{ color: colorForId(c.id) }} />
                    {c.level}
                  </span>
                ) : (
                  <span
                    className="mt-1.5 flex items-center gap-1.5 text-xs text-viewport-muted-foreground"
                    title="Commentaire général, non localisé dans la matrice"
                  >
                    <MapPinOff className="h-3 w-3 shrink-0 text-viewport-muted-foreground/60" />
                    {c.level}
                  </span>
                )}
                <p className="mt-1.5 text-xs leading-relaxed text-viewport-foreground/85">{c.body}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const willResolve = !c.resolved;
                      setComments((prev) =>
                        prev.map((x) => (x.id === c.id ? { ...x, resolved: willResolve } : x)),
                      );
                      if (willResolve) {
                        toast.success("Commentaire résolu", {
                          description: `${c.author} a été notifié·e de la résolution.`,
                        });
                      }
                    }}
                    className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-viewport-muted-foreground hover:bg-viewport-2 hover:text-viewport-foreground"
                  >
                    <Check className="h-3 w-3" /> {c.resolved ? "Rouvrir" : "Résoudre"}
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="rounded px-1.5 py-0.5 text-[10px] text-viewport-muted-foreground hover:bg-viewport-2 hover:text-viewport-foreground"
                  >
                    Répondre
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form
            className="flex items-center gap-2 border-t border-viewport-border bg-viewport p-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.trim()) return;
              setComments((prev) => [
                ...prev,
                {
                  id: `c${prev.length + 1}`,
                  projectId: project.id,
                  author: "Camille Rousseau",
                  role: "Collaborateur",
                  initials: "CR",
                  level: `Niveau ${String(activeLevel).padStart(2, "0")}`,
                  levelIndex: activeLevel,
                  time: new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  body: draft.trim(),
                  resolved: false,
                },
              ]);
              setDraft("");
              toast.success("Commentaire publié");
            }}
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Commenter ce niveau…"
              className="h-9 border-viewport-border bg-viewport-card text-xs text-viewport-foreground placeholder:text-viewport-muted-foreground"
            />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
          </>
          ) : (
          <>
          <div ref={scrollAreaRef} className="flex-1 space-y-3 overflow-y-auto bg-viewport p-3">
            {notes.length === 0 && (
              <p className="px-2 py-6 text-center text-xs text-viewport-muted-foreground">
                Aucune note privée pour l'instant. Elle ne sera visible que par vous.
              </p>
            )}
            {notes.map((n) => (
              <div
                key={n.id}
                ref={(el) => {
                  cardRefs.current[n.id] = el;
                }}
                onClick={() => n.levelIndex !== undefined && locateLevel(n.id, n.levelIndex)}
                className={`rounded-lg border border-viewport-border bg-viewport-card p-3 transition-colors ${
                  n.levelIndex !== undefined ? "cursor-pointer" : ""
                } ${linkedId === n.id ? "ring-2 ring-warning/60" : ""} ${
                  pulsingId === n.id ? "animate-connector-flash" : ""
                }`}
                style={{ "--flash-color": colorForId(n.id) } as React.CSSProperties}
              >
                <div className="flex items-center gap-2">
                  <Lock className="h-3 w-3 shrink-0 text-viewport-muted-foreground" />
                  <span className="text-[10px] text-viewport-muted-foreground">Note privée</span>
                  <span className="ml-auto font-mono text-[10px] text-viewport-muted-foreground">
                    {n.time}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotes((prev) => prev.filter((x) => x.id !== n.id));
                    }}
                    aria-label="Supprimer la note"
                    className="text-viewport-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                {n.levelIndex !== undefined ? (
                  <span
                    className="mt-1.5 flex items-center gap-1.5 text-xs text-viewport-muted-foreground"
                    title="Cliquer la carte pour localiser ce niveau dans la matrice"
                  >
                    <MapPin className="h-3 w-3 shrink-0" style={{ color: colorForId(n.id) }} />
                    {n.level}
                  </span>
                ) : (
                  <span className="mt-1.5 flex items-center gap-1.5 text-xs text-viewport-muted-foreground">
                    <MapPinOff className="h-3 w-3 shrink-0 text-viewport-muted-foreground/60" />
                    Général
                  </span>
                )}
                <p className="mt-1.5 text-xs leading-relaxed text-viewport-foreground/85">{n.body}</p>
              </div>
            ))}
          </div>

          <form
            className="flex items-center gap-2 border-t border-viewport-border bg-viewport p-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!noteDraft.trim()) return;
              setNotes((prev) => [
                ...prev,
                {
                  id: `n${prev.length + 1}`,
                  projectId: project.id,
                  level: `Niveau ${String(activeLevel).padStart(2, "0")}`,
                  levelIndex: activeLevel,
                  time: new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  body: noteDraft.trim(),
                },
              ]);
              setNoteDraft("");
              toast.success("Note enregistrée", { description: "Visible par vous uniquement." });
            }}
          >
            <Input
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Note privée sur ce niveau…"
              className="h-9 border-viewport-border bg-viewport-card text-xs text-viewport-foreground placeholder:text-viewport-muted-foreground"
            />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
          </>
          )}
          <div
            className="pointer-events-none absolute inset-0 bg-[#ced4c1]"
            style={{
              opacity: recede * 0.2,
              transition: isRecedeDragging ? "opacity 0s" : "opacity 250ms ease",
            }}
            aria-hidden
          />
          </div>
        </div>
        )}

        {comments.length > 0 && !drawerOpen && (
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Ouvrir les commentaires"
            className="absolute right-0 top-1/2 z-20 flex h-28 w-11 -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-l-lg border border-r-0 border-border bg-surface text-muted-foreground shadow-lg transition-colors hover:text-foreground"
          >
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-semibold">{openCount}</span>
          </button>
        )}
      </div>
    </div>
  );
}

function ViewportSkeleton() {
  return (
    <div className="flex h-full items-center justify-center bg-viewport">
      <p className="animate-pulse rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs text-muted-foreground">
        Initialisation du moteur WebGL…
      </p>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {icon} {title}
      </p>
      {children}
    </div>
  );
}

function Control({
  label,
  value,
  children,
}: {
  label: string;
  value: string | number;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground">{value}</span>
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-mono ${warn ? "text-warning" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

function SharePanel({
  projectName,
  onDone,
}: {
  projectName: string;
  onDone: () => void;
}) {
  const [query, setQuery] = useState("");
  const [invited, setInvited] = useState<Array<{ person: Person; access: Access }>>([
    { person: DIRECTORY[1]!, access: "Édition" },
    { person: DIRECTORY[4]!, access: "Commentaire" },
  ]);
  const [linkAccess, setLinkAccess] = useState<"restricted" | "link">("restricted");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return DIRECTORY.filter(
      (p) =>
        !invited.some((i) => i.person.id === p.id) &&
        (p.name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.org.toLowerCase().includes(q)),
    ).slice(0, 5);
  }, [query, invited]);

  return (
    <div>
      <div className="border-b border-viewport-border px-4 py-3">
        <p className="text-sm font-semibold text-viewport-foreground">Partager « {projectName} »</p>
        <p className="text-xs text-viewport-muted-foreground">
          Invitez des collègues ou des tiers à consulter cette matrice 3D.
        </p>
      </div>

      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-viewport-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ajouter des personnes, groupes ou e-mails…"
            className="h-9 border-viewport-border bg-viewport-card pl-9 text-sm text-viewport-foreground placeholder:text-viewport-muted-foreground"
          />
        </div>

        {results.length > 0 && (
          <div className="mt-2 overflow-hidden rounded-lg border border-viewport-border bg-viewport-card shadow-xl">
            {results.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setInvited((prev) => [...prev, { person: p, access: "Lecture" }]);
                  setQuery("");
                }}
                className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-viewport-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-viewport-2 text-[10px] font-semibold text-viewport-foreground">
                  {p.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm text-viewport-foreground">{p.name}</p>
                  <p className="truncate text-[11px] text-viewport-muted-foreground">{p.email}</p>
                </div>
                {p.external && (
                  <Badge variant="outline" className="ml-auto border-warning/30 bg-warning/10 text-warning">
                    Externe
                  </Badge>
                )}
              </button>
            ))}
          </div>
        )}

        <p className="mt-4 text-xs font-medium text-viewport-muted-foreground">Personnes ayant accès</p>
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-[10px] font-semibold text-primary">
              CR
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm text-viewport-foreground">Camille Rousseau (vous)</p>
              <p className="truncate text-[11px] text-viewport-muted-foreground">
                admin@example.com
              </p>
            </div>
            <span className="ml-auto text-xs text-viewport-muted-foreground">Propriétaire</span>
          </div>

          {invited.map(({ person, access }) => (
            <div key={person.id} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-viewport-2 text-[10px] font-semibold text-viewport-foreground">
                {person.initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm text-viewport-foreground">
                  {person.name}
                  {person.external && (
                    <span className="ml-2 rounded bg-warning/15 px-1.5 py-0.5 text-[10px] text-warning">
                      externe
                    </span>
                  )}
                </p>
                <p className="truncate text-[11px] text-viewport-muted-foreground">{person.org}</p>
              </div>
              <Select
                value={access}
                onValueChange={(v) =>
                  setInvited((prev) =>
                    prev.map((i) =>
                      i.person.id === person.id ? { ...i, access: v as Access } : i,
                    ),
                  )
                }
              >
                <SelectTrigger className="ml-auto h-8 w-[140px] border-0 bg-transparent text-xs text-viewport-foreground hover:bg-viewport-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lecture">Lecture</SelectItem>
                  <SelectItem value="Commentaire">Commentaire</SelectItem>
                  <SelectItem value="Édition">Édition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-viewport-border bg-viewport-card p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-viewport-2">
              <Globe2 className="h-4 w-4 text-viewport-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-viewport-foreground">
                {linkAccess === "restricted" ? "Accès restreint" : "Toute personne avec le lien"}
              </p>
              <p className="text-[11px] text-viewport-muted-foreground">
                {linkAccess === "restricted"
                  ? "Seules les personnes invitées peuvent ouvrir la matrice"
                  : "Lecture seule, sans possibilité d'export"}
              </p>
            </div>
            <Switch
              className="ml-auto"
              checked={linkAccess === "link"}
              onCheckedChange={(v) => setLinkAccess(v ? "link" : "restricted")}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-viewport-border px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success("Lien de la matrice copié dans le presse-papiers")}
        >
          <Link2 className="h-4 w-4" /> Copier le lien
        </Button>
        <Button
          size="sm"
          className="ml-auto"
          onClick={() => {
            onDone();
            toast.success("Invitations envoyées", {
              description: `${invited.length} personne(s) ont reçu l'accès à « ${projectName} »`,
            });
          }}
        >
          Envoyer
        </Button>
      </div>
    </div>
  );
}
