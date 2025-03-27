/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Search } from 'lucide-react';

interface HistoryItem {
  id: string;
  type: string;
  description: string;
  date: string;
}

// 임시 데이터 (더 많은 데이터 추가)
const mockHistory: HistoryItem[] = [
  {
    id: "1",
    type: "login",
    description: "로그인",
    date: "2024-03-20 14:30:00",
  },
  {
    id: "2",
    type: "profile_update",
    description: "프로필 정보 수정",
    date: "2024-03-19 11:20:00",
  },
  {
    id: "3",
    type: "password_change",
    description: "비밀번호 변경",
    date: "2024-03-18 09:15:00",
  },
  {
    id: "4",
    type: "logout",
    description: "로그아웃",
    date: "2024-03-18 09:00:00",
  },
];

// 더 많은 샘플 데이터 생성
for (let i = 5; i <= 50; i++) {
  mockHistory.push({
    id: i.toString(),
    type: ["login", "logout", "profile_update", "password_change"][Math.floor(Math.random() * 4)],
    description: "활동 내역",
    date: `2024-03-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
  });
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  // 비동기 함수로 변경
  const history = await fetchMemberHistory(params.id); // 예시 함수
  
  const router = useRouter();
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>(mockHistory);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<HistoryItem["type"] | "all">("all");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const itemsPerPage = 10;

  // 필터링 적용
  useEffect(() => {
    let filtered = [...history];

    // 활동 유형 필터
    if (selectedType !== "all") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    // 날짜 범위 필터
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        end.setHours(23, 59, 59); // 종료일 마지막 시간으로 설정
        return itemDate >= start && itemDate <= end;
      });
    }

    // 날짜순 정렬
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredHistory(filtered);
    setCurrentPage(1); // 필터 변경시 첫 페이지로 이동
  }, [history, selectedType, dateRange]);

  const pageCount = Math.ceil(filteredHistory.length / itemsPerPage);
  const currentItems = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    const headers = ["활동 유형", "설명", "일시"];
    const csvContent = [
      headers.join(","),
      ...filteredHistory.map((item) =>
        [
          item.type,
          item.description,
          item.date,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `회원활동내역_${params.id}_${format(new Date(), 'yyyyMMdd')}.csv`;
    link.click();
  };

  const getTypeStyle = (type: HistoryItem["type"]) => {
    switch (type) {
      case "login":
        return "bg-green-100 text-green-800";
      case "logout":
        return "bg-gray-100 text-gray-800";
      case "profile_update":
        return "bg-blue-100 text-blue-800";
      case "password_change":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeText = (type: HistoryItem["type"]) => {
    switch (type) {
      case "login":
        return "로그인";
      case "logout":
        return "로그아웃";
      case "profile_update":
        return "프로필 수정";
      case "password_change":
        return "비밀번호 변경";
      default:
        return type;
    }
  };

  const handleHistoryUpdate = (updatedHistory: HistoryItem) => {
    // 여기에 업데이트 로직을 추가해야 합니다.
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="뒤로 가기"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">회원 활동 내역</h1>
          <p className="text-sm text-gray-500 mt-1">
            회원의 로그인, 정보 수정 등 주요 활동 내역을 확인할 수 있습니다.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 text-sm font-medium"
          title="CSV 내보내기"
        >
          <Download className="w-4 h-4" />
          CSV 내보내기
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                활동 유형
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as HistoryItem["type"] | "all")}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체</option>
                <option value="login">로그인</option>
                <option value="logout">로그아웃</option>
                <option value="profile_update">프로필 수정</option>
                <option value="password_change">비밀번호 변경</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시작일
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                종료일
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">활동 유형</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">설명</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">일시</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.map((item) => (
                <>
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setShowDetails(showDetails === item.id ? null : item.id)}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getTypeStyle(
                          item.type as HistoryItem["type"]
                        )}`}
                      >
                        {getTypeText(item.type as HistoryItem["type"])}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{item.description}</td>
                    <td className="px-4 py-3 text-sm">{item.date}</td>
                  </tr>
                  {showDetails === item.id && (
                    <tr>
                      <td colSpan={3} className="px-4 py-3 bg-gray-50">
                        <div className="text-sm space-y-1">
                          <h4 className="font-medium mb-2">상세 정보</h4>
                          {/* 상세 정보 표시 로직 추가 */}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {pageCount > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                총 {filteredHistory.length}개 중 {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredHistory.length)}개 표시
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                let pageNum;
                if (pageCount <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= pageCount - 2) {
                  pageNum = pageCount - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
                disabled={currentPage === pageCount}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 필요한 경우 fetchMemberHistory 함수 정의
async function fetchMemberHistory(memberId: string) {
  // API 호출 또는 데이터 가져오기 로직
  return mockHistory; // mockHistory 데이터 반환
} 