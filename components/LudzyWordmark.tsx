/**
 * Tubular / double-outline wordmark inspired by the LUDZY lockup:
 * thick white stroke with a darker “channel” through the centre on black.
 */
export function LudzyWordmark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 196 38"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="LUDZY"
    >
      {/* Outer luminous tube */}
      <text
        x="0"
        y="29"
        fill="none"
        stroke="#ffffff"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          fontFamily: "var(--font-outfit), system-ui, sans-serif",
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: "0.06em",
        }}
      >
        LUDZY
      </text>
      {/* Inner channel darkening centre vein */}
      <text
        x="0"
        y="29"
        fill="none"
        stroke="#0a0a0a"
        strokeWidth={2.35}
        strokeLinecap="round"
        strokeLinejoin="round"
        paintOrder="stroke fill"
        style={{
          fontFamily: "var(--font-outfit), system-ui, sans-serif",
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: "0.06em",
        }}
      >
        LUDZY
      </text>
    </svg>
  );
}
