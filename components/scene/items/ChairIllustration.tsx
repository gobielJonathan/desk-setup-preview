import type { Chair } from "../../../lib/catalog";

export function ChairIllustration({
  chair,
  x = 0,
  y = 0,
  scale = 1,
}: {
  chair: Chair;
  x?: number;
  y?: number;
  scale?: number;
}) {
  const { seat, back, leg } = chair.colors;

  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      className="scene-chair scene-fade"
    >
      {chair.id === "citrus-stool" ? (
        <>
          <ellipse cx="400" cy="421" rx="84" ry="13" fill="#2A3438" opacity=".12" />
          <path d="M347 344h106l-11 31H358z" fill={seat} />
          <ellipse cx="400" cy="343" rx="54" ry="14" fill={seat} />
          <path d="M375 369h50l19 49h-12l-31-37-31 37h-12z" fill={leg} />
          <path d="M400 375v40" stroke={leg} strokeWidth="8" strokeLinecap="round" />
          <path d="M363 416h74M369 410l-14 16M431 410l14 16" stroke={leg} strokeWidth="7" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="400" cy="433" rx="112" ry="16" fill="#2A3438" opacity=".12" />
          <path
            d={chair.id === "cloud-mesh" ? "M328 245c0-25 18-43 43-43h58c25 0 43 18 43 43v113H328z" : "M328 246c0-29 21-49 49-49h46c28 0 49 20 49 49v119H328z"}
            fill={back}
          />
          <path
            d="M330 343h140c28 0 47 20 48 45l-2 14H324l-2-14c1-25 20-45 48-45z"
            fill={seat}
          />
          <path d="M349 364h102" stroke="#fff" strokeOpacity=".35" strokeWidth="4" strokeLinecap="round" />
          {chair.id === "cloud-mesh" && (
            <path d="M353 219h94M350 241h100M349 264h102M349 287h102" stroke="#fff" strokeOpacity=".32" strokeWidth="2" />
          )}
          <path d="M378 400h44v23h-44z" fill={leg} />
          <path d="M400 418v17M400 432l-66 12M400 432l66 12M400 432l-25 21M400 432l25 21" stroke={leg} strokeWidth="7" strokeLinecap="round" />
          <circle cx="334" cy="444" r="5" fill={leg} />
          <circle cx="466" cy="444" r="5" fill={leg} />
          <circle cx="375" cy="453" r="5" fill={leg} />
          <circle cx="425" cy="453" r="5" fill={leg} />
        </>
      )}
    </g>
  );
}

