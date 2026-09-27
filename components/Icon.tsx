export type IconName =
  | "arrow-right"
  | "arrow-left"
  | "check"
  | "chevron-down"
  | "minus"
  | "plus"
  | "sparkle"
  | "refresh"
  | "reset"
  | "box"
  | "clock"
  | "pin"
  | "truck"
  | "close";

export function Icon({
  name,
  size = 18,
  strokeWidth = 1.8,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "check") {
    return <svg {...common}><path d="m5 12 4 4L19 6" /></svg>;
  }
  if (name === "plus") {
    return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
  }
  if (name === "minus") {
    return <svg {...common}><path d="M5 12h14" /></svg>;
  }
  if (name === "arrow-right") {
    return <svg {...common}><path d="M4 12h15M13 6l6 6-6 6" /></svg>;
  }
  if (name === "arrow-left") {
    return <svg {...common}><path d="M20 12H5m6-6-6 6 6 6" /></svg>;
  }
  if (name === "chevron-down") {
    return <svg {...common}><path d="m6 9 6 6 6-6" /></svg>;
  }
  if (name === "sparkle") {
    return <svg {...common}><path d="m12 3-1.3 5.7L5 10l5.7 1.3L12 17l1.3-5.7L19 10l-5.7-1.3L12 3ZM19 16l-.6 2.4L16 19l2.4.6L19 22l.6-2.4L22 19l-2.4-.6L19 16Z" /></svg>;
  }
  if (name === "refresh") {
    return <svg {...common}><path d="M20 11a8 8 0 0 0-14.7-4L4 9m0 0V4m0 5h5M4 13a8 8 0 0 0 14.7 4L20 15m0 0v5m0-5h-5" /></svg>;
  }
  if (name === "reset") {
    return <svg {...common}><path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.5M4 4v4.5h4.5" /></svg>;
  }
  if (name === "box") {
    return <svg {...common}><path d="m4 7 8-4 8 4v10l-8 4-8-4V7Z" /><path d="m4 7 8 4 8-4M12 11v10" /></svg>;
  }
  if (name === "clock") {
    return <svg {...common}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></svg>;
  }
  if (name === "pin") {
    return <svg {...common}><path d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
  }
  if (name === "truck") {
    return <svg {...common}><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>;
  }
  if (name === "close") {
    return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>;
  }
  return <svg {...common} />;
}

