"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, CircleCheck, Send } from "lucide-react";
import { useCallback, useState, type FormEvent, type ReactNode } from "react";
import { whatsappLink } from "@/data/site";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { validateLead, type ErrorKey } from "@/lib/forms";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

type FormsDict = Dictionary["forms"];
type Status = "idle" | "sending" | "success" | "error" | "rate";

export function useLeadForm(
  type: "contact" | "distributor" | "quote",
  lang: Locale,
  extra?: () => Record<string, unknown>,
  onSuccess?: () => void,
) {
  const [errors, setErrors] = useState<Record<string, ErrorKey>>({});
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const fd = new FormData(form);
      const data: Record<string, unknown> = { type, lang, ...extra?.() };
      fd.forEach((v, k) => {
        if (typeof v === "string") data[k] = v;
      });
      data.consent = fd.get("consent") === "on";
      for (const k of Object.keys(data)) if (data[k] === "") delete data[k];

      const res = validateLead(data);
      if (!res.ok) {
        setErrors(res.errors);
        const first = Object.keys(res.errors)[0];
        form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
        return;
      }
      setErrors({});
      setStatus("sending");
      try {
        const r = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(res.data),
        });
        if (r.status === 429) return setStatus("rate");
        const json = (await r.json().catch(() => ({}))) as { ok?: boolean; fields?: Record<string, ErrorKey> };
        if (json.ok) {
          setStatus("success");
          form.reset();
          onSuccess?.();
        } else {
          if (json.fields) setErrors(json.fields);
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    },
    [type, lang, extra, onSuccess],
  );

  return { errors, status, setStatus, onSubmit };
}

export function Field({
  name,
  label,
  error,
  t,
  type = "text",
  as = "input",
  options,
  placeholder,
  autoComplete,
  rows = 4,
  className = "",
  required,
  inputMode,
}: {
  name: string;
  label: string;
  error?: ErrorKey;
  t: FormsDict;
  type?: string;
  as?: "input" | "select" | "textarea";
  options?: readonly string[];
  placeholder?: string;
  autoComplete?: string;
  rows?: number;
  className?: string;
  required?: boolean;
  inputMode?: "text" | "email" | "tel" | "numeric";
}) {
  const id = `f-${name}`;
  const err = error ? `${id}-err` : undefined;
  const common = {
    id,
    name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": err,
    "aria-required": required || undefined,
    className: "field",
  } as const;
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
        {required && <span className="text-teal"> *</span>}
      </label>
      {as === "select" ? (
        <select {...common} defaultValue="">
          <option value="" disabled>
            {t.select}
          </option>
          {options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : as === "textarea" ? (
        <textarea {...common} rows={rows} placeholder={placeholder} className="field resize-y" />
      ) : (
        <input {...common} type={type} placeholder={placeholder} autoComplete={autoComplete} inputMode={inputMode} />
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            id={err}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-forest"
          >
            <CircleAlert className="h-3.5 w-3.5 text-gold" />
            {t[error]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function Consent({ t, lang, error }: { t: FormsDict; lang: Locale; error?: ErrorKey }) {
  const [before, after] = t.consent.split(t.privacyLink);
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm text-navy/75">
        <input
          type="checkbox"
          name="consent"
          className="mt-0.5 h-4 w-4 shrink-0 accent-teal"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "f-consent-err" : undefined}
        />
        <span>
          {after !== undefined ? (
            <>
              {before}
              <Link href={href(lang, "privacy")} target="_blank" className="font-semibold text-teal underline underline-offset-2">
                {t.privacyLink}
              </Link>
              {after}
            </>
          ) : (
            t.consent
          )}
        </span>
      </label>
      {error && (
        <p id="f-consent-err" className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-forest">
          <CircleAlert className="h-3.5 w-3.5 text-gold" />
          {t[error]}
        </p>
      )}
    </div>
  );
}

export function Submit({ t, status, label }: { t: FormsDict; status: Status; label: string }) {
  const sending = status === "sending";
  return (
    <button type="submit" className="btn btn-teal w-full sm:w-auto" disabled={sending} aria-busy={sending}>
      {sending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
          {t.sending}
        </>
      ) : (
        <>
          {label}
          <Send className="h-4 w-4" />
        </>
      )}
    </button>
  );
}

export function FormFeedback({
  t,
  status,
  onReset,
  whatsappMessage,
}: {
  t: FormsDict;
  status: Status;
  onReset: () => void;
  whatsappMessage: string;
}) {
  return (
    <AnimatePresence>
      {(status === "error" || status === "rate") && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="flex flex-col gap-3 rounded-xl border border-gold bg-gold/15 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <CircleAlert className="h-5 w-5 shrink-0 text-forest" />
              <div>
                <p className="font-semibold">{t.errorTitle}</p>
                <p className="text-navy/70">{status === "rate" ? t.rateLimited : t.errorText}</p>
              </div>
            </div>
            <a
              href={whatsappLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-navy shrink-0 !px-4 !py-2.5"
              onClick={onReset}
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SuccessPanel({ t, onAgain, children }: { t: FormsDict; onAgain: () => void; children?: ReactNode }) {
  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl bg-teal px-6 py-14 text-center text-cream"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 14, delay: 0.15 }}
        className="grid h-16 w-16 place-items-center rounded-full bg-gold text-navy"
      >
        <CircleCheck className="h-8 w-8" />
      </motion.span>
      <p className="mt-6 font-display text-2xl font-bold">{t.successTitle}</p>
      <p className="mt-2 max-w-sm text-cream/75">{t.successText}</p>
      {children}
      <button type="button" onClick={onAgain} className="btn btn-ghost-light mt-8">
        {t.successAgain}
      </button>
    </motion.div>
  );
}
