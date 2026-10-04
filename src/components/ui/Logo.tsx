import Image from "next/image";

/**
 * Logos oficiales (carpeta /logos, optimizados en public/brand).
 * Uso según contraste del brandboard:
 *  - dorado  → sobre Principal (#144C42), Acento (#1C3F26) o Fondo alternativo (#121D2C)
 *  - crema   → sobre fondos oscuros y video
 *  - azul    → sobre Fondo claro (#FBF6E6)
 *  - blanco / negro → usos especiales de alto contraste
 */
export type LogoColor = "dorado" | "crema" | "azul" | "blanco" | "negro";

const sizes = {
  horizontal: { w: 900, h: 215 },
  stacked: { w: 720, h: 518 },
  icon: { w: 323, h: 360 },
} as const;

export function Logo({
  color = "dorado",
  layout = "horizontal",
  className,
  priority,
  alt = "D'Cora Hogar",
}: {
  color?: LogoColor;
  layout?: keyof typeof sizes;
  className?: string;
  priority?: boolean;
  alt?: string;
}) {
  const file =
    layout === "horizontal" ? `logo-h-${color}` : layout === "stacked" ? `logo-${color}` : `isotipo-${color}`;
  const { w, h } = sizes[layout];
  return (
    <Image
      src={`/brand/${file}.webp`}
      alt={alt}
      width={w}
      height={h}
      priority={priority}
      unoptimized
      className={className}
      draggable={false}
    />
  );
}
