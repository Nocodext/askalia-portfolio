import { useEffect, useState } from "react";

type ContactEmailProps = {
  user: string;
  domain: string;
  placeholder: string;
  className?: string;
};

// Keeps "user@domain" out of the prerendered HTML and out of any single
// literal string in the JS bundle — only assembled client-side after mount,
// so plain-HTML scrapers never see a usable address.
export function ContactEmail({ user, domain, placeholder, className }: ContactEmailProps) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail([user, domain].join("@"));
  }, [user, domain]);

  return (
    <a href={email ? `mailto:${email}` : undefined} className={className}>
      {email ?? placeholder}
    </a>
  );
}
