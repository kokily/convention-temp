"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);

  return (
    <form action={action} className="space-y-3">
      <input
        type="password"
        name="password"
        placeholder="비밀번호"
        autoComplete="current-password"
        required
        className="h-12 w-full border border-gray-300 px-4"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={pending} className="h-12 w-full bg-brand font-bold text-white disabled:opacity-50">
        로그인
      </button>
    </form>
  );
}
