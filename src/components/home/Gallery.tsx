import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { ShadeReveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Mosaico: las fotos verticales ocupan dos filas; las demás, una.
const photos = [
  { src: "/images/fachada.webp", cls: "col-span-2 row-span-2 lg:col-span-4", pos: "object-center", sizes: "(max-width:1024px) 100vw, 33vw" },
  { src: "/images/reales/stock-telas.webp", cls: "row-span-2 lg:col-span-3", pos: "object-center", sizes: "(max-width:1024px) 50vw, 25vw" },
  { src: "/images/showroom.webp", cls: "lg:col-span-5", pos: "object-[50%_40%]", sizes: "(max-width:1024px) 50vw, 40vw" },
  { src: "/images/reales/corte-perfiles.webp", cls: "lg:col-span-5", pos: "object-[50%_42%]", sizes: "(max-width:1024px) 50vw, 40vw" },
  { src: "/images/reales/corte-telas.webp", cls: "lg:col-span-4", pos: "object-[50%_55%]", sizes: "(max-width:1024px) 50vw, 33vw" },
  { src: "/images/reales/taller-mesa.webp", cls: "lg:col-span-4", pos: "object-[50%_70%]", sizes: "(max-width:1024px) 50vw, 33vw" },
  { src: "/images/reales/camiseta-rack.webp", cls: "col-span-2 lg:col-span-4", pos: "object-[50%_65%]", sizes: "(max-width:1024px) 100vw, 33vw" },
];

export function Gallery({ t }: { t: Dictionary["home"]["gallery"] }) {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />
        <div className="mt-14 grid auto-rows-[200px] grid-cols-2 gap-3 sm:auto-rows-[260px] sm:gap-4 lg:grid-cols-12">
          {photos.map((p, i) => (
            <ShadeReveal
              key={p.src}
              delay={(i % 3) * 0.1}
              shade={i % 2 ? "bg-teal" : "bg-navy"}
              className={`group rounded-2xl ${p.cls}`}
            >
              <div className="relative h-full w-full">
                <Image
                  src={p.src}
                  alt={t.items[i]}
                  fill
                  sizes={p.sizes}
                  className={`object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105 ${p.pos}`}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-80" aria-hidden />
                <span className="absolute bottom-4 left-4 flex items-center gap-2 text-sm font-semibold text-cream">
                  <span className="h-px w-5 bg-gold" aria-hidden />
                  {t.items[i]}
                </span>
              </div>
            </ShadeReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
