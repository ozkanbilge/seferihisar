import { promises as fs } from "fs";
import path from "path";

/** Bülten aboneleri — sunucu deposu (data/subscribers.json) */
const FILE = path.join(process.cwd(), "data", "subscribers.json");

export interface Subscriber {
  email: string;
  createdAt: string;
}

async function read(): Promise<Subscriber[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Subscriber[];
  } catch {
    return [];
  }
}

async function write(list: Subscriber[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf8");
}

export async function getSubscribers(): Promise<Subscriber[]> {
  return read();
}

/** Abone ekler; aynı e-posta tekrar eklenmez. true=yeni, false=zaten kayıtlı */
export async function addSubscriber(email: string): Promise<boolean> {
  const norm = email.trim().toLowerCase();
  const list = await read();
  if (list.some((s) => s.email.toLowerCase() === norm)) return false;
  list.unshift({ email: email.trim().slice(0, 120), createdAt: new Date().toISOString() });
  await write(list);
  return true;
}

export async function removeSubscriber(email: string): Promise<void> {
  const list = await read();
  await write(list.filter((s) => s.email.toLowerCase() !== email.trim().toLowerCase()));
}
