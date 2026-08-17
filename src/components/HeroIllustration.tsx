export default function HeroIllustration() {
  return (
    <svg viewBox="0 0 400 260" width="100%" height="100%" role="img" aria-label="Dumbbell illustration">
      <circle cx="70" cy="130" r="3" fill="#232830" />
      <circle cx="120" cy="60" r="3" fill="#232830" />
      <circle cx="330" cy="90" r="3" fill="#232830" />
      <circle cx="300" cy="200" r="3" fill="#232830" />
      <circle cx="60" cy="200" r="3" fill="#232830" />

      <g transform="rotate(-18 200 130)">
        <rect x="70" y="95" width="26" height="70" rx="8" fill="#c6ff3a" />
        <rect x="100" y="108" width="18" height="44" rx="6" fill="#c6ff3a" opacity="0.6" />
        <rect x="118" y="122" width="164" height="16" rx="8" fill="#3a4150" />
        <rect x="282" y="108" width="18" height="44" rx="6" fill="#c6ff3a" opacity="0.6" />
        <rect x="304" y="95" width="26" height="70" rx="8" fill="#c6ff3a" />
      </g>
    </svg>
  );
}
