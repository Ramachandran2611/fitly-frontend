export default function ProductIcon({ seed }: { seed: number }) {
  const tilt = (seed % 3) - 1;
  return (
    <svg
      viewBox="0 0 120 140"
      width="88"
      height="102"
      role="img"
      aria-hidden="true"
      style={{ transform: `rotate(${tilt * 4}deg)` }}
    >
      <rect x="20" y="18" width="80" height="112" rx="14" fill="rgba(255,255,255,0.92)" />
      <rect x="20" y="18" width="80" height="34" rx="14" fill="rgba(255,255,255,0.6)" />
      <rect x="42" y="4" width="36" height="18" rx="6" fill="rgba(255,255,255,0.85)" />
      <line x1="20" y1="70" x2="100" y2="70" stroke="currentColor" strokeOpacity="0.18" strokeWidth="3" />
      <line x1="20" y1="86" x2="100" y2="86" stroke="currentColor" strokeOpacity="0.12" strokeWidth="3" />
    </svg>
  );
}
