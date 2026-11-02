"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveNotice } from "@/actions/notice";
import { RichEditor } from "./RichEditor";
import { listQuery } from "@/lib/query";
import { AttachmentInput } from "@/lib/upload";
import { AttachmentField } from "./AttachmentField";

type NoticeFormProps = {
  id?: number;
  page?: number;
  initialTitle?: string;
  initialHtml?: string;
  initialFiles?: AttachmentInput[];
};

export function NoticeForm({ id, page = 1, initialTitle = "", initialHtml = "", initialFiles = [] }: NoticeFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [html, setHtml] = useState(initialHtml);
  const [files, setFiles] = useState(initialFiles);
  const [editorBusy, setEditorBusy] = useState(false);
  const [filesBusy, setFilesBusy] = useState(false);
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
      <RichEditor value={initialHtml} onChange={setHtml} onBusyChange={setEditorBusy} />
      <input type="hidden" name="contentHtml" value={html} />

      <AttachmentField files={files} onChange={setFiles} onBusyChange={setFilesBusy} />
      <input type="hidden" name="attachments" value={JSON.stringify(files)} />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2">
        <Link href={`/admin/notice${listQuery(undefined, page)}`} className="border border-gray-300 px-6 py-2">
          취소
        </Link>
        <button
          disabled={pending || editorBusy || filesBusy}
          className="cursor-pointer bg-brand px-6 py-2 text-white disabled:opacity-50"
        >
          저장
        </button>
      </div>
    </form>
  );
}
