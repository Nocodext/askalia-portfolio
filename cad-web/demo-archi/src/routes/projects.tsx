import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import {
  Boxes,
  Search,
  Plus,
  HardDrive,
  AlertTriangle,
  LogOut,
  ArrowUpRight,
  Layers3,
  List,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROJECTS, QUOTA, type Project } from "@/lib/studio-data";
import { getSession, signOut, type Session } from "@/lib/session";

const ProjectThumbnail = lazy(() => import("@/components/ProjectThumbnail"));

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projets — ACME Matrix Studio" },
      {
        name: "description",
        content:
          "Vos matrices 3D de bâtiments numériques : statut, volumétrie, dernière mise à jour et quota de stockage.",
      },
      { property: "og:title", content: "Projets — ACME Matrix Studio" },
      { property: "og:description", content: "Toutes vos matrices 3D dans un seul espace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsPage,
});

const statusStyles: Record<string, string> = {
  "En cours": "bg-primary/15 text-primary border-primary/30",
  "Revue client": "bg-warning/15 text-warning border-warning/30",
  Livré: "bg-success/15 text-success border-success/30",
  Archivé: "bg-muted text-muted-foreground border-border",
};

function ProjectsPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<Project["status"] | "all">("all");
  const [layout, setLayoutState] = useState<"list" | "gallery">(() => {
    if (typeof window === "undefined") return "list";
    try {
      const saved = window.sessionStorage.getItem("axiom.projects.layout");
      return saved === "gallery" ? "gallery" : "list";
    } catch {
      return "list";
    }
  });
  const setLayout = (v: "list" | "gallery") => {
    setLayoutState(v);
    try {
      window.sessionStorage.setItem("axiom.projects.layout", v);
    } catch {
      /* noop */
    }
  };

  useEffect(() => {
    const s = getSession();
    if (!s) navigate({ to: "/" });
    else setSession(s);
  }, [navigate]);

  const pct = Math.round((QUOTA.usedGb / QUOTA.totalGb) * 100);
  const list = PROJECTS.filter(
    (p) =>
      (p.name + p.city + p.building).toLowerCase().includes(q.toLowerCase()) &&
      (statusFilter === "all" || p.status === statusFilter),
  );

  if (!session) return <div className="min-h-screen bg-background" />;

  return (
    <div className="relative min-h-screen">
      <header className="relative z-10 border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15">
              <Boxes className="h-4.5 w-4.5 text-primary" />
            </div>
            <span className="font-display text-sm font-semibold tracking-tight">ACME Studio</span>
          </div>
          <nav className="ml-6 hidden gap-1 text-sm md:flex">
            <span className="rounded-md bg-secondary px-3 py-1.5 font-medium">Projets</span>
            <span className="px-3 py-1.5 text-muted-foreground">Bibliothèque</span>
            <span className="px-3 py-1.5 text-muted-foreground">Équipe</span>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium leading-tight">{session.name}</p>
              <p className="text-[11px] text-muted-foreground">{session.email}</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
              CR
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Se déconnecter"
              onClick={() => {
                signOut();
                navigate({ to: "/" });
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Projets</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {PROJECTS.length} matrices de bâtiments numériques · espace ACME Studio
            </p>
          </div>
          <Button className="h-10">
            <Plus className="h-4 w-4" /> Nouvelle matrice
          </Button>
        </div>

        <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Rechercher un projet…"
                  className="h-10 w-full bg-surface/60 pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                <SelectTrigger className="h-10 w-44 bg-surface/60">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Revue client">Revue client</SelectItem>
                  <SelectItem value="Livré">Livré</SelectItem>
                  <SelectItem value="Archivé">Archivé</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1 rounded-md border border-border bg-surface/60 p-1">
                <button
                  onClick={() => setLayout("list")}
                  aria-label="Vue liste"
                  title="Vue liste"
                  className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${
                    layout === "list"
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setLayout("gallery")}
                  aria-label="Vue galerie"
                  title="Vue galerie"
                  className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${
                    layout === "gallery"
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>

            {layout === "list" ? (
              <div className="space-y-3">
                {list.map((p) => (
                  <ProjectRow key={p.id} p={p} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {list.map((p) => (
                  <GalleryCard key={p.id} p={p} />
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-border/80 bg-surface/60 p-5">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Quota de stockage</p>
              </div>
              <p className="mt-4 font-display text-3xl font-semibold">
                {QUOTA.usedGb} <span className="text-base text-muted-foreground">/ {QUOTA.totalGb} Go</span>
              </p>
              <Progress
                value={pct}
                className="mt-3 h-2 bg-secondary [&>div]:bg-warning"
              />
              <p className="mt-2 text-xs text-muted-foreground">{pct}% de votre espace utilisé</p>

              {pct >= 80 && (
                <div className="mt-4 flex gap-3 rounded-lg border border-warning/40 bg-warning/10 p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  <div>
                    <p className="text-xs font-semibold text-warning">Quota bientôt atteint</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      Vous avez dépassé 80% de votre espace. Archivez des matrices ou augmentez
                      votre plan pour continuer à exporter.
                    </p>
                    <Button size="sm" variant="outline" className="mt-3 h-7 border-warning/40 text-warning text-xs">
                      Augmenter le quota
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border/80 bg-surface/60 p-5">
              <p className="text-sm font-medium">Activité récente</p>
              <ul className="mt-4 space-y-3 text-xs text-muted-foreground">
                <li>
                  <span className="text-foreground">Sophie Meunier</span> a commenté Tour Hélios ·
                  09:41
                </li>
                <li>
                  <span className="text-foreground">Yanis Bertrand</span> a publié la v34 · 10:02
                </li>
                <li>
                  <span className="text-foreground">Bureau Veritas</span> a reçu un accès lecture ·
                  hier
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

function ProjectRow({ p }: { p: Project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to="/studio/$projectId"
      params={{ projectId: p.id }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex items-center gap-5 rounded-xl border border-border/80 bg-surface/60 p-4 transition-colors duration-300 ease-out hover:border-primary/50 hover:bg-surface-2/70"
    >
      <div className="relative h-12 w-12 shrink-0">
        <div
          className="absolute inset-0 -m-2 overflow-hidden rounded-xl border-2 border-success shadow-lg"
          style={{
            background: `radial-gradient(circle at 30% 20%, oklch(0.7 0.17 ${p.accent} / 0.65), oklch(0.8 0.006 260))`,
          }}
        >
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <Layers3 className="h-6 w-6 text-foreground/80" />
              </div>
            }
          >
            <ProjectThumbnail buildingType={p.buildingType} hovered={hovered} />
          </Suspense>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{p.name}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {p.building} · {p.city} · pilote {p.owner}
        </p>
      </div>
      <div className="hidden w-28 shrink-0 text-left sm:block">
        <Badge variant="outline" className={statusStyles[p.status]}>
          {p.status}
        </Badge>
      </div>
      <div className="hidden text-right sm:block">
        <p className="font-mono text-sm">{p.voxels.toLocaleString("fr-FR")}</p>
        <p className="text-[11px] text-muted-foreground">voxels</p>
      </div>
      <div className="hidden text-right md:block">
        <p className="font-mono text-sm">{p.sizeGb} Go</p>
        <p className="text-[11px] text-muted-foreground">{p.updated}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:text-primary" />
    </Link>
  );
}

function GalleryCard({ p }: { p: Project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to="/studio/$projectId"
      params={{ projectId: p.id }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col overflow-hidden rounded-xl border border-success/50 bg-surface/60 shadow-[0_0_0_1px_rgba(0,0,0,0.2),0_0_50px_-6px_var(--tw-shadow-color)] shadow-success/40 transition-all hover:border-success hover:shadow-success/60"
    >
      {/* Body: the miniature takes center stage, large and animated on hover */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-viewport">
        <Suspense
          fallback={
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                background: `radial-gradient(circle at 30% 20%, oklch(0.7 0.17 ${p.accent} / 0.65), oklch(0.8 0.006 260))`,
              }}
            >
              <Layers3 className="h-10 w-10 text-foreground/60" />
            </div>
          }
        >
          <ProjectThumbnail buildingType={p.buildingType} hovered={hovered} />
        </Suspense>
        <ArrowUpRight className="absolute right-3 top-3 h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Footer: project info, inverted from the usual header position */}
      <div className="border-t border-border bg-surface p-4">
        <div className="flex items-center gap-2">
          <p className="min-w-0 flex-1 truncate font-medium">{p.name}</p>
          <Badge variant="outline" className={`shrink-0 whitespace-nowrap ${statusStyles[p.status]}`}>
            {p.status}
          </Badge>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {p.building} · {p.city}
        </p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-mono">{p.voxels.toLocaleString("fr-FR")} voxels</span>
          <span className="font-mono">{p.sizeGb} Go</span>
        </div>
      </div>
    </Link>
  );
}
