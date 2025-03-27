import React from 'react';
import { X, Eye, Image as ImageIcon, Maximize2 } from 'lucide-react';

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

            {notice.imageUrl && (
              <div className="relative group">
                <img
                  src={notice.imageUrl}
                  alt="공지사항 이미지"
                  className="w-full max-h-96 object-contain rounded-lg"
                />
                <a
                  href={notice.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all">
                  <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            )}

            <div className="border-t border-gray-200 my-4"></div>
            <div className="whitespace-pre-wrap text-gray-600">
              {notice.content}
            </div>

            {notice.isPopup && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2 flex items-center gap-2">
                  <Maximize2 className="w-4 h-4" />
                  팝업 설정
                </h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">팝업 크기:</span>
                    <span className="ml-2">{notice.popupWidth} x {notice.popupHeight}px</span>
                  </div>
                  <div>
                    <span className="text-gray-500">팝업 위치:</span>
                    <span className="ml-2">
                      {notice.popupPosition === 'center' && '화면 중앙'}
                      {notice.popupPosition === 'top' && '화면 상단'}
                      {notice.popupPosition === 'bottom' && '화면 하단'}
                    </span>
                  </div>
                </div>
              </div>
            )}
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