"use client";

import React, { useState, useEffect, useRef } from "react";
import { Eye, Pencil, Ban, Search, ListFilter, Package, Flame, Trash, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';

const AdminLayout = dynamic(() => import('@/components/layout/AdminLayout'), {
  ssr: false
});

// 상품 타입 정의
interface Product {
  id: string;
  title: string;
  seller: string;
  productType: "밭떼기" | "원물";
  cropType: string;
  price: number;
  registeredDate: string;
  address?: string;
  farmSize?: string;
  pestStatus?: string;
  expectedHarvestDate: string;
  images: string[];
  // 원물 전용 필드
  saleType?: string;
  size?: string;
  sugarContent?: string;
  acidity?: string;
  status: "판매중" | "판매완료" | "삭제";
  isHot: boolean;
  createdAt: string;
}

// 초기 상품 데이터
const initialProducts: Product[] = [
  {
    id: "1",
    title: "제주 감귤 밭떼기",
    seller: "농장주1",
    productType: "밭떼기",
    cropType: "감귤",
    price: 5000000,
    registeredDate: "2024-03-20",
    address: "제주시 한경면",
    farmSize: "1000평",
    pestStatus: "없음",
    expectedHarvestDate: "2024-11-15",
    images: ["/images/farm1.jpg"],
    status: "판매중",
    isHot: true,
    createdAt: "2024-03-20"
  },
  {
    id: "2",
    title: "프리미엄 한라봉",
    seller: "농장주2",
    productType: "원물",
    cropType: "한라봉",
    price: 35000,
    registeredDate: "2024-03-19",
    address: "서귀포시 남원읍",
    farmSize: "500평",
    pestStatus: "없음",
    expectedHarvestDate: "2024-04-01",
    images: ["/images/farm2.jpg"],
    status: "판매중",
    isHot: true,
    createdAt: "2024-03-19"
  },
  {
    id: "3",
    title: "성산 천혜향",
    seller: "농장주3",
    productType: "원물",
    cropType: "천혜향",
    price: 45000,
    registeredDate: "2024-03-18",
    address: "서귀포시 성산읍",
    farmSize: "300평",
    pestStatus: "없음",
    expectedHarvestDate: "2024-04-15",
    images: ["/images/farm3.jpg"],
    status: "판매완료",
    isHot: false,
    createdAt: "2024-03-18"
  },
  {
    id: "4",
    title: "하우스 레드향",
    seller: "농장주4",
    productType: "밭떼기",
    cropType: "레드향",
    price: 6000000,
    registeredDate: "2024-03-17",
    address: "제주시 구좌읍",
    farmSize: "800평",
    pestStatus: "없음",
    expectedHarvestDate: "2024-05-01",
    images: ["/images/farm4.jpg"],
    status: "판매완료",
    isHot: false,
    createdAt: "2024-03-17"
  },
  {
    id: "5",
    title: "황금향 밭떼기",
    seller: "농장주5",
    productType: "밭떼기",
    cropType: "황금향",
    price: 4500000,
    registeredDate: "2024-03-16",
    address: "서귀포시 안덕면",
    farmSize: "600평",
    pestStatus: "없음",
    expectedHarvestDate: "2024-04-20",
    images: ["/images/farm5.jpg"],
    status: "삭제",
    isHot: false,
    createdAt: "2024-03-16"
  },
  {
    id: "6",
    title: "청견 하우스",
    seller: "농장주6",
    productType: "원물",
    cropType: "청견",
    price: 38000,
    registeredDate: "2024-03-15",
    address: "제주시 애월읍",
    farmSize: "400평",
    pestStatus: "없음",
    expectedHarvestDate: "2024-04-10",
    images: ["/images/farm6.jpg"],
    status: "삭제",
    isHot: false,
    createdAt: "2024-03-15"
  }
];

type TabType = 'all' | '판매중' | '판매완료' | '삭제' | 'hot';

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const savedProducts = localStorage.getItem('products');
      return savedProducts ? JSON.parse(savedProducts) : initialProducts;
    }
    return initialProducts;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>('판매중');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [targetProduct, setTargetProduct] = useState<string | null>(null);
  
  const editDialogRef = useRef<HTMLDialogElement>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const detailDialogRef = useRef<HTMLDialogElement>(null);

  const tabs = [
    { id: 'all', label: '전체 상품', count: 150 },
    { id: '판매중', label: '판매중', count: 100 },
    { id: '판매완료', label: '판매완료', count: 30 },
    { id: '삭제', label: '삭제됨', count: 20 },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === "" || 
      product.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'hot') {
      return matchesSearch && product.isHot;
    }
    
    if (activeTab === 'all') {
      return matchesSearch;
    }
    
    return matchesSearch && product.status === activeTab;
  });

  const productCounts = {
    all: products.length,
    판매중: products.filter(p => p.status === "판매중").length,
    판매완료: products.filter(p => p.status === "판매완료").length,
    삭제: products.filter(p => p.status === "삭제").length
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    editDialogRef.current?.showModal();
  };

  const handleCloseEdit = () => {
    editDialogRef.current?.close();
    setSelectedProduct(null);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    deleteDialogRef.current?.showModal();
  };

  const handleCloseDelete = () => {
    deleteDialogRef.current?.close();
    setSelectedProduct(null);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      setProducts(prevProducts => 
        prevProducts.filter(p => p.id !== selectedProduct.id)
      );
      handleCloseDelete();
    }
  };

  const handleShowDetail = (product: Product) => {
    setSelectedProduct(product);
    detailDialogRef.current?.showModal();
  };

  const handleCloseDetail = () => {
    detailDialogRef.current?.close();
    setSelectedProduct(null);
  };

  const calculateIndex = (currentPage: number, itemsPerPage: number, rowIndex: number) => {
    return products.length - ((currentPage - 1) * itemsPerPage + rowIndex);
  };

  const handleHotRegister = async () => {
    try {
      const updatedProducts = products.map(product => 
        selectedProducts.includes(product.id) 
          ? { ...product, isHot: true }
          : product
      );
      
      setProducts(updatedProducts);
      setSelectedProducts([]);
    } catch (error) {
      console.error('핫 상품 등록 실패:', error);
    }
  };

  const handleHotRemove = async (productId: string) => {
    try {
      const updatedProducts = products.map(product => 
        product.id === productId 
          ? { ...product, isHot: false }
          : product
      );
      
      setProducts(updatedProducts);
    } catch (error) {
      console.error('핫 상품 제거 실패:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-gray-700" />
              <h1 className="text-2xl font-bold text-gray-800">상품 관리</h1>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="상품명 검색"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none 
                         focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <div className="flex justify-between items-center px-6">
              <div className="flex">
                {[
                  { id: '판매중', label: '판매중', count: products.filter(p => p.status === '판매중').length },
                  { id: '판매완료', label: '판매완료', count: products.filter(p => p.status === '판매완료').length },
                  { id: '삭제', label: '삭제됨', count: products.filter(p => p.status === '삭제').length },
                  { id: 'hot', label: '핫상품 리스트', count: products.filter(p => p.isHot).length },
                  { id: 'all', label: '전체 상품', count: products.length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                      ${activeTab === tab.id 
                        ? 'border-orange-500 text-orange-500' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    onClick={() => setActiveTab(tab.id as TabType)}
                  >
                    {tab.label}
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs 
                                  font-semibold rounded-full bg-gray-100 text-gray-700">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
              {activeTab === '판매중' && (
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 
                             text-white rounded-md transition-colors"
                  onClick={handleHotRegister}
                  disabled={selectedProducts.length === 0}
                >
                  <Flame className="w-4 h-4" />
                  <span className="text-sm font-medium">핫 상품 등록하기</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  <input
                    type="checkbox"
                    className="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(products.map(p => p.id));
                      } else {
                        setSelectedProducts([]);
                      }
                    }}
                    checked={selectedProducts.length === products.length}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">판매자</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가격</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts([...selectedProducts, product.id]);
                        } else {
                          setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calculateIndex(1, 10, index)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <Image
                          className="h-10 w-10 rounded-md object-cover"
                          src={product.images[0]}
                          alt={product.title}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.title}
                          {product.isHot && (
                            <span className="ml-2 text-red-500">
                              <Flame className="w-4 h-4 inline" />
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{product.cropType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.seller}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.productType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₩{product.price.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border
                      ${product.status === '판매중' 
                        ? 'border-blue-500 text-blue-500 bg-blue-50' 
                        : product.status === '판매완료'
                          ? 'border-orange-500 text-orange-500 bg-orange-50'
                          : 'border-gray-400 text-gray-500 bg-gray-50'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.registeredDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {activeTab === 'hot' ? (
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => {
                            setTargetProduct(product.id);
                            setShowConfirmModal(true);
                          }}
                        >
                          핫 상품 제거
                        </button>
                      ) : (
                        <>
                          <button 
                            className='p-1 hover:bg-gray-100 rounded-full transition-colors'
                            title='상세보기'
                            onClick={() => handleShowDetail(product)}
                          >
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                          <button 
                            className='p-1 hover:bg-gray-100 rounded-full transition-colors'
                            title='수정'
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            className='p-1 hover:bg-gray-100 rounded-full transition-colors'
                            title='이메일 발송'
                          >
                            <Mail className="w-4 h-4 text-gray-500" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dialog ref={deleteDialogRef} className="modal">
          <div className='modal-box'>
            <h3 className='font-bold text-lg mb-4'>상품 삭제</h3>
            <p>정말로 이 상품을 삭제하시겠습니까?</p>
            <p className='text-sm text-gray-500 mt-2'>
              상품명: {selectedProduct?.title}
            </p>
            <div className='modal-action'>
              <button 
                className='btn' 
                onClick={handleCloseDelete}
              >
                취소
              </button>
              <button 
                className='btn btn-error' 
                onClick={confirmDelete}
              >
                삭제하기
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={handleCloseDelete}>닫기</button>
          </form>
        </dialog>

        <dialog ref={editDialogRef} className="modal">
          <div className="modal-box max-w-3xl w-11/12 min-w-[500px] p-6 relative">
            <button 
              className="btn btn-circle btn-ghost absolute -right-3 -top-3 text-xl bg-base-100" 
              onClick={handleCloseEdit}
              title="닫기"
            >
              ✕
            </button>
            <div className="border-b pb-3 mb-5">
              <h3 className="text-lg font-medium">상품 수정</h3>
            </div>
            {selectedProduct && (
              <div className="space-y-4">
                <table className="w-full">
                  <tbody className="grid grid-cols-2 gap-x-4">
                    <tr className="border-b">
                      <td className="py-2.5">
                        <span className="block text-sm font-medium text-zinc-500 mb-1">상품명</span>
                        <input
                          type="text"
                          className="input input-bordered input-sm w-full"
                          defaultValue={selectedProduct.title}
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2.5">
                        <span className="block text-sm font-medium text-zinc-500 mb-1">판매자</span>
                        <input
                          type="text"
                          className="input input-bordered input-sm w-full"
                          defaultValue={selectedProduct.seller}
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2.5">
                        <span className="block text-sm font-medium text-zinc-500 mb-1">상품유형</span>
                        <select 
                          className="select select-bordered select-sm w-full"
                          defaultValue={selectedProduct.productType}
                        >
                          <option value="밭떼기">밭떼기</option>
                          <option value="원물">원물</option>
                        </select>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2.5">
                        <span className="block text-sm font-medium text-zinc-500 mb-1">판매가격</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            className="input input-bordered input-sm w-full"
                            defaultValue={selectedProduct.price}
                          />
                          <span className="text-sm">원</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2.5">
                        <span className="block text-sm font-medium text-zinc-500 mb-1">상품상태</span>
                        <select 
                          className="select select-bordered select-sm w-full"
                          defaultValue={selectedProduct.status}
                        >
                          <option value="판매중">판매중</option>
                          <option value="판매완료">판매완료</option>
                          <option value="삭제">삭제</option>
                        </select>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2.5">
                        <span className="block text-sm font-medium text-zinc-500 mb-1">등록일</span>
                        <input
                          type="date"
                          className="input input-bordered input-sm w-full"
                          defaultValue={selectedProduct.registeredDate}
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2.5">
                        <span className="block text-sm font-medium text-zinc-500 mb-1">예상수확일</span>
                        <input
                          type="date"
                          className="input input-bordered input-sm w-full"
                          defaultValue={selectedProduct.expectedHarvestDate}
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2.5">
                        <span className="block text-sm font-medium text-zinc-500 mb-1">농산물 종류</span>
                        <select 
                          className="select select-bordered select-sm w-full"
                          defaultValue={selectedProduct.cropType}
                        >
                          <option value="감귤">감귤</option>
                          <option value="한라봉">한라봉</option>
                          <option value="기타">기타</option>
                        </select>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2.5">
                        <span className="block text-sm font-medium text-zinc-500 mb-1">병해충여부</span>
                        <input
                          type="text"
                          className="input input-bordered input-sm w-full"
                          defaultValue={selectedProduct.pestStatus || "없음"}
                        />
                      </td>
                    </tr>
                    {selectedProduct.productType === "밭떼기" ? (
                      <tr className="border-b">
                        <td className="py-2.5">
                          <span className="block text-sm font-medium text-zinc-500 mb-1">농지규모</span>
                          <input
                            type="text"
                            className="input input-bordered input-sm w-full"
                            defaultValue={selectedProduct.farmSize}
                          />
                        </td>
                      </tr>
                    ) : (
                      <>
                        <tr className="border-b">
                          <td className="py-2.5">
                            <span className="block text-sm font-medium text-zinc-500 mb-1">판매 유형</span>
                            <input
                              type="text"
                              className="input input-bordered input-sm w-full"
                              defaultValue={selectedProduct.saleType}
                            />
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2.5">
                            <span className="block text-sm font-medium text-zinc-500 mb-1">원물사이즈</span>
                            <input
                              type="text"
                              className="input input-bordered input-sm w-full"
                              defaultValue={selectedProduct.size}
                            />
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2.5">
                            <span className="block text-sm font-medium text-zinc-500 mb-1">당도</span>
                            <input
                              type="text"
                              className="input input-bordered input-sm w-full"
                              defaultValue={selectedProduct.sugarContent}
                            />
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2.5">
                            <span className="block text-sm font-medium text-zinc-500 mb-1">산도</span>
                            <input
                              type="text"
                              className="input input-bordered input-sm w-full"
                              defaultValue={selectedProduct.acidity}
                            />
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>

                <div className="pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-zinc-500">
                      {selectedProduct.productType === "밭떼기" ? "농장 사진:" : "상품 사진:"}
                    </span>
                    <label className="btn btn-sm btn-outline">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
                            setSelectedProduct(prev => prev ? {
                              ...prev,
                              images: [...prev.images, ...newImages]
                            } : null);
                          }
                        }}
                      />
                      사진 추가
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    {selectedProduct.images.map((image, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden shadow-sm group">
                        <Image
                          src={image}
                          alt={`${selectedProduct.title} 이미지 ${index + 1}`}
                          fill
                          className="object-cover group-hover:opacity-80 transition-opacity duration-300"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          onClick={() => {
                            setSelectedProduct(prev => prev ? {
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            } : null);
                          }}
                          title="이미지 삭제"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  {selectedProduct.images.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <p className="text-sm text-gray-500">등록된 사진이 없습니다.</p>
                    </div>
                  )}
                </div>

                <div className="modal-action flex justify-end gap-2">
                  <button 
                    className="btn bg-gray-400 hover:bg-gray-500 text-white border-none min-w-[120px]" 
                    onClick={handleCloseEdit}
                  >
                    취소
                  </button>
                  <button 
                    className="btn bg-rose-400 hover:bg-rose-500 text-white border-none min-w-[120px]" 
                    onClick={handleCloseEdit}
                  >
                    수정하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </dialog>

        <dialog ref={detailDialogRef} className="modal">
          <div className="modal-box max-w-3xl w-11/12 min-w-[500px] p-6 relative">
            <button 
              className="btn btn-circle btn-ghost absolute -right-3 -top-3 text-xl bg-base-100" 
              onClick={handleCloseDetail}
              title="닫기"
            >
              ✕
            </button>
            <div className="border-b pb-3 mb-5">
              <h3 className="text-lg font-medium">{selectedProduct?.title}</h3>
            </div>
            {selectedProduct && (
              <div className="space-y-4">
                <table className="w-full">
                  <tbody className="grid grid-cols-2 gap-x-4">
                    <tr className="border-b">
                      <td className="py-2.5">
                        <span className="block text-sm font-medium text-zinc-500 mb-1">상품명</span>
                        <span className="text-base">{selectedProduct.title}</span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2.5">
                        <span className="block text-sm font-medium text-zinc-500 mb-1">판매자</span>
                        <span className="text-base">{selectedProduct.seller}</span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2.5">
                        <span className="block text-sm font-medium text-zinc-500 mb-1">상품유형</span>
                        <span className="text-base">{selectedProduct.productType}</span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2.5">
                        <span className="block text-sm font-medium text-zinc-500 mb-1">판매가격</span>
                        <span className="text-base">₩{selectedProduct.price.toLocaleString()}</span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2.5">
                        <span className="block text-sm font-medium text-zinc-500 mb-1">등록일</span>
                        <span className="text-base">{selectedProduct.registeredDate}</span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2.5">
                        <span className="block text-sm font-medium text-zinc-500 mb-1">예상수확일</span>
                        <span className="text-base">{selectedProduct.expectedHarvestDate}</span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2.5">
                        <span className="block text-sm font-medium text-zinc-500 mb-1">농산물 종류</span>
                        <span className="text-base">{selectedProduct.cropType}</span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2.5">
                        <span className="block text-sm font-medium text-zinc-500 mb-1">병해충여부</span>
                        <span className="text-base">{selectedProduct.pestStatus || "없음"}</span>
                      </td>
                    </tr>
                    {selectedProduct.productType === "밭떼기" ? (
                      <tr className="border-b">
                        <td className="py-2.5">
                          <span className="block text-sm font-medium text-zinc-500 mb-1">농지규모</span>
                          <span className="text-base">{selectedProduct.farmSize}</span>
                        </td>
                      </tr>
                    ) : (
                      <>
                        <tr className="border-b">
                          <td className="py-2.5">
                            <span className="block text-sm font-medium text-zinc-500 mb-1">판매 유형</span>
                            <span className="text-base">{selectedProduct.saleType}</span>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2.5">
                            <span className="block text-sm font-medium text-zinc-500 mb-1">원물사이즈</span>
                            <span className="text-base">{selectedProduct.size}</span>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2.5">
                            <span className="block text-sm font-medium text-zinc-500 mb-1">당도</span>
                            <span className="text-base">{selectedProduct.sugarContent}</span>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2.5">
                            <span className="block text-sm font-medium text-zinc-500 mb-1">산도</span>
                            <span className="text-base">{selectedProduct.acidity}</span>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>

                <div className="pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-zinc-500">
                      {selectedProduct.productType === "밭떼기" ? "농장 사진:" : "상품 사진:"}
                    </span>
                    <label className="btn btn-sm btn-outline">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
                            setSelectedProduct(prev => prev ? {
                              ...prev,
                              images: [...prev.images, ...newImages]
                            } : null);
                          }
                        }}
                      />
                      사진 추가
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    {selectedProduct.images.map((image, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden shadow-sm group">
                        <Image
                          src={image}
                          alt={`${selectedProduct.title} 이미지 ${index + 1}`}
                          fill
                          className="object-cover group-hover:opacity-80 transition-opacity duration-300"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          onClick={() => {
                            setSelectedProduct(prev => prev ? {
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            } : null);
                          }}
                          title="이미지 삭제"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  {selectedProduct.images.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <p className="text-sm text-gray-500">등록된 사진이 없습니다.</p>
                    </div>
                  )}
                </div>

                <div className="modal-action flex justify-end gap-2">
                  <button 
                    className="btn bg-gray-400 hover:bg-gray-500 text-white border-none min-w-[120px]" 
                    onClick={handleCloseDetail}
                  >
                    닫기
                  </button>
                </div>
              </div>
            )}
          </div>
        </dialog>

        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[400px]">
              <h3 className="text-lg font-bold mb-4">핫 상품 제거</h3>
              <p>선택한 상품을 핫 상품에서 제거하시겠습니까?</p>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowConfirmModal(false)}
                >
                  취소
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => {
                    if (targetProduct) {
                      handleHotRemove(targetProduct);
                      setShowConfirmModal(false);
                      setTargetProduct(null);
                    }
                  }}
                >
                  제거
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductPage;