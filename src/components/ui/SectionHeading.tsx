import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  tone = "dark",
  className = "",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <Reveal>
        <p
          className={`eyebrow flex items-center gap-3 ${center ? "justify-center" : ""} ${
            tone === "light" ? "text-gold" : "text-teal"
          }`}
        >
          <span className="h-px w-8 bg-gold" aria-hidden />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={`mt-4 text-[2rem] leading-[1.08] sm:text-5xl lg:text-[3.4rem] ${
            tone === "light" ? "text-cream" : "text-navy"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {text && (
        <Reveal delay={0.16}>
          <p className={`mt-5 text-base leading-relaxed sm:text-lg ${tone === "light" ? "text-cream/70" : "text-navy/70"}`}>
            {text}
          </p>
        </Reveal>
      )}
    </div>
  );
}
