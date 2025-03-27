/** @format */

"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Send,
  User,
  ArrowLeft,
  Filter,
  ChevronDown,
  Download,
  Upload,
  Eye,
  X,
  MessageCircle,
} from "lucide-react";
import AdminLayout from '@/components/layout/AdminLayout';
import Modal from '@/components/common/Modal';

// 상태 배지 색상 매핑
const statusColors = {
  대기중: "warning",
  진행중: "info",
  완료: "success",
  거부: "error",
} as const;

type StatusType = keyof typeof statusColors;

interface Inquiry {
  id: number;
  title: string;
  content: string;
  user_id: string;
  user_name: string;
  category: string;
  created_at: string;
  status: StatusType;
  is_new: boolean;
  replies: Reply[];
  files: File[];
  handler?: {
    admin_id: string;
    admin_name: string;
    action_time: string;
    action: string;
  };
  answer?: string;
}

interface Reply {
  id: number;
  admin_id: string;
  admin_name: string;
  content: string;
  created_at: string;
}

interface File {
  name: string;
  size: string;
  url: string;
}

// 샘플 데이터
const inquiryData: Inquiry[] = [
  {
    id: 1,
    title: "출금 지연 문의",
    content:
      "어제 출금 신청했는데 아직 처리가 안 되었습니다. 언제쯤 처리될까요?",
    user_id: "user123",
    user_name: "홍길동",
    category: "출금문의",
    created_at: "2025-03-22 14:30:24",
    status: "대기중",
    is_new: true,
    replies: [],
    files: [],
  },
  {
    id: 2,
    title: "회원 정보 변경 요청",
    content:
      "전화번호가 변경되어 정보 수정을 요청합니다. 010-1234-5678에서 010-8765-4321로 변경 부탁드립니다.",
    user_id: "betking",
    user_name: "김철수",
    category: "회원정보",
    created_at: "2025-03-21 10:15:37",
    status: "진행중",
    is_new: false,
    handler: {
      admin_id: "admin2",
      admin_name: "이관리",
      action_time: "2025-03-21 11:30:15",
      action: "접수",
    },
    replies: [
      {
        id: 101,
        admin_id: "admin2",
        admin_name: "이관리",
        content:
          "안녕하세요, 고객님. 전화번호 변경 요청 접수되었습니다. 본인 확인 후 처리 도와드리겠습니다. 가입 시 등록한 이메일 주소를 알려주시겠어요?",
        created_at: "2025-03-21 11:35:22",
      },
    ],
    files: [],
  },
];

