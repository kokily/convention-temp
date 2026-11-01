import Link from "next/link";
import { logout } from "@/actions/auth";
import { requireAdmin } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <>
      <nav className="flex items-center gap-4 border-b border-gray-200 px-4 py-3 textm-sm">
        <Link href="/admin/schedule">스케줄 관리</Link>
        <Link href="/admin/notice">게시글 관리</Link>

        <form action={logout} className="ml-auto">
          <button className="text-gray-500">로그아웃</button>
        </form>
      </nav>
      {children}
    </>
  );
}
