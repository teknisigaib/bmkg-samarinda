"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
// 1. Import TextAlign extension
import TextAlign from '@tiptap/extension-text-align';
// 2. Import Icon AlignJustify
import { Bold, Italic, List, ListOrdered, Heading2, AlignJustify } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      // 3. Konfigurasi TextAlign
      TextAlign.configure({
        types: ['heading', 'paragraph'], // Bisa untuk judul dan paragraf biasa
        alignments: ['justify', 'left'], // Kita aktifkan justify (dan left untuk reset)
      }),
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  // Helper untuk mengecek tombol aktif (Diupdate sedikit untuk support text align)
  const isActive = (type: string, options?: any) => 
    editor.isActive(type, options) ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-600";

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      
      {/* --- TOOLBAR --- */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-1 flex-wrap">
        
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${isActive('bold')}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${isActive('italic')}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        {/* Heading 2 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${isActive('heading', { level: 2 })}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${isActive('bulletList')}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        {/* Numbered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${isActive('orderedList')}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>

        {/* --- 4. TOMBOL RATA KANAN KIRI (JUSTIFY) --- */}
        <button
          type="button"
          onClick={() => {
            // Jika sudah justify, kembalikan ke left (unset). Jika belum, set justify.
            if (editor.isActive({ textAlign: 'justify' })) {
                editor.chain().focus().unsetTextAlign().run();
            } else {
                editor.chain().focus().setTextAlign('justify').run();
            }
          }}
          // Cek apakah alignment sekarang adalah justify
          className={`p-2 rounded ${editor.isActive({ textAlign: 'justify' }) ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-600"}`}
          title="Rata Kanan Kiri"
        >
          <AlignJustify className="w-4 h-4" />
        </button>

      </div>

      {/* --- AREA EDITOR --- */}
      <EditorContent editor={editor} />
    </div>
  );
}