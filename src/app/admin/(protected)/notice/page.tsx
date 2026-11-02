import Link from "next/link";
import { DeleteNoticeButton } from "@/components/DeleteNoticeButton";
import { requireAdmin } from "@/lib/auth";
import { listNotices } from "@/lib/notice";
import { listQuery } from "@/lib/query";

export default async function AdminNoticePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireAdmin();

  const requestedPage = Math.max(1, Number.parseInt((await searchParams).page ?? "1", 10) || 1);
  const { rows, page, lastPage } = listNotices("", requestedPage);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-4 flex justify-end">
        <Link href="/admin/notice/new" className="bg-brand px-5 py-2 text-white">
          글쓰기
        </Link>
      </div>

      <ul className="divide-y divide-gray-200 border-y border-gray-300 text-sm">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center gap-4 py-3">
            <Link
              href={`/admin/notice/${row.id}/edit${listQuery(undefined, page)}`}
              className="min-w-0 flex-1 truncate hover:underline"
            >
              {row.title}
            </Link>
            <time className="hidden shrink-0 sm:block">{row.createdAt.slice(0, 10)}</time>
            <a href={`/notice/${row.id}`} target="_blank" rel="noreferrer" className="shrink-0">
              보기
            </a>
            <DeleteNoticeButton id={row.id} title={row.title} />
          </li>
        ))}
        {rows.length === 0 && <li className="py-16 text-center text-gray-500">게시글이 없습니다.</li>}
      </ul>

      <nav aria-label="페이지" className="mt-6 flex flex-wrap justify-center gap-1 text-sm">
        {Array.from({ length: lastPage }, (_, i) => i + 1).map((n) => (
          <Link
            key={n}
            href={`/admin/notice?page=${n}`}
            className={`px-3 py-1 border ${n === page ? "font-bold text-brand" : "text-gray-500"}`}
          >
            {n}
          </Link>
        ))}
      </nav>
    </main>
  );
}
