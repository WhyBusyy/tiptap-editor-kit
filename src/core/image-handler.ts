import type { EditorView } from '@tiptap/pm/view';
import type { Slice } from '@tiptap/pm/model';
import type { ImageUploadHandler } from './constants';

export function createHandleDrop(uploadFn: ImageUploadHandler) {
  return (view: EditorView, event: DragEvent, _slice: Slice, moved: boolean): boolean => {
    if (moved || !event.dataTransfer?.files?.length) {
      return false;
    }

    const file = event.dataTransfer.files[0];
    if (!file.type.startsWith('image/')) {
      return false;
    }

    event.preventDefault();
    uploadFn(file).then((url) => {
      const { tr } = view.state;
      const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
      if (pos) {
        const node = view.state.schema.nodes.image.create({ src: url });
        view.dispatch(tr.insert(pos.pos, node));
      }
    });
    return true;
  };
}

export function createHandlePaste(uploadFn: ImageUploadHandler) {
  return (view: EditorView, event: ClipboardEvent): boolean => {
    const items = event.clipboardData?.items;
    if (!items) {
      return false;
    }

    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file) {
          uploadFn(file).then((url) => {
            const { tr, selection } = view.state;
            const node = view.state.schema.nodes.image.create({ src: url });
            view.dispatch(tr.insert(selection.anchor, node));
          });
        }
        return true;
      }
    }
    return false;
  };
}

export function triggerImageUpload(
  uploadFn: ImageUploadHandler,
  onComplete: (url: string) => void,
) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async () => {
    const file = input.files?.[0];
    if (file) {
      const url = await uploadFn(file);
      onComplete(url);
    }
  };
  input.click();
}
