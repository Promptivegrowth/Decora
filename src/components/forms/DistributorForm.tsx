"use client";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Consent, Field, FormFeedback, Honeypot, Submit, SuccessPanel, useLeadForm } from "./FormKit";

export function DistributorForm({
  lang,
  t,
  whatsappMessage,
}: {
  lang: Locale;
  t: Dictionary["forms"];
  whatsappMessage: string;
}) {
  const { errors, status, setStatus, onSubmit } = useLeadForm("distributor", lang);
  if (status === "success") return <SuccessPanel t={t} onAgain={() => setStatus("idle")} />;
  return (
    <form noValidate onSubmit={onSubmit} className="relative grid gap-5 sm:grid-cols-2" aria-label="Distribuidor">
      <Honeypot />
      <Field t={t} name="name" label={t.name} error={errors.name} autoComplete="name" required />
      <Field t={t} name="phone" label={t.phone} type="tel" inputMode="tel" error={errors.phone} autoComplete="tel" required />
      <Field t={t} name="email" label={t.email} type="email" inputMode="email" error={errors.email} autoComplete="email" required />
      <Field t={t} name="city" label={t.city} error={errors.city} autoComplete="address-level2" required />
      <Field t={t} name="company" label={t.company} autoComplete="organization" />
      <Field t={t} name="document" label={t.document} inputMode="numeric" />
      <Field t={t} name="profile" label={t.profile} as="select" options={t.profiles} error={errors.profile} required />
      <Field t={t} name="experience" label={t.experience} as="select" options={t.experiences} error={errors.experience} required />
      <Field t={t} name="message" label={t.messageDistributor} as="textarea" rows={4} className="sm:col-span-2" />
      <div className="sm:col-span-2">
        <Consent t={t} lang={lang} error={errors.consent} />
      </div>
      <div className="space-y-4 sm:col-span-2">
        <FormFeedback t={t} status={status} onReset={() => setStatus("idle")} whatsappMessage={whatsappMessage} />
        <Submit t={t} status={status} label={t.submitDistributor} />
      </div>
    </form>
  );
}
