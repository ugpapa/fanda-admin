/** @format */

"use client";

import React, { useState, useEffect } from 'react';
import { Users, Package, CreditCard, BanknoteIcon, Bell } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import dynamic from 'next/dynamic';

// ApexCharts 동적 임포트
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <div className="h-[400px] flex items-center justify-center">Loading chart...</div>
});

interface StatCard {
  title: string;
  total: number;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  icon: React.ReactNode;
  color: string;
  creditUsage?: {
    total: number;
    today: number;
    yesterday: number;
    lastWeek: number;
    lastMonth: number;
  };
  productStatus?: {
    onSale: number;
    completed: number;
    onSaleToday: number;
    completedToday: number;
    onSaleYesterday: number;
    completedYesterday: number;
    onSaleLastWeek: number;
    completedLastWeek: number;
    onSaleLastMonth: number;
    completedLastMonth: number;
  };
  format?: (value: number) => string;
}

interface VisibleSeries {
  transaction: {
    [key: string]: boolean;
    '거래액': boolean;
    '마일리지': boolean;
  };
  status: {
    [key: string]: boolean;
    '회원 수': boolean;
    '상품 수': boolean;
  };
}

const DashboardPage = () => {
  const [transactionTab, setTransactionTab] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const [statusTab, setStatusTab] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const [mounted, setMounted] = useState(false);
  const [visibleSeries, setVisibleSeries] = useState<VisibleSeries>({
    transaction: {
      '거래액': true,
      '마일리지': true
    },
    status: {
      '회원 수': true,
      '상품 수': true
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // 차트 옵션
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'line' as const,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true
      },
      background: 'transparent'
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    yaxis: [
      {
        title: {
          text: '거래액'
        },
        labels: {
          formatter: (value: number) => `${value.toLocaleString()}원`
        }
      },
      {
        opposite: true,
        title: {
          text: '마일리지'
        },
        labels: {
          formatter: (value: number) => `${value.toLocaleString()}`
        }
      }
    ],
    colors: ['#3B82F6', '#8B5CF6'],
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      onItemClick: {
        toggleDataSeries: false
      }
    },
    grid: {
      show: true,
      borderColor: '#f1f1f1',
      strokeDashArray: 4
    },
    tooltip: {
      enabled: true,
      shared: true
    }
  };

  // 차트 데이터
  const chartData = {
    monthly: [
      {
        name: '거래액',
        data: [1200000, 1900000, 300000, 500000, 200000, 300000]
      },
      {
        name: '마일리지',
        data: [1200, 1900, 300, 500, 200, 300]
      }
    ],
    weekly: [
      {
        name: '거래액',
        data: [1000000, 1500000, 800000, 1200000]
      },
      {
        name: '마일리지',
        data: [1000, 1500, 800, 1200]
      }
    ],
    daily: [
      {
        name: '거래액',
        data: [500000, 800000, 600000, 900000, 700000, 400000, 300000]
      },
      {
        name: '마일리지',
        data: [500, 800, 600, 900, 700, 400, 300]
      }
    ]
  };

  // 회원/상품 현황 차트 옵션
  const statusChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'line' as const,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true
      },
      background: 'transparent'
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    yaxis: {
      title: {
        text: '수량'
      },
      labels: {
        formatter: (value: number) => value.toLocaleString()
      }
    },
    colors: ['#3B82F6', '#10B981'],
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      onItemClick: {
        toggleDataSeries: false
      }
    },
    grid: {
      show: true,
      borderColor: '#f1f1f1',
      strokeDashArray: 4
    },
    tooltip: {
      enabled: true,
      shared: true
    }
  };

  // 회원/상품 현황 데이터
  const statusChartData = {
    monthly: [
      {
        name: '회원 수',
        data: [150, 280, 320, 450, 520, 650]
      },
      {
        name: '상품 수',
        data: [80, 120, 180, 250, 300, 380]
      }
    ],
    weekly: [
      {
        name: '회원 수',
        data: [480, 520, 580, 650]
      },
      {
        name: '상품 수',
        data: [280, 320, 350, 380]
      }
    ],
    daily: [
      {
        name: '회원 수',
        data: [590, 610, 625, 635, 642, 648, 650]
      },
      {
        name: '상품 수',
        data: [350, 358, 365, 370, 374, 378, 380]
      }
    ]
  };

  // 통계 데이터
  const stats: StatCard[] = [
    {
      title: "회원",
      total: 2500,
      today: 25,
      yesterday: 20,
      lastWeek: 150,
      lastMonth: 450,
      icon: <Users className="w-6 h-6" />,
      color: "bg-blue-500",
      format: (value: number) => `${value.toLocaleString()}명`
    },
    {
      title: "거래액",
      total: 15000000,
      today: 1200000,
      yesterday: 1500000,
      lastWeek: 8000000,
      lastMonth: 35000000,
      icon: <CreditCard className="w-6 h-6" />,
      color: "bg-green-500",
      format: (value: number) => `${value.toLocaleString()}원`
    },
    {
      title: "상품",
      total: 850,
      today: 15,
      yesterday: 20,
      lastWeek: 100,
      lastMonth: 300,
      icon: <Package className="w-6 h-6" />,
      color: "bg-yellow-500",
      format: (value: number) => `${value.toLocaleString()}개`
    },
    {
      title: "마일리지",
      total: 7500000,
      today: 150000,
      yesterday: 200000,
      lastWeek: 1000000,
      lastMonth: 3000000,
      icon: <BanknoteIcon className="w-6 h-6" />,
      color: "bg-purple-500",
      format: (value: number) => `${value.toLocaleString()}원`
    }
  ];

  // 알림 데이터
  const notifications = [
    { type: 'member', message: '새로운 회원가입: 김농부', time: '10분 전' },
    { type: 'product', message: '새로운 상품등록: 제주 감귤 10kg', time: '30분 전' },
    { type: 'transaction', message: '거래완료: 청송 사과 밭떼기', time: '1시간 전' },
    { type: 'credit', message: '마일리지 결제: 3,000원 ', time: '2시간 전' },
  ];

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${stat.color} p-2 rounded-lg text-white flex-shrink-0`}>
                    {stat.icon}
                  </div>
                  <h2 className="text-lg font-semibold">{stat.title} 현황</h2>
                </div>
                <div className="flex flex-col flex-grow">
                  <div className="text-2xl font-bold mb-4">
                    {stat.format ? stat.format(stat.total) : stat.total.toLocaleString()}
                  </div>
                  <div className="space-y-2 text-sm mt-auto">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">오늘</span>
                      <span className="text-right">{stat.format ? stat.format(stat.today) : stat.today.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">어제</span>
                      <span className="text-right">{stat.format ? stat.format(stat.yesterday) : stat.yesterday.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">지난주</span>
                      <span className="text-right">{stat.format ? stat.format(stat.lastWeek) : stat.lastWeek.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">지난달</span>
                      <span className="text-right">{stat.format ? stat.format(stat.lastMonth) : stat.lastMonth.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">최근 알림</h2>
              <Bell className="w-5 h-5 text-gray-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {notifications.map((notification, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {notification.type === 'member' && <Users className="w-5 h-5 text-blue-500" />}
                    {notification.type === 'product' && <Package className="w-5 h-5 text-green-500" />}
                    {notification.type === 'transaction' && <CreditCard className="w-5 h-5 text-orange-500" />}
                    {notification.type === 'credit' && <BanknoteIcon className="w-5 h-5 text-purple-500" />}
                    <span className="text-sm">{notification.message}</span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">{notification.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">거래/마일리지 통계</h2>
                <div className="flex gap-2">
                  {['monthly', 'weekly', 'daily'].map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        transactionTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => setTransactionTab(tab as 'monthly' | 'weekly' | 'daily')}
                    >
                      {tab === 'monthly' ? '월별' : tab === 'weekly' ? '주별' : '일별'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[400px]">
                {mounted && (
                  <Chart
                    options={{
                      ...chartOptions,
                      xaxis: {
                        categories: transactionTab === 'monthly' 
                          ? ['1월', '2월', '3월', '4월', '5월', '6월']
                          : transactionTab === 'weekly'
                            ? ['1주차', '2주차', '3주차', '4주차']
                            : ['월', '화', '수', '목', '금', '토', '일'],
                        labels: {
                          style: {
                            colors: '#4B5563'
                          }
                        }
                      },
                      chart: {
                        ...chartOptions.chart,
                        events: {
                          legendClick: function(chartContext, seriesIndex) {
                            setVisibleSeries(prev => ({
                              ...prev,
                              transaction: {
                                ...prev.transaction,
                                [chartData[transactionTab][seriesIndex].name]: !prev.transaction[chartData[transactionTab][seriesIndex].name]
                              }
                            }));
                            return true;
                          }
                        }
                      }
                    }}
                    series={chartData[transactionTab].map(series => ({
                      ...series,
                      data: visibleSeries.transaction[series.name] ? series.data : series.data.map(() => 0)
                    }))}
                    type="line"
                    height={400}
                  />
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">회원/상품 현황</h2>
                <div className="flex gap-2">
                  {['monthly', 'weekly', 'daily'].map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        statusTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => setStatusTab(tab as 'monthly' | 'weekly' | 'daily')}
                    >
                      {tab === 'monthly' ? '월별' : tab === 'weekly' ? '주별' : '일별'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[400px]">
                {mounted && (
                  <Chart
                    options={{
                      ...statusChartOptions,
                      xaxis: {
                        categories: statusTab === 'monthly' 
                          ? ['1월', '2월', '3월', '4월', '5월', '6월']
                          : statusTab === 'weekly'
                            ? ['1주차', '2주차', '3주차', '4주차']
                            : ['월', '화', '수', '목', '금', '토', '일'],
                        labels: {
                          style: {
                            colors: '#4B5563'
                          }
                        }
                      },
                      chart: {
                        ...statusChartOptions.chart,
                        events: {
                          legendClick: function(chartContext, seriesIndex) {
                            setVisibleSeries(prev => ({
                              ...prev,
                              status: {
                                ...prev.status,
                                [statusChartData[statusTab][seriesIndex].name]: !prev.status[statusChartData[statusTab][seriesIndex].name]
                              }
                            }));
                            return true;
                          }
                        }
                      }
                    }}
                    series={statusChartData[statusTab].map(series => ({
                      ...series,
                      data: visibleSeries.status[series.name] ? series.data : series.data.map(() => 0)
                    }))}
                    type="line"
                    height={400}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
