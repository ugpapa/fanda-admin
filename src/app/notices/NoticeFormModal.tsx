import React from 'react';
import { X, Upload } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  isPopup: boolean;
  isImportant: boolean;
  content: string;
  imageUrl?: string;
  popupWidth?: number;
  popupHeight?: number;
  popupPosition?: 'center' | 'top' | 'bottom';
}

interface NoticeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof Notice, value: string | boolean | number) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  notice: Notice | null;
  editMode: boolean;
  imagePreview?: string;
  popupWidth: number;
  popupHeight: number;
  popupPosition: 'center' | 'top' | 'bottom';
  onPopupWidthChange: (value: number) => void;
  onPopupHeightChange: (value: number) => void;
  onPopupPositionChange: (value: 'center' | 'top' | 'bottom') => void;
}

const NoticeFormModal: React.FC<NoticeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onChange,
  onImageChange,
  notice,
  editMode,
  imagePreview,
  popupWidth,
  popupHeight,
  popupPosition,
  onPopupWidthChange,
  onPopupHeightChange,
  onPopupPositionChange,
}) => {
  if (!isOpen || !notice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">
              {editMode ? "공지사항 수정" : "공지사항 작성"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="닫기">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="제목"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={notice.title}
                onChange={(e) => onChange("title", e.target.value)}
              />
            </div>
            
            <div>
              <textarea
                placeholder="내용"
                className="w-full px-4 py-2 border border-gray-300 rounded h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={notice.content}
                onChange={(e) => onChange("content", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={notice.isPopup}
                    onChange={(e) => onChange("isPopup", e.target.checked)}
                  />
                  <span>팝업 공지</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={notice.isImportant}
                    onChange={(e) => onChange("isImportant", e.target.checked)}
                  />
                  <span>중요 공지</span>
                </label>
              </div>

              {notice.isPopup && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        팝업 너비
                      </label>
                      <input
                        type="number"
                        value={popupWidth}
                        onChange={(e) => onPopupWidthChange(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        min="200"
                        max="1200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        팝업 높이
                      </label>
                      <input
                        type="number"
                        value={popupHeight}
                        onChange={(e) => onPopupHeightChange(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        min="200"
                        max="800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      팝업 위치
                    </label>
                    <select
                      value={popupPosition}
                      onChange={(e) => onPopupPositionChange(e.target.value as 'center' | 'top' | 'bottom')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option value="center">화면 중앙</option>
                      <option value="top">화면 상단</option>
                      <option value="bottom">화면 하단</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이미지 업로드
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-5 h-5 text-gray-500" />
                    <span>이미지 선택</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onImageChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <div className="relative w-32 h-32">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => onChange("imageUrl", "")}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors">
                {editMode ? "수정" : "작성"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoticeFormModal; 