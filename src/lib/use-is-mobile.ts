import { useEffect, useState } from "react";

// Matches Tailwind's `sm` breakpoint (640px) - the same boundary the
// recommendations grid switches from columns-1 to columns-2 at, so "mobile"
// here means "the single-column layout is active", not a device check.
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
