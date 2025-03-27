/** @format */

"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Gavel, Search, ListFilter } from 'lucide-react';
import Image from "next/image";

const AdminLayout = dynamic(() => import('@/components/layout/AdminLayout'), {
  ssr: false
});

// 입찰 정보 인터페이스 추가
interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderNickname: string;
  bidAmount: number;
  bidDate: string;
  isWinningBid: boolean;
}

// 경매 인터페이스 수정
interface Auction {
  id: string;
  title: string;
  seller: string;
  sellerNickname: string;
  startPrice: number;
  currentPrice: number;
  bidCount: number;
  createdAt: string;
  endDate: string;
  status: "진행중" | "낙찰" | "유찰";
  images: string[];
  productType: "밭떼기" | "원물";
  cropType: string;
  credit: number;
  winningBid?: {
    bidder: string;
    bidderNickname: string;
    amount: number;
    date: string;
  };
  bids?: Bid[];
}

// 초기 경매 데이터 수정
const initialAuctions: Auction[] = [
  {
    id: "1",
    title: "제주 감귤 밭떼기 경매",
    seller: "farmer1@example.com",
    sellerNickname: "제주감귤왕",
    startPrice: 5000000,
    currentPrice: 5500000,
    bidCount: 5,
    createdAt: "2024-03-15",
    endDate: "2024-03-27",
    status: "낙찰",
    images: ["/images/farm1.jpg"],
    productType: "밭떼기",
    cropType: "감귤",
    credit: 5000,
    winningBid: {
      bidder: "buyer1@example.com",
      bidderNickname: "과일상회",
      amount: 5500000,
      date: "2024-03-27"
    },
    bids: [
      {
        id: "bid1",
        auctionId: "1",
        bidderId: "buyer1@example.com",
        bidderNickname: "과일상회",
        bidAmount: 5500000,
        bidDate: "2024-03-27 14:30:00",
        isWinningBid: true
      },
      {
        id: "bid2",
        auctionId: "1",
        bidderId: "buyer2@example.com",
        bidderNickname: "청과마켓",
        bidAmount: 5300000,
        bidDate: "2024-03-27 14:25:00",
        isWinningBid: false
      }
    ]
  },
  {
    id: "2",
    title: "프리미엄 한라봉 경매",
    seller: "농장주2",
    sellerNickname: "농장주2",
    startPrice: 30000,
    currentPrice: 35000,
    bidCount: 8,
    createdAt: "2024-03-19",
    endDate: "2024-03-26",
    status: "진행중",
    images: ["/images/product1.jpg"],
    productType: "원물",
    cropType: "한라봉",
    credit: 30000
  },
  {
    id: "3",
    title: "제주 천혜향 경매",
    seller: "farmer3@example.com",
    sellerNickname: "과수원주인",
    startPrice: 3000000,
    currentPrice: 3000000,
    bidCount: 0,
    createdAt: "2024-03-10",
    endDate: "2024-03-17",
    status: "유찰",
    images: ["/images/farm3.jpg"],
    productType: "밭떼기",
    cropType: "천혜향",
    credit: 3000,
    bids: []
  },
  {
    id: "4",
    title: "제주 레드향 경매",
    seller: "farmer4@example.com",
    sellerNickname: "레드향농장",
    startPrice: 4000000,
    currentPrice: 4000000,
    bidCount: 0,
    createdAt: "2024-03-12",
    endDate: "2024-03-19",
    status: "유찰",
    images: ["/images/farm4.jpg"],
    productType: "밭떼기",
    cropType: "레드향",
    credit: 4000,
    bids: []
  }
];

type TabType = "전체" | "진행중" | "낙찰" | "유찰";

const AuctionPage = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("전체");
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const bidsDialogRef = useRef<HTMLDialogElement>(null);

  const tabs = [
    { id: '전체', label: '전체', count: auctions.length },
    { id: '진행중', label: '진행중', count: auctions.filter(a => a.status === '진행중').length },
    { id: '낙찰', label: '낙찰', count: auctions.filter(a => a.status === '낙찰').length },
    { id: '유찰', label: '유찰', count: auctions.filter(a => a.status === '유찰').length },
  ];

  useEffect(() => {
    setAuctions(initialAuctions);
  }, []);

  // 필터링된 경매 목록
  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = searchTerm === "" || 
      auction.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "전체" || auction.status === activeTab;
    return matchesSearch && matchesTab;
  });

  // 입찰 내역 모달 표시
  const handleBidsClick = (auction: Auction) => {
    setSelectedAuction(auction);
    bidsDialogRef.current?.showModal();
  };

  // 모달 닫기 함수 추가
  const handleCloseModal = () => {
    bidsDialogRef.current?.close();
    setSelectedAuction(null);
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-3 mb-8">
          <Gavel className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-800">경매 관리</h1>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-orange-500 bg-orange-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab(tab.id as TabType)}
                >
                  {tab.label}
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="경매 검색"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">경매 정보</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">판매자</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">닉네임</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시작가</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">현재가</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  입찰수
                  <span className="text-gray-400 text-[10px] ml-1">(클릭)</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게시일</th>
                {activeTab !== '진행중' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">종료일</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">크레딧</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAuctions.map((auction) => (
                <tr key={auction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <Image
                          className="h-10 w-10 rounded-md object-cover"
                          src={auction.images[0]}
                          alt={auction.title}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{auction.title}</div>
                        <div className="text-sm text-gray-500">{auction.cropType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{auction.seller}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{auction.sellerNickname}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₩{auction.startPrice.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₩{auction.currentPrice.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleBidsClick(auction)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {auction.bidCount}회
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        auction.status === '진행중' ? 'bg-green-100 text-green-800' : 
                        auction.status === '낙찰' ? 'bg-orange-100 text-orange-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {auction.status}
                      </span>
                      {auction.status === '낙찰' && auction.winningBid && (
                        <div className="mt-1 text-xs text-gray-600">
                          낙찰자: {auction.winningBid.bidderNickname}
                          <span className="text-gray-400 ml-1">({auction.winningBid.bidder})</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{auction.createdAt}</td>
                  {activeTab !== '진행중' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{auction.endDate}</td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{auction.credit.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 입찰 내역 모달 수정 */}
      <dialog 
        ref={bidsDialogRef}
        className="modal p-0 bg-transparent max-w-2xl w-full relative"
      >
        <div className="bg-white rounded-lg shadow-lg w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">입찰 내역</h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ListFilter className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-900">{selectedAuction?.title}</h4>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-500">
                <p>시작가: ₩{selectedAuction?.startPrice.toLocaleString()}</p>
                <p>현재가: ₩{selectedAuction?.currentPrice.toLocaleString()}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">닉네임</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">입찰가</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">입찰시간</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedAuction?.bids && selectedAuction.bids.length > 0 ? (
                    selectedAuction.bids.map((bid) => (
                      <tr key={bid.id} className={bid.isWinningBid ? 'bg-orange-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {bid.bidderNickname}
                          <span className="text-xs text-gray-400 ml-1">
                            ({bid.bidderId})
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₩{bid.bidAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {bid.bidDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {bid.isWinningBid && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              낙찰
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        입찰 내역이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </dialog>

      {/* 모달 배경 오버레이 */}
      <style jsx global>{`
        dialog::backdrop {
          background-color: rgba(0, 0, 0, 0.5);
        }
        
        dialog[open] {
          display: block;
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </AdminLayout>
  );
};

export default AuctionPage;
