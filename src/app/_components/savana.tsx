// Ambience savana: matahari + dua lapis bukit akasia, murni SVG/CSS.
// Dekoratif penuh (aria-hidden) dan di belakang konten (-z-10).
export function Savana() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-8 right-4 h-24 w-24 rounded-full bg-[radial-gradient(circle_at_36%_32%,#fff4d2,var(--matahari)_62%,#e09f2f)] opacity-90" />
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 390 130"
        preserveAspectRatio="none"
      >
        <path
          d="M0 62 C46 34 96 50 140 56 C200 64 250 40 300 48 C340 54 368 44 390 50 L390 130 L0 130 Z"
          fill="var(--bukit-1)"
          opacity=".75"
        />
        <path
          d="M0 86 C60 68 120 80 190 86 C266 92 330 74 390 82 L390 130 L0 130 Z"
          fill="var(--bukit-2)"
          opacity=".9"
        />
        <g fill="var(--akasia)" opacity=".55">
          <rect x="86" y="46" width="3" height="18" rx="1.5" />
          <path d="M87 48 c-14 0 -20 -8 -20 -13 c0 -7 6 -11 20 -11 c14 0 20 4 20 11 c0 5 -6 13 -20 13 z" />
          <rect x="300" y="54" width="2.6" height="14" rx="1.3" />
          <path d="M301 55 c-11 0 -16 -6 -16 -10 c0 -6 5 -9 16 -9 c11 0 16 3 16 9 c0 4 -5 10 -16 10 z" />
        </g>
      </svg>
    </div>
  );
}
