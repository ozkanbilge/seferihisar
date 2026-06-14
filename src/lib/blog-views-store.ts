import { getRawContent, setRawContent } from "@/lib/site-content";

/** Blog okunma sayaçları — Neon Postgres içerik deposu */
const KEY = "blog-views";

/** Yazıya özgü deterministik başlangıç (yeni içerik "0" görünmesin) */
function baseFor(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 100000;
  return 180 + (h % 540); // 180–720 arası sabit taban
}

// Build sırasında blog sayfalarınca çağrılır; kısa TTL'li memo.
let memo: { data: Record<string, number>; exp: number } | null = null;
const TTL_MS = 30_000;

async function read(): Promise<Record<string, number>> {
  const now = Date.now();
  if (memo && memo.exp > now) return memo.data;
  const data = ((await getRawContent(KEY, "tr")) as Record<string, number> | null) ?? {};
  memo = { data, exp: now + TTL_MS };
  return data;
}

async function write(data: Record<string, number>) {
  await setRawContent(KEY, "tr", data);
  memo = null;
}

/** Görüntülenen toplam (taban + gerçek artış) */
export async function getViews(slug: string): Promise<number> {
  const data = await read();
  return baseFor(slug) + (data[slug] ?? 0);
}

/** Okunmayı 1 artırır ve yeni toplamı döndürür */
export async function incrementView(slug: string): Promise<number> {
  const data = await read();
  data[slug] = (data[slug] ?? 0) + 1;
  await write(data);
  return baseFor(slug) + data[slug];
}
