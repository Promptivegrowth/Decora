"use client";

import { motion } from "motion/react";
import { whatsappLink } from "@/data/site";
import { useSiteReady } from "@/lib/ready";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

export function WhatsAppFloat({ label, message }: { label: string; message: string }) {
  const ready = useSiteReady();
  return (
    <motion.a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      initial={false}
      animate={ready ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
      className="group fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-teal p-3.5 text-cream shadow-[0_16px_40px_-12px_rgb(18_29_44/0.6)] ring-1 ring-gold/40 transition-colors hover:bg-forest sm:right-6 sm:bottom-6"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-teal/40 [animation-duration:2.6s]" aria-hidden />
      <WhatsAppIcon className="relative h-6 w-6 text-gold" />
      <span className="relative hidden max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap transition-[max-width] duration-500 group-hover:max-w-[10rem] sm:block">
        {label}
      </span>
    </motion.a>
  );
}
