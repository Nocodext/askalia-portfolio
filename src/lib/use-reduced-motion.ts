import { useEffect, useState } from "react";

// Only respects the OS "reduce motion" setting in production builds — in
// dev, animations always play regardless of the machine's own setting, so
// testing them doesn't require toggling a system accessibility preference.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (!import.meta.env.PROD) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
