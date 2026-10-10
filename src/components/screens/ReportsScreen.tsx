'use client';

import React, { useState } from 'react';
import { MOCK_AGENTS } from '../../data/mockCrmData';

interface ReportsScreenProps {
  onToast: (msg: string) => void;
}

export default function ReportsScreen({ onToast }: ReportsScreenProps) {
  const [selectedBranch, setSelectedBranch] = useState('Phòng KD1 (Chi nhánh Miền Bắc)');

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* 1. Header & Filter Bar */}
      <div className="flex flex-col gap-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
              <h1 className="font-headline-lg text-2xl font-bold text-on-surface">
                Báo cáo & Phân tích KPI Kinh doanh
              </h1>
            </div>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
              Thống kê chuyên sâu hiệu suất chuyển đổi, hoạt động cuộc gọi và năng suất đội ngũ sale đa chiều
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => onToast('Đang mở bảng tùy biến chỉ số hiển thị...')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs shadow-xs transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-outline">tune</span>
              <span>Tùy chỉnh cột</span>
            </button>
            <button
              onClick={() => onToast('Đang xuất toàn bộ số liệu KPI ra file Excel...')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-md text-xs shadow-sm transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Xuất báo cáo Excel/CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-outline-variant/20">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-outline">Dự án kinh doanh</label>
            <select className="w-full text-xs font-medium text-on-surface bg-surface-container-low rounded-xl px-3 py-2 border border-outline-variant/30 focus:outline-none cursor-pointer">
              <option>BĐS Green Residence</option>
              <option>EcoPark Riverside</option>
              <option>Chung cư Sun Grand City</option>
              <option>Tất cả dự án hiện hữu</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-outline">Khối / Phòng ban</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full text-xs font-medium text-on-surface bg-surface-container-low rounded-xl px-3 py-2 border border-outline-variant/30 focus:outline-none cursor-pointer"
            >
              <option>Phòng KD1 (Chi nhánh Miền Bắc)</option>
              <option>Phòng KD2 (Chi nhánh Miền Nam)</option>
              <option>Đội Telesales Outbound VIP</option>
              <option>Tất cả phòng ban</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-outline">Nhân sự sale</label>
            <select className="w-full text-xs font-medium text-on-surface bg-surface-container-low rounded-xl px-3 py-2 border border-outline-variant/30 focus:outline-none cursor-pointer">
              <option>Tất cả nhân sự (Toàn đội ngũ)</option>
              <option>Nguyễn Minh Anh (Lead Sale)</option>
              <option>Trần Hoàng Nam</option>
              <option>Lê Thu Hà</option>
              <option>Phạm Đức Long</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-outline">Khoảng thời gian báo cáo</label>
            <div className="flex items-center bg-surface-container-low rounded-xl px-3 py-2 border border-outline-variant/30 text-xs">
              <span className="material-symbols-outlined text-[16px] text-primary mr-1.5">calendar_month</span>
              <span className="truncate">Tháng 10/2024</span>
              <span className="material-symbols-outlined text-[16px] text-outline ml-auto">expand_more</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 6 Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/30">
          <span className="text-[10px] uppercase font-semibold text-outline block">Tổng lead nạp</span>
          <strong className="text-xl font-bold text-on-surface font-mono block mt-1">12,480</strong>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">+14.2% MoM</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/30">
          <span className="text-[10px] uppercase font-semibold text-outline block">Cuộc gọi thực hiện</span>
          <strong className="text-xl font-bold text-primary font-mono block mt-1">8,420</strong>
          <span className="text-[11px] text-primary font-semibold mt-1 block">TB: 2.8p/cuộc</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/30">
          <span className="text-[10px] uppercase font-semibold text-outline block">Tỷ lệ kết nối</span>
          <strong className="text-xl font-bold text-emerald-600 font-mono block mt-1">68.4%</strong>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Vượt KPI 3.4%</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/30">
          <span className="text-[10px] uppercase font-semibold text-outline block">Hẹn gặp tư vấn</span>
          <strong className="text-xl font-bold text-sky-600 font-mono block mt-1">840</strong>
          <span className="text-[11px] text-sky-700 font-semibold mt-1 block">Tỷ lệ: 10.0%</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/30">
          <span className="text-[10px] uppercase font-semibold text-outline block">Cọc thành công</span>
          <strong className="text-xl font-bold text-amber-600 font-mono block mt-1">286 deal</strong>
          <span className="text-[11px] text-amber-700 font-semibold mt-1 block">+8.6% tỷ lệ chốt</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/30">
          <span className="text-[10px] uppercase font-semibold text-outline block">Doanh số cọc</span>
          <strong className="text-xl font-bold text-emerald-700 font-mono block mt-1">42.8 tỷ</strong>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Đạt 94% kế hoạch</span>
        </div>
      </div>

      {/* 3. Deep Dive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-base font-bold text-on-surface">
              Xu hướng cuộc gọi & Tỷ lệ kết nối theo ngày
            </h2>
            <span className="text-xs text-outline font-mono">01/10 - 24/10/2024</span>
          </div>

          <div className="relative w-full h-64 flex flex-col justify-end pt-4">
            <svg className="w-full h-48 overflow-visible" preserveAspectRatio="none" viewBox="0 0 720 160">
              <line stroke="#e2e7ff" strokeDasharray="3 3" x1="0" x2="720" y1="0" y2="0" />
              <line stroke="#e2e7ff" strokeDasharray="3 3" x1="0" x2="720" y1="40" y2="40" />
              <line stroke="#e2e7ff" strokeDasharray="3 3" x1="0" x2="720" y1="80" y2="80" />
              <line stroke="#e2e7ff" strokeDasharray="3 3" x1="0" x2="720" y1="120" y2="120" />
              <line stroke="#dae2fd" x1="0" x2="720" y1="160" y2="160" />

              <path
                d="M 0 110 Q 90 70, 180 85 T 360 50 T 540 30 T 720 20"
                fill="none"
                stroke="#3525cd"
                strokeWidth="3"
              />
              <path
                d="M 0 130 Q 90 95, 180 110 T 360 75 T 540 60 T 720 50"
                fill="none"
                stroke="#059669"
                strokeWidth="2.5"
              />
            </svg>
            <div className="flex justify-between text-[11px] text-outline pt-2 border-t border-outline-variant/20">
              <span>Tuần 1</span>
              <span>Tuần 2</span>
              <span>Tuần 3</span>
              <span className="font-bold text-primary">Tuần 4 (Hiện tại)</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
          <h2 className="font-headline-sm text-base font-bold text-on-surface">
            Cơ cấu kết quả cuộc gọi
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex justify-between items-center">
              <span className="font-semibold text-emerald-900">Đã kết nối & tư vấn</span>
              <strong className="font-mono text-emerald-950 font-bold">5,760 (68.4%)</strong>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex justify-between items-center">
              <span className="font-semibold text-amber-900">Hẹn gọi lại sau</span>
              <strong className="font-mono text-amber-950 font-bold">1,420 (16.9%)</strong>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex justify-between items-center">
              <span className="font-semibold text-blue-900">Máy bận / Không nhấc</span>
              <strong className="font-mono text-blue-950 font-bold">890 (10.6%)</strong>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex justify-between items-center">
              <span className="font-semibold text-gray-700">Sai số / Nhầm máy</span>
              <strong className="font-mono text-gray-900 font-bold">350 (4.1%)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Sales Agent Detailed Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6 space-y-4">
        <h2 className="font-headline-sm text-base font-bold text-on-surface">
          Hiệu suất chi tiết từng nhân viên sale
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-outline uppercase font-semibold border-b border-outline-variant/30">
                <th className="py-3 px-3">Nhân sự</th>
                <th className="py-3 px-3">Phòng ban</th>
                <th className="py-3 px-3 text-right">Tổng cuộc gọi</th>
                <th className="py-3 px-3 text-right">Tỷ lệ kết nối</th>
                <th className="py-3 px-3 text-right">Khách hẹn tư vấn</th>
                <th className="py-3 px-3 text-right">Cọc chốt</th>
                <th className="py-3 px-3 text-right">Tỷ lệ chốt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {MOCK_AGENTS.map((a) => (
                <tr key={a.id} className="hover:bg-surface-container-low transition">
                  <td className="py-3 px-3 font-semibold text-on-surface">{a.name}</td>
                  <td className="py-3 px-3 text-on-surface-variant">{a.team}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">{a.totalCalls}</td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-700 font-semibold">
                    {(65 + a.closedDeals).toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-medium">{a.leadsToday * 3}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-primary">{a.closedDeals}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">{a.conversionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
