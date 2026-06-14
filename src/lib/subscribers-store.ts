import { getRawContent, setRawContent } from "@/lib/site-content";

/** Bülten aboneleri — Neon Postgres içerik deposu */
const KEY = "subscribers";

export interface Subscriber {
  email: string;
  createdAt: string;
}

async function read(): Promise<Subscriber[]> {
  return ((await getRawContent(KEY, "tr")) as Subscriber[] | null) ?? [];
}

async function write(list: Subscriber[]) {
  await setRawContent(KEY, "tr", list);
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
