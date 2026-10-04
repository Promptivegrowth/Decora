import "server-only";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { site } from "@/data/site";
import { DOC_LABELS, type Complaint } from "./complaints";
import { LOGO_PNG_BASE64 } from "./pdf-logo";

// Colores del brandboard
const TEAL = rgb(20 / 255, 76 / 255, 66 / 255);
const GOLD = rgb(218 / 255, 179 / 255, 111 / 255);
const CREAM = rgb(251 / 255, 246 / 255, 230 / 255);
const NAVY = rgb(18 / 255, 29 / 255, 44 / 255);
const MUTED = rgb(0.38, 0.42, 0.47);

const A4 = { w: 595.28, h: 841.89 };
const M = 42; // margen
const W = A4.w - M * 2;

/** Helvetica estándar usa WinAnsi: se normalizan los caracteres que no soporta. */
function clean(s: string) {
  return s
    .replace(/[“”«»]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/\r/g, "")
    .replace(/[^\n\x20-\x7E\xA0-\xFF]/g, "");
}

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const lines: string[] = [];
  for (const para of clean(text).split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/)) {
      if (!word) continue;
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) <= width) {
        line = test;
      } else {
        if (line) lines.push(line);
        // palabras más largas que el ancho disponible
        let w = word;
        while (font.widthOfTextAtSize(w, size) > width) {
          let i = w.length;
          while (i > 1 && font.widthOfTextAtSize(w.slice(0, i), size) > width) i--;
          lines.push(w.slice(0, i));
          w = w.slice(i);
        }
        line = w;
      }
    }
    lines.push(line);
  }
  return lines;
}

export type ComplaintRecord = Complaint & {
  number: string;
  dateLabel: string;
  ubigeoLabel: string;
};

