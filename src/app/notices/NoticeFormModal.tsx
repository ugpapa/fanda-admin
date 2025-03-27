import React from 'react';
import { X } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  isPopup: boolean;
  isImportant: boolean;
  content: string;
}

interface NoticeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof Notice, value: string | boolean) => void;
  notice: Notice | null;
  editMode: boolean;
}

const NoticeFormModal: React.FC<NoticeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onChange,
  notice,
  editMode,
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

            <div className="flex gap-4">
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