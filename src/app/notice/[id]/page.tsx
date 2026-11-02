import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacent, getNotice } from "@/lib/notice";
import { PageHeader } from "@/components/PageHeader";
import { listQuery } from "@/lib/query";

export default async function NoticeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const id = Number((await params).id);
  const notice = Number.isInteger(id) ? getNotice(id) : undefined;
  if (!notice) notFound();

  const { q, page } = await searchParams;
  const suffix = listQuery(q, page);
  const { prev, next } = getAdjacent(id);

  return (
    <main>
      <PageHeader title="공지사항" />

      <article className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-16">
        <h2 className="border-y border-gray-300 bg-gray-50 px-4 py-4 text-lg font-bold">{notice.title}</h2>

        <dl className="flex border-b border-gray-300 text-sm">
          <dt className="w-24 bg-gray-50 px-4 py-3">등록일</dt>
          <dd className="px-4 py-3">{notice.createdAt.slice(0, 16)}</dd>
        </dl>

        <div
          className="notice-content min-h-48 break-words border-b border-gray-300 px-4 py-8"
          dangerouslySetInnerHTML={{ __html: notice.contentHtml }}
        />

        <dl className="text-sm">
          <div className="flex border-b border-gray-200 py-4">
            <dt className="w-20 shrink-0 font-bold">이전글</dt>
            <dd className="truncate">
              {prev ? (
                <Link href={`/notice/${prev.id}${suffix}`} className="hover:underline">
                  {prev.title}
                </Link>
              ) : (
                "이전 글이 없습니다."
              )}
            </dd>
          </div>
          <div className="flex border-b border-gray-200 py-4">
            <dt className="w-20 shrink-0 font-bold">다음글</dt>
            <dd className="truncate">
              {next ? (
                <Link href={`/notice/${next.id}${suffix}`} className="hover:underline">
                  {next.title}
                </Link>
              ) : (
                "다음 글이 없습니다."
              )}
            </dd>
          </div>
        </dl>

        <div className="mt-6 text-right">
          <Link href={`/${suffix}`} className="inline-block border border-brand px-6 py-2 text-brand">
            목록
          </Link>
        </div>
      </article>
    </main>
  );
}
