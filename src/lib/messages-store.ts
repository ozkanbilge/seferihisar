import { promises as fs } from "fs";
import path from "path";

/** İletişim formu mesajları — sunucu deposu (data/messages.json) */
const FILE = path.join(process.cwd(), "data", "messages.json");
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
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as ContactMessage[];
  } catch {
    return [];
  }
}

async function writeAll(list: ContactMessage[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list.slice(0, LIMIT), null, 2), "utf8");
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
