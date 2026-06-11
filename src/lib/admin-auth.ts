/**
 * Basit admin API koruması: AppContext'teki panel şifresiyle aynı anahtar
 * x-admin-key başlığında beklenir. Canlıya çıkarken ADMIN_KEY env değişkeni
 * ile değiştirilmelidir.
 */
export const ADMIN_KEY = process.env.ADMIN_KEY ?? "123321Aq";

export function isAdminRequest(request: Request): boolean {
  return request.headers.get("x-admin-key") === ADMIN_KEY;
}
