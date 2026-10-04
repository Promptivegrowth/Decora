import "server-only";
import nodemailer from "nodemailer";
import type { Lead } from "./forms";

/**
 * Envío por SMTP del correo corporativo (cPanel).
 * Variables de entorno (ver .env.example):
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_TO, MAIL_FROM, MAIL_AUTOREPLY
 */
export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function transport() {
  const port = Number(process.env.SMTP_PORT ?? 465);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const TITLES: Record<Lead["type"], string> = {
  contact: "Nuevo mensaje de contacto",
  distributor: "Nueva postulación de distribuidor",
  quote: "Nueva solicitud de cotización",
};

const LABELS: Record<string, string> = {
  name: "Nombre",
  email: "Correo",
  phone: "Teléfono / WhatsApp",
  company: "Empresa / marca",
  document: "RUC / DNI",
  city: "Ciudad / región",
  clientType: "Tipo de cliente",
  profile: "Perfil",
  experience: "Experiencia",
  subject: "Asunto",
  message: "Mensaje",
  lang: "Idioma del sitio",
};

function rows(lead: Lead) {
  const entries = Object.entries(lead).filter(
    ([k, v]) => LABELS[k] && typeof v === "string" && v.trim() !== "",
  ) as [string, string][];
  return entries;
}

export function buildEmail(lead: Lead) {
  const title = TITLES[lead.type];
  const data = rows(lead);
  const items = lead.type === "quote" ? lead.items : [];

  const text = [
    title,
    "",
    ...data.map(([k, v]) => `${LABELS[k]}: ${v}`),
    ...(items.length
      ? ["", "Productos:", ...items.map((i) => `- ${i.qty} × ${i.name}${i.color ? ` (${i.color})` : ""}`)]
      : []),
  ].join("\n");

  const html = `<!doctype html><html><body style="margin:0;background:#FBF6E6;font-family:Montserrat,Arial,sans-serif;color:#121D2C">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF6E6;padding:32px 12px"><tr><td align="center">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FBF6E6;border:1px solid #DAB36F">
    <tr><td style="background:#144C42;padding:28px 32px;color:#DAB36F;font-size:22px;font-weight:700;letter-spacing:.5px">D'CORA HOGAR<div style="font-size:12px;letter-spacing:4px;color:#FBF6E6;margin-top:6px">${esc(title.toUpperCase())}</div></td></tr>
    <tr><td style="padding:28px 32px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.5">
        ${data
          .map(
            ([k, v]) =>
              `<tr><td style="padding:8px 0;border-bottom:1px solid #DAB36F33;width:38%;font-weight:700;vertical-align:top">${esc(LABELS[k])}</td><td style="padding:8px 0;border-bottom:1px solid #DAB36F33;white-space:pre-wrap">${esc(v)}</td></tr>`,
          )
          .join("")}
      </table>
      ${
        items.length
          ? `<h3 style="margin:28px 0 10px;font-size:15px;color:#144C42">Productos solicitados</h3>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
        <tr style="background:#121D2C;color:#FBF6E6"><td style="padding:8px">Producto</td><td style="padding:8px">Color</td><td style="padding:8px;text-align:right">Cant.</td></tr>
        ${items
          .map(
            (i) =>
              `<tr><td style="padding:8px;border-bottom:1px solid #DAB36F33">${esc(i.name)}</td><td style="padding:8px;border-bottom:1px solid #DAB36F33">${esc(i.color ?? "—")}</td><td style="padding:8px;border-bottom:1px solid #DAB36F33;text-align:right">${i.qty}</td></tr>`,
          )
          .join("")}
      </table>`
          : ""
      }
    </td></tr>
    <tr><td style="background:#121D2C;padding:16px 32px;color:#FBF6E6;font-size:12px">Enviado desde el sitio web de D'Cora Hogar · Responde a este correo para contactar a ${esc(lead.name)}</td></tr>
  </table></td></tr></table></body></html>`;

  return { subject: `${title} — ${lead.name}`, text, html };
}

function autoReply(lead: Lead) {
  const es = lead.lang === "es";
  const subject = es ? "Recibimos tu mensaje — D'Cora Hogar" : "We received your message — D'Cora Hogar";
  const body = es
    ? `Hola ${lead.name},\n\nGracias por escribirnos. Recibimos tu mensaje y nuestro equipo se comunicará contigo muy pronto.\n\nD'Cora Hogar`
    : `Hi ${lead.name},\n\nThank you for reaching out. We received your message and our team will contact you very soon.\n\nD'Cora Hogar`;
  return { subject, text: body };
}

export async function sendLead(lead: Lead) {
  const t = transport();
  const user = process.env.SMTP_USER!;
  const from = process.env.MAIL_FROM || `"D'Cora Hogar Web" <${user}>`;
  const to = process.env.MAIL_TO || user;
  const mail = buildEmail(lead);
  await t.sendMail({ from, to, replyTo: `"${lead.name}" <${lead.email}>`, ...mail });
  if (process.env.MAIL_AUTOREPLY === "true") {
    await t.sendMail({ from, to: lead.email, ...autoReply(lead) }).catch(() => undefined);
  }
}
