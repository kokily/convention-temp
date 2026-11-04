import { buildCells, shiftMonth } from "@/lib/calendar";
import Link from "next/link";

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];

type MonthCalendarProps = {
  month: string;
  today: string;
  items: Record<string, string>;
  basePath: string;
  onSelect?: (date: string) => void;
};

export function MonthCalendar({ month, today, items, basePath, onSelect }: MonthCalendarProps) {
  const [year, mon] = month.split("-");
  const entries = Object.entries(items).sort(([a], [b]) => a.localeCompare(b));

  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 py-8 lg:my-auto 2xl:max-w-none 2xl:px-10">
      <div className="mb-6 flex items-center justify-center gap-6">
        <Link href={`${basePath}?month=${shiftMonth(month, -1)}`} aria-label="이전 달" className="px-3 py-1 text-xl">
          ‹
        </Link>
        <h2 className="text-2xl font-bold text-heading lg:text-4xl">
          {year}년 {mon}월
        </h2>
        <Link href={`${basePath}?month=${shiftMonth(month, 1)}`} aria-label="다음 달" className="px-3 py-1 text-xl">
          ›
        </Link>
      </div>

      <div className={`${onSelect ? "grid" : "hidden sm:grid"} grid-cols-7 border-l border-t border-gray-200`}>
        {WEEK.map((w, i) => (
          <div
            key={w}
            className={`border-b border-r border-gray-200 bg-gray-50 py-2 text-center text-sm font-bold lg:py-4 lg:text-lg ${
              i === 0 ? "text-red-600" : ""
            }`}
          >
            {w}
          </div>
        ))}

        {buildCells(month).map((date, i) => {
          if (!date) return <div key={i} className="border-b border-r border-gray-200 bg-gray-50/50" />;

          const body = (
            <>
              <time
                className={`text-sm lg:text-base ${i % 7 === 0 ? "text-red-600" : ""} ${
                  date === today ? "font-bold text-brand" : ""
                }`}
              >
                {Number(date.slice(8))}
              </time>
              <span className="mt-1 block w-full whitespace-pre-line break-keep wrap-anywhere text-xs leading-5 sm:text-sm lg:text-base lg:leading-6">
                {items[date]}
              </span>
            </>
          );

          const cell =
            "min-h-20 border-b border-r border-gray-200 p-1 text-left align-top sm:min-h-32 sm:p-2 lg:min-h-[175px] lg:p-3";

          return onSelect ? (
            <button
              key={date}
              type="button"
              className={`${cell} flex cursor-pointer flex-col items-start justify-start hover:bg-gray-50`}
              onClick={() => onSelect(date)}
            >
              {body}
            </button>
          ) : (
            <div key={date} className={cell}>
              {body}
            </div>
          );
        })}
      </div>

      {!onSelect && (
        <ul className="divide-y divide-gray-200 border-y border-gray-200 sm:hidden">
          {entries.length === 0 && <li className="py-10 text-center text-sm text-gray-500">등록된 일정이 없습니다.</li>}
          {entries.map(([date, content]) => (
            <li key={date} className="flex gap-4 py-3">
              <time className={`w-14 shrink-0 font-bold ${date === today ? "text-brand" : ""}`}>
                {date.slice(5).replace("-", ".")}
              </time>
              <p className="whitespace-pre-line break-all text-sm">{content}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
