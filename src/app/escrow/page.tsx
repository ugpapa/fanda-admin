"use client";

import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useState } from "react";
import { Search, Eye, Download, CreditCard } from "lucide-react";

interface Escrow {
  id: number;
  escrowNumber: string;
  seller: string;
  buyer: string;
  productName: string;
  amount: number;
  status: "입금대기" | "입금완료" | "출고대기" | "출고완료" | "구매확정" | "거래취소";
  createdAt: string;
}

const initialEscrows: Escrow[] = [
  {
    id: 1,
    escrowNumber: "ES2024-001",
    seller: "판매자1",
    buyer: "구매자1",
    productName: "제주 감귤 10kg",
    amount: 35000,
    status: "입금완료",
    createdAt: "2024-03-24",
  },
  {
    id: 2,
    escrowNumber: "ES2024-002",
    seller: "판매자2",
    buyer: "구매자2",
    productName: "프리미엄 한라봉 5kg",
    amount: 45000,
    status: "구매확정",
    createdAt: "2024-03-24",
  },
];

const EscrowPage = () => {
  const [escrows, setEscrows] = useState<Escrow[]>(initialEscrows);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Escrow["status"]>("all");

  // 필터링된 에스크로 목록
  const filteredEscrows = escrows.filter(escrow => {
    const matchesSearch = 
      searchTerm === "" || 
      escrow.escrowNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      escrow.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      escrow.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      escrow.productName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || escrow.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Escrow["status"]) => {
    switch (status) {
      case "입금대기":
        return "bg-yellow-100 text-yellow-800";
      case "입금완료":
        return "bg-blue-100 text-blue-800";
      case "출고대기":
        return "bg-purple-100 text-purple-800";
      case "출고완료":
        return "bg-indigo-100 text-indigo-800";
      case "구매확정":
        return "bg-green-100 text-green-800";
      case "거래취소":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <CreditCard className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-800">에스크로 관리</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="거래번호, 판매자, 구매자, 상품명으로 검색"
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <select
            className="select select-bordered w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | Escrow["status"])}
            aria-label="거래 상태 필터"
          >
            <option value="all">전체 상태</option>
            <option value="입금대기">입금대기</option>
            <option value="입금완료">입금완료</option>
            <option value="출고대기">출고대기</option>
            <option value="출고완료">출고완료</option>
            <option value="구매확정">구매확정</option>
            <option value="거래취소">거래취소</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="text-center">거래번호</th>
                <th className="text-center">판매자</th>
                <th className="text-center">구매자</th>
                <th className="text-center">상품명</th>
                <th className="text-center">거래금액</th>
                <th className="text-center">상태</th>
                <th className="text-center">거래일</th>
                <th className="text-center">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredEscrows.map((escrow) => (
                <tr key={escrow.id}>
                  <td className="text-center">{escrow.escrowNumber}</td>
                  <td className="text-center">{escrow.seller}</td>
                  <td className="text-center">{escrow.buyer}</td>
                  <td className="text-center">{escrow.productName}</td>
                  <td className="text-center">₩{escrow.amount.toLocaleString()}</td>
                  <td className="text-center">
                    <span className={`px-2 py-1 text-sm rounded-full ${getStatusColor(escrow.status)}`}>
                      {escrow.status}
                    </span>
                  </td>
                  <td className="text-center">{escrow.createdAt}</td>
                  <td className="text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        className="btn btn-ghost btn-sm"
                        title="거래내역 보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="btn btn-ghost btn-sm"
                        title="거래명세서 다운로드"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EscrowPage; 