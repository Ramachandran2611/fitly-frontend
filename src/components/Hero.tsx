import type { ReactNode } from "react";

interface HeroProps {
  eyebrow: string;
  headline: ReactNode;
  compact?: boolean;
}

export default function Hero({ eyebrow, headline, compact }: HeroProps) {
  return (
    <div className={compact ? "hero hero-compact" : "hero"}>
      <div className="hero-dots" aria-hidden="true" />
      <div className="hero-topline">
        <span>{eyebrow}</span>
        <span className="hero-loc">Bengaluru</span>
      </div>
      <h1 className="hero-headline">{headline}</h1>
    </div>
  );
}
