import { promises as fs } from "fs";
import path from "path";

/**
 * Sunucu tarafı randevu deposu: müşteri hangi cihazdan randevu alırsa
 * alsın admin panelinde görünür. data/appointments.json'da tutulur.
 */
const FILE = path.join(process.cwd(), "data", "appointments.json");
const LIMIT = 1000;

export interface ServerAppointment {
  id: string;
  userPhone: string;
  listingSlug: string;
  listingTitle: string;
  date: string;
  time: string;
  status: "pending" | "approved" | "cancelled";
  createdAt: string;
}

async function read(): Promise<ServerAppointment[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as ServerAppointment[];
  } catch {
    return [];
  }
}

async function write(list: ServerAppointment[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list.slice(0, LIMIT), null, 2), "utf8");
}

export async function getAppointments(): Promise<ServerAppointment[]> {
  return read();
}

export async function addAppointment(
  input: Omit<ServerAppointment, "id" | "status" | "createdAt">
): Promise<ServerAppointment> {
  const list = await read();
  const app: ServerAppointment = {
    ...input,
    id: `RND-${Date.now().toString(36).toUpperCase()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  list.unshift(app);
  await write(list);
  return app;
}

export async function setAppointmentStatus(
  id: string,
  status: ServerAppointment["status"]
): Promise<boolean> {
  const list = await read();
  const app = list.find((a) => a.id === id);
  if (!app) return false;
  app.status = status;
  await write(list);
  return true;
}
