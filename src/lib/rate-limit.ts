// Límite básico de envíos por IP (por instancia del servidor)
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = Number(process.env.RATE_LIMIT_MAX ?? 6);
const buckets = new Map<string, number[]>();

export function rateLimited(key: string) {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  buckets.set(key, recent);
  return recent.length > MAX_HITS;
}

export function clientIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}
