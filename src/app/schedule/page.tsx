import { MonthCalendar } from "@/components/MonthCalendar";
import { parseMonth, todayKST } from "@/lib/calendar";
import { getSchedules } from "@/lib/schedule";

export default async function SchedulePage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const month = parseMonth((await searchParams).month);

  return (
    <main>
      <MonthCalendar month={month} today={todayKST()} items={getSchedules(month)} basePath="/schedule" />
    </main>
  );
}
