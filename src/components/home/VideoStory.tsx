import type { Dictionary } from "@/i18n/dictionaries/es";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoCard } from "@/components/ui/VideoCard";

export function VideoStory({
  t,
  common,
}: {
  t: Dictionary["home"]["videos"];
  common: Dictionary["common"];
}) {
  const labels = { play: common.playVideo, pause: common.pauseVideo, mute: common.mute, unmute: common.unmute };
  const people = [
    { ...t.mariela, src: "/videos/mariela.mp4", poster: "/videos/mariela-poster.webp" },
    { ...t.joel, src: "/videos/joel.mp4", poster: "/videos/joel-poster.webp" },
  ];
  return (
    <section className="relative overflow-hidden bg-teal py-24 text-cream sm:py-32">
      <div className="slats pointer-events-none absolute inset-0 text-cream/[0.12]" aria-hidden />
      <div className="container-x relative">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} tone="light" align="center" />
        <div className="mx-auto mt-16 grid max-w-5xl gap-12 md:grid-cols-2 md:gap-10">
          {people.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.12} className={i === 1 ? "md:mt-20" : ""}>
              <div className="mx-auto max-w-[340px]">
                <VideoCard src={p.src} poster={p.poster} name={p.name} role={p.role} labels={labels} />
                <h3 className="mt-7 text-2xl">{p.title}</h3>
                <p className="mt-2 text-cream/70">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
