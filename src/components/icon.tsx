import { useId, type ReactNode } from "react";

export type IconName =
  | "layers" | "chevrons-left" | "clock" | "search" | "download" | "upload" | "menu" | "close" | "check"
  | "arrow" | "book" | "chevron" | "trash" | "edit" | "save" | "brain" | "code"
  | "info" | "check-circle" | "sun" | "moon" | "play" | "pause" | "eye";

const glyphs: Record<IconName, ReactNode> = {
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>,
  "chevrons-left": <><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5"/><path d="M5 17v4h14v-4"/></>,
  upload: <><path d="M12 16V4m-5 5 5-5 5 5"/><path d="M5 17v4h14v-4"/></>,
  menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  check: <path d="m5 12 4.2 4.2L19 6.8"/>,
  arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5v-12Z"/><path d="M8 8h8M8 12h8"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  trash: <><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/></>,
  edit: <><path d="m4 16.5-.8 4.3 4.3-.8L19 8.5 15.5 5 4 16.5Z"/><path d="m13.8 6.7 3.5 3.5"/></>,
  save: <><path d="M5 3h12l3 3v15H4V3h1Z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/></>,
  brain: <><path d="M12 5.5a3.5 3.5 0 0 0-6.8 1.1A3.5 3.5 0 0 0 4.5 13a3.5 3.5 0 0 0 3.2 5.5A3.5 3.5 0 0 0 12 20V5.5Z"/><path d="M12 5.5a3.5 3.5 0 0 1 6.8 1.1A3.5 3.5 0 0 1 19.5 13a3.5 3.5 0 0 1-3.2 5.5A3.5 3.5 0 0 1 12 20M8 9h.01M16 9h.01M8 15h.01M16 15h.01M12 10v2"/></>,
  code: <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/></>,
  "check-circle": <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 9"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41"/></>,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>,
  play: <polygon points="6,4 20,12 6,20"/>,
  pause: <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
  eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
};

export function Icon({
  name,
  size = 18,
  strokeWidth = 1.8,
  className,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {glyphs[name]}
    </svg>
  );
}

/** Bespoke Fieldnote emblem: folded paper silhouette with cobalt corner flap and single carved topographic contour. */
export function FieldnoteMark({
  size = 22,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const rawId = useId();
  const maskId = `fn-mark-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
    >
      <defs>
        <mask id={maskId}>
          <rect width="32" height="32" fill="black" />
          <path
            d="M8.5 3.5H17.2V9.8A2.2 2.2 0 0 0 19.4 12H25.5V26A2.5 2.5 0 0 1 23 28.5H8.5A2.5 2.5 0 0 1 6 26V6A2.5 2.5 0 0 1 8.5 3.5Z"
            fill="white"
          />
          <path
            d="M9.4 20.6C12.2 16.9 15.6 16.8 18 19.3C19.8 21.1 21.3 21.1 22.8 19.6"
            stroke="black"
            strokeWidth="2.7"
            strokeLinecap="round"
            fill="none"
          />
        </mask>
      </defs>
      <rect
        x="5"
        y="3"
        width="22"
        height="26"
        fill="currentColor"
        mask={`url(#${maskId})`}
      />
      <path
        d="M19.2 3.8L25.4 10H20.3A1.1 1.1 0 0 1 19.2 8.9V3.8Z"
        fill="var(--accent)"
      />
    </svg>
  );
}
