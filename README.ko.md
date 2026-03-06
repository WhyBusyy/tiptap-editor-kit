# tiptap-editor-kit

[![NPM](https://img.shields.io/npm/v/tiptap-editor-kit.svg)](https://www.npmjs.com/package/tiptap-editor-kit)

`tiptap-editor-kit` | Tiptap 기반 커스텀 WYSIWYG 에디터. React 컴포넌트와 Vanilla JS 팩토리를 하나의 패키지로 제공합니다.

[English](./README.md)

## Features

- **React & Vanilla JS** — 하나의 패키지에서 두 가지 방식 모두 지원
- **풀 툴바** — 제목, 서식, 폰트, 색상, 정렬, 이미지, 링크, 리스트, 테이블, 서식 제거
- **이미지 업로드** — 드래그 & 드롭 / 붙여넣기 / 버튼 클릭 3가지 방식
- **커스텀 업로드 핸들러** — `onImageUpload` prop으로 S3 등 외부 업로드 연동
- **TypeScript** — 완전한 타입 지원 (d.ts 포함)
- **ESM & CJS** — 두 가지 모듈 포맷 동시 지원

---

## 설치

```bash
npm install tiptap-editor-kit
```

## Peer Dependencies

React 버전을 사용할 경우 아래 패키지가 필요합니다:

```bash
npm install react react-dom
```

**참고**: Vanilla JS 버전만 사용한다면 `react`, `react-dom` 설치는 필요하지 않습니다. (optional peer dependency)

---

# React

React 프로젝트에서 컴포넌트로 사용합니다.

## 기본 사용법

```tsx
import { useState } from 'react';
import TiptapEditor from 'tiptap-editor-kit';
import 'tiptap-editor-kit/styles.css';

function App() {
  const [content, setContent] = useState('<p>Hello World</p>');

  return <TiptapEditor content={content} setContent={setContent} />;
}
```

## 커스텀 이미지 업로드

```tsx
import { useState } from 'react';
import TiptapEditor from 'tiptap-editor-kit';
import 'tiptap-editor-kit/styles.css';

function App() {
  const [content, setContent] = useState('');

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const { url } = await res.json();
    return url;
  };

  return (
    <TiptapEditor
      content={content}
      setContent={setContent}
      onImageUpload={handleImageUpload}
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `content` | `string` | Yes | — | 에디터에 표시할 HTML 문자열 |
| `setContent` | `Dispatch<SetStateAction<string>>` | Yes | — | content 상태 업데이트 함수 |
| `onImageUpload` | `(file: File) => Promise<string>` | No | `URL.createObjectURL` | 이미지 파일을 받아 URL을 반환하는 업로드 핸들러 |

---

# Vanilla JS

React 없이 순수 JavaScript/TypeScript 프로젝트에서 사용합니다.

## 기본 사용법

```ts
import { createTiptapEditor } from 'tiptap-editor-kit/vanilla';
import 'tiptap-editor-kit/styles.css';
import 'tiptap-editor-kit/vanilla.css';

const instance = createTiptapEditor({
  element: document.getElementById('editor')!,
  content: '<p>Hello World</p>',
  onUpdate: (html) => {
    console.log('Updated:', html);
  },
});
```

## 커스텀 이미지 업로드

```ts
import { createTiptapEditor } from 'tiptap-editor-kit/vanilla';
import 'tiptap-editor-kit/styles.css';
import 'tiptap-editor-kit/vanilla.css';

const instance = createTiptapEditor({
  element: document.getElementById('editor')!,
  content: '',
  onUpdate: (html) => {
    document.getElementById('output')!.textContent = html;
  },
  onImageUpload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const { url } = await res.json();
    return url;
  },
});
```

## Options

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `element` | `HTMLElement` | Yes | — | 에디터를 마운트할 DOM 요소 |
| `content` | `string` | No | `''` | 초기 HTML 콘텐츠 |
| `onUpdate` | `(html: string) => void` | No | — | 에디터 내용 변경 시 콜백 |
| `onImageUpload` | `(file: File) => Promise<string>` | No | `URL.createObjectURL` | 이미지 업로드 핸들러 |

## 인스턴스 메서드

| Method | Return | Description |
| --- | --- | --- |
| `getHTML()` | `string` | 현재 에디터 HTML 반환 |
| `setContent(html)` | `void` | 에디터 콘텐츠를 설정 |
| `destroy()` | `void` | 에디터 및 DOM 정리 |
| `editor` | `Editor` | tiptap Editor 인스턴스 직접 접근 |

---

## CSS Import

사용 환경에 따라 필요한 CSS를 import합니다:

| Import 경로 | 설명 | React | Vanilla |
| --- | --- | --- | --- |
| `tiptap-editor-kit/styles.css` | 에디터 콘텐츠 영역 스타일 (제목, 목록, 표, 인용 등) | 필수 | 필수 |
| `tiptap-editor-kit/vanilla.css` | 툴바 UI 스타일 (Tailwind 없이 동작) | — | 필수 |

**참고**: React 버전은 툴바에 Tailwind CSS 클래스를 사용합니다. 프로젝트에 Tailwind가 설정되어 있어야 툴바가 정상적으로 표시됩니다.

---

## 툴바 기능

| 그룹 | 기능 |
| --- | --- |
| **히스토리** | 실행취소, 다시실행 |
| **제목** | H1, H2, H3 |
| **서식** | 굵게, 기울임, 밑줄, 취소선 |
| **폰트** | 글자 크기 (12~32px), 글꼴 (Arial, Georgia 등) |
| **색상** | 글자 색상, 배경 색상 (15색 팔레트) |
| **정렬** | 왼쪽, 가운데, 오른쪽 |
| **삽입** | 이미지, 링크, 글머리 기호 목록, 번호 목록, 인용구 |
| **테이블** | 삽입, 행/열 추가·삭제, 셀 병합·분할, 테이블 삭제 |
| **기타** | 서식 제거 |

---

## 프로젝트 구조

```
src/
├── core/                    # 공유 모듈
│   ├── constants.ts         #   색상, 폰트, 타입 정의
│   ├── extensions.ts        #   Tiptap extensions 설정
│   └── image-handler.ts     #   드롭 / 붙여넣기 / 파일선택 핸들러
├── react/                   # React 버전
│   ├── index.tsx            #   TiptapEditor 컴포넌트
│   └── toolbar.tsx          #   JSX 툴바
├── vanilla/                 # Vanilla JS 버전
│   ├── index.ts             #   createTiptapEditor() 팩토리
│   ├── toolbar.ts           #   DOM 기반 툴바
│   └── vanilla.css          #   툴바 스타일 (Tailwind 불필요)
├── tiptap.css               #   에디터 콘텐츠 영역 스타일 (공유)
├── index.tsx                # React entry point
└── vanilla.ts               # Vanilla entry point
```

---

## 라이선스

이 패키지는 [MIT 라이선스](LICENSE)에 따라 배포됩니다.
