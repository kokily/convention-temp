import Link from "next/link";
import Form from "next/form";
import { PageHeader } from "@/components/PageHeader";
import { listNotices, PAGE_SIZE } from "@/lib/notice";
import { listQuery } from "@/lib/query";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const requestedPage = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const { rows, total, page, lastPage } = listNotices(q, requestedPage);

  return (
    <main>
      <PageHeader title="공지사항" />

      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-16">
        <Form action="/" className="mx-auto mb-10 flex max-w-xl">
          <input
            name="q"
            defaultValue={q}
            placeholder="검색어 입력"
            aria-label="검색어"
            className="h-12 min-w-0 flex-1 border border-gray-300 bg-gray-50 px-4"
          />
          <button className="h-12 w-24 shrink-0 cursor-pointer bg-brand font-bold text-white">조회</button>
        </Form>

        <table className="w-full table-fixed border-t border-gray-300 text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-300">
              <th className="hidden w-20 py-3 sm:table-cell">번호</th>
              <th className="py-3">제목</th>
              <th className="w-28 py-3 sm:w-32">등록일</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className="border-b border-gray-200">
                <td className="hidden py-4 text-center sm:table-cell">{total - (page - 1) * PAGE_SIZE - i}</td>
                <td className="truncate px-3 py-4">
                  <Link href={`/notice/${row.id}${listQuery(q, page)}`} className="hover:underline">
                    {row.title}
                  </Link>
                </td>
                <td className="py-4 text-center">{row.createdAt.slice(0, 10)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="py-16 text-center text-gray-500">
                  게시글이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <nav className="mt-8 flex flex-wrap justify-center gap-1 text-sm">
          {Array.from({ length: lastPage }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={`/${listQuery(q, n)}`}
              aria-current={n === page ? "page" : undefined}
              className={`px-3 py-1 border ${n === page ? "font-bold text-brand" : "text-gray-500"}`}
            >
              {n}
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
