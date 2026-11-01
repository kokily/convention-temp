"use client";

import { useEffect, useState, useTransition } from "react";
import { MonthCalendar } from "./MonthCalendar";
import { deleteSchedule, saveSchedule } from "@/actions/schedule";

type ScheduleEditorProps = {
  month: string;
  today: string;
  items: Record<string, string>;
};

export function ScheduleEditor({ month, today, items }: ScheduleEditorProps) {
  const [date, setDate] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const open = (selected: string) => {
    setDate(selected);
    setText(items[selected] ?? "");
  };

  const save = () => {
    if (!date) return;

    startTransition(async () => {
      await saveSchedule(date, text);
      setDate(null);
    });
  };

  const remove = () => {
    if (!date) return;

    startTransition(async () => {
      await deleteSchedule(date);
      setConfirming(false);
      setDate(null);
    });
  };

  useEffect(() => {
    if (!date) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const isSave = e.code === "KeyS" && (e.ctrlKey || e.metaKey);

      if (isSave) {
        e.preventDefault();
        if (!confirming && text.trim() && !pending) save();
        return;
      }

      if (e.key !== "Escape" || pending) return;

      if (confirming) setConfirming(false);
      else setDate(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <>
      <MonthCalendar month={month} today={today} items={items} basePath="/admin/schedule" onSelect={open} />

      {date && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div role="dialog" aria-modal="true" aria-label={`${date} 일정`} className="w-full max-w-md bg-white p-6">
              <h3 className="mb-3 font-bold">{date}</h3>
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                placeholder="일정을 입력해주세요 (저장: Ctrl+S, 취소: ESC)"
                className="w-full border border-gray-300 p-3"
              />
              <div className="mt-3 flex gap-2">
                {items[date] && (
                  <button
                    type="button"
                    onClick={() => setConfirming(true)}
                    disabled={pending}
                    className="mr-auto cursor-pointer border border-red-600 px-5 py-2 text-red-600 disabled:opacity-50"
                  >
                    일정 삭제
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setDate(null)}
                  className="ml-auto cursor-pointer border border-gray-300 px-5 py-2"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={pending || !text.trim()}
                  className="cursor-pointer bg-brand px-5 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  저장
                </button>
              </div>
            </div>
          </div>

          {confirming && (
            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
              <div
                role="alertdialog"
                aria-modal="true"
                aria-label="일정 삭제 확인"
                className="w-full max-w-sm bg-white p-6 text-center"
              >
                <p className="font-bold">{date}</p>
                <p className="mt-2 text-sm text-gray-600">이 일정을 삭제할까요?</p>
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    disabled={pending}
                    className="flex-1 cursor-pointer border border-gray-300 py-2 disabled:opacity-50"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    autoFocus
                    onClick={remove}
                    disabled={pending}
                    className="flex-1 cursor-pointer bg-red-600 py-2 text-white disabled:opacity-50"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
