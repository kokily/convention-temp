"use client";

import { useRef, useState } from "react";
import Image from "@tiptap/extension-image";
import { TextSelection } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { createImageUpload } from "@/actions/upload";
import { putFile } from "@/lib/upload";

type RichEditorProps = {
  value: string;
  onChange: (html: string) => void;
  onBusyChange: (busy: boolean) => void;
};

const imageFiles = (list?: FileList | null) => Array.from(list ?? []).filter((file) => file.type.startsWith("image/"));

export function RichEditor({ value, onChange, onBusyChange }: RichEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const insertImages = async (view: EditorView, files: File[]) => {
    setError("");
    setUploading(true);
    onBusyChange(true);

    try {
      for (const file of files) {
        const result = await createImageUpload(file.type, file.size);

        if ("error" in result) {
          setError(result.error ?? "");
          continue;
        }

        await putFile(result.uploadUrl, file, file.type);

        const node = view.state.schema.nodes.image.create({ src: result.publicUrl, alt: file.name });
        view.dispatch(view.state.tr.replaceSelectionWith(node));
      }
    } catch {
      setError("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
      onBusyChange(false);
    }
  };

  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] } }), Image],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "notice-content min-h-80 p-4 outline-none" },
      handleDrop: (view, event, _slice, moved) => {
        if (moved || !event.dataTransfer?.files.length) return false;

        event.preventDefault();

        const files = imageFiles(event.dataTransfer.files);
        if (files.length === 0) {
          setError("본문에는 이미지만 넣을 수 있습니다. 문서는 첨부파일로 추가해주세요.");
          return true;
        }

        const dropped = view.posAtCoords({ left: event.clientX, top: event.clientY });
        if (dropped) {
          const selection = TextSelection.near(view.state.doc.resolve(dropped.pos));
          view.dispatch(view.state.tr.setSelection(selection));
        }

        insertImages(view, files);
        return true;
      },
      handlePaste: (view, event) => {
        const files = imageFiles(event.clipboardData?.files);
        if (files.length === 0) return false;

        event.preventDefault();
        insertImages(view, files);
        return true;
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const buttons = [
    { label: "B", run: () => editor?.chain().focus().toggleBold().run() },
    { label: "I", run: () => editor?.chain().focus().toggleItalic().run() },
    { label: "제목", run: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "목록", run: () => editor?.chain().focus().toggleBulletList().run() },
    { label: "번호", run: () => editor?.chain().focus().toggleOrderedList().run() },
    { label: "이미지", run: () => inputRef.current?.click() },
  ];

  return (
    <div className="border border-gray-300">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-300 bg-gray-50 p-2">
        {buttons.map((b) => (
          <button
            key={b.label}
            type="button"
            onClick={b.run}
            className="cursor-pointer border border-gray-300 bg-white px-3 py-1 text-sm"
          >
            {b.label}
          </button>
        ))}
        {uploading && <span className="ml-2 text-sm text-gray-500">이미지 업로드 중...</span>}
        {error && <span className="ml-2 text-sm text-red-600">{error}</span>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = imageFiles(e.target.files);
          e.target.value = "";
          if (editor && files.length > 0) insertImages(editor.view, files);
        }}
      />

      <EditorContent editor={editor} />
    </div>
  );
}
