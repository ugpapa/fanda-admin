"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Edit, History, KeyRound, X, ChevronLeft, ChevronRight, MoreVertical, Eye, Trash2, User, Package, ListFilter, Users, Pencil, Ban, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import Image from "next/image";
import MemberDetailModal from './MemberDetailModal';

const AdminLayout = dynamic(() => import('@/components/layout/AdminLayout'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

// 상수 정의
const DEFAULT_PROFILE_IMAGE = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="%23E2E8F0"/></svg>';
// 또는
const DEFAULT_PROFILE_IMAGE_SVG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="%23E2E8F0"/></svg>'; // SVG 기본 이미지

interface Member {
  id: string;
  nickname: string;
  phone: string;
  registeredItems: number;
  soldItems: number;
  purchasedItems: number;
  joinDate: string;
  lastLoginDate: string;
  status: '활성' | '휴면' | '탈퇴';
}

interface MemberHistory {
  type: "registration" | "auction" | "chat" | "failed" | "nickname";
  title: string;
  date: string;
  details: string;
  previousValue?: string;
  newValue?: string;
}

type TabType = "전체" | "활성" | "휴면" | "정지" | "탈퇴";

const MemberPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("전체");
  const [showHistory, setShowHistory] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [historyTab, setHistoryTab] = useState(0);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPasswordResetDialog, setShowPasswordResetDialog] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const itemsPerPage = 5;
  const [showHistoryMenu, setShowHistoryMenu] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const editDialogRef = useRef<HTMLDialogElement>(null);
  const passwordResetDialogRef = useRef<HTMLDialogElement>(null);
  const historyDialogRef = useRef<HTMLDialogElement>(null);

  const router = useRouter();

  useEffect(() => {
    setMembers(initialMembers);
  }, []);

  // 회원 상태별 카운트
  const memberCounts = {
    all: members.length,
    active: members.filter(m => !m.withdrawalDate).length,
    withdrawn: members.filter(m => m.withdrawalDate).length
  };

  // 필터링된 회원 목록
  useEffect(() => {
    const filtered = members.filter(member => {
      const matchesSearch = searchTerm === "" || 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = activeTab === "전체" || member.status === activeTab;
      
      return matchesSearch && matchesTab;
    });
    setFilteredMembers(filtered);
  }, [searchTerm, activeTab, members]);

  useEffect(() => {
    if (showEditDialog) {
      editDialogRef.current?.showModal();
    } else {
      editDialogRef.current?.close();
    }
  }, [showEditDialog]);

  useEffect(() => {
    if (showPasswordResetDialog) {
      passwordResetDialogRef.current?.showModal();
    } else {
      passwordResetDialogRef.current?.close();
    }
  }, [showPasswordResetDialog]);

  useEffect(() => {
    if (showHistory) {
      historyDialogRef.current?.showModal();
    } else {
      historyDialogRef.current?.close();
    }
  }, [showHistory]);

  // 샘플 데이터
  const initialMembers: Member[] = [
    {
      id: "user1",
      nickname: "사과농부",
      phone: "010-1234-5678",
      registeredItems: 15,
      soldItems: 10,
      purchasedItems: 5,
      joinDate: "2024-01-15",
      lastLoginDate: "2024-03-20",
      status: "활성"
    },
    {
      id: "user2",
      nickname: "배농장",
      phone: "010-9876-5432",
      registeredItems: 8,
      soldItems: 3,
      purchasedItems: 2,
      joinDate: "2024-02-20",
      lastLoginDate: "2024-03-19",
      status: "활성"
    },
    {
      id: "user3",
      nickname: "귤농장",
      phone: "010-5555-4444",
      registeredItems: 20,
      soldItems: 15,
      purchasedItems: 0,
      joinDate: "2023-12-01",
      lastLoginDate: "2023-12-25",
      status: "휴면"
    },
    {
      id: "user4",
      nickname: "포도농장",
      phone: "010-7777-8888",
      registeredItems: 5,
      soldItems: 2,
      purchasedItems: 1,
      joinDate: "2024-01-10",
      lastLoginDate: "2024-02-01",
      status: "탈퇴"
    }
  ];

  // 샘플 히스토리 데이터
  const memberHistories: Record<string, MemberHistory[]> = {
    "1": [
      {
        type: "nickname",
        title: "닉네임 변경",
        date: "2024-03-23",
        details: "닉네임이 변경되었습니다.",
        previousValue: "홍길동",
        newValue: "홍홍홍",
      },
      {
        type: "registration",
        title: "상품 등록",
        date: "2024-03-22",
        details: "명품 가방 등록",
      },
      {
        type: "auction",
        title: "경매 낙찰",
        date: "2024-03-21",
        details: "시계 경매 낙찰",
      },
      {
        type: "chat",
        title: "채팅 기록",
        date: "2024-03-20",
        details: "상품 문의 채팅",
      },
      {
        type: "failed",
        title: "유찰 기록",
        date: "2024-03-19",
        details: "가방 경매 유찰",
      },
    ],
  };

  const maskPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{3})-(\d{4})-(\d{4})/, "$1-****-$3");
  };

  const handleHistoryClick = (e: React.MouseEvent, member: Member) => {
    e.stopPropagation();
    setSelectedMember(member);
    setShowHistoryMenu(showHistoryMenu === member.id ? null : member.id);
  };

  const handleHistoryMenuClick = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    if (selectedMember) {
      router.push(`/members/${selectedMember.id}/${path}`);
    }
    setShowHistoryMenu(null);
  };

  const handleEditClick = (member: Member) => {
    setSelectedMember(member);
    setShowEditDialog(true);
  };

  const handlePasswordResetClick = (member: Member) => {
    setSelectedMember(member);
    setShowPasswordResetDialog(true);
  };

  const getHistoryByType = (type: MemberHistory["type"]) => {
    if (!selectedMember) return { items: [], total: 0 };
    const histories =
      memberHistories[selectedMember.id]?.filter((h) => h.type === type) || [];
    const startIndex = (historyPage - 1) * itemsPerPage;
    return {
      items: histories.slice(startIndex, startIndex + itemsPerPage),
      total: histories.length,
    };
  };

  const tabs = [
    { 
      id: '전체', 
      label: '전체회원', 
      count: members.length 
    },
    { 
      id: '활성', 
      label: '활성회원', 
      count: members.filter(m => m.status === '활성').length 
    },
    { 
      id: '휴면', 
      label: '휴면회원', 
      count: members.filter(m => m.status === '휴면').length 
    },
    { 
      id: '탈퇴', 
      label: '탈퇴회원', 
      count: members.filter(m => m.status === '탈퇴').length 
    }
  ];

  const handleDetailClick = (member: Member) => {
    setSelectedMember(member);
    setShowDetailModal(true);
  };

  // 회원 상태별 카운트 계산
  const getMemberCount = (status: string) => {
    if (status === 'all') return members.length;
    return members.filter(m => m.status === status).length;
  };

  return (
    <>
      <AdminLayout>
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-6 h-6 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-800">회원 관리</h1>
          </div>

          <div className="bg-white rounded-lg shadow mb-6">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id 
                        ? 'text-orange-500 bg-orange-50' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab(tab.id as TabType)}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="회원명 또는 이메일로 검색"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  <ListFilter className="w-4 h-4" />
                  필터
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">아이디(닉네임)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">연락처</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록 물품</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">판매 물품</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구매 물품</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">최근 접속일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{member.id}</div>
                          <div className="text-sm text-gray-500">({member.nickname})</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {maskPhoneNumber(member.phone)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.registeredItems}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.soldItems}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.purchasedItems}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.joinDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.lastLoginDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDetailClick(member)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors" 
                          title="상세보기"
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button 
                          onClick={() => handleEditClick(member)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors" 
                          title="수정"
                        >
                          <Pencil className="w-4 h-4 text-gray-500" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors" 
                          title="메일 발송"
                        >
                          <Mail className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 회원 정보 수정 모달 */}
          <dialog 
            ref={editDialogRef}
            className='modal'>
            <div className='fixed inset-0 flex items-center justify-center z-50'>
              <div className='bg-white rounded-lg p-6 w-full max-w-3xl'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='font-bold text-lg'>회원 정보 수정</h3>
                  <button
                    className='p-2 hover:bg-gray-100 rounded'
                    onClick={() => setShowEditDialog(false)}>
                    <X className='h-4 w-4' />
                  </button>
                </div>
                <div className='grid grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        이름
                      </label>
                      <input
                        type='text'
                        className='w-full border rounded px-3 py-2'
                        defaultValue={selectedMember?.name}
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        닉네임
                      </label>
                      <input
                        type='text'
                        className='w-full border rounded px-3 py-2'
                        defaultValue={selectedMember?.nickname}
                      />
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        전화번호
                      </label>
                      <input
                        type='text'
                        className='w-full border rounded px-3 py-2'
                        defaultValue={selectedMember?.phone}
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        이메일
                      </label>
                      <input
                        type='email'
                        className='w-full border rounded px-3 py-2'
                        defaultValue={selectedMember?.email}
                      />
                    </div>
                  </div>
                </div>
                <div className='mt-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    상태
                  </label>
                  <select
                    className='w-full border rounded px-3 py-2'
                    defaultValue={selectedMember?.status}>
                    <option value='활성'>활성</option>
                    <option value='휴면'>휴면</option>
                    <option value='정지'>정지</option>
                    <option value='탈퇴'>탈퇴</option>
                  </select>
                </div>
                <div className='flex justify-end gap-2 mt-6'>
                  <button 
                    className='px-4 py-2 border rounded hover:bg-gray-100'
                    onClick={() => setShowEditDialog(false)}>
                    취소
                  </button>
                  <button 
                    className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                    저장
                  </button>
                </div>
              </div>
            </div>
          </dialog>

          {/* 비밀번호 초기화 모달 */}
          <dialog 
            ref={passwordResetDialogRef}
            className='modal'>
            <div className='fixed inset-0 flex items-center justify-center z-50'>
              <div className='bg-white rounded-lg p-6 w-full max-w-md'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='font-bold text-lg'>비밀번호 초기화</h3>
                  <button
                    className='p-2 hover:bg-gray-100 rounded'
                    onClick={() => setShowPasswordResetDialog(false)}>
                    <X className='h-4 w-4' />
                  </button>
                </div>
                <p className='py-4'>
                  {selectedMember?.name} 회원의 비밀번호를 초기화하시겠습니까?
                  <br />
                  초기화된 비밀번호는 회원의 이메일로 전송됩니다.
                </p>
                <div className='flex justify-end gap-2'>
                  <button 
                    className='px-4 py-2 border rounded hover:bg-gray-100'
                    onClick={() => setShowPasswordResetDialog(false)}>
                    취소
                  </button>
                  <button 
                    className='px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600'>
                    초기화
                  </button>
                </div>
              </div>
            </div>
          </dialog>

          {/* 회원 히스토리 모달 */}
          <dialog 
            ref={historyDialogRef}
            className='modal'>
            <div className='fixed inset-0 flex items-center justify-center z-50'>
              <div className='bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='font-bold text-lg'>
                    {selectedMember?.name} 회원 히스토리
                  </h3>
                  <button
                    className='p-2 hover:bg-gray-100 rounded'
                    onClick={() => setShowHistory(false)}>
                    <X className='h-4 w-4' />
                  </button>
                </div>
                <div className='flex gap-2 mb-6'>
                  <button
                    className={`px-4 py-2 rounded ${
                      historyTab === 0 ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      setHistoryTab(0);
                      setHistoryPage(1);
                    }}>
                    닉네임 변경
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${
                      historyTab === 1 ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      setHistoryTab(1);
                      setHistoryPage(1);
                    }}>
                    등록 물건
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${
                      historyTab === 2 ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      setHistoryTab(2);
                      setHistoryPage(1);
                    }}>
                    낙찰 물건
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${
                      historyTab === 3 ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      setHistoryTab(3);
                      setHistoryPage(1);
                    }}>
                    채팅 기록
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${
                      historyTab === 4 ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      setHistoryTab(4);
                      setHistoryPage(1);
                    }}>
                    유찰 기록
                  </button>
                </div>
                <div className='mt-6'>
                  {getHistoryByType(historyTab).items.map((history) => (
                    <div key={history.date} className="mb-4">
                      <div className="font-semibold">{history.title}</div>
                      <div className="text-sm text-gray-500">{history.date}</div>
                      <div className="text-sm text-gray-500">{history.details}</div>
                    </div>
                  ))}
                </div>
                <div className='flex justify-end gap-2 mt-6'>
                  <button 
                    className='px-4 py-2 border rounded hover:bg-gray-100'
                    onClick={() => setShowHistory(false)}>
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </dialog>

          {showDetailModal && selectedMember && (
            <MemberDetailModal
              member={selectedMember}
              isOpen={showDetailModal}
              onClose={() => setShowDetailModal(false)}
            />
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default MemberPage;