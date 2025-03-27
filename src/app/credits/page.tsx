/** @format */

"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";

interface CreditTransaction {
  id: string;
  username: string;
  type: "충전" | "사용" | "환불";
  amount: number;
  description: string;
  date: string;
}

const initialTransactions: CreditTransaction[] = [
  {
    id: "1",
    username: "user1",
    type: "충전",
    amount: 10000,
    description: "신용카드 충전",
    date: "2024-03-20 14:30",
  },
  {
    id: "2",
    username: "user2",
    type: "사용",
    amount: -5000,
    description: "상품 구매",
    date: "2024-03-20 15:45",
  },
  {
    id: "3",
    username: "user3",
    type: "환불",
    amount: 3000,
    description: "구매 취소 환불",
    date: "2024-03-20 16:20",
  },
];

const CreditPage = () => {
  const [transactions] = useState<CreditTransaction[]>(initialTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "충전" | "사용" | "환불">("all");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      searchTerm === "" ||
      transaction.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "충전":
        return "text-green-600 bg-green-50";
      case "사용":
        return "text-red-600 bg-red-50";
      case "환불":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <select
              className="select select-bordered w-40"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "all" | "충전" | "사용" | "환불")}
              aria-label="거래 유형 필터"
            >
              <option value="all">전체 거래</option>
              <option value="충전">충전</option>
              <option value="사용">사용</option>
              <option value="환불">환불</option>
            </select>
          </div>

          <div className="relative w-64">
            <input
              type="text"
              placeholder="사용자명 또는 설명으로 검색"
              className="input input-bordered w-full pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="검색">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  거래 ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  거래 유형
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  금액
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  설명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  날짜
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(
                        transaction.type
                      )}`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.amount.toLocaleString()}원
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.date}
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

export default CreditPage;
