import type { Accessory } from "../../../lib/catalog";

export function AccessoryIllustration({
  accessory,
  x = 0,
  y = 0,
  scale = 1,
}: {
  accessory: Accessory;
  x?: number;
  y?: number;
  scale?: number;
}) {
  const { primary, secondary } = accessory.colors;

  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      className="scene-accessory"
      aria-label={accessory.name}
    >
      {accessory.icon === "monitor" && (
        <>
          <rect x="-68" y="-61" width="136" height="84" rx="8" fill="#26373D" />
          <rect x="-59" y="-52" width="118" height="66" rx="4" fill={secondary} />
          <path d="M-45 1h56l-11 9h-35z" fill="#fff" opacity=".25" />
          <path d="M-7 23h14v21H-7z" fill={primary} />
          <path d="M-30 45h60v7h-60z" fill={primary} />
          <circle cx="51" cy="-52" r="3" fill={secondary} />
        </>
      )}
      {accessory.icon === "wide-monitor" && (
        <>
          <rect x="-112" y="-52" width="224" height="75" rx="9" fill="#26373D" />
          <rect x="-102" y="-43" width="204" height="57" rx="4" fill={secondary} />
          <path d="M-82 1h92l-16 7h-62z" fill="#fff" opacity=".24" />
          <path d="M-8 23h16v20H-8z" fill={primary} />
          <path d="M-34 44h68v7h-68z" fill={primary} />
        </>
      )}
      {accessory.icon === "lamp" && (
        <>
          <path d="M-2 0l24-76" stroke={primary} strokeWidth="8" strokeLinecap="round" />
          <path d="M22-75h38l-8 17H15z" fill={primary} />
          <path d="M17-59h31l-5 8H20z" fill={secondary} opacity=".9" />
          <path d="M-22 0h42" stroke={primary} strokeWidth="6" strokeLinecap="round" />
          <circle cx="32" cy="-52" r="3" fill="#fff" />
        </>
      )}
      {accessory.icon === "sprout" && (
        <>
          <path d="M-18 0h36l-5-27h-26z" fill={primary} />
          <path d="M-4-27c-1-17-13-27-28-27 1 17 11 27 28 27z" fill={secondary} />
          <path d="M4-27c1-21 14-32 31-32-1 20-13 31-31 32z" fill={primary} />
          <path d="M0-27V-7" stroke="#52765D" strokeWidth="4" />
        </>
      )}
      {accessory.icon === "keyboard" && (
        <>
          <path d="M-62-16h124l-8 30H-54z" fill={primary} />
          <path d="M-51-9h102v12H-51z" fill={secondary} opacity=".8" />
          {[-39, -23, -7, 9, 25, 41].map((keyX) => (
            <rect key={keyX} x={keyX} y="17" width="7" height="4" rx="1" fill={secondary} />
          ))}
          <circle cx="82" cy="0" r="15" fill={primary} />
          <path d="M82-10v20M72 0h20" stroke={secondary} strokeWidth="2" opacity=".6" />
        </>
      )}
      {accessory.icon === "stand" && (
        <>
          <path d="M-44-7h88l-12 11h-64z" fill={primary} />
          <path d="M-27 4h54L16 32H-16z" fill={secondary} />
          <path d="M-33 32h66" stroke={primary} strokeWidth="6" strokeLinecap="round" />
        </>
      )}
      {accessory.icon === "headphones" && (
        <>
          <path d="M-42 10V-9c0-39 84-39 84 0v19" fill="none" stroke={primary} strokeWidth="10" strokeLinecap="round" />
          <rect x="-54" y="2" width="20" height="35" rx="8" fill={secondary} />
          <rect x="34" y="2" width="20" height="35" rx="8" fill={secondary} />
        </>
      )}
      {accessory.icon === "monstera" && (
        <>
          <path d="M-19-24c-9-61 22-110 82-133-2 63-29 110-82 133z" fill={primary} />
          <path d="M-13-28c-53-29-72-75-62-129 55 17 78 60 62 129z" fill={secondary} />
          <path d="M-2-27C1-91 24-126 65-150" stroke="#D1E2A9" strokeWidth="3" opacity=".8" />
          <path d="M-3-26C-35-73-51-102-64-144" stroke="#477A5D" strokeWidth="3" opacity=".7" />
          <path d="M-26-1h68l-8 36H-18z" fill={primary} />
          <path d="M-20 8h56" stroke={secondary} strokeWidth="4" opacity=".7" />
        </>
      )}
      {accessory.icon === "rug" && (
        <>
          <ellipse cx="0" cy="2" rx="142" ry="34" fill={primary} opacity=".28" />
          <ellipse cx="0" cy="0" rx="136" ry="29" fill={secondary} />
          <path d="M-114 0c45-16 80 16 124 0s74 15 104 0" fill="none" stroke={primary} strokeWidth="4" strokeDasharray="8 9" opacity=".6" />
          <path d="M-132 0l-9 8m273-8 9 8" stroke={primary} strokeWidth="3" />
        </>
      )}
      {accessory.icon === "shelf" && (
        <>
          <path d="M-100 0h200v12H-100z" fill={primary} />
          <path d="M-84 12h10v19h-10zM74 12h10v19H74z" fill={primary} />
          <rect x="-69" y="-37" width="27" height="37" rx="2" fill={secondary} />
          <path d="M-30 0l14-31 14 31z" fill="#D48462" />
          <circle cx="46" cy="-15" r="18" fill="#C5A05C" />
          <path d="M37-15h18M46-24v18" stroke="#fff" strokeWidth="2" opacity=".55" />
        </>
      )}
    </g>
  );
}

