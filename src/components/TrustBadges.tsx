import type { ReactNode } from "react";

const ICONS: Record<string, ReactNode> = {
  shield: (
    <path d="M20 5 8 10v11c0 12 9 18 12 20 3-2 12-8 12-20V10L20 5Z M13 21l5 5 9-11" />
  ),
  truck: (
    <path d="M4 10h18v13H4V10Z M22 15h6l4 4v4h-10v-8Z M10 27a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M27 27a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
  ),
  returns: (
    <path d="M9 12a11 11 0 1 1-2 8 M9 12v-6 M9 12h6 M31 28a11 11 0 1 1 2-8 M31 28v6 M31 28h-6" />
  ),
  lock: (
    <path d="M10 18V12a10 10 0 0 1 20 0v6 M6 18h28v16H6V18Z M20 25v4" />
  ),
};

const BADGES = [
  { icon: "shield", title: "100%", subtitle: "Authentic Products" },
  { icon: "truck", title: "Free Shipping", subtitle: "on orders above ₹999" },
  { icon: "returns", title: "Easy Returns", subtitle: "within 7 days" },
  { icon: "lock", title: "Secure", subtitle: "Payments" },
];

export default function TrustBadges() {
  return (
    <div className="trust-badges">
      {BADGES.map((badge) => (
        <div className="trust-badge" key={badge.icon}>
          <div className="trust-badge-icon">
            <svg viewBox="0 0 40 40" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {ICONS[badge.icon]}
            </svg>
          </div>
          <p className="trust-badge-title">{badge.title}</p>
          <p className="trust-badge-subtitle">{badge.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
