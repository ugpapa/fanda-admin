/** @format */

"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2, FolderClosed, FolderOpen } from "lucide-react";
import AdminLayout from '@/components/layout/AdminLayout';
import Modal from '@/components/common/Modal';

interface SubCategory {
  id: number;
  name: string;
  productCount: number;
  status: 'active' | 'inactive';
}

interface MainCategory {
  id: number;
  name: string;
  productCount: number;
  status: 'active' | 'inactive';
  subCategories: SubCategory[];
  isOpen?: boolean;
}

// 샘플 데이터
const initialCategories: MainCategory[] = [
  {
    id: 1,
    name: "과일",
    productCount: 15,
    status: "active",
    subCategories: [
      { id: 101, name: "사과", productCount: 8, status: "active" },
      { id: 102, name: "배", productCount: 4, status: "active" },
      { id: 103, name: "귤", productCount: 3, status: "inactive" },
    ],
    isOpen: false,
  },
  {
    id: 2,
    name: "채소",
    productCount: 12,
    status: "active",
    subCategories: [
      { id: 201, name: "당근", productCount: 5, status: "active" },
      { id: 202, name: "양파", productCount: 7, status: "active" },
    ],
    isOpen: false,
  },
];

const CategoryPage = () => {
  const [categories, setCategories] = useState<MainCategory[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [selectedCategory, setSelectedCategory] = useState<MainCategory | null>(null);
  const [parentCategory, setParentCategory] = useState<MainCategory | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const toggleCategory = (categoryId: number) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, isOpen: !cat.isOpen };
      }
      return cat;
    }));
  };

  const openAddModal = (parent?: MainCategory) => {
    setModalType('add');
    setParentCategory(parent || null);
    setNewCategoryName('');
    setIsModalOpen(true);
  };

  const openEditModal = (category: MainCategory, parent?: MainCategory) => {
    setModalType('edit');
    setSelectedCategory(category);
    setParentCategory(parent || null);
    setNewCategoryName(category.name);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!newCategoryName.trim()) return;

    if (modalType === 'add') {
      const newCategory: MainCategory = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        name: newCategoryName,
        productCount: 0,
        status: 'active',
        subCategories: [],
        isOpen: false
      };

      if (parentCategory) {
        setCategories(prev => prev.map(cat => {
          if (cat.id === parentCategory.id) {
            return {
              ...cat,
              subCategories: [...cat.subCategories, newCategory]
            };
          }
          return cat;
        }));
      } else {
        setCategories(prev => [...prev, newCategory]);
      }
    } else {
      // 수정 로직
      setCategories(prev => prev.map(cat => {
        if (parentCategory) {
          if (cat.id === parentCategory.id) {
            return {
              ...cat,
              subCategories: cat.subCategories.map(sub =>
                sub.id === selectedCategory?.id
                  ? { ...sub, name: newCategoryName }
                  : sub
              )
            };
          }
        } else if (cat.id === selectedCategory?.id) {
          return { ...cat, name: newCategoryName };
        }
        return cat;
      }));
    }

    setIsModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">카테고리 관리</h1>
            <button
              onClick={() => openAddModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              대분류 추가
            </button>
          </div>

          <div className="space-y-4">
            {categories.map(category => (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {category.isOpen ? (
                        <FolderOpen className="w-5 h-5" />
                      ) : (
                        <FolderClosed className="w-5 h-5" />
                      )}
                    </button>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAddModal(category)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                      title="하위 카테고리 추가"
                      aria-label="하위 카테고리 추가"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-2 text-gray-500 hover:bg-gray-50 rounded-full"
                      title="카테고리 수정"
                      aria-label="카테고리 수정"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                      title="카테고리 삭제"
                      aria-label="카테고리 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {category.isOpen && category.subCategories && (
                  <div className="ml-8 mt-4 space-y-3">
                    {category.subCategories.map(sub => (
                      <div key={sub.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                        <span>{sub.name}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(sub as MainCategory, category)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                            title="하위 카테고리 수정"
                            aria-label="하위 카테고리 수정"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                            title="하위 카테고리 삭제"
                            aria-label="하위 카테고리 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`카테고리 ${modalType === 'add' ? '추가' : '수정'}`}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {parentCategory ? '중분류명' : '대분류명'}
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="카테고리명을 입력하세요"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {modalType === 'add' ? '추가' : '수정'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default CategoryPage;