export async function buildComplaintPdf(c: ComplaintRecord) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Hoja de reclamación ${c.number} - ${site.name}`);
  pdf.setAuthor(site.legalName);
  pdf.setSubject("Libro de Reclamaciones virtual");
  pdf.setCreator(site.name);

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const logo = await pdf.embedPng(Buffer.from(LOGO_PNG_BASE64, "base64"));

  let page: PDFPage = pdf.addPage([A4.w, A4.h]);
  let y = A4.h - M;

  const newPage = () => {
    page = pdf.addPage([A4.w, A4.h]);
    y = A4.h - M;
  };
  const ensure = (h: number) => {
    if (y - h < M + 14) newPage();
  };
  const text = (s: string, x: number, yy: number, size = 9, f = font, color = NAVY) =>
    page.drawText(clean(s), { x, y: yy, size, font: f, color });

  // ---------------------------------------------------------- Encabezado
  const logoW = 150;
  const logoH = (logo.height / logo.width) * logoW;
  page.drawRectangle({ x: 0, y: A4.h - 6, width: A4.w, height: 6, color: GOLD });
  page.drawImage(logo, { x: M, y: y - logoH + 4, width: logoW, height: logoH });
  const titleX = A4.w - M;
  const rightText = (s: string, yy: number, size: number, f = bold, color = NAVY) => {
    const w = f.widthOfTextAtSize(clean(s), size);
    text(s, titleX - w, yy, size, f, color);
  };
  rightText("LIBRO DE RECLAMACIONES", y - 8, 14, bold, TEAL);
  rightText(`HOJA DE RECLAMACIÓN N.° ${c.number}`, y - 24, 9.5);
  rightText(`Fecha: ${c.dateLabel}`, y - 37, 8.5, font, MUTED);
  y -= Math.max(logoH, 44) + 16;

  // Datos del proveedor
  const provH = 44;
  page.drawRectangle({ x: M, y: y - provH, width: W, height: provH, color: CREAM, borderColor: GOLD, borderWidth: 0.8 });
  text("Proveedor:", M + 10, y - 15, 8.5, bold);
  text(site.legalName, M + 62, y - 15, 8.5);
  text("RUC:", M + 330, y - 15, 8.5, bold);
  text(site.ruc || "-", M + 355, y - 15, 8.5);
  text("Domicilio:", M + 10, y - 31, 8.5, bold);
  text(site.fiscalAddress || site.country.es, M + 62, y - 31, 8.5);
  y -= provH + 14;

  // ---------------------------------------------------------- Helpers de sección
  const section = (n: number, title: string) => {
    ensure(40);
    page.drawRectangle({ x: M, y: y - 19, width: W, height: 19, color: TEAL });
    text(`${n}. ${title.toUpperCase()}`, M + 10, y - 13, 9, bold, CREAM);
    y -= 24;
  };

  const LABEL_W = 150;
  const row = (label: string, value: string) => {
    const lines = wrap(value || "-", font, 9, W - LABEL_W - 20);
    const h = Math.max(1, lines.length) * 11.5 + 6.5;
    ensure(h);
    text(label, M + 10, y - 10, 8.5, bold, MUTED);
    lines.forEach((l, i) => text(l, M + LABEL_W, y - 10 - i * 11.5, 9));
    page.drawLine({
      start: { x: M, y: y - h + 2 },
      end: { x: M + W, y: y - h + 2 },
      thickness: 0.4,
      color: rgb(0.85, 0.82, 0.74),
    });
    y -= h;
  };

  const block = (label: string, value: string) => {
    const lines = wrap(value, font, 9, W - 20);
    ensure(30);
    text(label, M + 10, y - 11, 8.5, bold, MUTED);
    y -= 18;
    for (const l of lines) {
      ensure(14);
      text(l, M + 10, y - 9, 9);
      y -= 12;
    }
    y -= 8;
  };

  // ---------------------------------------------------------- 1. Consumidor
  section(1, "Identificación del consumidor reclamante");
  row("Nombres y apellidos", c.name);
  row("Documento de identidad", `${DOC_LABELS[c.docType]} ${c.docNumber}`);
  row("Domicilio", c.address);
  row("Ubigeo", c.ubigeoLabel);
  row("Teléfono", c.phone);
  row("Correo electrónico", c.email);
  if (c.minor) row("Padre, madre o apoderado", c.guardian ?? "-");
  y -= 8;

  // ---------------------------------------------------------- 2. Bien contratado
  section(2, "Identificación del bien contratado");
  const mark = (on: boolean) => (on ? "[X]" : "[  ]");
  row("Tipo", `${mark(c.itemType === "producto")} Producto     ${mark(c.itemType === "servicio")} Servicio`);
  row("Monto reclamado", c.amount ? `S/ ${c.amount.replace(",", ".")}` : "-");
  if (c.orderRef) row("Pedido / comprobante", c.orderRef);
  row("Descripción", c.description);
  y -= 8;

  // ---------------------------------------------------------- 3. Detalle
  section(3, "Detalle de la reclamación y pedido del consumidor");
  row("Tipo de solicitud", `${mark(c.claimType === "reclamo")} Reclamo     ${mark(c.claimType === "queja")} Queja`);
  y -= 4;
  block("Detalle:", c.detail);
  block("Pedido:", c.request);

  // ---------------------------------------------------------- 4. Proveedor
  section(4, "Observaciones y acciones adoptadas por el proveedor");
  ensure(60);
  page.drawRectangle({ x: M, y: y - 44, width: W, height: 44, borderColor: rgb(0.8, 0.76, 0.66), borderWidth: 0.6 });
  text("(Para ser completado por el proveedor)", M + 10, y - 14, 8, font, MUTED);
  y -= 52;
  row("Fecha de comunicación de la respuesta", "");
  y -= 6;

  // ---------------------------------------------------------- Constancia y notas
  const notes = [
    `Declaración del consumidor: aceptada electrónicamente el ${c.dateLabel}, con la conformidad de que la información proporcionada es verdadera.`,
    "RECLAMO: disconformidad relacionada a los productos o servicios. QUEJA: disconformidad no relacionada a los productos o servicios; o malestar o descontento respecto a la atención al público.",
    "La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.",
    "El proveedor deberá dar respuesta al reclamo o queja en un plazo no mayor a quince (15) días hábiles improrrogables.",
  ];
  for (const n of notes) {
    const lines = wrap(n, font, 7.2, W);
    ensure(lines.length * 9 + 4);
    for (const l of lines) {
      text(l, M, y - 8, 7.2, font, MUTED);
      y -= 9;
    }
    y -= 3;
  }

  // Pie de página en todas las hojas
  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    p.drawRectangle({ x: 0, y: 0, width: A4.w, height: 4, color: GOLD });
    const footer = clean(`${site.legalName} · RUC ${site.ruc || "-"} · Hoja N.° ${c.number} · Página ${i + 1} de ${pages.length}`);
    const fw = font.widthOfTextAtSize(footer, 7);
    p.drawText(footer, { x: (A4.w - fw) / 2, y: 16, size: 7, font, color: MUTED });
  });

  return pdf.save();
}
