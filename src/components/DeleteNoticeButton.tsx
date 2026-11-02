"use client";

import { deleteNotice } from "@/actions/notice";
import { useEffect, useState, useTransition } from "react";

export function DeleteNoticeButton({ id, title }: { id: number; title: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const remove = () => {
    startTransition(async () => {
      await deleteNotice(id);
      setOpen(false);
    });
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="cursor-pointer text-red-600">
        삭제
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-label="게시글 삭제 확인"
            className="w-full max-w-sm bg-white p-6 text-center"
          >
            <p className="truncate font-bold">{title}</p>
            <p className="mt-2 text-sm text-gray-600">이 게시글을 삭제할까요?</p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
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
  );
}
