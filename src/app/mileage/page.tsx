"use client";

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Search, ArrowUpDown, Filter } from 'lucide-react';

interface MileageHistory {
  id: number;
  userId: string;
  nickname: string;
  amount: number;
  type: '적립' | '사용';
  description: string;
  date: string;
}

export default function MileagePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'전체' | '적립' | '사용'>('전체');

  const mileageHistory: MileageHistory[] = [
    {
      id: 1,
      userId: "user123",
      nickname: "홍길동",
      amount: 50000,
      type: "적립",
      description: "경매 낙찰",
      date: "2024-03-15 14:30"
    },
    {
      id: 2,
      userId: "user456",
      nickname: "김철수",
      amount: 30000,
      type: "사용",
      description: "상품 구매",
      date: "2024-03-15 15:45"
    },
    // ... 더 많은 히스토리 데이터
  ];

  const filteredHistory = mileageHistory
    .filter(item => {
      if (filterType !== '전체' && item.type !== filterType) return false;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.userId.toLowerCase().includes(searchLower) ||
          item.nickname.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">마일리지 관리</h1>
          <div className="flex items-center justify-end gap-4 mb-6">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as '전체' | '적립' | '사용')}
                className="border-0 focus:ring-0 text-sm font-medium bg-transparent"
                aria-label="마일리지 유형 필터"
              >
                <option value="전체">전체</option>
                <option value="적립">적립</option>
                <option value="사용">사용</option>
              </select>
            </div>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">
                {sortOrder === 'asc' ? '오래된 순' : '최신순'}
              </span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <div className="relative">
                <input
                  type="text"
                  placeholder="아이디, 닉네임 또는 내용으로 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">아이디</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">닉네임</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">금액</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구분</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">내용</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">일시</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.userId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nickname}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-medium ${item.type === '적립' ? 'text-blue-600' : 'text-red-600'}`}>
                          {item.type === '적립' ? '+' : '-'}{item.amount.toLocaleString()}원
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.type === '적립' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 