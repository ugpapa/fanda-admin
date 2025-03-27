/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from 'date-fns';
import Link from 'next/link';
import React from 'react';

interface ProductActivity {
  id: number;
  type: "registered" | "bidded" | "won" | "failed";
  productName: string;
  productId: number;
  price: number;
  status: string;
  createdAt: string;
  details?: {
    [key: string]: any;
  };
}

// 임시 데이터
const mockActivities: ProductActivity[] = [
  {
    id: 1,
    type: "registered",
    productName: "명품 가방",
    productId: 101,
    price: 1000000,
    status: "판매중",
    createdAt: "2024-03-20 14:30:00",
    details: {
      category: "가방",
      description: "새상품입니다."
    }
  },
  {
    id: 2,
    type: "bidded",
    productName: "스마트폰",
    productId: 102,
    price: 500000,
    status: "입찰완료",
    createdAt: "2024-03-19 11:20:00",
    details: {
      bidAmount: 550000,
      rank: 2
    }
  },
  {
    id: 3,
    type: "won",
    productName: "노트북",
    productId: 103,
    price: 2000000,
    status: "낙찰완료",
    createdAt: "2024-03-18 09:15:00",
    details: {
      finalPrice: 2200000,
      seller: "홍길동"
    }
  },
  {
    id: 4,
    type: "failed",
    productName: "시계",
    productId: 104,
    price: 300000,
    status: "유찰",
    createdAt: "2024-03-18 09:00:00",
    details: {
      reason: "최소 입찰가 미달"
    }
  },
];

// 더 많은 샘플 데이터 생성
for (let i = 5; i <= 50; i++) {
  const types: ProductActivity["type"][] = ["registered", "bidded", "won", "failed"];
  const type = types[Math.floor(Math.random() * types.length)];
  mockActivities.push({
    id: i,
    type,
    productName: `상품 ${i}`,
    productId: 100 + i,
    price: Math.floor(Math.random() * 10000000),
    status: type === "registered" ? "판매중" : 
           type === "bidded" ? "입찰완료" :
           type === "won" ? "낙찰완료" : "유찰",
    createdAt: `2024-03-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
    details: {
      category: ["가방", "전자제품", "의류", "주얼리"][Math.floor(Math.random() * 4)],
      description: "상품 설명입니다."
    }
  });
}

export default function MemberProductsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activities, setActivities] = useState<ProductActivity[]>(mockActivities);
  const [filteredActivities, setFilteredActivities] = useState<ProductActivity[]>(mockActivities);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<ProductActivity["type"] | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const itemsPerPage = 10;

  // 필터링 적용
  useEffect(() => {
    let filtered = [...activities];

    // 활동 유형 필터
    if (selectedType !== "all") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    // 검색어 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.productName.toLowerCase().includes(query) ||
          item.productId.toString().includes(query)
      );
    }

    // 날짜순 정렬
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredActivities(filtered);
    setCurrentPage(1);
  }, [activities, selectedType, searchQuery]);

  const pageCount = Math.ceil(filteredActivities.length / itemsPerPage);
  const currentItems = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getTypeStyle = (type: ProductActivity["type"]) => {
    switch (type) {
      case "registered":
        return "bg-blue-100 text-blue-800";
      case "bidded":
        return "bg-yellow-100 text-yellow-800";
      case "won":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeText = (type: ProductActivity["type"]) => {
    switch (type) {
      case "registered":
        return "등록";
      case "bidded":
        return "입찰";
      case "won":
        return "낙찰";
      case "failed":
        return "유찰";
      default:
        return type;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="뒤로 가기"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">등록된 상품 관리</h1>
          <p className="text-sm text-gray-500 mt-1">
            회원이 등록한 상품 목록을 확인할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상품 상태
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as ProductActivity["type"] | "all")}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="상품 상태 선택"
              >
                <option value="all">전체</option>
                <option value="registered">판매중</option>
                <option value="bidded">입찰중</option>
                <option value="won">판매완료</option>
                <option value="failed">판매중지</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상품 검색
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="상품명 또는 상품번호로 검색"
                  className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="상품 검색"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">상품명</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">상품번호</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">가격</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">상태</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">일시</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.map((item) => (
                <React.Fragment key={item.id}>
                  <tr
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setShowDetails(showDetails === item.id ? null : item.id)}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getTypeStyle(
                          item.type
                        )}`}
                      >
                        {getTypeText(item.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Link 
                        href={`/products/${item.productId}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.productName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">{item.productId}</td>
                    <td className="px-4 py-3 text-sm">
                      {item.price.toLocaleString()}원
                    </td>
                    <td className="px-4 py-3 text-sm">{item.status}</td>
                    <td className="px-4 py-3 text-sm">{item.createdAt}</td>
                  </tr>
                  {showDetails === item.id && item.details && (
                    <tr>
                      <td colSpan={6} className="px-4 py-3 bg-gray-50">
                        <div className="text-sm space-y-1">
                          <h4 className="font-medium mb-2">상세 정보</h4>
                          {Object.entries(item.details).map(([key, value]) => (
                            <div key={key} className="flex gap-2">
                              <span className="font-medium">{key}:</span>
                              <span>{value}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {pageCount > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                총 {filteredActivities.length}개 중 {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredActivities.length)}개 표시
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                title="이전 페이지"
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
                title="다음 페이지"
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