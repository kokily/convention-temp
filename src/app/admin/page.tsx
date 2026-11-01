import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin/schedule");

  return (
    <main className="mx-auto max-w-sm px-4 py-24">
      <h1 className="mb-8 text-center text-2xl font-bold">관리자 로그인</h1>
      <LoginForm />
    </main>
  );
}
