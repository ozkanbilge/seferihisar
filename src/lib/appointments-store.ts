import { getRawContent, setRawContent } from "@/lib/site-content";

/**
 * Sunucu tarafı randevu deposu: müşteri hangi cihazdan randevu alırsa
 * alsın admin panelinde görünür. Neon Postgres içerik deposunda tutulur.
 */
const KEY = "appointments";
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
  return ((await getRawContent(KEY, "tr")) as ServerAppointment[] | null) ?? [];
}

async function write(list: ServerAppointment[]) {
  await setRawContent(KEY, "tr", list.slice(0, LIMIT));
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
