import { NoticeForm } from "@/components/NoticeForm";
import { requireAdmin } from "@/lib/auth";

export default async function NewNoticePage() {
  await requireAdmin();

  return <NoticeForm />;
}
