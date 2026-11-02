import type { Metadata } from "next";
import { MonthCalendar } from "@/components/MonthCalendar";
import { parseMonth, todayKST } from "@/lib/calendar";
import { getSchedules } from "@/lib/schedule";

export const metadata: Metadata = {
  title: "행사 일정",
  robots: { index: false, follow: false },
};

export default async function SchedulePage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const month = parseMonth((await searchParams).month);

  return (
    <main className="flex flex-1 flex-col">
      <MonthCalendar month={month} today={todayKST()} items={getSchedules(month)} basePath="/schedule" />
    </main>
  );
}
