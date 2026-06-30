import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "ansh_admin_session";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "links@anshapps.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Rahul@123";
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "Khushi@Simran";
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || "ansh-links-admin-session-secret-change-me";

function sign(data: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
}

export function verifyAdminCredentials(
  email: string,
  password: string,
  passcode: string
): boolean {
  return (
    email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD &&
    passcode === ADMIN_PASSCODE
  );
}

export function createAdminSessionToken(): string {
  const payload = {
    role: "admin",
    email: ADMIN_EMAIL,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [data, signature] = token.split(".");
  if (!data || !signature) return false;
  if (sign(data) !== signature) return false;

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as {
      role?: string;
      exp?: number;
    };
    return payload.role === "admin" && typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export function unauthorizedResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
