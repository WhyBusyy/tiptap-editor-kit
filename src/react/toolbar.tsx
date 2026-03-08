import { useCallback, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { FONT_SIZES, FONT_FAMILIES, COLORS, ICON_SIZE } from '../core/constants';

// ─── Inline style constants ───

const S = {
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid #d1d5db',
    backgroundColor: '#f9fafb',
    padding: '6px',
  },
  btn: {
    display: 'flex',
    height: '32px',
    minWidth: '32px',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    padding: '0 6px',
    fontSize: '14px',
    border: 'none',
    background: 'none',
    color: '#4b5563',
    cursor: 'pointer',
    lineHeight: 1,
    transition: 'background-color 0.15s, color 0.15s',
  } as React.CSSProperties,
  btnActive: {
    backgroundColor: '#d1fae5',
    color: '#047857',
    boxShadow: '0 0 0 1px #6ee7b7',
  },
  divider: {
    width: '1px',
    height: '24px',
    margin: '0 4px',
    backgroundColor: '#d1d5db',
  },
  dropdown: {
    position: 'relative' as const,
  },
  dropdownPanel: {
    position: 'absolute' as const,
    left: 0,
    top: '100%',
    zIndex: 50,
    marginTop: '4px',
    minWidth: '160px',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    backgroundColor: '#fff',
    padding: '4px 0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  listItem: {
    display: 'block',
    width: '100%',
    padding: '6px 12px',
    border: 'none',
    background: 'none',
    textAlign: 'left' as const,
    fontSize: '14px',
    cursor: 'pointer',
    color: '#374151',
  },
  colorPalette: {
    position: 'absolute' as const,
    left: 0,
    top: '100%',
    zIndex: 50,
    marginTop: '4px',
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '4px',
    width: '180px',
    padding: '8px',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  colorSwatch: {
    width: '24px',
    height: '24px',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: 0,
  },
  colorIndicator: {
    marginLeft: '2px',
    display: 'inline-block',
    height: '4px',
    width: '12px',
    backgroundColor: '#ef4444',
  },
  bgIndicator: {
    borderRadius: '2px',
    backgroundColor: '#fef08a',
    padding: '0 4px',
  },
  caret: {
    marginLeft: '2px',
    fontSize: '10px',
  },
};

const btnStyle = (active?: boolean): React.CSSProperties => ({
  ...S.btn,
  ...(active ? S.btnActive : {}),
});

// ─── SVG Icons ───

function IconUndo() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M3 7v6h6' />
      <path d='M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13' />
    </svg>
  );
}

function IconRedo() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M21 7v6h-6' />
      <path d='M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13' />
    </svg>
  );
}

function IconAlignLeft() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <line x1='17' y1='10' x2='3' y2='10' /><line x1='21' y1='6' x2='3' y2='6' />
      <line x1='21' y1='14' x2='3' y2='14' /><line x1='17' y1='18' x2='3' y2='18' />
    </svg>
  );
}

function IconAlignCenter() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <line x1='18' y1='10' x2='6' y2='10' /><line x1='21' y1='6' x2='3' y2='6' />
      <line x1='21' y1='14' x2='3' y2='14' /><line x1='18' y1='18' x2='6' y2='18' />
    </svg>
  );
}

function IconAlignRight() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <line x1='21' y1='10' x2='7' y2='10' /><line x1='21' y1='6' x2='3' y2='6' />
      <line x1='21' y1='14' x2='3' y2='14' /><line x1='21' y1='18' x2='7' y2='18' />
    </svg>
  );
}

function IconImage() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
      <circle cx='8.5' cy='8.5' r='1.5' />
      <polyline points='21 15 16 10 5 21' />
    </svg>
  );
}

function IconLink() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
      <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
    </svg>
  );
}

function IconBulletList() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <line x1='8' y1='6' x2='21' y2='6' /><line x1='8' y1='12' x2='21' y2='12' />
      <line x1='8' y1='18' x2='21' y2='18' />
      <circle cx='4' cy='6' r='1' fill='currentColor' />
      <circle cx='4' cy='12' r='1' fill='currentColor' />
      <circle cx='4' cy='18' r='1' fill='currentColor' />
    </svg>
  );
}

function IconOrderedList() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <line x1='10' y1='6' x2='21' y2='6' /><line x1='10' y1='12' x2='21' y2='12' />
      <line x1='10' y1='18' x2='21' y2='18' />
      <text x='2' y='8' fontSize='7' fill='currentColor' stroke='none' fontWeight='bold'>1</text>
      <text x='2' y='14' fontSize='7' fill='currentColor' stroke='none' fontWeight='bold'>2</text>
      <text x='2' y='20' fontSize='7' fill='currentColor' stroke='none' fontWeight='bold'>3</text>
    </svg>
  );
}

function IconBlockquote() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox='0 0 24 24' fill='currentColor'>
      <path d='M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z' />
    </svg>
  );
}

