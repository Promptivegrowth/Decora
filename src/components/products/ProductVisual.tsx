import Image from "next/image";
import { productColors, type Product, type ProductColor } from "@/data/products";

/**
 * Representación visual de cada producto. Si el producto tiene foto (product.image)
 * se usa la foto; si no, una ilustración técnica en colores de marca.
 * Las telas se dibujan como un roller con el color y la textura real de la tela.
 */
export function ProductVisual({
  product,
  color,
  small = false,
  className = "",
}: {
  product: Product;
  color?: string;
  small?: boolean;
  className?: string;
}) {
  if (product.image) {
    return (
      <div className={`relative h-full w-full bg-cream ${className}`}>
        <Image src={product.image} alt={product.name.es} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
      </div>
    );
  }
  const c = (color && color in productColors ? color : product.colors[0]) as ProductColor | undefined;
  const isFabric = product.category === "telas";
  return (
    <div
      className={`relative grid h-full w-full place-items-center overflow-hidden ${
        isFabric ? "bg-teal" : "bg-[color-mix(in_oklab,var(--color-teal)_9%,var(--color-cream))]"
      } ${className}`}
    >
      {!small && (
        <div
          className={`slats pointer-events-none absolute inset-0 ${isFabric ? "text-cream/25" : "text-teal/25"}`}
          aria-hidden
        />
      )}
      {isFabric ? (
        <FabricRoller product={product} hex={c ? productColors[c].hex : "#f4f2ec"} small={small} />
      ) : (
        <ComponentArt visual={product.visual} hex={c ? productColors[c].hex : undefined} />
      )}
    </div>
  );
}

function FabricRoller({ product, hex, small }: { product: Product; hex: string; small: boolean }) {
  const id = `${product.id}-${hex.replace("#", "")}${small ? "-s" : ""}`;
  const openness = product.openness ?? 0;
  const v = product.visual;
  // densidad de perforación visible según apertura
  const holeOpacity = v === "screen" || v === "linen" ? Math.min(0.55, 0.08 + openness * 0.03) : 0;
  return (
    <svg viewBox="0 0 200 220" className="relative h-[86%] w-[86%] drop-shadow-[0_18px_24px_rgb(18_29_44/0.35)]" aria-hidden>
      <defs>
        <pattern id={`w-${id}`} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill={hex} />
          <rect x="0" y="0" width="2" height="2" fill="#121D2C" opacity={holeOpacity} />
          <rect x="2" y="2" width="1" height="1" fill="#FBF6E6" opacity={holeOpacity * 0.6} />
        </pattern>
        <pattern id={`l-${id}`} width="6" height="5" patternUnits="userSpaceOnUse">
          <rect width="6" height="5" fill={hex} />
          <path d="M0 1.2h6M0 3.6h6" stroke="#121D2C" strokeOpacity="0.12" strokeWidth="0.8" />
          <path d="M2 0v5" stroke="#FBF6E6" strokeOpacity="0.18" strokeWidth="0.6" />
        </pattern>
        <linearGradient id={`sh-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#121D2C" stopOpacity="0.18" />
          <stop offset="0.25" stopColor="#FBF6E6" stopOpacity="0.12" />
          <stop offset="0.6" stopColor="#121D2C" stopOpacity="0" />
          <stop offset="1" stopColor="#121D2C" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id={`tube-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBF6E6" />
          <stop offset="0.5" stopColor="#DAB36F" />
          <stop offset="1" stopColor="#8f7444" />
        </linearGradient>
      </defs>
      {/* Tubo / cabezal */}
      <rect x="18" y="14" width="164" height="18" rx="9" fill={`url(#tube-${id})`} />
      <rect x="12" y="11" width="10" height="24" rx="3" fill="#121D2C" />
      <rect x="178" y="11" width="10" height="24" rx="3" fill="#121D2C" />
      {/* Tela */}
      <g>
        <rect
          x="26"
          y="30"
          width="148"
          height="160"
          fill={v === "linen" ? `url(#l-${id})` : v === "blackout" || v === "fabric" ? hex : `url(#w-${id})`}
        />
        {v === "duo" &&
          Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x="26" y={38 + i * 19} width="148" height="9" fill="#121D2C" opacity="0.14" />
          ))}
        {v === "duo" &&
          Array.from({ length: 8 }, (_, i) => (
            <rect key={`b${i}`} x="26" y={47 + i * 19} width="148" height="10" fill="#FBF6E6" opacity="0.22" />
          ))}
        <rect x="26" y="30" width="148" height="160" fill={`url(#sh-${id})`} />
      </g>
      {/* Barra inferior */}
      <rect x="22" y="188" width="156" height="9" rx="3" fill="#121D2C" />
      <rect x="22" y="188" width="156" height="2" fill="#DAB36F" opacity="0.6" />
      {/* Cadena */}
      <g fill="#DAB36F">
        {Array.from({ length: 13 }, (_, i) => (
          <circle key={i} cx="190" cy={40 + i * 9} r="1.7" />
        ))}
      </g>
    </svg>
  );
}

