import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Member {
  id: string;
  nickname: string;
  email: string;
  phone: string;
  status: string;
  // ... 다른 필요한 속성들
}

interface MemberEditModalProps {
  member: Member;
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Member) => void;
}

interface FormData {
  nickname: string;
  email: string;
  phone: string;
}

const MemberEditModal = ({ member, isOpen, onClose, onSave }: MemberEditModalProps) => {
  const [formData, setFormData] = useState({
    nickname: member.nickname,
    email: member.email,
    phone: member.phone,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API 호출 및 데이터 업데이트 로직
    onSave(member);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[500px]">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">회원 정보 수정</h2>
          <button 
            onClick={onClose} 
            className="btn btn-ghost btn-sm"
            title="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">닉네임</span>
            </label>
            <input
              type="text"
              title="닉네임"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">이메일</span>
            </label>
            <input
              type="email"
              title="이메일"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">연락처</span>
            </label>
            <input
              type="text"
              title="연락처"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">비밀번호 초기화</span>
            </label>
            <button type="button" className="btn btn-warning">
              비밀번호 초기화
            </button>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              취소
            </button>
            <button type="submit" className="btn btn-primary">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberEditModal; 