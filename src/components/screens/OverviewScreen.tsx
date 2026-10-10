'use client';

import React, { useState } from 'react';
import { MOCK_AGENTS, MOCK_CALL_LOGS } from '../../data/mockCrmData';

interface OverviewScreenProps {
  onNavigateTab: (tab: any) => void;
  onToast: (msg: string) => void;
}

export default function OverviewScreen({ onNavigateTab, onToast }: OverviewScreenProps) {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | 'month'>('month');
  const [selectedProject, setSelectedProject] = useState('BĐS Green Residence');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onToast('Dữ liệu kinh doanh đã được đồng bộ mới nhất');
    }, 700);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* 1. Page Header */}
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Tổng quan hoạt động kinh doanh
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-label-sm text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Trực tiếp
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Theo dõi hoạt động kinh doanh, tiến độ xử lý lead và hiệu suất đội ngũ sale theo thời gian thực
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Project Filter */}
          <div className="relative inline-flex items-center">
            <span className="material-symbols-outlined absolute left-2.5 text-[18px] text-outline pointer-events-none">
              domain
            </span>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="pl-8 pr-7 py-2 bg-surface-container-low text-on-surface font-label-md text-sm rounded-xl focus:outline-none appearance-none cursor-pointer hover:bg-surface-container border border-outline-variant/30"
            >
              <option>BĐS Green Residence</option>
              <option>Khu Đô Thị EcoPark Riverside</option>
              <option>Chung cư Sun Grand City</option>
              <option>Tư vấn tài chính VIP</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 text-[16px] text-outline pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Time Range Picker */}
          <div className="inline-flex items-center p-1 bg-surface-container-low rounded-xl text-on-surface-variant font-label-sm text-xs border border-outline-variant/30">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                timeRange === 'today'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                  : 'hover:text-on-surface'
              }`}
            >
              Hôm nay
            </button>
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                timeRange === '7days'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                  : 'hover:text-on-surface'
              }`}
            >
              7 ngày qua
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                timeRange === 'month'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                  : 'hover:text-on-surface'
              }`}
            >
              Tháng này
            </button>
          </div>

          {/* Refresh Status */}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-surface-container rounded-xl font-label-sm text-xs transition-colors cursor-pointer border border-outline-variant/30"
            title="Bấm để đồng bộ dữ liệu mới"
          >
            <span className={`material-symbols-outlined text-[16px] ${isRefreshing ? 'animate-spin text-primary' : ''}`}>
              refresh
            </span>
            <span className="hidden sm:inline">Vừa cập nhật</span>
          </button>

          {/* Export Button */}
          <button
            onClick={() => onToast('Đang tạo tệp Excel tổng quan kinh doanh tháng...')}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-container hover:bg-primary text-on-primary font-label-md text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </header>

      {/* 2. KPI Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Tổng data khách hàng */}
        <div
          onClick={() => onNavigateTab('customers')}
          className="relative overflow-hidden bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between space-y-3 group hover:shadow-md hover:border-primary/40 transition cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col space-y-0.5">
              <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-semibold">
                Tổng data khách hàng
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-xl text-3xl font-bold text-on-surface tracking-tight">
                  12,480
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shadow-sm">
              <span className="material-symbols-outlined text-[24px]">group</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-label-sm text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +14.2% so với tháng trước
            </span>
            <span className="font-body-sm text-xs text-on-surface-variant font-medium">
              Tiếp cận: 88.5%
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-container">
            <div className="h-full bg-primary" style={{ width: '88.5%' }}></div>
          </div>
        </div>

        {/* Card 2: Data chưa phân bổ */}
        <div
          onClick={() => onNavigateTab('allocation')}
          className="relative overflow-hidden bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between space-y-3 group hover:shadow-md hover:border-red-300 transition cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col space-y-0.5">
              <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-semibold">
                Data chưa phân bổ
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-xl text-3xl font-bold text-error tracking-tight">
                  1,245
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center text-error shadow-sm">
              <span className="material-symbols-outlined text-[24px]">inbox</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-700 font-label-sm text-xs font-bold">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              Cần xử lý ngay
            </span>
            <span className="font-body-sm text-xs text-on-surface-variant font-medium truncate">
              FB Ads: 680 lead
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-container">
            <div className="h-full bg-error" style={{ width: '45%' }}></div>
          </div>
        </div>

        {/* Card 3: Cuộc gọi hôm nay */}
        <div
          onClick={() => onNavigateTab('calendar')}
          className="relative overflow-hidden bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between space-y-3 group hover:shadow-md hover:border-sky-300 transition cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col space-y-0.5">
              <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-semibold">
                Cuộc gọi hôm nay
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-headline-xl text-3xl font-bold text-on-surface tracking-tight">
                  348
                </span>
                <span className="font-headline-sm text-sm text-outline font-normal">/ 500</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-sky-100 flex items-center justify-center text-secondary shadow-sm">
              <span className="material-symbols-outlined text-[24px]">phone_in_talk</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 text-sky-800 font-label-sm text-xs font-semibold">
              74% mục tiêu ngày
            </span>
            <span className="font-body-sm text-xs text-on-surface-variant font-medium">
              TB: 2p 45s / cuộc
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-container">
            <div className="h-full bg-secondary" style={{ width: '74%' }}></div>
          </div>
        </div>

        {/* Card 4: Khách hàng quan tâm */}
        <div
          onClick={() => onNavigateTab('customers')}
          className="relative overflow-hidden bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between space-y-3 group hover:shadow-md hover:border-amber-300 transition cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col space-y-0.5">
              <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-semibold">
                Khách tiềm năng (Hot Lead)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-xl text-3xl font-bold text-amber-600 tracking-tight">
                  286
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shadow-sm">
              <span className="material-symbols-outlined text-[24px] fill text-amber-600">
                local_fire_department
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-label-sm text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              +8.6% tỷ lệ chốt
            </span>
            <span className="font-body-sm text-xs text-on-surface-variant font-medium">
              42 cọc thành công
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-container">
            <div className="h-full bg-amber-500" style={{ width: '62%' }}></div>
          </div>
        </div>
      </section>

      {/* 3. Analytics Charts & Top Sales Leaderboard */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Line Chart */}
        <div className="xl:col-span-8 flex flex-col space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                  Hoạt động cuộc gọi & kết nối theo ngày
                </h2>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Dữ liệu tổng hợp từ ngày 01 đến 24 tháng 10 năm 2024
                </p>
              </div>
              <div className="flex items-center gap-3 font-label-sm text-xs flex-wrap">
                <span className="flex items-center gap-1.5 text-on-surface">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                  Tổng cuộc gọi (520)
                </span>
                <span className="flex items-center gap-1.5 text-on-surface">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  Đã kết nối (348)
                </span>
                <span className="flex items-center gap-1.5 text-on-surface">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                  Hẹn gọi lại (78)
                </span>
              </div>
            </div>

            {/* SVG Trend Area Chart */}
            <div className="relative w-full h-64 flex flex-col justify-end pt-4">
              <svg className="w-full h-48 overflow-visible" preserveAspectRatio="none" viewBox="0 0 720 160">
                <line className="text-surface-container" stroke="#e2e7ff" strokeDasharray="3 3" x1="0" x2="720" y1="0" y2="0" />
                <line className="text-surface-container" stroke="#e2e7ff" strokeDasharray="3 3" x1="0" x2="720" y1="40" y2="40" />
                <line className="text-surface-container" stroke="#e2e7ff" strokeDasharray="3 3" x1="0" x2="720" y1="80" y2="80" />
                <line className="text-surface-container" stroke="#e2e7ff" strokeDasharray="3 3" x1="0" x2="720" y1="120" y2="120" />
                <line className="text-surface-container-high" stroke="#dae2fd" x1="0" x2="720" y1="160" y2="160" />

                <defs>
                  <linearGradient id="primaryArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="emeraldArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Total Calls */}
                <path d="M 0 120 Q 80 80, 160 95 T 320 60 T 480 40 T 600 70 T 720 25 L 720 160 L 0 160 Z" fill="url(#primaryArea)" />
                <path d="M 0 120 Q 80 80, 160 95 T 320 60 T 480 40 T 600 70 T 720 25" fill="none" stroke="#4F46E5" strokeWidth="2.5" />

                {/* Connected Calls */}
                <path d="M 0 140 Q 80 110, 160 120 T 320 85 T 480 75 T 600 100 T 720 60 L 720 160 L 0 160 Z" fill="url(#emeraldArea)" />
                <path d="M 0 140 Q 80 110, 160 120 T 320 85 T 480 75 T 600 100 T 720 60" fill="none" stroke="#059669" strokeWidth="2" />

                {/* Callback line */}
                <path d="M 0 152 Q 80 135, 160 145 T 320 125 T 480 120 T 600 130 T 720 110" fill="none" stroke="#38BDF8" strokeDasharray="4 3" strokeWidth="2" />

                <circle cx="480" cy="40" fill="#4F46E5" r="4" />
                <circle cx="480" cy="75" fill="#059669" r="3.5" />
              </svg>

              <div className="flex justify-between text-outline font-label-sm text-xs pt-3 border-t border-outline-variant/20">
                <span>01/10</span>
                <span>05/10</span>
                <span>09/10</span>
                <span>13/10</span>
                <span>17/10</span>
                <span>21/10</span>
                <span className="font-bold text-primary">24/10 (Hôm nay)</span>
              </div>
            </div>
          </div>

          {/* Real-time Call Activity Table */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                  Hoạt động tương tác cuộc gọi mới nhất
                </h2>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Cập nhật tự động từ tổng đài VoIP & hệ thống telesale
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('calendar')}
                className="text-primary hover:underline text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                Xem tất cả lịch hẹn <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/20 text-outline uppercase font-semibold">
                    <th className="py-2.5 px-3">Khách hàng</th>
                    <th className="py-2.5 px-3">Số điện thoại</th>
                    <th className="py-2.5 px-3">Nhân sự</th>
                    <th className="py-2.5 px-3">Thời gian</th>
                    <th className="py-2.5 px-3">Thời lượng</th>
                    <th className="py-2.5 px-3">Trạng thái</th>
                    <th className="py-2.5 px-3 text-right">Tác vụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {MOCK_CALL_LOGS.map((log) => (
                    <tr key={log.id} className="hover:bg-surface-container-low transition">
                      <td className="py-3 px-3 font-semibold text-on-surface">{log.lead}</td>
                      <td className="py-3 px-3 font-mono text-outline">{log.phone}</td>
                      <td className="py-3 px-3 text-on-surface-variant">{log.agent}</td>
                      <td className="py-3 px-3 font-medium">{log.time}</td>
                      <td className="py-3 px-3 font-mono">{log.duration}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold ${
                            log.status === 'Đã kết nối'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onToast(`Đang kết nối lại cuộc gọi với ${log.lead}...`)}
                          className="px-2 py-1 bg-surface-container hover:bg-primary hover:text-white rounded-md text-primary font-medium transition cursor-pointer"
                        >
                          Gọi lại
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Sales Leaderboard & Sales Funnel */}
        <div className="xl:col-span-4 flex flex-col space-y-6">
          {/* Sales Leaderboard */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-base font-bold text-on-surface">
                  Bảng xếp hạng hiệu suất sale
                </h2>
                <p className="font-body-sm text-xs text-on-surface-variant">Top chuyên viên chốt deal cao nhất</p>
              </div>
              <span className="material-symbols-outlined text-amber-500 text-[22px]">military_tech</span>
            </div>

            <div className="space-y-3">
              {MOCK_AGENTS.slice(0, 5).map((agent, idx) => (
                <div key={agent.id} className="p-2.5 rounded-xl hover:bg-surface-container-low transition border border-outline-variant/20">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          idx === 0
                            ? 'bg-amber-100 text-amber-800'
                            : idx === 1
                            ? 'bg-slate-200 text-slate-700'
                            : idx === 2
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-surface-container text-outline'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="font-label-md text-xs font-semibold text-on-surface">
                        {agent.name}
                      </span>
                      <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 text-[10px] rounded font-semibold">
                        {agent.closedDeals} cọc
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 font-mono">
                      {agent.conversionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-primary-container h-full rounded-full transition-all duration-500"
                      style={{ width: `${agent.conversionRate * 6}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('reports')}
              className="w-full py-2 bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-xs rounded-xl font-semibold transition cursor-pointer"
            >
              Xem toàn bộ chỉ số KPI đội ngũ
            </button>
          </div>

          {/* Sales Conversion Funnel */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
            <h2 className="font-headline-sm text-base font-bold text-on-surface">
              Phễu chuyển đổi bán hàng
            </h2>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 flex justify-between items-center">
                <span className="font-medium text-indigo-900">1. Marketing Lead (Nạp mới)</span>
                <strong className="font-mono text-indigo-950 font-bold">12,480 (100%)</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 flex justify-between items-center ml-2">
                <span className="font-medium text-blue-900">2. Tiếp cận & Cuộc gọi</span>
                <strong className="font-mono text-blue-950 font-bold">11,040 (88.5%)</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100 flex justify-between items-center ml-4">
                <span className="font-medium text-sky-900">3. Đã kết nối trao đổi</span>
                <strong className="font-mono text-sky-950 font-bold">7,850 (62.9%)</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 flex justify-between items-center ml-6">
                <span className="font-medium text-amber-900">4. Quan tâm cao (Hot Lead)</span>
                <strong className="font-mono text-amber-950 font-bold">2,140 (17.1%)</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between items-center ml-8 shadow-xs">
                <span className="font-bold text-emerald-900">5. Chốt cọc thành công</span>
                <strong className="font-mono text-emerald-950 font-bold text-sm">286 (2.3%)</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
