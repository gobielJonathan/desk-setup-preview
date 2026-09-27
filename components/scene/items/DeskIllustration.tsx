import type { Desk } from "../../../lib/catalog";

export function DeskIllustration({
  desk,
  x = 0,
  y = 0,
  scale = 1,
}: {
  desk: Desk;
  x?: number;
  y?: number;
  scale?: number;
}) {
  const { top, edge, leg } = desk.colors;

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className="scene-desk">
      <ellipse cx="400" cy="395" rx="282" ry="24" fill="#2A3438" opacity=".12" />
      <rect x="128" y="278" width="544" height="26" rx="9" fill={edge} />
      <rect x="135" y="268" width="530" height="22" rx="8" fill={top} />
      <path d="M162 291h16l-21 113h-14zM621 291h16l21 113h-14z" fill={leg} />
      <path
        d="M205 302h20v8h-20zM575 302h20v8h-20z"
        fill={leg}
        opacity=".75"
      />
      {desk.id === "sunrise-standing" ? (
        <>
          <path d="M242 291h122v76H242z" fill={edge} opacity=".24" />
          <rect x="253" y="302" width="99" height="5" rx="2.5" fill={edge} opacity=".7" />
          <circle cx="330" cy="340" r="3" fill={edge} />
        </>
      ) : desk.id === "cloud-white" ? (
        <>
          <path d="M282 291h114v7H282zM404 291h114v7H404z" fill={leg} opacity=".23" />
          <path d="M333 342h134v9H333z" fill={leg} opacity=".18" />
        </>
      ) : (
        <>
          <path d="M274 291h142v79H274z" fill={edge} opacity=".28" />
          <rect x="287" y="304" width="116" height="4" rx="2" fill={edge} opacity=".8" />
          <circle cx="391" cy="340" r="3" fill={edge} />
        </>
      )}
      <path d="M125 279h550" stroke="#fff" strokeOpacity=".3" strokeWidth="3" />
    </g>
  );
}

