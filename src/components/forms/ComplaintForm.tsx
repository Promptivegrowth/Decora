"use client";

import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, CircleCheck, Download, Send } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { site } from "@/data/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { validateComplaint, type ComplaintErrorKey } from "@/lib/complaints";
import { Consent, FormFeedback, Honeypot } from "./FormKit";

type Ubigeo = { d: [string, string][]; p: [string, string][]; t: [string, string][] };
type Status = "idle" | "sending" | "success" | "error" | "rate";
type Result = { number: string; date: string; pdf: string };

export function ComplaintForm({
  lang,
  t,
  forms,
  whatsappMessage,
}: {
  lang: Locale;
  t: Dictionary["complaints"];
  forms: Dictionary["forms"];
  whatsappMessage: string;
}) {
  const f = t.fields;
  const [ubigeo, setUbigeo] = useState<Ubigeo | null>(null);
  const [dep, setDep] = useState("");
  const [prov, setProv] = useState("");
  const [dist, setDist] = useState("");
  const [minor, setMinor] = useState(false);
  const [errors, setErrors] = useState<Record<string, ComplaintErrorKey>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [today, setToday] = useState("");

  useEffect(() => {
    let alive = true;
    fetch("/data/ubigeo.json")
      .then((r) => r.json())
      .then((d: Ubigeo) => alive && setUbigeo(d))
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fecha local solo en cliente
    setToday(
      new Intl.DateTimeFormat(lang === "es" ? "es-PE" : "en-GB", { timeZone: "America/Lima", dateStyle: "long" }).format(new Date()),
    );
    return () => {
      alive = false;
    };
  }, [lang]);

  const provinces = useMemo(() => (ubigeo && dep ? ubigeo.p.filter(([c]) => c.startsWith(dep)) : []), [ubigeo, dep]);
  const districts = useMemo(() => (ubigeo && prov ? ubigeo.t.filter(([c]) => c.startsWith(prov)) : []), [ubigeo, prov]);

  const msg = (k?: ComplaintErrorKey) => (k ? (k === "invalidDocument" ? t.invalidDocument : forms[k]) : undefined);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => {
      const v = fd.get(k);
      return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
    };
    const data = {
      type: "complaint",
      lang,
      name: get("name"),
      docType: get("docType"),
      docNumber: get("docNumber"),
      phone: get("phone"),
      email: get("email"),
      address: get("address"),
      ubigeo: dist || undefined,
      minor,
      guardian: minor ? get("guardian") : undefined,
      itemType: get("itemType"),
      amount: get("amount"),
      orderRef: get("orderRef"),
      description: get("description"),
      claimType: get("claimType"),
      detail: get("detail"),
      request: get("request"),
      declare: fd.get("declare") === "on",
      consent: fd.get("consent") === "on",
      website: get("website"),
    };
    const res = validateComplaint(data);
    if (!res.ok) {
      setErrors(res.errors);
      const first = Object.keys(res.errors)[0];
      const target = first === "ubigeo" ? (dep ? (prov ? "district" : "province") : "department") : first;
      form.querySelector<HTMLElement>(`[name="${target}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const r = await fetch("/api/complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(res.data),
      });
      if (r.status === 429) return setStatus("rate");
      const json = (await r.json().catch(() => ({}))) as Partial<Result> & {
        ok?: boolean;
        fields?: Record<string, ComplaintErrorKey>;
      };
      if (json.ok && json.number && json.pdf && json.date) {
        setResult({ number: json.number, date: json.date, pdf: json.pdf });
        setStatus("success");
        window.scrollTo({ top: (form.closest("section")?.offsetTop ?? 0) - 40, behavior: "smooth" });
      } else {
        if (json.fields) setErrors(json.fields);
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const download = () => {
    if (!result) return;
    const bytes = Uint8Array.from(atob(result.pdf), (c) => c.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `Hoja-de-reclamacion-${result.number}.pdf`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  if (status === "success" && result) {
    return (
      <motion.div
        role="status"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center rounded-[2rem] bg-teal px-6 py-14 text-center text-cream"
      >
        <span className="grid h-16 w-16 place-items-center rounded-full bg-gold text-navy">
          <CircleCheck className="h-8 w-8" />
        </span>
        <p className="mt-6 font-display text-2xl font-bold sm:text-3xl">{t.success.title}</p>
        <p className="eyebrow mt-5 text-gold">{t.success.number}</p>
        <p className="mt-1 font-display text-3xl font-bold tracking-wide" data-testid="complaint-number">
          {result.number}
        </p>
        <p className="mt-1 text-sm text-cream/70">{result.date}</p>
        <p className="mt-5 max-w-md text-cream/80">{t.success.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={download} className="btn btn-gold">
            <Download className="h-4 w-4" />
            {t.success.download}
          </button>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setResult(null);
            }}
            className="btn btn-ghost-light"
          >
            {t.success.again}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-label={t.hero.title} className="relative space-y-6">
      <Honeypot />

      {/* Cabecera de la hoja */}
      <div className="overflow-hidden rounded-[1.5rem] ring-1 ring-navy/10">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-navy px-6 py-4 text-cream">
          <p className="font-display text-lg font-bold">{t.sheet}</p>
          <p className="text-sm text-cream/70">
            N.° <span className="font-semibold text-gold">{t.sheetAuto}</span>
          </p>
        </div>
        <dl className="grid gap-4 bg-[color-mix(in_oklab,var(--color-gold)_12%,var(--color-cream))] px-6 py-5 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs font-semibold tracking-wide text-navy/50 uppercase">{t.date}</dt>
            <dd className="mt-0.5 font-semibold">{today || "—"}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-xs font-semibold tracking-wide text-navy/50 uppercase">{t.provider.legalName}</dt>
            <dd className="mt-0.5 font-semibold">{site.legalName}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-navy/50 uppercase">{t.provider.ruc}</dt>
            <dd className="mt-0.5 font-semibold">{site.ruc || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-navy/50 uppercase">{t.provider.address}</dt>
            <dd className="mt-0.5 font-semibold">{site.fiscalAddress || site.country[lang]}</dd>
          </div>
        </dl>
      </div>

      {/* 1. Consumidor */}
      <Section n={1} title={t.s1}>
        <Input name="name" label={f.name} error={msg(errors.name)} autoComplete="name" className="sm:col-span-2" required />
        <Select
          name="docType"
          label={f.docType}
          error={msg(errors.docType)}
          placeholder={forms.select}
          options={f.docTypes.map((d) => [d.value, d.label])}
          required
        />
        <Input name="docNumber" label={f.docNumber} error={msg(errors.docNumber)} required />
        <Input name="phone" label={f.phone} type="tel" error={msg(errors.phone)} autoComplete="tel" required />
        <Input name="email" label={f.email} type="email" error={msg(errors.email)} autoComplete="email" required />
        <Input name="address" label={f.address} error={msg(errors.address)} autoComplete="street-address" className="sm:col-span-2" required />
        <div className="grid gap-5 sm:col-span-2 sm:grid-cols-3">
          <Select
            name="department"
            label={f.department}
            placeholder={ubigeo ? forms.select : t.loading}
            disabled={!ubigeo}
            value={dep}
            onChange={(v) => {
              setDep(v);
              setProv("");
              setDist("");
            }}
            options={ubigeo?.d ?? []}
            error={!dep ? msg(errors.ubigeo) : undefined}
            required
          />
          <Select
            name="province"
            label={f.province}
            placeholder={forms.select}
            disabled={!dep}
            value={prov}
            onChange={(v) => {
              setProv(v);
              setDist("");
            }}
            options={provinces}
            error={dep && !prov ? msg(errors.ubigeo) : undefined}
            required
          />
          <Select
            name="district"
            label={f.district}
            placeholder={forms.select}
            disabled={!prov}
            value={dist}
            onChange={setDist}
            options={districts}
            error={prov && !dist ? msg(errors.ubigeo) : undefined}
            required
          />
        </div>
        <label className="flex cursor-pointer items-center gap-3 text-sm sm:col-span-2">
          <input type="checkbox" checked={minor} onChange={(e) => setMinor(e.target.checked)} className="h-4 w-4 accent-teal" />
          {f.minor}
        </label>
        <AnimatePresence initial={false}>
          {minor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden sm:col-span-2"
            >
              <Input name="guardian" label={f.guardian} error={msg(errors.guardian)} required />
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      {/* 2. Bien contratado */}
      <Section n={2} title={t.s2}>
        <Choice
          name="itemType"
          label={f.itemType}
          error={msg(errors.itemType)}
          options={f.itemTypes.map((o) => ({ value: o.value, label: o.label }))}
          className="sm:col-span-2"
        />
        <Input name="amount" label={f.amount} inputMode="decimal" error={msg(errors.amount)} />
        <Input name="orderRef" label={f.orderRef} />
        <Input name="description" label={f.description} error={msg(errors.description)} as="textarea" rows={3} className="sm:col-span-2" required />
      </Section>

      {/* 3. Detalle */}
      <Section n={3} title={t.s3}>
        <Choice
          name="claimType"
          label={f.claimType}
          error={msg(errors.claimType)}
          options={[
            { value: "reclamo", label: f.reclamo, text: f.reclamoText },
            { value: "queja", label: f.queja, text: f.quejaText },
          ]}
          className="sm:col-span-2"
        />
        <Input name="detail" label={f.detail} error={msg(errors.detail)} as="textarea" rows={5} className="sm:col-span-2" required />
        <Input name="request" label={f.request} error={msg(errors.request)} as="textarea" rows={3} className="sm:col-span-2" required />
      </Section>

      <div className="space-y-4 rounded-[1.5rem] bg-navy/[0.04] p-6">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-navy/80">
          <input type="checkbox" name="declare" className="mt-0.5 h-4 w-4 shrink-0 accent-teal" aria-invalid={errors.declare ? true : undefined} />
          <span>{f.declare}</span>
        </label>
        {errors.declare && <ErrorText>{forms.required}</ErrorText>}
        <Consent t={forms} lang={lang} error={errors.consent === "consentRequired" ? "consentRequired" : undefined} />
        <ul className="space-y-1.5 border-t border-navy/10 pt-4 text-xs leading-relaxed text-navy/60">
          {t.notes.map((n) => (
            <li key={n} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              {n}
            </li>
          ))}
        </ul>
      </div>

      <FormFeedback t={forms} status={status} onReset={() => setStatus("idle")} whatsappMessage={whatsappMessage} />
      <button type="submit" className="btn btn-teal w-full sm:w-auto" disabled={status === "sending"} aria-busy={status === "sending"}>
        {status === "sending" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
            {forms.sending}
          </>
        ) : (
          <>
            {t.submit}
            <Send className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

/* ----------------------------------------------------------------- Piezas */

function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <fieldset className="overflow-hidden rounded-[1.5rem] ring-1 ring-navy/10">
      <legend className="sr-only">{`${n}. ${title}`}</legend>
      <div className="flex items-center gap-3 bg-teal px-6 py-3.5 text-cream" aria-hidden>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gold font-display text-sm font-bold text-navy">{n}</span>
        <span className="font-display font-bold">{title}</span>
      </div>
      <div className="grid gap-5 p-6 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function ErrorText({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-forest">
      <CircleAlert className="h-3.5 w-3.5 text-gold" />
      {children}
    </p>
  );
}

function Input({
  name,
  label,
  error,
  type = "text",
  as = "input",
  rows = 4,
  className = "",
  required,
  autoComplete,
  inputMode,
}: {
  name: string;
  label: string;
  error?: string;
  type?: string;
  as?: "input" | "textarea";
  rows?: number;
  className?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "decimal" | "text";
}) {
  const id = `c-${name}`;
  const common = {
    id,
    name,
    className: "field",
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-err` : undefined,
  } as const;
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
        {required && <span className="text-teal"> *</span>}
      </label>
      {as === "textarea" ? (
        <textarea {...common} rows={rows} className="field resize-y" />
      ) : (
        <input {...common} type={type} autoComplete={autoComplete} inputMode={inputMode} />
      )}
      {error && <ErrorText id={`${id}-err`}>{error}</ErrorText>}
    </div>
  );
}

