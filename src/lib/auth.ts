import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { scryptSync, timingSafeEqual } from "node:crypto";

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 8;
const secret = () => new TextEncoder().encode(process.env.SESSION_SECRET);

export function verifyPassword(password: string) {
  const [salt, stored] = process.env.ADMIN_PASSWORD_HASH!.split(":");
  const input = scryptSync(password, salt, 64);
  return timingSafeEqual(input, Buffer.from(stored, "hex"));
}

export async function createSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;

  if (!token) return false;

  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin");
}
