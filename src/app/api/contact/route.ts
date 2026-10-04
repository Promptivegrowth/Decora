import { NextResponse, type NextRequest } from "next/server";
import { validateLead } from "@/lib/forms";
import { buildEmail, mailConfigured, sendLead } from "@/lib/mailer";
import { clientIp, rateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: los bots llenan el campo oculto → respondemos OK sin enviar
  if (body && typeof body === "object" && "website" in body && (body as { website?: string }).website) {
    return NextResponse.json({ ok: true });
  }

  if (rateLimited(`contact:${clientIp(request.headers)}`)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const result = validateLead(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: "validation", fields: result.errors }, { status: 422 });
  }

  if (!mailConfigured()) {
    if (process.env.NODE_ENV !== "production" || process.env.MAIL_DRY_RUN === "true") {
      // Desarrollo / pruebas sin SMTP: se muestra el correo en consola para poder probar el flujo
      const mail = buildEmail(result.data);
      console.info(`\n[contact] SMTP no configurado — correo simulado:\n${mail.subject}\n${mail.text}\n`);
      return NextResponse.json({ ok: true, simulated: true });
    }
    console.error("[contact] SMTP no configurado: defina SMTP_HOST, SMTP_USER y SMTP_PASS");
    return NextResponse.json({ ok: false, error: "mail_not_configured" }, { status: 503 });
  }

  try {
    await sendLead(result.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Error SMTP", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
