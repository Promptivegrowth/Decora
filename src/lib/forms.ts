import { z } from "zod";

const phone = z
  .string()
  .trim()
  .regex(/^[+()\d\s-]{6,20}$/, "invalidPhone");

const base = {
  lang: z.enum(["es", "en"]),
  name: z.string().trim().min(2, "required").max(120),
  email: z.string().trim().min(1, "required").email("invalidEmail").max(160),
  phone,
  consent: z.literal(true, { error: "consentRequired" }),
  /** Honeypot anti-spam: debe llegar vacío */
  website: z.string().max(0).optional(),
};

export const contactSchema = z.object({
  type: z.literal("contact"),
  ...base,
  clientType: z.string().trim().min(1, "required").max(80),
  company: z.string().trim().max(160).optional(),
  subject: z.string().trim().max(160).optional(),
  message: z.string().trim().min(5, "required").max(4000),
});

export const distributorSchema = z.object({
  type: z.literal("distributor"),
  ...base,
  company: z.string().trim().max(160).optional(),
  document: z.string().trim().max(20).optional(),
  city: z.string().trim().min(2, "required").max(120),
  profile: z.string().trim().min(1, "required").max(80),
  experience: z.string().trim().min(1, "required").max(80),
  message: z.string().trim().max(4000).optional(),
});

export const quoteSchema = z.object({
  type: z.literal("quote"),
  ...base,
  company: z.string().trim().max(160).optional(),
  city: z.string().trim().max(120).optional(),
  message: z.string().trim().max(4000).optional(),
  items: z
    .array(
      z.object({
        id: z.string().max(80),
        name: z.string().max(160),
        color: z.string().max(60).optional(),
        qty: z.number().int().min(1).max(99999),
      }),
    )
    .min(1)
    .max(100),
});

export const leadSchema = z.discriminatedUnion("type", [contactSchema, distributorSchema, quoteSchema]);

export type Lead = z.infer<typeof leadSchema>;
export type ErrorKey = "required" | "invalidEmail" | "invalidPhone" | "consentRequired";

/** Valida y devuelve errores por campo con claves traducibles. */
export function validateLead(data: unknown) {
  const res = leadSchema.safeParse(data);
  if (res.success) return { ok: true as const, data: res.data };
  const errors: Record<string, ErrorKey> = {};
  for (const issue of res.error.issues) {
    const field = String(issue.path[0] ?? "form");
    if (errors[field]) continue;
    const msg = issue.message as ErrorKey;
    errors[field] = ["required", "invalidEmail", "invalidPhone", "consentRequired"].includes(msg)
      ? msg
      : "required";
  }
  return { ok: false as const, errors };
}
