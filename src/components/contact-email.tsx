import { useEffect, useRef, useState } from "react";

type ContactEmailProps = {
  user: string;
  domain: string;
  placeholder: string;
  copiedMessage: string;
  className?: string;
};

// Keeps "user@domain" out of the prerendered HTML and out of any single
// literal string in the JS bundle — only assembled client-side after mount,
// so plain-HTML scrapers never see a usable address.
export function ContactEmail({
  user,
  domain,
  placeholder,
  copiedMessage,
  className,
}: ContactEmailProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setEmail([user, domain].join("@"));
  }, [user, domain]);

  useEffect(() => () => clearTimeout(hideTimeout.current), []);

  return (
    <span className="relative block">
      <a
        href={email ? `mailto:${email}` : undefined}
        className={`block ${className ?? ""}`}
        onClick={() => {
          // mailto: silently no-ops when the browser/OS has no default mail
          // client configured — copy to clipboard too so the address is
          // always reachable even if nothing visibly happens on click.
          if (!email) return;
          navigator.clipboard?.writeText(email).then(() => {
            setCopied(true);
            clearTimeout(hideTimeout.current);
            hideTimeout.current = setTimeout(() => setCopied(false), 1800);
          });
        }}
      >
        {email ?? placeholder}
      </a>
      <span
        className={`pointer-events-none absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 rounded-md bg-ink px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-white transition-opacity ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        {copiedMessage}
      </span>
    </span>
  );
}