function IconTable() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <rect x='3' y='3' width='18' height='18' rx='2' />
      <line x1='3' y1='9' x2='21' y2='9' /><line x1='3' y1='15' x2='21' y2='15' />
      <line x1='9' y1='3' x2='9' y2='21' /><line x1='15' y1='3' x2='15' y2='21' />
    </svg>
  );
}

function IconRemoveFormat() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M17 3H7l4 8' />
      <line x1='3' y1='21' x2='21' y2='3' />
      <path d='M12 15l-3 6' />
    </svg>
  );
}

// ─── Toolbar ───

interface ToolbarProps {
  editor: Editor;
  onInsertImage: () => void;
}

export default function TiptapToolbar({ editor, onInsertImage }: ToolbarProps) {
  const [showFontSize, setShowFontSize] = useState(false);
  const [showFontFamily, setShowFontFamily] = useState(false);
  const [showFontColor, setShowFontColor] = useState(false);
  const [showBgColor, setShowBgColor] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);

  const fontSizeRef = useRef<HTMLDivElement>(null);
  const fontFamilyRef = useRef<HTMLDivElement>(null);
  const fontColorRef = useRef<HTMLDivElement>(null);
  const bgColorRef = useRef<HTMLDivElement>(null);
  const tableMenuRef = useRef<HTMLDivElement>(null);

  const closeAllDropdowns = useCallback(() => {
    setShowFontSize(false);
    setShowFontFamily(false);
    setShowFontColor(false);
    setShowBgColor(false);
    setShowTableMenu(false);
  }, []);

  const toggleDropdown = useCallback(
    (setter: React.Dispatch<React.SetStateAction<boolean>>, current: boolean) => {
      closeAllDropdowns();
      if (!current) setter(true);
    },
    [closeAllDropdowns],
  );

  const handleLink = useCallback(() => {
    const url = window.prompt('URL을 입력하세요:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
  }, [editor]);

  const handleRemoveFormat = useCallback(() => {
    editor.chain().focus().unsetAllMarks().clearNodes().run();
  }, [editor]);

  return (
    <div style={S.toolbar}>
      {/* ─── 실행취소 / 다시실행 ─── */}
      <button type='button' style={btnStyle()} onClick={() => editor.chain().focus().undo().run()} title='실행취소 (Ctrl+Z)'>
        <IconUndo />
      </button>
      <button type='button' style={btnStyle()} onClick={() => editor.chain().focus().redo().run()} title='다시실행 (Ctrl+Y)'>
        <IconRedo />
      </button>

      <Divider />

      {/* ─── 제목 ─── */}
      <button type='button' style={btnStyle(editor.isActive('heading', { level: 1 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title='제목 1'>
        H1
      </button>
      <button type='button' style={btnStyle(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title='제목 2'>
        H2
      </button>
      <button type='button' style={btnStyle(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title='제목 3'>
        H3
      </button>

      <Divider />

      {/* ─── 기본 서식 ─── */}
      <button type='button' style={btnStyle(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()} title='굵게 (Ctrl+B)'>
        <strong>B</strong>
      </button>
      <button type='button' style={btnStyle(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()} title='기울임 (Ctrl+I)'>
        <em>I</em>
      </button>
      <button type='button' style={btnStyle(editor.isActive('underline'))} onClick={() => editor.chain().focus().toggleUnderline().run()} title='밑줄 (Ctrl+U)'>
        <u>U</u>
      </button>
      <button type='button' style={btnStyle(editor.isActive('strike'))} onClick={() => editor.chain().focus().toggleStrike().run()} title='취소선'>
        <s>S</s>
      </button>

      <Divider />

      {/* ─── 폰트 크기 ─── */}
      <div style={S.dropdown} ref={fontSizeRef}>
        <button type='button' style={btnStyle()} onClick={() => toggleDropdown(setShowFontSize, showFontSize)} title='글자 크기 변경'>
          크기 ▾
        </button>
        {showFontSize && (
          <DropdownPanel>
            {FONT_SIZES.map((size) => (
              <ListItem key={size} onClick={() => { (editor.commands as any).setFontSize(size); setShowFontSize(false); }}>
                {size}
              </ListItem>
            ))}
          </DropdownPanel>
        )}
      </div>

      {/* ─── 폰트 패밀리 ─── */}
      <div style={S.dropdown} ref={fontFamilyRef}>
        <button type='button' style={btnStyle()} onClick={() => toggleDropdown(setShowFontFamily, showFontFamily)} title='글꼴 변경'>
          글꼴 ▾
        </button>
        {showFontFamily && (
          <DropdownPanel>
            {FONT_FAMILIES.map((font) => (
              <ListItem
                key={font}
                style={{ fontFamily: font === '기본' ? 'inherit' : font }}
                onClick={() => {
                  if (font === '기본') { editor.chain().focus().unsetFontFamily().run(); }
                  else { editor.chain().focus().setFontFamily(font).run(); }
                  setShowFontFamily(false);
                }}
              >
                {font}
              </ListItem>
            ))}
          </DropdownPanel>
        )}
      </div>

      {/* ─── 글자색 ─── */}
      <div style={S.dropdown} ref={fontColorRef}>
        <button type='button' style={btnStyle()} onClick={() => toggleDropdown(setShowFontColor, showFontColor)} title='글자 색상 변경'>
          A<span style={S.colorIndicator} />▾
        </button>
        {showFontColor && (
          <ColorPalette onSelect={(color) => { editor.chain().focus().setColor(color).run(); setShowFontColor(false); }} />
        )}
      </div>

      {/* ─── 배경색 ─── */}
      <div style={S.dropdown} ref={bgColorRef}>
        <button type='button' style={btnStyle()} onClick={() => toggleDropdown(setShowBgColor, showBgColor)} title='글자 배경색 변경'>
          <span style={S.bgIndicator}>A</span>▾
        </button>
        {showBgColor && (
          <ColorPalette onSelect={(color) => { editor.chain().focus().toggleHighlight({ color }).run(); setShowBgColor(false); }} />
        )}
      </div>

      <Divider />

      {/* ─── 정렬 ─── */}
      <button type='button' style={btnStyle(editor.isActive({ textAlign: 'left' }))} onClick={() => editor.chain().focus().setTextAlign('left').run()} title='왼쪽 정렬'>
        <IconAlignLeft />
      </button>
      <button type='button' style={btnStyle(editor.isActive({ textAlign: 'center' }))} onClick={() => editor.chain().focus().setTextAlign('center').run()} title='가운데 정렬'>
        <IconAlignCenter />
      </button>
      <button type='button' style={btnStyle(editor.isActive({ textAlign: 'right' }))} onClick={() => editor.chain().focus().setTextAlign('right').run()} title='오른쪽 정렬'>
        <IconAlignRight />
      </button>

      <Divider />

      {/* ─── 삽입 ─── */}
      <button type='button' style={btnStyle()} onClick={onInsertImage} title='이미지 삽입'>
        <IconImage />
      </button>
      <button type='button' style={btnStyle(editor.isActive('link'))} onClick={handleLink} title='링크 삽입/제거'>
        <IconLink />
      </button>
      <button type='button' style={btnStyle(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()} title='글머리 기호 목록'>
        <IconBulletList />
      </button>
      <button type='button' style={btnStyle(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title='번호 매기기 목록'>
        <IconOrderedList />
      </button>
      <button type='button' style={btnStyle(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()} title='인용구 블록'>
        <IconBlockquote />
      </button>

      {/* ─── 테이블 ─── */}
      <div style={S.dropdown} ref={tableMenuRef}>
        <button type='button' style={btnStyle()} onClick={() => toggleDropdown(setShowTableMenu, showTableMenu)} title='테이블 삽입/편집'>
          <IconTable />
          <span style={S.caret}>▾</span>
        </button>
        {showTableMenu && (
          <DropdownPanel>
            <ListItem onClick={() => { editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); setShowTableMenu(false); }}>
              테이블 삽입 (3x3)
            </ListItem>
            <ListItem onClick={() => { editor.chain().focus().addColumnAfter().run(); setShowTableMenu(false); }}>열 추가</ListItem>
            <ListItem onClick={() => { editor.chain().focus().addRowAfter().run(); setShowTableMenu(false); }}>행 추가</ListItem>
            <ListItem onClick={() => { editor.chain().focus().deleteColumn().run(); setShowTableMenu(false); }}>열 삭제</ListItem>
            <ListItem onClick={() => { editor.chain().focus().deleteRow().run(); setShowTableMenu(false); }}>행 삭제</ListItem>
            <ListItem onClick={() => { editor.chain().focus().mergeCells().run(); setShowTableMenu(false); }}>셀 병합</ListItem>
            <ListItem onClick={() => { editor.chain().focus().splitCell().run(); setShowTableMenu(false); }}>셀 분할</ListItem>
            <ListItem style={{ color: '#ef4444' }} onClick={() => { editor.chain().focus().deleteTable().run(); setShowTableMenu(false); }}>
              테이블 삭제
            </ListItem>
          </DropdownPanel>
        )}
      </div>

      <Divider />

      {/* ─── 서식 제거 ─── */}
      <button type='button' style={btnStyle()} onClick={handleRemoveFormat} title='모든 서식 제거'>
        <IconRemoveFormat />
      </button>
    </div>
  );
}

// ─── Sub-components ───

function Divider() {
  return <div style={S.divider} />;
}

function DropdownPanel({ children }: { children: React.ReactNode }) {
  return <div style={S.dropdownPanel}>{children}</div>;
}

function ListItem({ children, onClick, style }: { children: React.ReactNode; onClick: () => void; style?: React.CSSProperties }) {
  return (
    <button
      type='button'
      style={{ ...S.listItem, ...style }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ColorPalette({ onSelect }: { onSelect: (color: string) => void }) {
  return (
    <div style={S.colorPalette}>
      {COLORS.map((color) => (
        <button
          key={color}
          type='button'
          style={{ ...S.colorSwatch, backgroundColor: color }}
          onClick={() => onSelect(color)}
          title={color}
        />
      ))}
    </div>
  );
}
