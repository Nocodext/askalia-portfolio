const KEY = "axiom.session";

export type Session = { email: string; name: string };

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function signIn(email: string, password: string): Session | null {
  if (email.trim().toLowerCase() !== "admin@example.com" || password !== "1234") return null;
  const session: Session = { email: "admin@example.com", name: "Camille Rousseau" };
  window.localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function signOut() {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}