const InquiryPage = () => {
  const [mounted, setMounted] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>(inquiryData);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<StatusType | "전체">("전체");
  const [replyText, setReplyText] = useState("");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [showInquiryDetail, setShowInquiryDetail] = useState(false);
  const [answer, setAnswer] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 새로운 문의 개수 계산
  const newInquiryCount = inquiries.filter((inquiry) => inquiry.is_new).length;

  // 상태 변경 처리
  const handleStatusChange = (status: StatusType) => {
    if (!selectedInquiry) return;

    const updatedInquiry = {
      ...selectedInquiry,
      status,
      handler: {
        admin_id: "admin1",
        admin_name: "김관리",
        action_time: new Date()
          .toISOString()
          .replace("T", " ")
          .substring(0, 19),
        action: status,
      },
    };

    setInquiries(
      inquiries.map((item) =>
        item.id === updatedInquiry.id ? updatedInquiry : item
      )
    );
    setSelectedInquiry(updatedInquiry);
    setShowStatusMenu(false);
  };

  // 답변 제출
  const handleReplySubmit = () => {
    if (!replyText.trim() || !selectedInquiry) return;

    const newReply = {
      id: Date.now(),
      admin_id: "admin1",
      admin_name: "김관리",
      content: replyText,
      created_at: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    const updatedInquiry = {
      ...selectedInquiry,
      replies: [...selectedInquiry.replies, newReply],
      is_new: false,
      handler: {
        admin_id: "admin1",
        admin_name: "김관리",
        action_time: new Date()
          .toISOString()
          .replace("T", " ")
          .substring(0, 19),
        action: "답변",
      },
      status:
        selectedInquiry.status === "대기중" ? "진행중" : selectedInquiry.status,
    };

    setInquiries(
      inquiries.map((item) =>
        item.id === updatedInquiry.id ? updatedInquiry : item
      )
    );
    setSelectedInquiry(updatedInquiry);
    setReplyText("");
  };

  // 필터링된 문의 목록
  const filteredInquiries = inquiries
    .filter((inquiry) => {
      if (filterStatus !== "전체" && inquiry.status !== filterStatus) {
        return false;
      }

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          inquiry.title.toLowerCase().includes(searchLower) ||
          inquiry.user_id.toLowerCase().includes(searchLower) ||
          inquiry.content.toLowerCase().includes(searchLower) ||
          inquiry.category.toLowerCase().includes(searchLower)
        );
      }

      return true;
    })
    // 내림차순 정렬 추가 (id가 큰 순서대로)
    .sort((a, b) => b.id - a.id);

  const handleAnswerSubmit = () => {
    if (!selectedInquiry || !answer.trim()) return;

    setInquiries(prev => prev.map(inquiry => 
      inquiry.id === selectedInquiry.id 
        ? { ...inquiry, status: '답변완료' as const, answer } 
        : inquiry
    ));

    setIsModalOpen(false);
    setAnswer('');
  };

  const openInquiryModal = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setAnswer(inquiry.answer || '');
    setIsModalOpen(true);
  };

  if (!mounted) {
    return null;
  }

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case "대기중":
        return "bg-yellow-100 text-yellow-800";
      case "진행중":
        return "bg-blue-100 text-blue-800";
      case "완료":
        return "bg-green-100 text-green-800";
      case "거부":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="제목 또는 작성자로 검색"
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <select
            className="select select-bordered w-full"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as StatusType | "전체")}
            aria-label="상태 필터"
          >
            <option value="전체">전체 상태</option>
            {Object.keys(statusColors).map((status) => (
              <option key={status} value={status as StatusType}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="text-center">번호</th>
                <th className="text-center">제목</th>
                <th className="text-center">카테고리</th>
                <th className="text-center">작성자</th>
                <th className="text-center">상태</th>
                <th className="text-center">문의일</th>
                <th className="text-center">답변일</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td className="text-center">{inquiry.id}</td>
                  <td>
                    <button
                      onClick={() => openInquiryModal(inquiry)}
                      className="hover:text-blue-600 hover:underline text-left w-full"
                    >
                      {inquiry.title}
                      {inquiry.is_new && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                          NEW
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="text-center">
                    <span className={`px-2 py-1 text-sm rounded-full ${getStatusColor(inquiry.status)}`}>
                      {inquiry.category}
                    </span>
                  </td>
                  <td className="text-center">{inquiry.user_name}</td>
                  <td className="text-center">
                    <span className={`px-2 py-1 text-sm rounded-full ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="text-center">{inquiry.created_at}</td>
                  <td className="text-center">{inquiry.handler?.action_time || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedInquiry ? `문의 상세 (No. ${selectedInquiry.id})` : "문의 상세"}
        >
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium text-lg mb-2">{selectedInquiry.title}</h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>작성자: {selectedInquiry.user_name}</span>
                  <span>작성일: {selectedInquiry.created_at}</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">문의 내용</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {selectedInquiry.content}
                  </p>
                </div>
              </div>

              {selectedInquiry.replies.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">이전 답변 내역</h3>
                  {selectedInquiry.replies.map((reply) => (
                    <div key={reply.id} className="bg-blue-50 p-4 rounded-lg mb-2">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">{reply.admin_name}</span>
                        <span className="text-gray-600">{reply.created_at}</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <h3 className="font-medium mb-2">답변 작성</h3>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="답변을 입력하세요..."
                  className="w-full h-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  취소
                </button>
                <button
                  onClick={handleAnswerSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  disabled={!answer.trim()}
                >
                  답변 등록
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default InquiryPage;
