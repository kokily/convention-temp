"use client";

import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";

type RichEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

export function RichEditor({ value, onChange }: RichEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] } })],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "notice-content min-h-80 p-4 outline-none" },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const buttons = [
    { label: "B", run: () => editor?.chain().focus().toggleBold().run() },
    { label: "I", run: () => editor?.chain().focus().toggleItalic().run() },
    { label: "제목", run: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "목록", run: () => editor?.chain().focus().toggleBulletList().run() },
    { label: "번호", run: () => editor?.chain().focus().toggleOrderedList().run() },
  ];

  return (
    <div className="border border-gray-300">
      <div className="flex flex-wrap gap-1 border-b border-gray-300 bg-gray-50 p-2">
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
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
