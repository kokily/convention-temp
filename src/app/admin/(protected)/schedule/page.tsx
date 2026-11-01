import { ScheduleEditor } from "@/components/ScheduleEditor";
import { requireAdmin } from "@/lib/auth";
import { parseMonth, todayKST } from "@/lib/calendar";
import { getSchedules } from "@/lib/schedule";

export default async function AdminSchedulePage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  await requireAdmin();
  const month = parseMonth((await searchParams).month);

  return <ScheduleEditor month={month} today={todayKST()} items={getSchedules(month)} />;
}
