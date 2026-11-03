"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, destroySession, verifyPassword } from "@/lib/auth";

const WINDOW = 10 * 60 * 1000;
const LIMIT = 5;
const failures = new Map<string, { count: number; resetAt: number }>();

export async function login(_: string | null, formData: FormData) {
  const h = await headers();
  const ip = h.get("x-real-ip") ?? "local";
  const record = failures.get(ip);

  if (record && record.resetAt > Date.now() && record.count >= LIMIT) {
    return "시도 횟수를 초과했습니다. 10분 후 다시 시도해 주세요";
  }

  const password = String(formData.get("password") ?? "");

  if (!verifyPassword(password)) {
    const active = record && record.resetAt > Date.now();

    failures.set(ip, {
      count: active ? record.count + 1 : 1,
      resetAt: active ? record.resetAt : Date.now() + WINDOW,
    });

    return "비밀번호가 틀렸습니다.";
  }

  failures.delete(ip);
  await createSession();
  redirect("/admin/schedule");
}

export async function logout() {
  await destroySession();
  redirect("/admin");
}
