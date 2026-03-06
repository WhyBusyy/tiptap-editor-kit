import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { createExtensions } from '../core/extensions';
import { createHandleDrop, createHandlePaste, triggerImageUpload } from '../core/image-handler';
import { defaultImageUpload, type ImageUploadHandler } from '../core/constants';
import TiptapToolbar from './toolbar';

export interface TiptapEditorProps {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  onImageUpload?: ImageUploadHandler;
}

export default function TiptapEditor({
  content,
  setContent,
  onImageUpload,
}: TiptapEditorProps) {
  const uploadFn = onImageUpload ?? defaultImageUpload;

  const editor = useEditor({
    extensions: createExtensions(),
    content,
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => {
      setContent(e.getHTML());
    },
    onBlur: ({ editor: e }) => {
      setContent(e.getHTML());
    },
    editorProps: {
      handleDrop: createHandleDrop(uploadFn),
      handlePaste: createHandlePaste(uploadFn),
    },
  });

  useEffect(() => {
    if (!editor || !content || editor.isFocused) {
      return;
    }
    const currentHTML = editor.getHTML();
    if (currentHTML !== content) {
      (editor.commands.setContent as Function)(content, {
        emitUpdate: false,
        parseOptions: { preserveWhitespace: true },
      });
    }
  }, [editor, content]);

  const handleInsertImage = useCallback(() => {
    if (!editor) {
      return;
    }
    triggerImageUpload(uploadFn, (url) => {
      editor.chain().focus().setImage({ src: url }).run();
    });
  }, [editor, uploadFn]);

  if (!editor) {
    return null;
  }

  return (
    <div className='tiptap-editor-wrapper rounded border border-gray-300'>
      <TiptapToolbar editor={editor} onInsertImage={handleInsertImage} />
      <EditorContent editor={editor} className='tiptap-editor-content' />
    </div>
  );
}
