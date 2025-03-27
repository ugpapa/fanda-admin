import React from 'react';
import { X, Eye } from 'lucide-react';

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

interface NoticeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: Notice | null;
}

const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({
  isOpen,
  onClose,
  notice,
}) => {
  if (!isOpen || !notice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">공지사항 상세</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold">{notice.title}</h4>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                  {notice.author}
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                  {notice.createdAt}
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded text-sm flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {notice.views}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-200 my-4"></div>
            <div className="whitespace-pre-wrap text-gray-600">
              {notice.content}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetailModal; 