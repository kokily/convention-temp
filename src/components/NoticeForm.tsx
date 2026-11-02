"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveNotice } from "@/actions/notice";
import { RichEditor } from "./RichEditor";
import { listQuery } from "@/lib/query";

type NoticeFormProps = {
  id?: number;
  page?: number;
  initialTitle?: string;
  initialHtml?: string;
};

export function NoticeForm({ id, page = 1, initialTitle = "", initialHtml = "" }: NoticeFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [html, setHtml] = useState(initialHtml);
  const [error, action, pending] = useActionState(saveNotice.bind(null, id ?? null, page), null);

  return (
    <form action={action} className="mx-auto w-full max-w-5xl space-y-4 px-4 py-8">
      <input
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
        aria-label="제목"
        className="h-12 w-full border border-gray-300 px-4"
      />
      <RichEditor value={initialHtml} onChange={setHtml} />
      <input type="hidden" name="contentHtml" value={html} />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2">
        <Link href={`/admin/notice${listQuery(undefined, page)}`} className="border border-gray-300 px-6 py-2">
          취소
        </Link>
        <button disabled={pending} className="cursor-pointer bg-brand px-6 py-2 text-white disabled:opacity-50">
          저장
        </button>
      </div>
    </form>
  );
}
