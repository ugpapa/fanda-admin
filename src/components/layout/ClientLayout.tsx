"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ShoppingBag,
  Gavel,
  Users,
  CreditCard,
  FileText,
  Tag,
  Settings,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    title: "대시보드",
    icon: <LayoutGrid className="w-5 h-5" />,
    href: "/dashboard",
  },
  {
    title: "상품 관리",
    icon: <ShoppingBag className="w-5 h-5" />,
    href: "/products",
  },
  {
    title: "경매 관리",
    icon: <Gavel className="w-5 h-5" />,
    href: "/auctions",
  },
  {
    title: "회원 관리",
    icon: <Users className="w-5 h-5" />,
    href: "/members",
  },
  {
    title: "크레딧 관리",
    icon: <CreditCard className="w-5 h-5" />,
    href: "/credits",
  },
  {
    title: "계약 관리",
    icon: <FileText className="w-5 h-5" />,
    href: "/contracts",
  },
  {
    title: "카테고리 관리",
    icon: <Tag className="w-5 h-5" />,
    href: "/categories",
  },
  {
    title: "시스템 설정",
    icon: <Settings className="w-5 h-5" />,
    href: "/settings",
  },
  {
    title: "에스크로 관리",
    icon: <Shield className="w-5 h-5" />,
    href: "/escrow",
  },
  {
    title: "공지사항",
    icon: <Bell className="w-5 h-5" />,
    href: "/notices",
  },
  {
    title: "문의 관리",
    icon: <HelpCircle className="w-5 h-5" />,
    href: "/inquiries",
  },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      {/* 사이드바 */}
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* 로고 영역 */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <span className="text-xl font-semibold">관리자</span>
          </div>

          {/* 메뉴 영역 */}
          <div className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 ${
                      pathname === item.href
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-700"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 로그아웃 버튼 */}
          <div className="p-4 border-t border-gray-200">
            <button className="flex items-center w-full px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <LogOut className="w-5 h-5" />
              <span className="ml-3">로그아웃</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
} 