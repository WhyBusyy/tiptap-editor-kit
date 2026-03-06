export const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];

export const FONT_FAMILIES = ['기본', 'Arial', 'Georgia', 'Courier New', 'Times New Roman'];

export const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#cccccc',
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6',
  '#8b5cf6', '#ec4899', '#0e5c4d', '#1e40af', '#991b1b',
];

export const ICON_SIZE = 16;

export type ImageUploadHandler = (file: File) => Promise<string>;

export const defaultImageUpload: ImageUploadHandler = (file: File) => {
  return Promise.resolve(URL.createObjectURL(file));
};
