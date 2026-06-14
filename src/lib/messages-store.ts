import { getRawContent, setRawContent } from "@/lib/site-content";

/** İletişim formu mesajları — Neon Postgres içerik deposu */
const KEY = "messages";
const LIMIT = 1000;

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

async function readAll(): Promise<ContactMessage[]> {
  return ((await getRawContent(KEY, "tr")) as ContactMessage[] | null) ?? [];
}

async function writeAll(list: ContactMessage[]) {
  await setRawContent(KEY, "tr", list.slice(0, LIMIT));
}

export async function getMessages(): Promise<ContactMessage[]> {
  return readAll();
}

export async function addMessage(
  input: Omit<ContactMessage, "id" | "read" | "createdAt">
): Promise<ContactMessage> {
  const list = await readAll();
  const msg: ContactMessage = {
    ...input,
    id: `MSG-${Date.now().toString(36).toUpperCase()}`,
    read: false,
    createdAt: new Date().toISOString(),
  };
  list.unshift(msg);
  await writeAll(list);
  return msg;
}

export async function setMessageRead(id: string, read: boolean): Promise<boolean> {
  const list = await readAll();
  const msg = list.find((m) => m.id === id);
  if (!msg) return false;
  msg.read = read;
  await writeAll(list);
  return true;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const list = await readAll();
  const next = list.filter((m) => m.id !== id);
  if (next.length === list.length) return false;
  await writeAll(next);
  return true;
}
