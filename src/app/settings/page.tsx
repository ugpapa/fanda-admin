/** @format */

"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Settings, Users, Shield, Key, Bell, FileText, Lock, Plus, X, Check } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const AdminLayoutComponent = dynamic(() => import('@/components/layout/AdminLayout'), {
  ssr: false
});

// 탭 타입 정의
type TabType = '계정 관리' | '접근 제어' | '권한 설정' | '보안 정책' | '알림 설정' | '감사 로그';

// 관리자 계정 타입
interface AdminUser {
  id: string;
  name: string;
  email: string;
  status: '활성' | '비활성';
  role: string;
  createdAt: string;
  phone: string;
  isVerified: boolean;
}

// 초기 관리자 데이터
const initialAdmins: AdminUser[] = [
  {
    id: '1',
    name: '김관리',
    email: 'admin1@example.com',
    status: '활성',
    role: '슈퍼관리자',
    createdAt: '2024-03-20',
    phone: '010-0000-0000',
    isVerified: true
  },
  {
    id: '2',
    name: '이에디터',
    email: 'editor@example.com',
    status: '활성',
    role: '에디터',
    createdAt: '2024-03-21',
    phone: '010-1111-1111',
    isVerified: false
  }
];

// 체크박스 컴포넌트 추가
const Checkbox = ({ label, checked = false, onChange }: { 
  label: string; 
  checked?: boolean; 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <label className="flex items-center cursor-pointer group">
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-5 h-5 border-2 border-gray-300 rounded transition-colors 
                    peer-checked:bg-orange-500 peer-checked:border-orange-500
                    group-hover:border-orange-400">
      </div>
      <div className="absolute top-1 left-1 w-3 h-3 transition-opacity opacity-0 
                    peer-checked:opacity-100">
        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"
          />
        </svg>
      </div>
    </div>
    <span className="ml-3 text-gray-700">{label}</span>
  </label>
);

// Toggle 컴포넌트 추가
const Toggle = ({ label, checked = false }: { label: string; checked?: boolean }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only peer" defaultChecked={checked} />
    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
    <span className="ml-3 text-gray-700">{label}</span>
  </label>
);

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('계정 관리');
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    name: '',
    role: '일반관리자',
    verificationCode: ''
  });
  
  // 전화번호 인증 상태
  const [isPhoneVerifying, setIsPhoneVerifying] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  
  // 에러 메시지 상태
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    name: '',
    verificationCode: ''
  });

  // 탭 설정
  const tabs: { id: TabType; icon: React.ReactNode }[] = [
    { id: '계정 관리', icon: <Users className="w-4 h-4" /> },
    { id: '접근 제어', icon: <Shield className="w-4 h-4" /> },
    { id: '권한 설정', icon: <Key className="w-4 h-4" /> },
    { id: '보안 정책', icon: <Lock className="w-4 h-4" /> },
    { id: '알림 설정', icon: <Bell className="w-4 h-4" /> },
    { id: '감사 로그', icon: <FileText className="w-4 h-4" /> },
  ];

  // 초기 데이터 로딩
  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        setIsLoading(true);
        // TODO: API 호출하여 관리자 목록 가져오기
        // const response = await fetch('/api/admin-users');
        // const data = await response.json();
        
        // 임시 데이터 로딩 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error('Failed to fetch admin users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminUsers();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  // 계정 관리 컴포넌트
  const AccountManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">관리자 계정 목록</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 
                   transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          관리자 추가
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등급</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">생성일</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                    ${admin.status === '활성' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {admin.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setSelectedAdmin(admin);
                      setShowEditModal(true);
                    }}
                    className="text-orange-600 hover:text-orange-900"
                  >
                    수정
                  </button>
                  <button className="text-red-600 hover:text-red-900">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 접근 제어 컴포넌트
  const AccessControl = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">IP 제한 설정</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="IP 주소 입력"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none 
                       focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 
                           transition-colors text-sm font-medium">
              추가
            </button>
          </div>
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP 주소</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">192.168.1.1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-03-20</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-red-600 hover:text-red-900">삭제</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">접근 시간 제한</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <label className="flex flex-col">
              <span className="text-sm text-gray-600 mb-1">시작 시간</span>
              <input
                type="time"
                title="시작 시간"
                className="px-4 py-2 border border-gray-300 rounded-md"
              />
            </label>
            <span className="text-gray-500">~</span>
            <label className="flex flex-col">
              <span className="text-sm text-gray-600 mb-1">종료 시간</span>
              <input
                type="time"
                title="종료 시간"
                className="px-4 py-2 border border-gray-300 rounded-md"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // 권한 설정 컴포넌트
  const PermissionSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">권한 등급 설정</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">슈퍼관리자 권한</h3>
            <div className="space-y-4">
              <Checkbox label="시스템 설정 접근" checked />
              <Checkbox label="관리자 계정 관리" checked />
              <Checkbox label="권한 설정" checked />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">에디터 권한</h3>
            <div className="space-y-4">
              <Checkbox label="시스템 설정 접근" />
              <Checkbox label="관리자 계정 관리" />
              <Checkbox label="컨텐츠 관리" checked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 보안 정책 컴포넌트
  const SecurityPolicy = () => (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800">보안 설정</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-6">2단계 인증</h3>
            <div className="space-y-4">
              <Toggle label="2FA 활성화" />
              <Toggle label="SMS 인증" />
              <Toggle label="이메일 인증" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-6">비밀번호 정책</h3>
            <div className="space-y-4">
              <Checkbox label="최소 8자 이상" checked />
              <Checkbox label="특수문자 포함" checked />
              <Checkbox label="대문자 포함" checked />
              <Checkbox label="숫자 포함" checked />
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-6">계정 잠금 정책</h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <Checkbox label="5회 로그인 실패 시 잠금" checked />
              <Checkbox label="비밀번호 90일 만료" checked />
            </div>
            <div className="space-y-4">
              <Checkbox label="동시 접속 차단" />
              <Checkbox label="휴면 계정 30일 후 잠금" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 알림 설정 컴포넌트
  const NotificationSettings = () => (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800">알림 설정</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-6">알림 수신 방식</h3>
            <div className="space-y-4">
              <Toggle label="이메일 알림" checked />
              <Toggle label="슬랙 알림" />
              <Toggle label="SMS 알림" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-6">알림 이벤트</h3>
            <div className="space-y-4">
              <Checkbox label="로그인 실패" checked />
              <Checkbox label="비밀번호 변경" checked />
              <Checkbox label="권한 변경" checked />
              <Checkbox label="계정 잠금" checked />
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-6">알림 수신 시간</h3>
          <div className="flex items-center gap-4">
            <input
              type="time"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none 
                       focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <span className="text-gray-500">~</span>
            <input
              type="time"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none 
                       focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // 감사 로그 컴포넌트
  const AuditLog = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">감사 로그</h2>
        <div className="flex gap-4">
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none 
                     focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 
                         transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap min-w-[140px]">
            <FileText className="w-4 h-4" />
            로그 다운로드
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리자</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP 주소</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-03-20 14:30</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">김관리</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">설정 변경</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">192.168.1.1</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  성공
                </span>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-03-20 13:15</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">이에디터</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">로그인</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">192.168.1.2</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                  실패
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // 활성 탭에 따른 컴포넌트 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case '계정 관리':
        return <AccountManagement />;
      case '접근 제어':
        return <AccessControl />;
      case '권한 설정':
        return <PermissionSettings />;
      case '보안 정책':
        return <SecurityPolicy />;
      case '알림 설정':
        return <NotificationSettings />;
      case '감사 로그':
        return <AuditLog />;
      default:
        return null;
    }
  };

  // 폼 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 메시지 초기화
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // 전화번호 인증 요청
  const handleRequestVerification = () => {
    if (!formData.phone) {
      setErrors(prev => ({
        ...prev,
        phone: '전화번호를 입력해주세요.'
      }));
      return;
    }
    setIsPhoneVerifying(true);
    // TODO: 실제 인증번호 발송 로직 구현
    // 인증번호 발송 성공 시 알림
    alert('인증번호가 발송되었습니다.');
  };

  // 인증번호 확인
  const handleVerifyCode = () => {
    if (!formData.verificationCode) {
      setErrors(prev => ({
        ...prev,
        verificationCode: '인증번호를 입력해주세요.'
      }));
      return;
    }
    // TODO: 실제 인증번호 확인 로직 구현
    setIsPhoneVerified(true);
  };

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    let hasError = false;
    const newErrors = { ...errors };
    
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
      hasError = true;
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
      hasError = true;
    }
    
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
      hasError = true;
    }
    
    if (!formData.phone) {
      newErrors.phone = '전화번호를 입력해주세요.';
      hasError = true;
    }
    
    if (!isPhoneVerified) {
      newErrors.phone = '전화번호 인증이 필요합니다.';
      hasError = true;
    }
    
    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.';
      hasError = true;
    }
    
    if (hasError) {
      setErrors(newErrors);
      return;
    }
    
    // TODO: API 호출하여 관리자 추가
    console.log('Submit form data:', formData);
    setShowAddModal(false);
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-800">관리자 설정</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            관리자 추가
          </button>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors
                          ${activeTab === tab.id 
                            ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="flex items-center justify-center w-5 h-5">{tab.icon}</span>
                {tab.id}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {renderTabContent()}
        </div>

        {/* 관리자 추가 모달 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">관리자 추가</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    관리자 아이디(이메일)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    비밀번호 확인
                  </label>
                  <input
                    type="password"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  {errors.passwordConfirm && (
                    <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    연락처
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border rounded-md"
                      placeholder="010-0000-0000"
                    />
                    <button
                      type="button"
                      onClick={handleRequestVerification}
                      disabled={isPhoneVerified}
                      className={`px-4 py-2 rounded-md whitespace-nowrap ${
                        isPhoneVerified
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isPhoneVerified ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        '인증요청'
                      )}
                    </button>
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {isPhoneVerifying && !isPhoneVerified && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      인증번호
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="verificationCode"
                        value={formData.verificationCode}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 border rounded-md"
                        placeholder="인증번호 6자리"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyCode}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap"
                      >
                        확인
                      </button>
                    </div>
                    {errors.verificationCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.verificationCode}</p>
                    )}
                  </div>
                )}

                {isPhoneVerified && (
                  <p className="text-green-500 text-sm mt-1">
                    전화번호 인증이 완료되었습니다.
                  </p>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    실명
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    관리자 등급
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="일반관리자">일반관리자</option>
                    <option value="최고관리자">최고관리자</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    추가
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
