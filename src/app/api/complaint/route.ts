import { NextResponse, type NextRequest } from "next/server";
import { DOC_LABELS, validateComplaint } from "@/lib/complaints";
import { limaDateLabel, nextComplaintNumber } from "@/lib/complaint-number";
import { buildComplaintPdf } from "@/lib/complaint-pdf";
import { mailConfigured, sendComplaint } from "@/lib/mailer";
import { clientIp, rateLimited } from "@/lib/rate-limit";
import { resolveUbigeo } from "@/lib/ubigeo";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot anti-bots
  if (body && typeof body === "object" && (body as { website?: string }).website) {
    return NextResponse.json({ ok: true });
  }

  if (rateLimited(`complaint:${clientIp(request.headers)}`)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const result = validateComplaint(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: "validation", fields: result.errors }, { status: 422 });
  }
  const c = result.data;
  const ubi = resolveUbigeo(c.ubigeo);
  if (!ubi) {
    return NextResponse.json({ ok: false, error: "validation", fields: { ubigeo: "required" } }, { status: 422 });
  }

  const configured = mailConfigured();
  const simulate = !configured && (process.env.NODE_ENV !== "production" || process.env.MAIL_DRY_RUN === "true");
  if (!configured && !simulate) {
    console.error("[reclamaciones] SMTP no configurado: defina SMTP_HOST, SMTP_USER y SMTP_PASS");
    return NextResponse.json({ ok: false, error: "mail_not_configured" }, { status: 503 });
  }

  const now = new Date();
  const { number } = await nextComplaintNumber(now);
  const dateLabel = limaDateLabel(now);
  const ubigeoLabel = `${ubi.department} / ${ubi.province} / ${ubi.district} (${ubi.code})`;

  const pdf = await buildComplaintPdf({ ...c, number, dateLabel, ubigeoLabel });

  const summary: [string, string][] = [
    ["Tipo", c.claimType === "reclamo" ? "Reclamo" : "Queja"],
    ["Consumidor", c.name],
    ["Documento", `${DOC_LABELS[c.docType]} ${c.docNumber}`],
    ["Teléfono", c.phone],
    ["Correo", c.email],
    ["Domicilio", `${c.address} — ${ubigeoLabel}`],
    ...(c.minor ? ([["Padre/madre/apoderado", c.guardian ?? ""]] as [string, string][]) : []),
    ["Bien contratado", `${c.itemType === "producto" ? "Producto" : "Servicio"}: ${c.description}`],
    ["Monto reclamado", c.amount ? `S/ ${c.amount}` : "—"],
    ...(c.orderRef ? ([["Pedido / comprobante", c.orderRef]] as [string, string][]) : []),
    ["Detalle", c.detail],
    ["Pedido", c.request],
  ];

  if (simulate) {
    console.info(`\n[reclamaciones] SMTP no configurado — envío simulado de la hoja N.° ${number} (${pdf.length} bytes)\n`);
  } else {
    try {
      await sendComplaint(
        { number, name: c.name, email: c.email, lang: c.lang, claimType: c.claimType, dateLabel, summary },
        pdf,
      );
    } catch (err) {
      console.error("[reclamaciones] Error SMTP", err);
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }
  }

  return NextResponse.json({
    ok: true,
    number,
    date: dateLabel,
    pdf: Buffer.from(pdf).toString("base64"),
    ...(simulate ? { simulated: true } : {}),
  });
}
