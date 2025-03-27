import React, { useState } from 'react';
import { X } from 'lucide-react';

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

interface HistoryItem {
  date: string;
  content: string;
  type: 'nickname' | 'register' | 'sell' | 'purchase' | 'delete';
}

interface MemberDetailModalProps {
  member: Member;
  isOpen: boolean;
  onClose: () => void;
}

const MemberDetailModal = ({ member, isOpen, onClose }: MemberDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<'nickname' | 'register' | 'sell' | 'purchase' | 'delete'>('nickname');

  if (!isOpen) return null;

  // 전화번호 마스킹 함수 수정
  const maskPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{3})-(\d{4})-(\d{4})/, "$1-****-$3");
  };

  // 샘플 히스토리 데이터 부분 수정
  const histories: Record<string, HistoryItem[]> = {
    nickname: [
      { date: '2024-03-20', content: '사과농부 → 과수원주인', type: 'nickname' },
      { date: '2024-02-15', content: '과일왕 → 사과농부', type: 'nickname' },
      { date: '2024-01-10', content: '농사왕 → 과일왕', type: 'nickname' },
      { date: '2023-12-25', content: '사과장인 → 농사왕', type: 'nickname' },
      { date: '2023-11-30', content: '과수원지기 → 사과장인', type: 'nickname' }
    ],
    register: [
      { date: '2024-03-15', content: '청송 사과 10kg - 50,000원', type: 'register' },
      { date: '2024-03-10', content: '영주 사과 5kg - 30,000원', type: 'register' },
      { date: '2024-03-08', content: '안동 사과 20kg - 95,000원', type: 'register' },
      { date: '2024-03-05', content: '문경 사과 15kg - 70,000원', type: 'register' },
      { date: '2024-03-01', content: '의성 사과 8kg - 40,000원', type: 'register' },
      { date: '2024-02-28', content: '봉화 사과 12kg - 55,000원', type: 'register' },
      { date: '2024-02-25', content: '예천 사과 7kg - 35,000원', type: 'register' },
      { date: '2024-02-20', content: '영덕 사과 18kg - 85,000원', type: 'register' }
    ],
    sell: [
      { date: '2024-03-18', content: '청송 사과 10kg - 낙찰가 50,000원', type: 'sell' },
      { date: '2024-03-05', content: '영주 사과 5kg - 낙찰가 30,000원', type: 'sell' },
      { date: '2024-03-01', content: '안동 사과 20kg - 낙찰가 98,000원', type: 'sell' },
      { date: '2024-02-28', content: '문경 사과 15kg - 낙찰가 72,000원', type: 'sell' },
      { date: '2024-02-25', content: '의성 사과 8kg - 낙찰가 42,000원', type: 'sell' },
      { date: '2024-02-20', content: '봉화 사과 12kg - 낙찰가 58,000원', type: 'sell' },
      { date: '2024-02-15', content: '예천 사과 7kg - 낙찰가 37,000원', type: 'sell' }
    ],
    purchase: [
      { date: '2024-03-12', content: '상주 배 15kg - 낙찰가 45,000원', type: 'purchase' },
      { date: '2024-02-28', content: '제주 감귤 20kg - 낙찰가 35,000원', type: 'purchase' },
      { date: '2024-02-15', content: '나주 배 10kg - 낙찰가 40,000원', type: 'purchase' },
      { date: '2024-02-10', content: '진영 단감 12kg - 낙찰가 38,000원', type: 'purchase' },
      { date: '2024-02-05', content: '제주 한라봉 8kg - 낙찰가 42,000원', type: 'purchase' },
      { date: '2024-01-30', content: '순천 매실 15kg - 낙찰가 48,000원', type: 'purchase' },
      { date: '2024-01-25', content: '영동 포도 10kg - 낙찰가 52,000원', type: 'purchase' },
      { date: '2024-01-20', content: '김천 자두 7kg - 낙찰가 33,000원', type: 'purchase' }
    ],
    delete: [
      { date: '2024-03-19', content: '청송 사과 20kg - 판매 취소 (시세 하락)', type: 'delete' },
      { date: '2024-03-01', content: '영주 사과 15kg - 판매 취소 (품질 문제)', type: 'delete' },
      { date: '2024-02-25', content: '안동 사과 10kg - 판매 취소 (배송 불가)', type: 'delete' },
      { date: '2024-02-20', content: '문경 사과 8kg - 판매 취소 (재고 소진)', type: 'delete' },
      { date: '2024-02-15', content: '의성 사과 12kg - 판매 취소 (가격 조정)', type: 'delete' },
      { date: '2024-02-10', content: '봉화 사과 15kg - 판매 취소 (농산물 상태)', type: 'delete' }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">회원 상세 정보</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 기본 정보 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">기본 정보</h3>
            <table className="table w-full">
              <tbody>
                <tr>
                  <td className="font-medium w-32">아이디</td>
                  <td>{member.id}</td>
                </tr>
                <tr>
                  <td className="font-medium">닉네임</td>
                  <td>{member.nickname}</td>
                </tr>
                <tr>
                  <td className="font-medium">연락처</td>
                  <td>{maskPhoneNumber(member.phone)}</td>
                </tr>
                <tr>
                  <td className="font-medium">가입일</td>
                  <td>{member.joinDate}</td>
                </tr>
                <tr>
                  <td className="font-medium">최근 접속일</td>
                  <td>{member.lastLoginDate}</td>
                </tr>
                <tr>
                  <td className="font-medium">상태</td>
                  <td>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      member.status === '활성' ? 'bg-green-100 text-green-800' : 
                      member.status === '휴면' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 히스토리 탭 */}
          <div className="border-t pt-6">
            <div className="flex gap-2 mb-4">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'nickname' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setActiveTab('nickname')}
              >
                닉네임 변경 ({histories.nickname.length})
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'register' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setActiveTab('register')}
              >
                등록 물품 ({histories.register.length})
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'sell' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setActiveTab('sell')}
              >
                판매 물품 ({histories.sell.length})
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'purchase' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setActiveTab('purchase')}
              >
                구매 물품 ({histories.purchase.length})
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'delete' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setActiveTab('delete')}
              >
                삭제 물품 ({histories.delete.length})
              </button>
            </div>

            {/* 히스토리 내용 - 스크롤 추가 */}
            <div className="max-h-[300px] overflow-y-auto pr-2">
              <div className="space-y-4">
                {histories[activeTab].map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">{item.date}</div>
                    <div className="text-gray-900">{item.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailModal; 