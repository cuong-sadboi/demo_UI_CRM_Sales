'use client';

import React, { useState } from 'react';
import { MOCK_AGENTS } from '../../data/mockCrmData';

interface AllocationScreenProps {
  onToast: (msg: string) => void;
}

export default function AllocationScreen({ onToast }: AllocationScreenProps) {
  const [agents, setAgents] = useState(MOCK_AGENTS);
  const [allocationMode, setAllocationMode] = useState<'round-robin' | 'kpi' | 'manual'>('round-robin');
  const [unassignedPool, setUnassignedPool] = useState(1245);
  const [isDistributing, setIsDistributing] = useState(false);
  const [autoBatchSize, setAutoBatchSize] = useState(50);

  const toggleAgentOnline = (id: string) => {
    setAgents((prev) =>
      prev.map((ag) =>
        ag.id === id ? { ...ag, isOnline: !ag.isOnline } : ag
      )
    );
  };

  const handleRunAutoAllocation = () => {
    if (unassignedPool === 0) {
      onToast('Hàng đợi không còn lead nào chưa phân bổ');
      return;
    }
    setIsDistributing(true);
    setTimeout(() => {
      const activeAgents = agents.filter((a) => a.isOnline);
      const countPerAgent = Math.floor(autoBatchSize / (activeAgents.length || 1));
      setAgents((prev) =>
        prev.map((ag) =>
          ag.isOnline
            ? { ...ag, leadsToday: ag.leadsToday + countPerAgent }
            : ag
        )
      );
      setUnassignedPool((prev) => Math.max(0, prev - autoBatchSize));
      setIsDistributing(false);
      onToast(`Đã chia tự động ${autoBatchSize} lead cho ${activeAgents.length} nhân viên đang trực tuyến!`);
    }, 800);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-sm text-xs uppercase tracking-wider text-primary font-semibold">
              Điều phối Lead
            </span>
            <span className="text-outline-variant">•</span>
            <span className="font-label-sm text-xs text-outline">Lead Distribution Engine</span>
          </div>
          <h1 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
            Phân bổ Data Khách hàng
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
            Thiết lập thuật toán chia lead tự động, cân bằng tải telesale theo ca trực và tối ưu tỷ lệ tiếp cận đầu tiên
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-100 text-error flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">inbox</span>
            </div>
            <div>
              <span className="text-[11px] text-red-700 block font-semibold uppercase">Lead chờ chia</span>
              <strong className="text-lg font-bold text-error font-mono">{unassignedPool.toLocaleString()}</strong>
            </div>
          </div>
          <button
            onClick={handleRunAutoAllocation}
            disabled={isDistributing}
            className={`flex items-center gap-1.5 px-4 py-3 bg-primary hover:bg-primary-container text-white font-semibold text-xs rounded-xl shadow-md transition cursor-pointer ${
              isDistributing ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${isDistributing ? 'animate-spin' : ''}`}>
              {isDistributing ? 'sync' : 'bolt'}
            </span>
            <span>Chạy phân bổ ngay ({autoBatchSize} lead)</span>
          </button>
        </div>
      </div>

      {/* 2. Allocation Configuration Mode */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card: Mode Selection */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
          <h2 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
            Thuật toán phân phối lead
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => { setAllocationMode('round-robin'); onToast('Chuyển sang cơ chế: Tự động xoay vòng Round-Robin'); }}
              className={`p-4 rounded-xl border-2 transition cursor-pointer space-y-2 ${
                allocationMode === 'round-robin'
                  ? 'border-primary bg-primary-fixed/20'
                  : 'border-outline-variant/30 hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-on-surface">Xoay vòng (Round-Robin)</span>
                {allocationMode === 'round-robin' && (
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                )}
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Chia đều lần lượt từng lead cho tất cả nhân viên đang trực tuyến và chưa đạt hạn mức ngày.
              </p>
            </div>

            <div
              onClick={() => { setAllocationMode('kpi'); onToast('Chuyển sang cơ chế: Ưu tiên theo hiệu suất KPI & Tỷ lệ chốt'); }}
              className={`p-4 rounded-xl border-2 transition cursor-pointer space-y-2 ${
                allocationMode === 'kpi'
                  ? 'border-primary bg-primary-fixed/20'
                  : 'border-outline-variant/30 hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-on-surface">Theo KPI & Tỷ lệ %</span>
                {allocationMode === 'kpi' && (
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                )}
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Lead nóng được ưu tiên phân bổ cho sale có tỷ lệ chốt cao nhất tháng theo trọng số cấu hình.
              </p>
            </div>

            <div
              onClick={() => { setAllocationMode('manual'); onToast('Chuyển sang cơ chế: Điều phối thủ công'); }}
              className={`p-4 rounded-xl border-2 transition cursor-pointer space-y-2 ${
                allocationMode === 'manual'
                  ? 'border-primary bg-primary-fixed/20'
                  : 'border-outline-variant/30 hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-on-surface">Thủ công (Manual)</span>
                {allocationMode === 'manual' && (
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                )}
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Lead được gom vào hàng đợi chung, trưởng nhóm duyệt và gán đích danh từng đợt.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-outline border-t border-outline-variant/20 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span>Số lượng mỗi đợt phân bổ:</span>
              <select
                value={autoBatchSize}
                onChange={(e) => setAutoBatchSize(Number(e.target.value))}
                className="px-2 py-1 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface font-semibold"
              >
                <option value={20}>20 lead</option>
                <option value={50}>50 lead</option>
                <option value={100}>100 lead</option>
                <option value={200}>200 lead</option>
              </select>
            </div>
            <span>Thời gian hồi đáp mục tiêu: &lt; 5 phút kể từ lúc đổ form</span>
          </div>
        </div>

        {/* Card: Lead Pool Breakdown */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
          <h2 className="font-headline-sm text-base font-bold text-on-surface">
            Cơ cấu nguồn lead chờ chia
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex justify-between items-center">
              <div>
                <strong className="block text-blue-900">Facebook Ads (Form 3PN)</strong>
                <span className="text-[11px] text-blue-700">Chiến dịch BĐS Green Residence</span>
              </div>
              <span className="font-mono font-bold text-blue-900 text-sm">680 lead</span>
            </div>
            <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl flex justify-between items-center">
              <div>
                <strong className="block text-sky-900">Facebook Ads (Shophouse)</strong>
                <span className="text-[11px] text-sky-700">Chiến dịch Mặt bằng kinh doanh</span>
              </div>
              <span className="font-mono font-bold text-sky-900 text-sm">340 lead</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex justify-between items-center">
              <div>
                <strong className="block text-amber-900">Google Search & Landing Page</strong>
                <span className="text-[11px] text-amber-700">Từ khóa &quot;mua nhà eco park&quot;</span>
              </div>
              <span className="font-mono font-bold text-amber-900 text-sm">225 lead</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sales Roster & Allocation Workload */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-headline-sm text-base font-bold text-on-surface">
              Đội ngũ nhân sự trực ca & Hạn mức tiếp nhận
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Bật/tắt trạng thái trực tuyến để nhận data tự động theo thời gian thực
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              {agents.filter((a) => a.isOnline).length} đang Online
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold">
              {agents.filter((a) => !a.isOnline).length} Offline
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-outline uppercase font-semibold border-b border-outline-variant/30">
                <th className="py-3 px-3">Nhân sự sale</th>
                <th className="py-3 px-3">Phòng ban</th>
                <th className="py-3 px-3">Trạng thái trực</th>
                <th className="py-3 px-3">Tỷ trọng chia</th>
                <th className="py-3 px-3">Đã nhận hôm nay</th>
                <th className="py-3 px-3">Tiến độ hạn mức</th>
                <th className="py-3 px-3 text-right">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-surface-container-low transition">
                  <td className="py-3 px-3 font-semibold text-on-surface">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary font-bold flex items-center justify-center text-xs">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <span>{agent.name}</span>
                        <span className="text-[11px] text-outline block">{agent.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-on-surface-variant">{agent.team}</td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => {
                        toggleAgentOnline(agent.id);
                        onToast(`Đã đổi trạng thái của ${agent.name} sang ${!agent.isOnline ? 'Online' : 'Offline'}`);
                      }}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition ${
                        agent.isOnline
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${agent.isOnline ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                      {agent.isOnline ? 'Đang trực' : 'Tạm dừng'}
                    </button>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-primary">
                    {agent.allocationRatio}%
                  </td>
                  <td className="py-3 px-3 font-mono font-bold">
                    {agent.leadsToday} / {agent.maxLeadsPerDay} lead
                  </td>
                  <td className="py-3 px-3">
                    <div className="w-32 bg-surface-container-high h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          (agent.leadsToday / agent.maxLeadsPerDay) >= 0.8
                            ? 'bg-amber-500'
                            : 'bg-primary-container'
                        }`}
                        style={{ width: `${Math.min(100, (agent.leadsToday / agent.maxLeadsPerDay) * 100)}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        setAgents((prev) =>
                          prev.map((a) =>
                            a.id === agent.id ? { ...a, leadsToday: a.leadsToday + 5 } : a
                          )
                        );
                        setUnassignedPool((prev) => Math.max(0, prev - 5));
                        onToast(`Đã gán thêm 5 lead trực tiếp cho ${agent.name}`);
                      }}
                      className="px-2.5 py-1 bg-surface-container hover:bg-primary hover:text-white rounded-lg text-primary font-medium transition cursor-pointer"
                    >
                      + Gán 5 lead
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
