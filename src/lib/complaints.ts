import { z } from "zod";

/**
 * Hoja de reclamación (Libro de Reclamaciones virtual)
 * Ley N.° 29571 y Reglamento del Libro de Reclamaciones (D.S. 011-2011-PCM y modificatorias).
 */

const DOC_RULES: Record<string, RegExp> = {
  DNI: /^\d{8}$/,
  CE: /^[A-Za-z0-9]{9,12}$/,
  PASAPORTE: /^[A-Za-z0-9]{6,12}$/,
  RUC: /^(10|15|17|20)\d{9}$/,
};

export const complaintSchema = z
  .object({
    type: z.literal("complaint"),
    lang: z.enum(["es", "en"]),
    name: z.string().trim().min(3, "required").max(140),
    docType: z.enum(["DNI", "CE", "PASAPORTE", "RUC"], { error: "required" }),
    docNumber: z.string().trim().min(1, "required").max(15),
    phone: z.string().trim().regex(/^[+()\d\s-]{6,20}$/, "invalidPhone"),
    email: z.string().trim().min(1, "required").email("invalidEmail").max(160),
    address: z.string().trim().min(5, "required").max(200),
    ubigeo: z.string().regex(/^\d{6}$/, "required"),
    minor: z.boolean().default(false),
    guardian: z.string().trim().max(140).optional(),
    itemType: z.enum(["producto", "servicio"], { error: "required" }),
    amount: z
      .string()
      .trim()
      .regex(/^\d{1,9}([.,]\d{1,2})?$/, "required")
      .optional(),
    orderRef: z.string().trim().max(60).optional(),
    description: z.string().trim().min(3, "required").max(500),
    claimType: z.enum(["reclamo", "queja"], { error: "required" }),
    detail: z.string().trim().min(10, "required").max(3000),
    request: z.string().trim().min(5, "required").max(2000),
    declare: z.literal(true, { error: "required" }),
    consent: z.literal(true, { error: "consentRequired" }),
    website: z.string().max(0).optional(),
  })
  .superRefine((d, ctx) => {
    if (!DOC_RULES[d.docType]?.test(d.docNumber)) {
      ctx.addIssue({ code: "custom", path: ["docNumber"], message: "invalidDocument" });
    }
    if (d.minor && (!d.guardian || d.guardian.length < 3)) {
      ctx.addIssue({ code: "custom", path: ["guardian"], message: "required" });
    }
  });

export type Complaint = z.infer<typeof complaintSchema>;
export type ComplaintErrorKey = "required" | "invalidEmail" | "invalidPhone" | "consentRequired" | "invalidDocument";

const KEYS: ComplaintErrorKey[] = ["required", "invalidEmail", "invalidPhone", "consentRequired", "invalidDocument"];

export function validateComplaint(data: unknown) {
  const res = complaintSchema.safeParse(data);
  if (res.success) return { ok: true as const, data: res.data };
  const errors: Record<string, ComplaintErrorKey> = {};
  for (const issue of res.error.issues) {
    const field = String(issue.path[0] ?? "form");
    if (errors[field]) continue;
    const msg = issue.message as ComplaintErrorKey;
    errors[field] = KEYS.includes(msg) ? msg : "required";
  }
  return { ok: false as const, errors };
}

export const DOC_LABELS: Record<Complaint["docType"], string> = {
  DNI: "DNI",
  CE: "Carné de extranjería",
  PASAPORTE: "Pasaporte",
  RUC: "RUC",
};
