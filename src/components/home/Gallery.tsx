import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { ShadeReveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const photos = [
  { src: "/images/fachada.webp", cls: "col-span-2 row-span-2 lg:col-span-4", sizes: "(max-width:1024px) 100vw, 33vw" },
  { src: "/images/showroom.webp", cls: "lg:col-span-4", sizes: "(max-width:1024px) 50vw, 33vw" },
  { src: "/images/almacen-rollos.webp", cls: "lg:col-span-4 lg:row-span-2", sizes: "(max-width:1024px) 50vw, 33vw" },
  { src: "/images/taller-corte.webp", cls: "lg:col-span-4", sizes: "(max-width:1024px) 50vw, 33vw" },
  { src: "/images/oficina.webp", cls: "lg:col-span-5", sizes: "(max-width:1024px) 50vw, 40vw" },
  { src: "/images/taller-fabricacion.webp", cls: "lg:col-span-7", sizes: "(max-width:1024px) 100vw, 60vw" },
];

export function Gallery({ t }: { t: Dictionary["home"]["gallery"] }) {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />
        <div className="mt-14 grid auto-rows-[220px] grid-cols-2 gap-3 sm:auto-rows-[260px] sm:gap-4 lg:grid-cols-12">
          {photos.map((p, i) => (
            <ShadeReveal
              key={p.src}
              delay={(i % 3) * 0.1}
              shade={i % 2 ? "bg-teal" : "bg-navy"}
              className={`group rounded-2xl ${p.cls} ${i === 5 ? "col-span-2" : ""}`}
            >
              <div className="relative h-full w-full">
                <Image
                  src={p.src}
                  alt={t.items[i]}
                  fill
                  sizes={p.sizes}
                  className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
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
