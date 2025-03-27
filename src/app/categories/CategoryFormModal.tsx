/** @format */

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { name: string; status: 'active' | 'inactive' }) => void;
  type: 'main-add' | 'main-edit' | 'sub-add' | 'sub-edit';
  category?: {
    id: number;
    name: string;
    status: 'active' | 'inactive';
  } | null;
  subCategory?: {
    id: number;
    name: string;
    status: 'active' | 'inactive';
  } | null;
}

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  type,
  category,
  subCategory,
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    if (isOpen) {
      if (type === 'main-edit' && category) {
        setFormData({
          name: category.name,
          status: category.status,
        });
      } else if (type === 'sub-edit' && subCategory) {
        setFormData({
          name: subCategory.name,
          status: subCategory.status,
        });
      } else {
        setFormData({
          name: '',
          status: 'active',
        });
      }
    }
  }, [isOpen, type, category, subCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const modalTitle = {
    'main-add': '대분류 추가',
    'main-edit': '대분류 수정',
    'sub-add': '중분류 추가',
    'sub-edit': '중분류 수정',
  }[type];

  return (
    <>
      <div className='fixed inset-0 bg-black/25 backdrop-blur-sm z-40' onClick={onClose} />
      <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
        <div className='bg-white rounded-lg shadow-xl w-full max-w-md'>
          <div className='flex items-center justify-between p-4 border-b'>
            <h3 className='text-lg font-semibold text-gray-900'>{modalTitle}</h3>
            <button
              onClick={onClose}
              title='닫기'
              className='p-1 hover:bg-gray-100 rounded-full transition-colors'>
              <X className='w-5 h-5' />
            </button>
          </div>

          <form onSubmit={handleSubmit} className='p-4'>
            <div className='space-y-4'>
              <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                  카테고리명
                </label>
                <input
                  type='text'
                  id='name'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='카테고리명을 입력하세요'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>상태</label>
                <div className='flex gap-4'>
                  <label className='flex items-center gap-2'>
                    <input
                      type='radio'
                      name='status'
                      value='active'
                      checked={formData.status === 'active'}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })
                      }
                      className='w-4 h-4 text-blue-600'
                    />
                    <span className='text-sm text-gray-700'>활성</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='radio'
                      name='status'
                      value='inactive'
                      checked={formData.status === 'inactive'}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })
                      }
                      className='w-4 h-4 text-blue-600'
                    />
                    <span className='text-sm text-gray-700'>비활성</span>
                  </label>
                </div>
              </div>
            </div>

            <div className='flex justify-end gap-3 mt-6'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50'>
                취소
              </button>
              <button
                type='submit'
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700'>
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 