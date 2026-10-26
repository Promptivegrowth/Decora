import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

const photos = [
  { src: "/images/productos/tela-screen-rollos.webp", pos: "object-center" },
  { src: "/images/productos/tela-duo.webp", pos: "object-center" },
  { src: "/images/reales/stock-telas.webp", pos: "object-center" },
  { src: "/images/productos/telas-taller.webp", pos: "object-[50%_35%]" },
  { src: "/images/reales/corte-telas.webp", pos: "object-[50%_60%]" },
  { src: "/images/productos/importacion-camion.webp", pos: "object-[50%_55%]" },
];

/**
 * Collage lineal de telas reales. En escritorio es un acordeón: la foto bajo el
 * cursor se expande como una cortina que se abre. En móvil, carrusel deslizable.
 */
export function FabricCollage({ title, labels }: { title: string; labels: string[] }) {
  return (
    <Reveal className="container-x mt-20">
      <p className="eyebrow flex items-center gap-3 text-teal">
        <span className="h-px w-8 bg-gold" aria-hidden />
        {title}
      </p>
      <ul className="no-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 sm:mx-0 sm:scroll-px-0 sm:px-0 lg:h-[340px] lg:overflow-visible">
        {photos.map((p, i) => (
          <li
            key={p.src}
            className="group relative h-[300px] w-[72%] shrink-0 snap-start overflow-hidden rounded-2xl bg-navy sm:w-[42%] lg:h-full lg:w-auto lg:flex-[1_1_150px] lg:transition-[flex-grow] lg:duration-700 lg:ease-[cubic-bezier(.76,0,.24,1)] lg:hover:flex-[2.4_1_150px]"
          >
            <Image
              src={p.src}
              alt={labels[i]}
              fill
              sizes="(max-width:640px) 72vw, (max-width:1024px) 42vw, 30vw"
              className={`object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105 ${p.pos}`}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" aria-hidden />
            <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gold transition-transform duration-700 group-hover:scale-x-100" aria-hidden />
            <span className="absolute inset-x-4 bottom-4 flex items-start gap-2 text-sm leading-snug font-semibold text-cream">
              <span className="mt-2.5 h-px w-5 shrink-0 bg-gold" aria-hidden />
              {labels[i]}
            </span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
