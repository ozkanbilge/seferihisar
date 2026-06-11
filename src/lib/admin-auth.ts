/**
 * Basit admin API koruması: AppContext'teki panel şifresiyle aynı anahtar
 * x-admin-key başlığında beklenir. Canlıya çıkarken ADMIN_KEY env değişkeni
 * ile değiştirilmelidir.
 */
export const ADMIN_KEY = process.env.ADMIN_KEY ?? "";

export function isAdminRequest(request: Request): boolean {
  // Anahtar tanımlı değilse admin API'leri tamamen kapalıdır
  if (!ADMIN_KEY) return false;
  return request.headers.get("x-admin-key") === ADMIN_KEY;
}
