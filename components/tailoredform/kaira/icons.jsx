// Lucide-style inline icons (24px viewBox, 2px round stroke) — the Kaira
// design system uses inline SVG only, no icon font.
const base = (size, extra = {}) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  ...extra,
});

export const IconX = ({ size = 14, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
export const IconSearch = ({ size = 17, ...p }) => (
  <svg {...base(size, p)}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);
export const IconTarget = ({ size = 17, ...p }) => (
  <svg {...base(size, p)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </svg>
);
export const IconCalendar = ({ size = 17, ...p }) => (
  <svg {...base(size, p)}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
export const IconPin = ({ size = 15, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
export const IconPlane = ({ size = 12, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </svg>
);
export const IconChevronLeft = ({ size = 13, ...p }) => (
  <svg {...base(size, p)}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);
export const IconChevronRight = ({ size = 13, ...p }) => (
  <svg {...base(size, p)}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);
export const IconArrowLeft = ({ size = 17, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
export const IconArrowRight = ({ size = 15, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
export const IconTrash = ({ size = 14, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </svg>
);
export const IconGrip = ({ size = 14, ...p }) => (
  <svg {...base(size, p)}>
    <circle cx="9" cy="6" r="1" />
    <circle cx="9" cy="12" r="1" />
    <circle cx="9" cy="18" r="1" />
    <circle cx="15" cy="6" r="1" />
    <circle cx="15" cy="12" r="1" />
    <circle cx="15" cy="18" r="1" />
  </svg>
);
export const IconPlus = ({ size = 13, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconCheck = ({ size = 14, ...p }) => (
  <svg {...base(size, { strokeWidth: 2.5, ...p })}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
export const IconRefresh = ({ size = 12, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" />
  </svg>
);
export const IconMoon = ({ size = 15, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
  </svg>
);
export const IconUser = ({ size = 20, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
export const IconHeart = ({ size = 20, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M19 14c1.5-1.4 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.1 3 5.5l7 7 7-7z" />
  </svg>
);
export const IconUsers = ({ size = 20, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
export const IconHome = ({ size = 20, ...p }) => (
  <svg {...base(size, p)}>
    <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z" />
    <path d="M9 22V12h6v10" />
  </svg>
);
export const IconBed = ({ size = 18, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4M2 17h20" />
  </svg>
);
export const IconTicket = ({ size = 18, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M2 3h20M6 3v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3M10 19l-2 3M14 19l2 3" />
  </svg>
);
export const IconShield = ({ size = 13, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M20 13c0 5-3.5 7.5-7.7 9a.6.6 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
export const IconHeadset = ({ size = 13, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M3 11a9 9 0 0 1 18 0v5a3 3 0 0 1-3 3h-1v-7h4M3 11v7h4v-7H3z" />
  </svg>
);
export const IconReceipt = ({ size = 13, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1zM8 7h8M8 11h8M8 15h5" />
  </svg>
);
export const IconLock = ({ size = 13, ...p }) => (
  <svg {...base(size, p)}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
