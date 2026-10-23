// Maskot Jatahku: gagak kecil bergaya 3D dengan cincin mata merah.
// Murni SVG (tanpa file gambar) supaya ikut warna tema dan tetap tajam.
export function Maskot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="maskot-badan" cx="35%" cy="28%">
          <stop offset="0%" stopColor="#4a5a78" />
          <stop offset="55%" stopColor="#2b3550" />
          <stop offset="100%" stopColor="#151c2e" />
        </radialGradient>
        <radialGradient id="maskot-kepala" cx="38%" cy="30%">
          <stop offset="0%" stopColor="#5a6a89" />
          <stop offset="60%" stopColor="#2e3854" />
          <stop offset="100%" stopColor="#181f33" />
        </radialGradient>
        <radialGradient id="maskot-mata" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dfe6f2" />
        </radialGradient>
        <radialGradient id="maskot-cincin" cx="45%" cy="40%">
          <stop offset="0%" stopColor="#ff8a8a" />
          <stop offset="100%" stopColor="#c0243c" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="108" rx="26" ry="5" fill="#000" opacity=".16" />
      <ellipse cx="60" cy="76" rx="30" ry="31" fill="url(#maskot-badan)" />
      <ellipse cx="32" cy="74" rx="12" ry="20" fill="#232c44" transform="rotate(-14 32 74)" />
      <ellipse cx="88" cy="74" rx="12" ry="20" fill="#232c44" transform="rotate(14 88 74)" />
      <circle cx="60" cy="41" r="27" fill="url(#maskot-kepala)" />
      <path d="M60 17 c-6 -10 -14 -12 -19 -8 c5 1 9 5 12 10 z" fill="#1a2135" />
      <circle cx="47" cy="39" r="10.5" fill="url(#maskot-mata)" />
      <circle cx="74" cy="39" r="10.5" fill="url(#maskot-mata)" />
      <circle cx="48.5" cy="40" r="5.4" fill="#131a2b" />
      <circle cx="75.5" cy="40" r="5.4" fill="#131a2b" />
      <circle cx="46.5" cy="37" r="2" fill="#fff" opacity=".9" />
      <circle cx="73.5" cy="37" r="2" fill="#fff" opacity=".9" />
      <circle cx="75.5" cy="40" r="9" fill="none" stroke="url(#maskot-cincin)" strokeWidth="1.8" />
      <path d="M60 50 l7 7 -7 6 -7 -6 z" fill="#f0a53c" />
      <path d="M60 50 l7 7 -7 3 z" fill="#d98c22" />
      <circle cx="32" cy="51" r="5" fill="#e9736f" opacity=".3" />
      <circle cx="88" cy="51" r="5" fill="#e9736f" opacity=".3" />
      <path d="M52 106 l-9 8 12 -3 z" fill="#e6a53c" />
      <path d="M68 106 l9 8 -12 -3 z" fill="#e6a53c" />
    </svg>
  );
}
