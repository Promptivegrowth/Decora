/**
 * Datos de contacto de la empresa. Editar aquí para actualizar toda la web.
 * Los campos vacíos se ocultan automáticamente.
 */
export const site = {
  name: "D'Cora Hogar",
  legalName: "D'Cora Hogar Perú E.I.R.L.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  country: { es: "Lima, Perú", en: "Lima, Peru" },

  /** WhatsApp / teléfono comercial (visible en el letrero y uniformes de la empresa) */
  whatsapp: "51981082480",
  phoneDisplay: "+51 981 082 480",

  /** Correo corporativo visible en la web (el de cPanel). Se define con NEXT_PUBLIC_CONTACT_EMAIL. */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",

  /**
   * Datos fiscales del proveedor: obligatorios en la Hoja de Reclamación (Libro de Reclamaciones).
   * Tomados de registros públicos de SUNAT (verificar ante cualquier cambio).
   */
  ruc: process.env.NEXT_PUBLIC_RUC ?? "20603899572",
  fiscalAddress: process.env.NEXT_PUBLIC_FISCAL_ADDRESS ?? "Av. Coronel José Leal N.° 282, Lince, Lima, Perú",

  /** Dirección y horario: completar cuando se confirmen */
  address: "",
  mapsUrl: "",
  hours: { es: "", en: "" },

  social: {
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
  },
} as const;

export function whatsappLink(message?: string) {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${site.whatsapp}${text}`;
}
