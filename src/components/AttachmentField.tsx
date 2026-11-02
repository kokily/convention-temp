"use client";

import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import type { AttachmentInput } from "@/lib/upload";
import { putFile } from "@/lib/upload";
import { useState } from "react";
import { createFileUpload } from "@/actions/upload";

type AttachmentFieldProps = {
  files: AttachmentInput[];
  onChange: Dispatch<SetStateAction<AttachmentInput[]>>;
  onBusyChange: (busy: boolean) => void;
};

export function AttachmentField({ files, onChange, onBusyChange }: AttachmentFieldProps) {
  const [error, setError] = useState("");

  const upload = async (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = "";

    if (selected.length === 0) return;

    setError("");
    onBusyChange(true);

    try {
      for (const file of selected) {
        const result = await createFileUpload(file.name, file.size);

        if ("error" in result) {
          setError(result.error ?? "");
          continue;
        }

        await putFile(result.uploadUrl, file, result.contentType);
        onChange((current) => [
          ...current,
          {
            fileName: file.name,
            s3Key: result.s3Key,
            size: file.size,
          },
        ]);
      }
    } catch {
      setError("파일 업로드에 실패했습니다.");
    } finally {
      onBusyChange(false);
    }
  };

  return (
    <div className="border border-gray-300 p-4 text-sm">
      <label className="inline-block cursor-pointer border border-gray-300 bg-gray-50 px-4 py-2">
        첨부파일 추가
        <input type="file" multiple onChange={upload} className="sr-only" />
      </label>

      {error && <p className="mt-2 text-red-600">{error}</p>}

      {files.length > 0 && (
        <ul className="mt-3 space-y-1">
          {files.map((file) => (
            <li key={file.s3Key} className="flex items-center gap-3">
              <span className="min-w-0 flex-1 truncate">{file.fileName}</span>
              <span className="shrink-0 text-gray-500">{(file.size / 1024 / 1024).toFixed(1)}MB</span>
              <button
                type="button"
                onClick={() => onChange((current) => current.filter((f) => f.s3Key !== file.s3Key))}
                className="shrink-0 cursor-pointer text-red-600"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
