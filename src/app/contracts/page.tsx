/** @format */

"use client";

import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useState } from "react";
import { Eye, Download, Search, FileText } from "lucide-react";

// 계약 타입 정의
interface Contract {
  id: number;
  contractNumber: string;
  type: "밭떼기" | "원물";
  seller: string;
  buyer: string;
  productName: string;
  amount: number;
  status: "계약완료" | "진행중" | "취소";
  createdAt: string;
}

// 초기 계약 데이터
const initialContracts: Contract[] = [
  {
    id: 1,
    contractNumber: "CT2024-001",
    type: "밭떼기",
    seller: "농장주1",
    buyer: "구매자1",
    productName: "제주 감귤 밭떼기",
    amount: 5000000,
    status: "계약완료",
    createdAt: "2024-03-24",
  },
  {
    id: 2,
    contractNumber: "CT2024-002",
    type: "원물",
    seller: "농장주2",
    buyer: "구매자2",
    productName: "프리미엄 한라봉",
    amount: 350000,
    status: "진행중",
    createdAt: "2024-03-24",
  },
];

const ContractsPage = () => {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "밭떼기" | "원물">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "계약완료" | "진행중" | "취소">("all");

  // 필터링된 계약 목록
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      searchTerm === "" || 
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.productName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || contract.type === typeFilter;
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleContractUpdate = (updatedContract: Contract) => {
    setContracts(prev => prev.map(contract => 
      contract.id === updatedContract.id ? updatedContract : contract
    ));
  };

  const handleStatusChange = (contractId: number, newStatus: Contract['status']) => {
    setContracts(prev => prev.map(contract => 
      contract.id === contractId ? { ...contract, status: newStatus } : contract
    ));
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-800">계약 관리</h1>
        </div>
        {/* <div className="mb-6">
          <h1 className="text-2xl font-bold">계약 관리</h1>
          <p className="text-sm text-gray-500 mt-1">
            거래 계약을 조회하고 관리할 수 있습니다.
          </p>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="계약번호, 판매자, 구매자, 상품명으로 검색"
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <select
            className="select select-bordered w-full"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "all" | "밭떼기" | "원물")}
            aria-label="계약 유형 필터"
          >
            <option value="all">전체 유형</option>
            <option value="밭떼기">밭떼기</option>
            <option value="원물">원물</option>
          </select>
          <select
            className="select select-bordered w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "계약완료" | "진행중" | "취소")}
            aria-label="계약 상태 필터"
          >
            <option value="all">전체 상태</option>
            <option value="계약완료">계약완료</option>
            <option value="진행중">진행중</option>
            <option value="취소">취소</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="text-center">계약번호</th>
                <th className="text-center">유형</th>
                <th className="text-center">판매자</th>
                <th className="text-center">구매자</th>
                <th className="text-center">상품명</th>
                <th className="text-center">계약금액</th>
                <th className="text-center">상태</th>
                <th className="text-center">계약일</th>
                <th className="text-center">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract) => (
                <tr key={contract.id}>
                  <td className="text-center">{contract.contractNumber}</td>
                  <td className="text-center">
                    <span className={`px-2 py-1 text-sm rounded-full ${
                      contract.type === "밭떼기" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {contract.type}
                    </span>
                  </td>
                  <td className="text-center">{contract.seller}</td>
                  <td className="text-center">{contract.buyer}</td>
                  <td className="text-center">{contract.productName}</td>
                  <td className="text-center">₩{contract.amount.toLocaleString()}</td>
                  <td className="text-center">
                    <span className={`px-2 py-1 text-sm rounded-full ${
                      contract.status === "계약완료" 
                        ? "bg-green-100 text-green-800"
                        : contract.status === "진행중"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="text-center">{contract.createdAt}</td>
                  <td className="text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        className="btn btn-ghost btn-sm"
                        title="계약서 보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="btn btn-ghost btn-sm"
                        title="계약서 다운로드"
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

export default ContractsPage;
