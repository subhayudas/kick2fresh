/**
 * Hand-drawn 20px icon set. Slightly dimensional: each glyph pairs a 1.4px
 * stroke with a low-opacity "shadow" path offset by half a pixel, so icons
 * read as embossed rather than flat SVG.
 */

type P = { className?: string; size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false as const,
});

export const ArrowRight = ({ className, size = 16 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const ArrowUpRight = ({ className, size = 16 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const Plus = ({ className, size = 16 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Check = ({ className, size = 16 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m4.5 12.5 5 5L19.5 7" />
  </svg>
);

export const Star = ({ className, size = 14 }: P) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    focusable={false}
    className={className}
  >
    <path d="M12 2.6l2.72 5.86 6.28.78-4.64 4.4 1.22 6.36L12 16.8l-5.58 3.2 1.22-6.36L3 9.24l6.28-.78L12 2.6Z" />
  </svg>
);

/* Service glyphs, brush, droplet, tool, sole */
export const IconBrush = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M8.5 14.5 4 19c-.7.9.3 2 1.3 1.4L10 18" />
    <path d="M14.4 3.6a2 2 0 0 1 2.8 0l3.2 3.2a2 2 0 0 1 0 2.8l-7.2 7.2-6-6 7.2-7.2Z" />
    <path d="m10.2 7.8 6 6" />
  </svg>
);

export const IconDroplet = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 2.8s6.2 6 6.2 10.2A6.2 6.2 0 0 1 5.8 13C5.8 8.8 12 2.8 12 2.8Z" />
    <path d="M9 14.2a3 3 0 0 0 2.6 2.7" />
  </svg>
);

export const IconTool = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M15.5 3.5a5 5 0 0 0-5.7 6.4l-6 6a2 2 0 0 0 2.9 2.8l6-6a5 5 0 0 0 6.4-5.7l-3 3-2.7-2.7 3-3Z" />
  </svg>
);

export const IconSole = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M3 15.5c0-1.6 1.4-2.2 3.2-2.6 2.3-.5 3-1.8 3.6-3.8.5-1.9 1.7-3.6 4.2-3.6 3 0 5 2.2 5 5.2 0 4-3 7.3-7.4 7.3H5.8A2.8 2.8 0 0 1 3 15.5Z" />
    <path d="M7 16.4h7" />
  </svg>
);

export const IconShoe = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M2.5 16.8V11c0-.6.5-1 1.1-1 2 0 2.7.4 4 1.6l.9.8c1.2 1.1 2.2 1.3 4.2 1.5l6.4.7c1.5.2 2.4.9 2.4 2.2v1.4c0 .5-.4.9-.9.9H3.4a.9.9 0 0 1-.9-.9v-.4Z" />
    <path d="M8.6 12.4 11 9.6" />
  </svg>
);

export const IconPin = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const IconClock = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 7.4V12l3 1.8" />
  </svg>
);

export const IconMail = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.4" />
    <path d="m3.8 7 7.3 5.2a1.6 1.6 0 0 0 1.8 0L20.2 7" />
  </svg>
);

export const IconGlobe = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M3.6 12h16.8M12 3.4c2.2 2.4 3.3 5.4 3.3 8.6s-1.1 6.2-3.3 8.6c-2.2-2.4-3.3-5.4-3.3-8.6S9.8 5.8 12 3.4Z" />
  </svg>
);

export const IconShield = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3 5 5.8v5.4c0 4.2 2.9 7.8 7 9.8 4.1-2 7-5.6 7-9.8V5.8L12 3Z" />
    <path d="m9 12 2.2 2.2L15.4 10" />
  </svg>
);

export const IconLeaf = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4.6 19.4C3 14.6 6 6.4 19.4 4.6c1 9.6-4.6 15.4-10.8 14.8" />
    <path d="M8.6 15.4 19.4 4.6" />
  </svg>
);

export const IconSparkle = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3.4 13.8 9l5.6 1.8-5.6 1.8L12 18.2 10.2 12.6 4.6 10.8 10.2 9 12 3.4Z" />
  </svg>
);

export const Chevron = ({ className, size = 16 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m6 9.5 6 6 6-6" />
  </svg>
);

export const Handle = ({ className, size = 18 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M9 6 5 12l4 6M15 6l4 6-4 6" />
  </svg>
);
