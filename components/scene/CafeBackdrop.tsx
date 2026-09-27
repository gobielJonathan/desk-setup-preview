import type { Vibe } from "../../lib/catalog";

const cafeColors: Record<
  Vibe,
  {
    wall: string;
    tile: string;
    floor: string;
    floorDeep: string;
    window: string;
    city: string;
    light: string;
    wood: string;
    ink: string;
  }
> = {
  morning: {
    wall: "#E8DFD1",
    tile: "#F3ECE0",
    floor: "#C79A70",
    floorDeep: "#A97859",
    window: "#A9CFD0",
    city: "#75969A",
    light: "#FFF0B5",
    wood: "#A76F4A",
    ink: "#31474A",
  },
  sunset: {
    wall: "#DCC4BD",
    tile: "#EFDCD0",
    floor: "#B88168",
    floorDeep: "#88584F",
    window: "#BA8285",
    city: "#72566A",
    light: "#FFD38D",
    wood: "#8C5745",
    ink: "#3F3D46",
  },
  night: {
    wall: "#344354",
    tile: "#465568",
    floor: "#53606A",
    floorDeep: "#384650",
    window: "#455F78",
    city: "#263B4E",
    light: "#F3D38F",
    wood: "#775F55",
    ink: "#E8E0CE",
  },
};

export function CafeBackdrop({ vibe }: { vibe: Vibe }) {
  const colors = cafeColors[vibe];

  return (
    <g className={`cafe-backdrop cafe-backdrop--${vibe}`}>
      <defs>
        <pattern id={`cafe-tiles-${vibe}`} width="54" height="42" patternUnits="userSpaceOnUse">
          <rect width="54" height="42" fill={colors.tile} />
          <path d="M0 41h54M53 0v42" stroke={colors.wall} strokeOpacity=".45" strokeWidth="2" />
        </pattern>
        <linearGradient id={`cafe-floor-${vibe}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors.floor} />
          <stop offset="1" stopColor={colors.floorDeep} />
        </linearGradient>
        <radialGradient id={`cafe-lamp-${vibe}`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor={colors.light} stopOpacity=".66" />
          <stop offset="1" stopColor={colors.light} stopOpacity="0" />
        </radialGradient>
        <filter id={`cafe-soft-glow-${vibe}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      <rect width="800" height="354" fill={`url(#cafe-tiles-${vibe})`} />
      <rect y="354" width="800" height="166" fill={`url(#cafe-floor-${vibe})`} />
      <path d="M0 355h800" stroke={colors.ink} strokeOpacity=".16" strokeWidth="5" />

      <g className="cafe-window">
        <rect x="54" y="48" width="270" height="228" rx="12" fill="#fff" opacity=".18" />
        <rect x="65" y="59" width="248" height="207" rx="6" fill={colors.window} />
        <path d="M189 59v207M65 161h248" stroke="#fff" strokeOpacity=".55" strokeWidth="8" />
        <path d="M73 202h232v64H73z" fill={colors.city} opacity=".44" />
        <path d="M74 220h34v-29h19v18h26v-42h22v52h25v-25h30v35h21v-48h17v39h38v-27h18v53H74z" fill={colors.city} opacity=".76" />
        <path d="M77 247c45-27 83-13 119 6 35-31 71-26 111 2v11H77z" fill={colors.city} opacity=".52" />
        {vibe === "morning" && (
          <circle cx="257" cy="100" r="22" fill={colors.light} opacity=".8" />
        )}
        {vibe === "sunset" && (
          <circle cx="259" cy="126" r="26" fill={colors.light} opacity=".86" />
        )}
        {vibe === "night" && (
          <>
            <circle cx="264" cy="97" r="17" fill={colors.light} opacity=".8" />
            <circle cx="109" cy="102" r="3" fill={colors.light} />
            <circle cx="146" cy="128" r="2.5" fill={colors.light} />
            <circle cx="225" cy="88" r="2" fill={colors.light} />
          </>
        )}
        <path d="M45 45h280" stroke={colors.wood} strokeWidth="8" strokeLinecap="round" />
        <path d="M62 276h257" stroke={colors.wood} strokeWidth="8" strokeLinecap="round" />
      </g>

      <g className="cafe-pendants">
        <path d="M420 0v68M656 0v93" stroke={colors.ink} strokeOpacity=".5" strokeWidth="3" />
        <ellipse cx="420" cy="78" rx="42" ry="17" fill={`url(#cafe-lamp-${vibe})`} filter={`url(#cafe-soft-glow-${vibe})`} />
        <path d="M389 69h62l-11 25h-40z" fill={colors.wood} />
        <path d="M394 72h52l-6 15h-40z" fill={colors.light} />
        <ellipse cx="656" cy="103" rx="53" ry="21" fill={`url(#cafe-lamp-${vibe})`} filter={`url(#cafe-soft-glow-${vibe})`} />
        <path d="M617 93h78l-13 29h-52z" fill={colors.wood} />
        <path d="M622 96h68l-7 19h-54z" fill={colors.light} />
      </g>

      <g className="cafe-menu">
        <rect x="500" y="64" width="113" height="111" rx="5" fill={colors.ink} opacity=".95" />
        <path d="M518 85h76M518 103h57M518 121h67M518 139h43" stroke={colors.light} strokeOpacity=".68" strokeWidth="4" strokeLinecap="round" />
        <text x="518" y="158" fill={colors.light} fillOpacity=".82" fontSize="10" fontWeight="700" letterSpacing="2">TODAY</text>
        <circle cx="590" cy="82" r="5" fill={colors.light} />
      </g>

      <g className="cafe-shelf">
        <path d="M620 206h131v10H620z" fill={colors.wood} />
        <path d="M632 216h8v31h-8zM731 216h8v31h-8z" fill={colors.wood} />
        <path d="M644 201v-18h18v18M674 201v-27h21v27M707 201v-21h18v21" fill={colors.light} fillOpacity=".75" stroke={colors.wood} strokeWidth="3" />
        <path d="M647 187h12M678 179h13M711 188h11" stroke={colors.ink} strokeOpacity=".38" strokeWidth="3" />
      </g>

      <g className="cafe-counter" opacity=".75">
        <path d="M620 254h180v105H620z" fill={colors.wood} />
        <path d="M601 244h199v20H601z" fill={colors.ink} opacity=".75" />
        <path d="M624 281h151v4H624zM624 295h108v4H624zM624 309h137v4H624z" fill={colors.light} opacity=".45" />
        <circle cx="653" cy="337" r="9" fill={colors.ink} opacity=".6" />
        <circle cx="685" cy="337" r="9" fill={colors.ink} opacity=".6" />
      </g>

      <g className="cafe-neighbor" opacity=".48">
        <ellipse cx="117" cy="418" rx="87" ry="20" fill={colors.ink} opacity=".2" />
        <path d="M49 383h136l-13 26H63z" fill={colors.wood} />
        <path d="M78 408l-15 77M158 408l17 77" stroke={colors.ink} strokeWidth="7" strokeLinecap="round" />
        <path d="M119 379c-5-39 10-62 33-80" stroke={colors.ink} strokeWidth="4" />
        <path d="M152 302c-23-16-36-14-44-2 18 17 29 17 44 2zM157 291c7-26 20-35 37-37 0 24-13 38-37 37z" fill="#71936F" />
        <circle cx="99" cy="367" r="15" fill={colors.light} />
      </g>

      <g className="cafe-floor-lines" opacity=".22">
        <path d="M0 406h800M0 460h800M230 354l-42 166M450 354l-8 166M675 354l33 166" stroke="#fff" strokeWidth="2" />
      </g>
    </g>
  );
}
