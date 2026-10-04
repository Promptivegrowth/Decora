import "server-only";

/**
 * Numeración de la hoja de reclamación.
 *
 * - Con una base Redis de Upstash (integración de Vercel Marketplace) configurada en
 *   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (o KV_REST_API_URL / KV_REST_API_TOKEN),
 *   el número es correlativo por año: 000000001-2026, 000000002-2026, …
 * - Sin base de datos se genera un código único basado en la fecha y hora de Lima.
 */
export async function nextComplaintNumber(now = new Date()): Promise<{ number: string; correlative: boolean }> {
  const year = limaParts(now).year;
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (url && token) {
    try {
      const res = await fetch(`${url.replace(/\/$/, "")}/incr/dcora:reclamaciones:${year}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const json = (await res.json()) as { result?: number };
      if (res.ok && typeof json.result === "number") {
        return { number: `${String(json.result).padStart(9, "0")}-${year}`, correlative: true };
      }
    } catch (err) {
      console.error("[reclamaciones] No se pudo obtener el correlativo", err);
    }
  }

  const p = limaParts(now);
  const rand = Math.floor(Math.random() * 90 + 10);
  return { number: `${year}${p.month}${p.day}-${p.hour}${p.minute}${p.second}${rand}`, correlative: false };
}

export function limaParts(date: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .formatToParts(date)
      .map((x) => [x.type, x.value]),
  );
  return parts as Record<"year" | "month" | "day" | "hour" | "minute" | "second", string>;
}

export function limaDateLabel(date: Date) {
  const p = limaParts(date);
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute} (hora de Lima)`;
}
