import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Boxes, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSession, signIn } from "@/lib/session";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ACME Matrix Studio — Édition 3D de bâtiments numériques" },
      {
        name: "description",
        content:
          "Studio SaaS d'édition de matrices 3D WebGL pour jumeaux numériques de bâtiments : revue client, partage sécurisé et quotas de stockage.",
      },
      { property: "og:title", content: "ACME Matrix Studio" },
      {
        property: "og:description",
        content: "Éditez, annotez et partagez les matrices 3D de vos bâtiments numériques.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSession()) navigate({ to: "/projects" });
  }, [navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const s = signIn(email, password);
      setLoading(false);
      if (!s) setError("Identifiants invalides. Essayez admin@example.com / 1234");
      else navigate({ to: "/projects" });
    }, 500);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="relative z-10 grid w-full max-w-5xl gap-14 lg:grid-cols-2 lg:items-center">
        <div className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <Boxes className="h-3.5 w-3.5 text-primary" /> Matrix Studio v4.2
          </div>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] text-foreground">
            Le jumeau numérique
            <br />
            de vos bâtiments, en matrices.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Éditez des matrices volumétriques WebGL niveau par niveau, collectez les retours
            clients en temps réel et partagez vos rendus avec vos partenaires externes.
          </p>
          <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" /> SSO & ISO 27001
            </span>
            <span>·</span>
            <span>1 240 matrices actives</span>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-8 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15">
              <Boxes className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold leading-none">ACME Studio</p>
              <p className="mt-1 text-xs text-muted-foreground">Connexion à votre espace</p>
            </div>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
                E-mail professionnel
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-background/60 pl-9"
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pwd" className="text-xs uppercase tracking-wider text-muted-foreground">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="pwd"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-background/60 pl-9"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="h-11 w-full">
              {loading ? "Connexion…" : "Entrer dans le studio"}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 rounded-md border border-border/70 bg-background/40 px-3 py-2 font-mono text-[11px] text-muted-foreground">
            démo · admin@example.com / 1234
          </p>
        </div>
      </div>
    </main>
  );
}
