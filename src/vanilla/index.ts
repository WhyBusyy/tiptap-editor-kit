import { Editor } from '@tiptap/core';
import { createExtensions } from '../core/extensions';
import { createHandleDrop, createHandlePaste, triggerImageUpload } from '../core/image-handler';
import { defaultImageUpload, type ImageUploadHandler } from '../core/constants';
import { createToolbar } from './toolbar';

// ═══════════════════════════════════════════════════════════════════
// Vanilla JS Tiptap 에디터
// React 없이 순수 JS로 에디터를 생성하는 팩토리 함수.
// createTiptapEditor()로 인스턴스를 만들고, destroy()로 정리.
// ═══════════════════════════════════════════════════════════════════

export interface VanillaTiptapOptions {
  element: HTMLElement;
  content?: string;
  onUpdate?: (html: string) => void;
  onImageUpload?: ImageUploadHandler;
}

export interface TiptapEditorInstance {
  /** tiptap Editor 인스턴스 직접 접근 */
  editor: Editor;
  /** 현재 HTML 반환 */
  getHTML: () => string;
  /** content 설정 */
  setContent: (html: string) => void;
  /** 에디터 및 DOM 정리 */
  destroy: () => void;
}

export function createTiptapEditor(options: VanillaTiptapOptions): TiptapEditorInstance {
  const { element, content = '', onUpdate, onImageUpload } = options;
  const uploadFn = onImageUpload ?? defaultImageUpload;

  // ─── wrapper DOM 구조 ───
  const wrapper = document.createElement('div');
  wrapper.className = 'tiptap-editor-wrapper';

  const editorContainer = document.createElement('div');
  editorContainer.className = 'tiptap-editor-content';

  // ─── tiptap Editor 생성 ───
  const editor = new Editor({
    element: editorContainer,
    extensions: createExtensions(),
    content,
    editorProps: {
      handleDrop: createHandleDrop(uploadFn),
      handlePaste: createHandlePaste(uploadFn),
    },
    onUpdate: ({ editor: e }) => {
      onUpdate?.(e.getHTML());
    },
    onBlur: ({ editor: e }) => {
      onUpdate?.(e.getHTML());
    },
  });

  // ─── 툴바 생성 ───
  const toolbar = createToolbar(editor, () => {
    triggerImageUpload(uploadFn, (url) => {
      editor.chain().focus().setImage({ src: url }).run();
    });
  });

  wrapper.appendChild(toolbar);
  wrapper.appendChild(editorContainer);
  element.appendChild(wrapper);

  return {
    editor,
    getHTML: () => editor.getHTML(),
    setContent: (html: string) => {
      (editor.commands.setContent as Function)(html, {
        emitUpdate: false,
        parseOptions: { preserveWhitespace: true },
      });
    },
    destroy: () => {
      editor.destroy();
      wrapper.remove();
    },
  };
}
