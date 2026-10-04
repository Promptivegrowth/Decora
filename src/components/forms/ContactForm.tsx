"use client";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Consent, Field, FormFeedback, Honeypot, Submit, SuccessPanel, useLeadForm } from "./FormKit";

export function ContactForm({
  lang,
  t,
  whatsappMessage,
}: {
  lang: Locale;
  t: Dictionary["forms"];
  whatsappMessage: string;
}) {
  const { errors, status, setStatus, onSubmit } = useLeadForm("contact", lang);
  if (status === "success") return <SuccessPanel t={t} onAgain={() => setStatus("idle")} />;
  return (
    <form noValidate onSubmit={onSubmit} className="relative grid gap-5 sm:grid-cols-2" aria-label="Contacto">
      <Honeypot />
      <Field t={t} name="name" label={t.name} error={errors.name} autoComplete="name" required />
      <Field t={t} name="email" label={t.email} type="email" inputMode="email" error={errors.email} autoComplete="email" required />
      <Field t={t} name="phone" label={t.phone} type="tel" inputMode="tel" error={errors.phone} autoComplete="tel" required />
      <Field t={t} name="clientType" label={t.clientType} as="select" options={t.clientTypes} error={errors.clientType} required />
      <Field t={t} name="company" label={t.company} autoComplete="organization" className="sm:col-span-2" />
      <Field t={t} name="message" label={t.message} as="textarea" rows={5} error={errors.message} className="sm:col-span-2" required />
      <div className="sm:col-span-2">
        <Consent t={t} lang={lang} error={errors.consent} />
      </div>
      <div className="space-y-4 sm:col-span-2">
        <FormFeedback t={t} status={status} onReset={() => setStatus("idle")} whatsappMessage={whatsappMessage} />
        <Submit t={t} status={status} label={t.submit} />
      </div>
    </form>
  );
}
