import type { Editor } from '@tiptap/core';
import { FONT_SIZES, FONT_FAMILIES, COLORS, ICON_SIZE } from '../core/constants';

// ═══════════════════════════════════════════════════════════════════
// Vanilla DOM 기반 Tiptap 툴바
// React 없이 순수 DOM API로 동일한 툴바 UI를 렌더링.
// 모든 아이콘은 정적 상수 SVG 마크업이며 외부 입력을 포함하지 않음.
// ═══════════════════════════════════════════════════════════════════

// ─── SVG 아이콘 (정적 상수, XSS 위험 없음) ───
const svgAttrs = `width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;

const ICONS: Record<string, string> = {
  undo: `<svg ${svgAttrs}><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>`,
  redo: `<svg ${svgAttrs}><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>`,
  alignLeft: `<svg ${svgAttrs}><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>`,
  alignCenter: `<svg ${svgAttrs}><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>`,
  alignRight: `<svg ${svgAttrs}><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>`,
  image: `<svg ${svgAttrs}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  link: `<svg ${svgAttrs}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  bulletList: `<svg ${svgAttrs}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>`,
  orderedList: `<svg ${svgAttrs}><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="2" y="8" font-size="7" fill="currentColor" stroke="none" font-weight="bold">1</text><text x="2" y="14" font-size="7" fill="currentColor" stroke="none" font-weight="bold">2</text><text x="2" y="20" font-size="7" fill="currentColor" stroke="none" font-weight="bold">3</text></svg>`,
  blockquote: `<svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>`,
  table: `<svg ${svgAttrs}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`,
  removeFormat: `<svg ${svgAttrs}><path d="M17 3H7l4 8"/><line x1="3" y1="21" x2="21" y2="3"/><path d="M12 15l-3 6"/></svg>`,
};

// ─── DOM 헬퍼 ───
function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string>,
  children?: (Node | string)[],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'className') {
        node.className = v;
      } else {
        node.setAttribute(k, v);
      }
    }
  }
  if (children) {
    for (const child of children) {
      if (typeof child === 'string') {
        node.appendChild(document.createTextNode(child));
      } else {
        node.appendChild(child);
      }
    }
  }
  return node;
}

// 정적 SVG 아이콘 전용 — ICONS 상수만 사용하므로 XSS 위험 없음
function iconBtn(opts: {
  icon: string;
  title: string;
  onClick: () => void;
  isActive?: () => boolean;
}): HTMLButtonElement {
  const button = el('button', { type: 'button', title: opts.title, className: 'tte-btn' });
  const template = document.createElement('template');
  template.innerHTML = opts.icon.trim();
  button.appendChild(template.content);
  button.addEventListener('click', (e) => { e.preventDefault(); opts.onClick(); });
  if (opts.isActive) {
    button.dataset.checkActive = 'true';
    (button as any).__isActive = opts.isActive;
  }
  return button;
}

function textBtn(opts: {
  text: string;
  title: string;
  onClick: () => void;
  isActive?: () => boolean;
  tag?: 'strong' | 'em' | 'u' | 's';
}): HTMLButtonElement {
  const button = el('button', { type: 'button', title: opts.title, className: 'tte-btn' });
  if (opts.tag) {
    const inner = document.createElement(opts.tag);
    inner.textContent = opts.text;
    button.appendChild(inner);
  } else {
    button.textContent = opts.text;
  }
  button.addEventListener('click', (e) => { e.preventDefault(); opts.onClick(); });
  if (opts.isActive) {
    button.dataset.checkActive = 'true';
    (button as any).__isActive = opts.isActive;
  }
  return button;
}

function dividerEl(): HTMLDivElement {
  return el('div', { className: 'tte-divider' });
}

function dropdown(trigger: HTMLButtonElement, panel: HTMLDivElement): HTMLDivElement {
  const wrap = el('div', { className: 'tte-dropdown' });
  panel.classList.add('tte-dropdown-panel');
  panel.style.display = 'none';
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = panel.style.display !== 'none';
    closeAllPanels(wrap.closest('.tte-toolbar') as HTMLElement);
    panel.style.display = isOpen ? 'none' : '';
  });
  wrap.appendChild(trigger);
  wrap.appendChild(panel);
  return wrap;
}

function closeAllPanels(toolbar: HTMLElement | null) {
  if (!toolbar) { return; }
  toolbar.querySelectorAll<HTMLDivElement>('.tte-dropdown-panel').forEach((p) => {
    p.style.display = 'none';
  });
}

function colorPalette(onSelect: (color: string) => void): HTMLDivElement {
  const panel = el('div', { className: 'tte-color-palette' });
  for (const color of COLORS) {
    const swatch = el('button', { type: 'button', title: color, className: 'tte-color-swatch' });
    swatch.style.backgroundColor = color;
    swatch.addEventListener('click', (e) => {
      e.preventDefault();
      onSelect(color);
      panel.style.display = 'none';
    });
    panel.appendChild(swatch);
  }
  return panel;
}

function listPanel(
  items: { label: string; onClick: () => void; style?: Partial<CSSStyleDeclaration>; danger?: boolean }[],
): HTMLDivElement {
  const panel = el('div', { className: 'tte-list-panel' });
  for (const item of items) {
    const b = el('button', { type: 'button', className: `tte-list-item${item.danger ? ' tte-danger' : ''}` });
    b.textContent = item.label;
    if (item.style) { Object.assign(b.style, item.style); }
    b.addEventListener('click', (e) => {
      e.preventDefault();
      item.onClick();
      panel.style.display = 'none';
    });
    panel.appendChild(b);
  }
  return panel;
}

// ═══════════════════════════════════════════════════════════════════
// 툴바 생성 — 메인 export
// ═══════════════════════════════════════════════════════════════════

export function createToolbar(editor: Editor, onInsertImage: () => void): HTMLDivElement {
  const toolbar = el('div', { className: 'tte-toolbar' });

  document.addEventListener('click', (e) => {
    if (!toolbar.contains(e.target as Node)) {
      closeAllPanels(toolbar);
    }
  });

  // ─── 실행취소 / 다시실행 ───
  toolbar.appendChild(iconBtn({ icon: ICONS.undo, title: '실행취소 (Ctrl+Z)', onClick: () => editor.chain().focus().undo().run() }));
  toolbar.appendChild(iconBtn({ icon: ICONS.redo, title: '다시실행 (Ctrl+Y)', onClick: () => editor.chain().focus().redo().run() }));
  toolbar.appendChild(dividerEl());

  // ─── 제목 ───
  for (const level of [1, 2, 3] as const) {
    toolbar.appendChild(textBtn({
      text: `H${level}`, title: `제목 ${level}`,
      onClick: () => editor.chain().focus().toggleHeading({ level }).run(),
      isActive: () => editor.isActive('heading', { level }),
    }));
  }
  toolbar.appendChild(dividerEl());

  // ─── 기본 서식 ───
  toolbar.appendChild(textBtn({ text: 'B', tag: 'strong', title: '굵게 (Ctrl+B)', onClick: () => editor.chain().focus().toggleBold().run(), isActive: () => editor.isActive('bold') }));
  toolbar.appendChild(textBtn({ text: 'I', tag: 'em', title: '기울임 (Ctrl+I)', onClick: () => editor.chain().focus().toggleItalic().run(), isActive: () => editor.isActive('italic') }));
  toolbar.appendChild(textBtn({ text: 'U', tag: 'u', title: '밑줄 (Ctrl+U)', onClick: () => editor.chain().focus().toggleUnderline().run(), isActive: () => editor.isActive('underline') }));
  toolbar.appendChild(textBtn({ text: 'S', tag: 's', title: '취소선', onClick: () => editor.chain().focus().toggleStrike().run(), isActive: () => editor.isActive('strike') }));
  toolbar.appendChild(dividerEl());

  // ─── 폰트 크기 ───
  toolbar.appendChild(dropdown(
    textBtn({ text: '크기 ▾', title: '글자 크기 변경', onClick: () => {} }),
    listPanel(FONT_SIZES.map((size) => ({
      label: size,
      onClick: () => editor.chain().focus().setMark('textStyle', { fontSize: size }).run(),
    }))),
  ));

  // ─── 폰트 패밀리 ───
  toolbar.appendChild(dropdown(
    textBtn({ text: '글꼴 ▾', title: '글꼴 변경', onClick: () => {} }),
    listPanel(FONT_FAMILIES.map((font) => ({
      label: font,
      style: { fontFamily: font === '기본' ? 'inherit' : font } as Partial<CSSStyleDeclaration>,
      onClick: () => {
        if (font === '기본') { editor.chain().focus().unsetFontFamily().run(); }
        else { editor.chain().focus().setFontFamily(font).run(); }
      },
    }))),
  ));

  // ─── 글자색 ───
  toolbar.appendChild(dropdown(
    textBtn({ text: 'A▾', title: '글자 색상 변경', onClick: () => {} }),
    colorPalette((color) => editor.chain().focus().setColor(color).run()),
  ));

  // ─── 배경색 ───
  toolbar.appendChild(dropdown(
    textBtn({ text: 'A▾', title: '글자 배경색 변경', onClick: () => {} }),
    colorPalette((color) => editor.chain().focus().toggleHighlight({ color }).run()),
  ));

  toolbar.appendChild(dividerEl());

  // ─── 정렬 ───
  toolbar.appendChild(iconBtn({ icon: ICONS.alignLeft, title: '왼쪽 정렬', onClick: () => editor.chain().focus().setTextAlign('left').run(), isActive: () => editor.isActive({ textAlign: 'left' }) }));
  toolbar.appendChild(iconBtn({ icon: ICONS.alignCenter, title: '가운데 정렬', onClick: () => editor.chain().focus().setTextAlign('center').run(), isActive: () => editor.isActive({ textAlign: 'center' }) }));
  toolbar.appendChild(iconBtn({ icon: ICONS.alignRight, title: '오른쪽 정렬', onClick: () => editor.chain().focus().setTextAlign('right').run(), isActive: () => editor.isActive({ textAlign: 'right' }) }));
  toolbar.appendChild(dividerEl());

  // ─── 삽입 ───
  toolbar.appendChild(iconBtn({ icon: ICONS.image, title: '이미지 삽입', onClick: onInsertImage }));
  toolbar.appendChild(iconBtn({
    icon: ICONS.link, title: '링크 삽입/제거',
    onClick: () => {
      const url = window.prompt('URL을 입력하세요:');
      if (url) { editor.chain().focus().setLink({ href: url }).run(); }
      else { editor.chain().focus().unsetLink().run(); }
    },
    isActive: () => editor.isActive('link'),
  }));
  toolbar.appendChild(iconBtn({ icon: ICONS.bulletList, title: '글머리 기호 목록', onClick: () => editor.chain().focus().toggleBulletList().run(), isActive: () => editor.isActive('bulletList') }));
  toolbar.appendChild(iconBtn({ icon: ICONS.orderedList, title: '번호 매기기 목록', onClick: () => editor.chain().focus().toggleOrderedList().run(), isActive: () => editor.isActive('orderedList') }));
  toolbar.appendChild(iconBtn({ icon: ICONS.blockquote, title: '인용구 블록', onClick: () => editor.chain().focus().toggleBlockquote().run(), isActive: () => editor.isActive('blockquote') }));

  // ─── 테이블 ───
  toolbar.appendChild(dropdown(
    textBtn({ text: '표 ▾', title: '테이블 삽입/편집', onClick: () => {} }),
    listPanel([
      { label: '테이블 삽입 (3×3)', onClick: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
      { label: '열 추가', onClick: () => editor.chain().focus().addColumnAfter().run() },
      { label: '행 추가', onClick: () => editor.chain().focus().addRowAfter().run() },
      { label: '열 삭제', onClick: () => editor.chain().focus().deleteColumn().run() },
      { label: '행 삭제', onClick: () => editor.chain().focus().deleteRow().run() },
      { label: '셀 병합', onClick: () => editor.chain().focus().mergeCells().run() },
      { label: '셀 분할', onClick: () => editor.chain().focus().splitCell().run() },
      { label: '테이블 삭제', onClick: () => editor.chain().focus().deleteTable().run(), danger: true },
    ]),
  ));

  toolbar.appendChild(dividerEl());

  // ─── 서식 제거 ───
  toolbar.appendChild(iconBtn({ icon: ICONS.removeFormat, title: '모든 서식 제거', onClick: () => editor.chain().focus().unsetAllMarks().clearNodes().run() }));

  // ─── active 상태 업데이트 ───
  const updateActive = () => {
    toolbar.querySelectorAll<HTMLButtonElement>('[data-check-active]').forEach((b) => {
      const isActive = (b as any).__isActive;
      if (isActive) { b.classList.toggle('tte-active', isActive()); }
    });
  };
  editor.on('selectionUpdate', updateActive);
  editor.on('transaction', updateActive);

  return toolbar;
}
