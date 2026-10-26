import { Quote } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoCard } from "@/components/ui/VideoCard";

/** Testimonios en video de decoradores-distribuidores. */
export function Testimonials({
  t,
  common,
  id,
}: {
  t: Dictionary["home"]["testimonials"];
  common: Dictionary["common"];
  id?: string;
}) {
  const labels = { play: common.playVideo, pause: common.pauseVideo, mute: common.mute, unmute: common.unmute };
  return (
    <section id={id} className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} align="center" />
        <ul className="no-scrollbar -mx-5 mt-14 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
          {t.items.map((it, i) => (
            <Reveal
              as="li"
              key={it.id}
              delay={i * 0.1}
              className="flex w-[78%] shrink-0 snap-center flex-col sm:w-[46%] md:w-auto"
            >
              <VideoCard
                src={`/videos/testimonios/${it.id}.mp4`}
                poster={`/videos/testimonios/${it.id}-poster.webp`}
                name={it.name}
                role={it.role}
                labels={labels}
                className="mx-auto w-full max-w-[340px]"
              />
              <figure className="relative mx-auto mt-5 flex w-full max-w-[340px] flex-1 flex-col rounded-2xl bg-cream p-6 ring-1 ring-navy/10">
                <Quote className="h-6 w-6 text-gold" aria-hidden />
                <blockquote className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-navy/80">“{it.quote}”</blockquote>
                <figcaption className="mt-5 flex items-end justify-between gap-3 border-t border-navy/10 pt-4">
                  <span>
                    <span className="block font-display font-bold">{it.name}</span>
                    <span className="block text-xs text-navy/60">{it.role}</span>
                  </span>
                  <span className="text-right">
                    <span className="block font-display text-2xl leading-none font-bold text-teal">{it.years}</span>
                    <span className="block text-[0.65rem] leading-tight text-navy/55">{t.years}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
