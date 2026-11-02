import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getAttachments, getNotice } from "@/lib/notice";
import { NoticeForm } from "@/components/NoticeForm";

export default async function EditNoticePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin();

  const id = Number((await params).id);
  const notice = Number.isInteger(id) ? getNotice(id) : undefined;

  if (!notice) notFound();

  const page = Math.max(1, Number.parseInt((await searchParams).page ?? "1", 10) || 1);

  return (
    <NoticeForm
      id={notice.id}
      page={page}
      initialTitle={notice.title}
      initialHtml={notice.contentHtml}
      initialFiles={getAttachments(notice.id)}
    />
  );
}
