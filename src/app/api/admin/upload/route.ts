import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAdminRequest } from "@/lib/admin-auth";

/**
 * Admin medya yükleme: resim/video dosyalarını public/uploads altına
 * kaydeder ve site içi URL döner. Tip ve boyut doğrulamalı.
 */
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const ALLOWED: Record<string, { ext: string; maxMB: number }> = {
  "image/jpeg": { ext: "jpg", maxMB: 10 },
  "image/png": { ext: "png", maxMB: 10 },
  "image/webp": { ext: "webp", maxMB: 10 },
  "video/mp4": { ext: "mp4", maxMB: 200 },
  "video/webm": { ext: "webm", maxMB: 200 },
  "video/quicktime": { ext: "mov", maxMB: 200 },
};

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }

  const rule = ALLOWED[file.type];
  if (!rule) {
    return NextResponse.json(
      { error: `Desteklenmeyen dosya türü: ${file.type || "bilinmiyor"} (jpg, png, webp, mp4, webm, mov)` },
      { status: 400 }
    );
  }
  if (file.size > rule.maxMB * 1024 * 1024) {
    return NextResponse.json(
      { error: `Dosya çok büyük (en fazla ${rule.maxMB} MB).` },
      { status: 400 }
    );
  }

  const base = (file.name || "medya")
    .replace(/\.[^.]+$/, "")
    .toLocaleLowerCase("tr")
    .replace(/[çğıöşü]/g, (c) => ({ ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" }[c] ?? c))
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48) || "medya";
  const name = `${base}-${Date.now().toString(36)}.${rule.ext}`;

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({
    ok: true,
    url: `/uploads/${name}`,
    kind: file.type.startsWith("video/") ? "video" : "image",
  });
}
