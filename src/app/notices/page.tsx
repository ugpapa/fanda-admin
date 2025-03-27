/** @format */

"use client";

import React, { useState, useEffect } from "react";
import { Search, Edit, Trash2, Plus, Bell } from "lucide-react";
import dynamic from 'next/dynamic';
import AdminLayout from '@/components/layout/AdminLayout';
import Modal from '@/components/common/Modal';

interface Notice {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  createdAt: string;
  views: number;
  isPopup: boolean;
  isImportant: boolean;
  content: string;
}

// 모달 컴포넌트를 동적으로 임포트
const NoticeDetailModal = dynamic(() => import('./NoticeDetailModal').then(mod => mod.default), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

const NoticeFormModal = dynamic(() => import('./NoticeFormModal').then(mod => mod.default), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

// 초기 데이터
const initialNotices: Notice[] = [
  {
    id: "1",
    title: "시스템 점검 안내",
    author: "관리자",
    authorRole: "일반관리자",
    createdAt: "2024-03-22",
    views: 156,
    isPopup: true,
    isImportant: true,
    content: "정기 시스템 점검이 진행될 예정입니다.",
  },
  {
    id: "2",
    title: "베팅 규정 변경 안내",
    author: "운영자",
    authorRole: "최고관리자",
    createdAt: "2024-03-21",
    views: 89,
    isPopup: false,
    isImportant: false,
    content: "베팅 규정이 변경되었습니다.",
  },
];

const NoticePage = () => {
  const [mounted, setMounted] = useState(false);
  const [showNoticeDetail, setShowNoticeDetail] = useState(false);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("전체공지");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNotices(initialNotices);
  }, []);

  const formatDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const handleNoticeClick = (notice: Notice) => {
    setSelectedNotice(notice);
    setShowNoticeDetail(true);
  };

  const handleNewNotice = () => {
    setEditMode(false);
    setSelectedNotice({
      id: "",
      title: "",
      author: "관리자",
      authorRole: "일반관리자",
      createdAt: formatDate(),
      views: 0,
      isPopup: false,
      isImportant: false,
      content: "",
    });
    setShowNoticeForm(true);
  };

  const handleEditNotice = (notice: Notice) => {
    setEditMode(true);
    setSelectedNotice(notice);
    setShowNoticeForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedNotice?.title || !selectedNotice?.content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    if (editMode) {
      // 공지사항 수정
      setNotices(notices.map(notice => 
        notice.id === selectedNotice.id ? selectedNotice : notice
      ));
    } else {
      // 새 공지사항 작성
      const newNotice = {
        ...selectedNotice,
        id: (Math.max(...notices.map(n => parseInt(n.id))) + 1).toString(),
        author: "관리자",
        authorRole: "일반관리자",
        createdAt: formatDate(),
        views: 0,
      };
      setNotices([newNotice, ...notices]);
    }

    setShowNoticeForm(false);
    setSelectedNotice(null);
  };

  const handleInputChange = (
    field: keyof Notice,
    value: string | boolean
  ) => {
    if (selectedNotice) {
      setSelectedNotice({
        ...selectedNotice,
        [field]: value,
      });
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;

    const newNotice: Notice = {
      id: Date.now().toString(),
      title: title.trim(),
      author: "관리자",
      authorRole: "일반관리자",
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      views: 0,
      isPopup: false,
      isImportant: isImportant,
      content: content.trim(),
    };

    setNotices(prev => [newNotice, ...prev]);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setIsImportant(false);
    setIsModalOpen(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <Bell className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-800">공지사항</h1>
        </div>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex gap-4 items-center flex-1 max-w-2xl'>
            <select
              className='select select-bordered w-[180px]'
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              aria-label='공지사항 분류'>
              <option value='전체공지'>전체공지</option>
              <option value='일반공지'>일반공지</option>
              <option value='중요공지'>중요공지</option>
              <option value='팝업공지'>팝업공지</option>
            </select>

            <div className='relative flex-1'>
              <input
                type='text'
                placeholder='공지사항 검색'
                className='input input-bordered w-full pr-10'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                title='검색'>
                <Search className='w-5 h-5' />
              </button>
            </div>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='table'>
            <thead>
              <tr>
                <th className="text-center">번호</th>
                <th className="text-center">제목</th>
                <th className="text-center">작성자</th>
                <th className="text-center">작성일</th>
                <th className="text-center">조회수</th>
                <th className="text-center">팝업</th>
                <th className="text-center">관리</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice.id} className='hover'>
                  <td className="text-center">
                    {notice.id}
                  </td>
                  <td
                    className='cursor-pointer hover:text-primary'
                    onClick={() => handleNoticeClick(notice)}>
                    {notice.title}
                    {notice.isImportant && (
                      <span className='inline-flex items-center rounded-full px-2 py-0.5 ml-2 text-[10px] font-medium bg-yellow-100 text-yellow-800'>중요</span>
                    )}
                  </td>
                  <td className="text-center">
                    {`${notice.author}(${notice.authorRole})`}
                  </td>
                  <td className="text-center">{notice.createdAt}</td>
                  <td className="text-center">{notice.views}</td>
                  <td className="text-center">
                    <div
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        notice.isPopup ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                      {notice.isPopup ? "사용" : "미사용"}
                    </div>
                  </td>
                  <td>
                    <div className='flex gap-2 justify-center'>
                      <button
                        className='btn btn-ghost btn-sm'
                        onClick={() => handleEditNotice(notice)}
                        title='수정'>
                        <Edit className='w-4 h-4' />
                      </button>
                      <button
                        className='btn btn-ghost btn-sm text-error'
                        title='삭제'>
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mounted && showNoticeDetail && (
          <NoticeDetailModal
            isOpen={showNoticeDetail}
            onClose={() => setShowNoticeDetail(false)}
            notice={selectedNotice}
          />
        )}

        {mounted && showNoticeForm && (
          <NoticeFormModal
            isOpen={showNoticeForm}
            onClose={() => setShowNoticeForm(false)}
            onSubmit={handleFormSubmit}
            onChange={handleInputChange}
            notice={selectedNotice}
            editMode={editMode}
          />
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={resetForm}
          title="공지사항 작성"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="공지사항 제목을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="공지사항 내용을 입력하세요"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="important"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="important" className="ml-2 block text-sm text-gray-900">
                중요 공지사항으로 등록
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={!title.trim() || !content.trim()}
              >
                등록
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default NoticePage;
