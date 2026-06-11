export const ADMIN_EMAIL = "meekaaeelm2@gmail.com";

export function isAdminEmail(email: string | undefined | null): boolean {
  return email?.trim().toLowerCase() === ADMIN_EMAIL;
}
