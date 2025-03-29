/** @format */

"use client";

import React, { useState } from 'react';
import { HelpCircle, Plus, Edit, Trash2, Search, Settings } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Modal from '@/components/common/Modal';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
}

const initialCategories: Category[] = [
  { id: '1', name: '회원가입', order: 1, isActive: true },
  { id: '2', name: '결제', order: 2, isActive: true },
  { id: '3', name: '배송', order: 3, isActive: true },
  { id: '4', name: '취소/환불', order: 4, isActive: true },
  { id: '5', name: '기타', order: 5, isActive: true },
];

const initialFAQs: FAQ[] = [
  {
    id: '1',
    category: '회원가입',
    question: '회원가입은 어떻게 하나요?',
    answer: '홈페이지 상단의 회원가입 버튼을 클릭하여 진행하실 수 있습니다.',
    order: 1,
    isActive: true,
    createdAt: '2024-03-20'
  },
  {
    id: '2',
    category: '결제',
    question: '결제 방법은 어떤 것이 있나요?',
    answer: '신용카드, 무통장입금, 계좌이체를 지원합니다.',
    order: 2,
    isActive: true,
    createdAt: '2024-03-20'
  }
];

const FAQPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFAQs);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [newCategory, setNewCategory] = useState({ name: '', order: 0 });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const categoryOptions = ['전체', ...categories.filter(cat => cat.isActive).map(cat => cat.name)];

  const handleAddFAQ = () => {
    setShowAddModal(true);
  };

  const handleEditFAQ = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setShowEditModal(true);
  };

  const handleDeleteFAQ = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setFaqs(faqs.filter(faq => faq.id !== id));
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    
    const newId = (categories.length + 1).toString();
    setCategories([...categories, {
      id: newId,
      name: newCategory.name,
      order: newCategory.order || categories.length + 1,
      isActive: true
    }]);
    setNewCategory({ name: '', order: 0 });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;
    
    setCategories(categories.map(cat => 
      cat.id === editingCategory.id ? editingCategory : cat
    ));
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('이 카테고리를 삭제하시겠습니까?\n해당 카테고리의 FAQ도 함께 삭제됩니다.')) {
      setCategories(categories.filter(cat => cat.id !== id));
      setFaqs(faqs.filter(faq => faq.category !== categories.find(cat => cat.id === id)?.name));
    }
  };

  const handleToggleCategoryStatus = (id: string) => {
    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-800">FAQ 관리</h1>
          </div>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>카테고리 관리</span>
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center flex-1 max-w-2xl">
            <select
              className="select select-bordered w-[180px]"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categoryOptions.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <div className="relative flex-1">
              <input
                type="text"
                placeholder="FAQ 검색"
                className="input input-bordered w-full pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <button
            onClick={handleAddFAQ}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">FAQ 추가</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">질문</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">답변</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">순서</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFAQs.map((faq) => (
                <tr key={faq.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{faq.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{faq.question}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{faq.answer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{faq.order}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                      ${faq.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {faq.isActive ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditFAQ(faq)}
                      className="text-orange-600 hover:text-orange-900"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteFAQ(faq.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 카테고리 관리 모달 */}
        <Modal
          isOpen={showCategoryModal}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
          title="카테고리 관리"
        >
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="새 카테고리 이름"
                    className="w-full px-3 py-2 border rounded-md"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  />
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    placeholder="순서"
                    className="w-full px-3 py-2 border rounded-md"
                    value={newCategory.order || ''}
                    onChange={(e) => setNewCategory({ ...newCategory, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  추가
                </button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">카테고리명</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">순서</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {editingCategory?.id === category.id ? (
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded"
                            value={editingCategory.name}
                            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                          />
                        ) : (
                          <span className="text-sm text-gray-900">{category.name}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingCategory?.id === category.id ? (
                          <input
                            type="number"
                            className="w-20 px-2 py-1 border rounded"
                            value={editingCategory.order}
                            onChange={(e) => setEditingCategory({ ...editingCategory, order: parseInt(e.target.value) || 0 })}
                          />
                        ) : (
                          <span className="text-sm text-gray-900">{category.order}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleCategoryStatus(category.id)}
                          className={`px-2 py-1 text-xs font-semibold rounded-full
                            ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {category.isActive ? '활성' : '비활성'}
                        </button>
                      </td>
                      <td className="px-4 py-3 space-x-2">
                        {editingCategory?.id === category.id ? (
                          <>
                            <button
                              onClick={handleUpdateCategory}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              저장
                            </button>
                            <button
                              onClick={() => setEditingCategory(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              취소
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="text-orange-600 hover:text-orange-900"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              삭제
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>

        {/* FAQ 추가 모달 */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="FAQ 추가"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카테고리
              </label>
              <select className="w-full px-3 py-2 border rounded-md">
                {categories.filter(cat => cat.isActive).map(category => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                질문
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="질문을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                답변
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="답변을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                순서
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="표시 순서를 입력하세요"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                defaultChecked
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                활성화
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                등록
              </button>
            </div>
          </div>
        </Modal>

        {/* FAQ 수정 모달 */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="FAQ 수정"
        >
          {selectedFAQ && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  카테고리
                </label>
                <select className="w-full px-3 py-2 border rounded-md">
                  {categories.filter(cat => cat.isActive).map(category => (
                    <option
                      key={category.id}
                      value={category.name}
                      selected={category.name === selectedFAQ.category}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  질문
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  defaultValue={selectedFAQ.question}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  답변
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                  defaultValue={selectedFAQ.answer}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  순서
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  defaultValue={selectedFAQ.order}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editIsActive"
                  className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  defaultChecked={selectedFAQ.isActive}
                />
                <label htmlFor="editIsActive" className="text-sm text-gray-700">
                  활성화
                </label>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  수정
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default FAQPage; 