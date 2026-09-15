/**
 * Abstract Montreal map. Schematic rather than literal: the island sitting in
 * the St. Lawrence, Mont Royal as contour rings, and the angled downtown grid.
 * Deliberately not a real address — Kicks2Fresh's service area is the city,
 * and no verified storefront location has been provided.
 */
export default function MontrealMap() {
  return (
    <svg viewBox="0 0 600 520" preserveAspectRatio="xMidYMid slice" aria-hidden focusable="false">
      <defs>
        <linearGradient id="k2fWater" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#141B1D" />
          <stop offset="100%" stopColor="#0D1113" />
        </linearGradient>
        <linearGradient id="k2fLand" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#2B2720" />
          <stop offset="100%" stopColor="#1C1A14" />
        </linearGradient>
        <clipPath id="k2fIsland">
          <path d="M78 246c28-48 84-84 152-103 66-19 137-17 190 7 47 21 79 56 83 99 5 45-25 88-77 116-56 30-128 43-195 36-60-6-111-30-141-66-24-29-30-60-12-89Z" />
        </clipPath>
        <radialGradient id="k2fFade" cx="0.5" cy="0.42" r="0.62">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="70%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#0A0907" stopOpacity="0.95" />
        </radialGradient>
      </defs>

      <rect width="600" height="520" fill="url(#k2fWater)" />

      {/* River currents */}
      <g stroke="rgba(255,250,240,0.08)" strokeWidth="1" fill="none">
        <path d="M-10 398c74-28 154-36 238-26 80 10 156 40 230 88" />
        <path d="M-10 432c78-26 162-32 250-20 84 12 162 44 238 94" />
        <path d="M-10 462c80-24 168-28 258-14 86 14 166 48 242 100" />
        <path d="M8 96c68 24 126 60 172 108" />
        <path d="M-10 64c78 26 144 68 194 124" />
      </g>

      {/* The island */}
      <path
        d="M78 246c28-48 84-84 152-103 66-19 137-17 190 7 47 21 79 56 83 99 5 45-25 88-77 116-56 30-128 43-195 36-60-6-111-30-141-66-24-29-30-60-12-89Z"
        fill="url(#k2fLand)"
      />

      {/* Everything below is clipped to the landmass */}
      <g clipPath="url(#k2fIsland)">
        {/* Downtown / Plateau grid, at the real ~30° rotation */}
        <g stroke="rgba(255,250,240,0.16)" strokeWidth="0.85" transform="rotate(-31 300 260)">
          {Array.from({ length: 30 }, (_, i) => (
            <line key={`h${i}`} x1="-80" y1={-20 + i * 21} x2="700" y2={-20 + i * 21} />
          ))}
          {Array.from({ length: 34 }, (_, i) => (
            <line key={`v${i}`} x1={-60 + i * 23} y1="-60" x2={-60 + i * 23} y2="640" />
          ))}
        </g>

        {/* Mont Royal contours */}
        <g stroke="rgba(231,169,58,0.34)" fill="rgba(231,169,58,0.05)" strokeWidth="1">
          <ellipse cx="248" cy="214" rx="58" ry="38" transform="rotate(-18 248 214)" />
          <ellipse cx="248" cy="214" rx="39" ry="24" transform="rotate(-18 248 214)" />
          <ellipse cx="248" cy="214" rx="20" ry="12" transform="rotate(-18 248 214)" />
        </g>

        {/* Arterials */}
        <g fill="none" strokeLinecap="round">
          <path d="M92 274c48-32 100-56 158-68 60-13 122-11 174 8"
                stroke="rgba(231,169,58,0.62)" strokeWidth="2.4" />
          <path d="M186 136c10 60 26 114 50 164 22 46 52 86 88 118"
                stroke="rgba(255,250,240,0.34)" strokeWidth="1.8" />
          <path d="M340 112c-5 66-20 126-46 178-22 44-50 80-84 108"
                stroke="rgba(255,250,240,0.26)" strokeWidth="1.5" />
          <path d="M120 330c60 14 122 18 184 12 52-5 100-17 142-36"
                stroke="rgba(255,250,240,0.2)" strokeWidth="1.3" />
        </g>
      </g>

      {/* Shoreline */}
      <path
        d="M78 246c28-48 84-84 152-103 66-19 137-17 190 7 47 21 79 56 83 99 5 45-25 88-77 116-56 30-128 43-195 36-60-6-111-30-141-66-24-29-30-60-12-89Z"
        fill="none"
        stroke="rgba(231,169,58,0.4)"
        strokeWidth="1.3"
      />

      {/* Île Sainte-Hélène */}
      <path
        d="M418 316c17-10 36-6 42 7 6 14-5 29-24 33-18 4-33-3-35-15-2-11 4-19 17-25Z"
        fill="#221F18"
        stroke="rgba(231,169,58,0.26)"
        strokeWidth="1"
      />

      {/* Dissolve the edges into the card */}
      <rect width="600" height="520" fill="url(#k2fFade)" />
    </svg>
  );
}
