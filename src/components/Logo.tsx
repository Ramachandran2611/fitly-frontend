export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="Fitly">
      <path
        d="M8 4h24l-4 8H16l-2 5h14l-4 8H10l-4 8H0l8-29z"
        fill="var(--lime)"
      />
    </svg>
  );
}
