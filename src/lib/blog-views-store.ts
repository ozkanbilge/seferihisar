import { promises as fs } from "fs";
import path from "path";

/** Blog okunma sayaçları — sunucu deposu (data/blog-views.json) */
const FILE = path.join(process.cwd(), "data", "blog-views.json");

/** Yazıya özgü deterministik başlangıç (yeni içerik "0" görünmesin) */
function baseFor(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 100000;
  return 180 + (h % 540); // 180–720 arası sabit taban
}

async function read(): Promise<Record<string, number>> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Record<string, number>;
  } catch {
    return {};
  }
}

async function write(data: Record<string, number>) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
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