function Select({
  name,
  label,
  options,
  placeholder,
  error,
  value,
  onChange,
  disabled,
  required,
}: {
  name: string;
  label: string;
  options: [string, string][];
  placeholder: string;
  error?: string;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  required?: boolean;
}) {
  const id = `c-${name}`;
  const controlled = value !== undefined;
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {required && <span className="text-teal"> *</span>}
      </label>
      <select
        id={id}
        name={name}
        className="field disabled:opacity-50"
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        {...(controlled ? { value, onChange: (e) => onChange?.(e.target.value) } : { defaultValue: "" })}
      >
        <option value="" disabled={!controlled}>
          {placeholder}
        </option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function Choice({
  name,
  label,
  options,
  error,
  className = "",
}: {
  name: string;
  label: string;
  options: { value: string; label: string; text?: string }[];
  error?: string;
  className?: string;
}) {
  return (
    <div className={className} role="radiogroup" aria-label={label}>
      <p className="label">
        {label}
        <span className="text-teal"> *</span>
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="group relative flex cursor-pointer gap-3 rounded-xl p-4 ring-1 ring-navy/15 transition has-[:checked]:bg-teal has-[:checked]:text-cream has-[:checked]:ring-teal"
          >
            <input type="radio" name={name} value={o.value} className="mt-0.5 h-4 w-4 shrink-0 accent-gold" />
            <span>
              <span className="block text-sm font-semibold">{o.label}</span>
              {o.text && <span className="mt-1 block text-xs leading-relaxed opacity-75">{o.text}</span>}
            </span>
          </label>
        ))}
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}
