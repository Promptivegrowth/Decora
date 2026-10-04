"use client";

import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Video vertical (9:16) con portada, reproducción al hacer clic y barra de progreso.
 * Solo un video se reproduce a la vez en la página.
 */
export function VideoCard({
  src,
  poster,
  name,
  role,
  labels,
  className = "",
}: {
  src: string;
  poster: string;
  name: string;
  role: string;
  labels: { play: string; pause: string; mute: string; unmute: string };
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onOther = (e: Event) => {
      if ((e as CustomEvent).detail !== ref.current) ref.current?.pause();
    };
    window.addEventListener("dcora:video-play", onOther);
    return () => window.removeEventListener("dcora:video-play", onOther);
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      window.dispatchEvent(new CustomEvent("dcora:video-play", { detail: v }));
      v.play().catch(() => {
        v.muted = true;
        setMuted(true);
        v.play().catch(() => undefined);
      });
      setStarted(true);
    } else v.pause();
  };

  return (
    <div className={`group relative aspect-[9/16] overflow-hidden rounded-[1.75rem] bg-navy ring-1 ring-gold/30 ${className}`}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        playsInline
        preload="none"
        muted={muted}
        className="absolute inset-0 h-full w-full object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (v.duration) setProgress(v.currentTime / v.duration);
        }}
        onClick={toggle}
      />

      <AnimatePresence>
        {!playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent"
          />
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? labels.pause : labels.play}
        className={`absolute top-1/2 left-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold text-navy shadow-xl transition-all duration-500 hover:scale-105 ${
          playing ? "pointer-events-none scale-75 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100" : ""
        }`}
      >
        {!playing && <span className="absolute inset-0 animate-ping rounded-full bg-gold/50 [animation-duration:2.4s]" />}
        {playing ? <Pause className="relative h-7 w-7" /> : <Play className="relative ml-1 h-7 w-7" />}
      </button>

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 p-5 text-cream transition-opacity duration-500 ${
          playing ? "opacity-0" : "opacity-100"
        }`}
      >
        <p className="font-display text-xl font-bold">{name}</p>
        <p className="eyebrow mt-1 text-gold">{role}</p>
      </div>

      {started && (
        <>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? labels.unmute : labels.mute}
            className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-navy/60 text-cream backdrop-blur transition-colors hover:bg-navy"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-cream/20">
            <div className="h-full bg-gold" style={{ width: `${progress * 100}%` }} />
          </div>
        </>
      )}
    </div>
  );
}
