/** @format */

"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Gavel,
  Users,
  CreditCard,
  FileText,
  Shield,
  Bell,
  HelpCircle,
  ShoppingCart,
  Tags,
  Settings,
  LogOut,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

// 샘플 알림 데이터
const notifications = [
  {
    id: 1,
    title: "새로운 경매 등록",
    message: "사과 경매가 새로 등록되었습니다.",
    time: "10분 전",
    read: false,
  },
  {
    id: 2,
    title: "경매 종료",
    message: "배 경매가 종료되었습니다.",
    time: "1시간 전",
    read: false,
  },
  {
    id: 3,
    title: "새로운 문의",
    message: "고객으로부터 새로운 문의가 접수되었습니다.",
    time: "2시간 전",
    read: true,
  },
];

const menuItems = [
  {
    text: "대시보드",
    icon: <LayoutDashboard className='h-5 w-5' />,
    path: "/dashboard",
  },
  {
    text: "상품 관리",
    icon: <ShoppingCart className='h-5 w-5' />,
    path: "/products",
  },
  { 
    text: "경매 관리", 
    icon: <Gavel className='h-5 w-5' />, 
    path: "/auctions" 
  },
  { 
    text: "회원 관리", 
    icon: <Users className='h-5 w-5' />, 
    path: "/members" 
  },
  {
    text: "마일리지 관리",
    icon: <CreditCard className='h-5 w-5' />,
    path: "/mileage",
  },
  {
    text: "계약 관리",
    icon: <FileText className='h-5 w-5' />,
    path: "/contracts",
  },
  {
    text: "카테고리 관리",
    icon: <Tags className='h-5 w-5' />,
    path: "/categories",
  },
  {
    text: "시스템 설정",
    icon: <Settings className='h-5 w-5' />,
    path: "/settings",
  },
  {
    text: "에스크로 관리",
    icon: <Shield className='h-5 w-5' />,
    path: "/escrow",
  },
  { 
    text: "공지사항", 
    icon: <Bell className='h-5 w-5' />, 
    path: "/notices" 
  },
  {
    text: "문의 관리",
    icon: <HelpCircle className='h-5 w-5' />,
    path: "/inquiries",
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotificationsToggle = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const handleLogout = () => {
    router.push("/login");
  };

  const handleMenuItemClick = (item: { text: string; path: string }) => {
    router.push(item.path);
    setMobileOpen(false);
  };

  // 현재 경로에 따라 타이틀 설정
  const getTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return 'Administrator Control Center';
      case '/mileage':
        return '마일리지 관리';
      case '/inquiries':
        return '문의 관리';
      case '/products':
        return '상품 관리';
      case '/auctions':
        return '경매 관리';
      case '/members':
        return '회원 관리';
      case '/contracts':
        return '계약 관리';
      case '/categories':
        return '카테고리 관리';
      case '/settings':
        return '시스템 설정';
      case '/escrow':
        return '에스크로 관리';
      case '/notices':
        return '공지사항';
      default:
        return 'Administrator Control Center';
    }
  };

  const handleNotificationsClick = () => {
    handleNotificationsToggle();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar for desktop */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-slate-500 border-r">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center p-4 border-b">
              <Image
                src="/admin-avatar.png"
                alt="Admin Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="text-lg font-medium text-white ml-2">
                호랭(일반관리자)
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-3">
                {menuItems.map((item) => (
                  <li key={item.text}>
                    <button
                      onClick={() => handleMenuItemClick(item)}
                      className={`
                        flex items-center w-full px-3 py-2 text-sm rounded-lg text-white
                        ${pathname === item.path 
                          ? 'bg-slate-600' 
                          : 'hover:bg-slate-600'
                        }
                      `}
                    >
                      {item.icon}
                      <span className="ml-3">{item.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Logout button */}
            <div className="p-4 border-t border-slate-400">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm text-white rounded-lg hover:bg-slate-600"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-3">로그아웃</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile sidebar */}
        <div
          className={`
            fixed inset-0 z-40 lg:hidden
            ${mobileOpen ? 'block' : 'hidden'}
          `}
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50"
            onClick={handleDrawerToggle}
          />

          {/* Sidebar */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-slate-600">
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center p-4 border-b">
                <Image
                  src="/admin-avatar.png"
                  alt="Admin Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="text-lg font-medium text-white ml-2">
                  호랭(일반관리자)
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                  {menuItems.map((item) => (
                    <li key={item.text}>
                      <button
                        onClick={() => handleMenuItemClick(item)}
                        className={`
                          flex items-center w-full px-3 py-2 text-sm rounded-lg text-white
                          ${pathname === item.path 
                            ? 'bg-slate-600' 
                            : 'hover:bg-slate-600'
                          }
                        `}
                      >
                        {item.icon}
                        <span className="ml-3">{item.text}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Logout button */}
              <div className="p-4 border-t border-slate-400">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm text-white rounded-lg hover:bg-slate-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="ml-3">로그아웃</span>
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold">Administrator Control Center</h1>
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