function ComponentArt({ visual, hex }: { visual: Product["visual"]; hex?: string }) {
  const fill = hex && hex !== "transparent" ? hex : "#FBF6E6";
  const stroke = "#144C42";
  const props = {
    viewBox: "0 0 160 160",
    className: "relative h-[70%] w-[70%]",
    fill: "none",
    stroke,
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (visual) {
    case "tube":
      return (
        <svg {...props}>
          <ellipse cx="38" cy="80" rx="14" ry="30" fill="#DAB36F" />
          <path d="M38 50h90M38 110h90" />
          <path d="M128 50a14 30 0 0 1 0 60" fill="#FBF6E6" />
          <ellipse cx="38" cy="80" rx="7" ry="15" fill="#FBF6E6" />
          <path d="M60 50v60M100 50v60" strokeOpacity="0.25" />
        </svg>
      );
    case "headrail":
      return (
        <svg {...props}>
          <path d="M20 62h120v22a10 10 0 0 1-10 10H30a10 10 0 0 1-10-10z" fill={fill} />
          <path d="M20 62l14-14h106l-20 14" fill="#DAB36F" />
          <path d="M140 48v24l-20 14" />
          <path d="M40 78h80" strokeOpacity="0.3" />
        </svg>
      );
    case "bar":
      return (
        <svg {...props}>
          <path d="M18 74h124v14a6 6 0 0 1-6 6H24a6 6 0 0 1-6-6z" fill={fill} />
          <path d="M18 74l10-10h118l-4 10" fill="#DAB36F" />
          <path d="M146 64v18l-4 12" />
        </svg>
      );
    case "cap":
      return (
        <svg {...props}>
          <rect x="48" y="40" width="64" height="80" rx="12" fill={fill} />
          <rect x="60" y="54" width="40" height="18" rx="5" fill="#DAB36F" />
          <circle cx="80" cy="96" r="8" />
        </svg>
      );
    case "valance":
      return (
        <svg {...props}>
          <path d="M18 50h124v12c0 22-16 40-40 40H18z" fill={fill} />
          <path d="M18 50v52M142 50l-12 0" />
          <path d="M18 50l12-10h112v10" fill="#DAB36F" />
          <path d="M18 116h40v8H18z" fill="#DAB36F" />
        </svg>
      );
    case "profile":
      return (
        <svg {...props}>
          <path d="M60 18h40v124H60z" fill={fill} />
          <path d="M72 18v124M88 18v124" />
          <path d="M60 18l12-8h40l-12 8M112 10v124l-12 8" fill="#DAB36F" />
        </svg>
      );
    case "bracket":
      return (
        <svg {...props}>
          <path d="M44 28h56a8 8 0 0 1 8 8v88H44z" fill={fill} />
          <circle cx="76" cy="62" r="14" fill="#DAB36F" />
          <circle cx="76" cy="62" r="5" fill="#FBF6E6" />
          <circle cx="58" cy="108" r="4" />
          <circle cx="94" cy="108" r="4" />
        </svg>
      );
    case "kit":
      return (
        <svg {...props}>
          <circle cx="62" cy="76" r="30" fill={fill} />
          <circle cx="62" cy="76" r="14" fill="#DAB36F" />
          <path d="M62 46v-8M62 114v-8M32 76h-8M100 76h-8" />
          <path d="M98 50h34v52H98" fill="#FBF6E6" />
          <path d="M132 102v34" strokeDasharray="1 7" strokeWidth="5" stroke="#DAB36F" />
        </svg>
      );
    case "motor":
      return (
        <svg {...props}>
          <rect x="22" y="58" width="96" height="44" rx="22" fill="#FBF6E6" />
          <rect x="22" y="58" width="34" height="44" rx="17" fill="#DAB36F" />
          <path d="M118 80h18" />
          <path d="M82 70l-8 12h10l-8 12" stroke="#1C3F26" />
        </svg>
      );
    case "battery":
      return (
        <svg {...props}>
          <rect x="22" y="58" width="96" height="44" rx="22" fill="#FBF6E6" />
          <rect x="34" y="68" width="40" height="24" rx="5" fill="#DAB36F" />
          <path d="M118 80h18M120 52c10-10 24-10 34 0M126 60c6-6 16-6 22 0" />
        </svg>
      );
    case "crown":
      return (
        <svg {...props}>
          <circle cx="80" cy="80" r="44" fill="#FBF6E6" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <rect
                key={i}
                x={80 + Math.cos(a) * 40 - 6}
                y={80 + Math.sin(a) * 40 - 6}
                width="12"
                height="12"
                rx="3"
                fill="#DAB36F"
              />
            );
          })}
          <circle cx="80" cy="80" r="16" fill="#DAB36F" />
        </svg>
      );
    case "rail":
      return (
        <svg {...props}>
          <rect x="14" y="42" width="132" height="16" rx="4" fill="#FBF6E6" />
          {[30, 52, 74, 96, 118].map((x) => (
            <g key={x}>
              <circle cx={x} cy="66" r="5" fill="#DAB36F" />
              <path d={`M${x} 71c-8 20 8 40 0 60`} strokeOpacity="0.5" />
            </g>
          ))}
          <path d="M140 58v76" stroke="#DAB36F" strokeWidth="4" />
        </svg>
      );
    case "chain":
      return (
        <svg {...props}>
          <path d="M60 18c-22 40-22 84 0 124M100 18c22 40 22 84 0 124" strokeOpacity="0.15" />
          {Array.from({ length: 11 }, (_, i) => (
            <circle key={i} cx={60 - Math.sin((i / 10) * Math.PI) * 16} cy={18 + i * 12.4} r="5" fill={fill} />
          ))}
          {Array.from({ length: 11 }, (_, i) => (
            <circle key={`r${i}`} cx={100 + Math.sin((i / 10) * Math.PI) * 16} cy={18 + i * 12.4} r="5" fill={fill} />
          ))}
        </svg>
      );
    case "tape":
      return (
        <svg {...props}>
          <circle cx="80" cy="80" r="46" fill={fill} />
          <circle cx="80" cy="80" r="22" fill="#FBF6E6" />
          <path d="M120 100l26 22" stroke={fill === "#FBF6E6" ? stroke : fill} strokeWidth="14" />
        </svg>
      );
    case "stopper":
    case "connector":
      return (
        <svg {...props}>
          <path d="M80 14v132" strokeDasharray="1 10" strokeWidth="7" stroke="#DAB36F" />
          <rect x="62" y={visual === "stopper" ? 62 : 52} width="36" height={visual === "stopper" ? 36 : 56} rx="14" fill={fill} fillOpacity={hex === "transparent" ? 0.45 : 1} />
        </svg>
      );
    case "angle":
      return (
        <svg {...props}>
          <path d="M40 34h20v72h60v20H40z" fill="#FBF6E6" />
          <circle cx="50" cy="56" r="4" fill="#DAB36F" />
          <circle cx="98" cy="116" r="4" fill="#DAB36F" />
        </svg>
      );
    default:
      return null;
  }
}
