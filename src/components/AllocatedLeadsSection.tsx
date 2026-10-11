'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_ALLOCATED_LEADS } from '../data/mockCrmData';
import { AllocatedLeadCustomer, CallStatus, CallHistoryItem } from '../types/crm';

interface AllocatedLeadsSectionProps {
  onToast: (msg: string) => void;
  onScheduleCall?: (customerName: string, phone: string) => void;
}

const CALL_STATUS_CONFIG: Record<
  CallStatus,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    dot: string;
    icon: string;
    activeRing: string;
    activeBg: string;
    activeBorder: string;
    iconColor: string;
  }
> = {
  'Chưa gọi': {
    label: 'Chưa gọi',
    bg: 'bg-[#fffbeb]',
    text: 'text-[#92400e]',
    border: 'border-[#fde68a]',
    dot: 'bg-[#f59e0b]',
    icon: 'hourglass_empty',
    activeRing: 'ring-[#f59e0b]',
    activeBg: 'bg-[#fef3c7]',
    activeBorder: 'border-[#f59e0b]',
    iconColor: 'text-[#d97706]'
  },
  'Đã gọi': {
    label: 'Đã gọi',
    bg: 'bg-[#ecfdf5]',
    text: 'text-[#065f46]',
    border: 'border-[#a7f3d0]',
    dot: 'bg-[#10b981]',
    icon: 'check_circle',
    activeRing: 'ring-[#10b981]',
    activeBg: 'bg-[#d1fae5]',
    activeBorder: 'border-[#10b981]',
    iconColor: 'text-[#059669]'
  },
  'Không nghe máy': {
    label: 'Không nghe máy',
    bg: 'bg-[#fff1f2]',
    text: 'text-[#9f1239]',
    border: 'border-[#fecdd3]',
    dot: 'bg-[#f43f5e]',
    icon: 'phone_missed',
    activeRing: 'ring-[#f43f5e]',
    activeBg: 'bg-[#ffe4e6]',
    activeBorder: 'border-[#f43f5e]',
    iconColor: 'text-[#e11d48]'
  },
  'Gọi lại sau': {
    label: 'Gọi lại sau',
    bg: 'bg-[#f0f9ff]',
    text: 'text-[#075985]',
    border: 'border-[#bae6fd]',
    dot: 'bg-[#0ea5e9]',
    icon: 'update',
    activeRing: 'ring-[#0ea5e9]',
    activeBg: 'bg-[#e0f2fe]',
    activeBorder: 'border-[#0ea5e9]',
    iconColor: 'text-[#0284c7]'
  },
  'Thuê bao / Bận': {
    label: 'Thuê bao / Bận',
    bg: 'bg-[#faf5ff]',
    text: 'text-[#6b21a8]',
    border: 'border-[#e9d5ff]',
    dot: 'bg-[#a855f7]',
    icon: 'phone_disabled',
    activeRing: 'ring-[#a855f7]',
    activeBg: 'bg-[#f3e8ff]',
    activeBorder: 'border-[#a855f7]',
    iconColor: 'text-[#9333ea]'
  },
  'Quan tâm cao': {
    label: 'Quan tâm cao',
    bg: 'bg-[#fff7ed]',
    text: 'text-[#9a3412]',
    border: 'border-[#fed7aa]',
    dot: 'bg-[#f97316]',
    icon: 'local_fire_department',
    activeRing: 'ring-[#f97316]',
    activeBg: 'bg-[#ffedd5]',
    activeBorder: 'border-[#f97316]',
    iconColor: 'text-[#ea580c]'
  },
  'Từ chối': {
    label: 'Từ chối',
    bg: 'bg-[#f1f5f9]',
    text: 'text-[#334155]',
    border: 'border-[#cbd5e1]',
    dot: 'bg-[#94a3b8]',
    icon: 'do_not_disturb',
    activeRing: 'ring-[#94a3b8]',
    activeBg: 'bg-[#e2e8f0]',
    activeBorder: 'border-[#94a3b8]',
    iconColor: 'text-[#64748b]'
  }
};

const ALL_STATUS_OPTIONS: CallStatus[] = [
  'Chưa gọi',
  'Đã gọi',
  'Không nghe máy',
  'Gọi lại sau',
  'Thuê bao / Bận',
  'Quan tâm cao',
  'Từ chối'
];

export default function AllocatedLeadsSection({
  onToast,
  onScheduleCall
}: AllocatedLeadsSectionProps) {
  const [leads, setLeads] = useState<AllocatedLeadCustomer[]>(MOCK_ALLOCATED_LEADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');
  const [projectFilter, setProjectFilter] = useState<string>('Tất cả');
  const [selectedLeadDetail, setSelectedLeadDetail] = useState<AllocatedLeadCustomer | null>(null);
  const [statusDropdownId, setStatusDropdownId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [activeVoipLead, setActiveVoipLead] = useState<AllocatedLeadCustomer | null>(null);
  const [voipTimer, setVoipTimer] = useState(0);
  const [voipStatus, setVoipStatus] = useState<'calling' | 'connected'>('calling');
  const [newNoteText, setNewNoteText] = useState('');

  // VoIP call duration ticker
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeVoipLead) {
      setVoipTimer(0);
      setVoipStatus('calling');
      const connectTimeout = setTimeout(() => {
        setVoipStatus('connected');
      }, 2000);

      interval = setInterval(() => {
        setVoipTimer((prev) => prev + 1);
      }, 1000);

      return () => {
        clearTimeout(connectTimeout);
        if (interval) clearInterval(interval);
      };
    }
  }, [activeVoipLead]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'Tất cả': leads.length
    };
    ALL_STATUS_OPTIONS.forEach((st) => {
      counts[st] = leads.filter((l) => l.callStatus === st).length;
    });
    return counts;
  }, [leads]);

  // Unique projects for dropdown
  const uniqueProjects = useMemo(() => {
    const set = new Set(leads.map((l) => l.project));
    return ['Tất cả', ...Array.from(set)];
  }, [leads]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        lead.leadCode.toLowerCase().includes(q) ||
        lead.address.toLowerCase().includes(q) ||
        lead.occupation.toLowerCase().includes(q) ||
        lead.project.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'Tất cả' || lead.callStatus === statusFilter;
      const matchProject = projectFilter === 'Tất cả' || lead.project === projectFilter;

      return matchSearch && matchStatus && matchProject;
    });
  }, [leads, searchQuery, statusFilter, projectFilter]);

  // Handle status update
  const handleUpdateStatus = (leadId: string, newStatus: CallStatus, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const updated = {
            ...l,
            callStatus: newStatus,
            callCount:
              newStatus === 'Đã gọi' || newStatus === 'Không nghe máy'
                ? l.callCount + 1
                : l.callCount,
            lastCallTime:
              newStatus === 'Đã gọi'
                ? 'Vừa xong'
                : l.lastCallTime
          };
          if (selectedLeadDetail && selectedLeadDetail.id === leadId) {
            setSelectedLeadDetail(updated);
          }
          return updated;
        }
        return l;
      })
    );
    setStatusDropdownId(null);
    onToast(`Đã chuyển trạng thái lead sang "${newStatus}"`);
  };

  // Add new note to call history
  const handleAddNoteToLead = (leadId: string) => {
    if (!newNoteText.trim()) {
      onToast('Vui lòng nhập nội dung ghi chú');
      return;
    }

    const newHistoryItem: CallHistoryItem = {
      id: `h-${Date.now()}`,
      time: 'Vừa xong',
      status: selectedLeadDetail?.callStatus || 'Đã liên hệ',
      duration: 'Vừa hoàn tất',
      caller: selectedLeadDetail?.assignedTo || 'Sale phụ trách',
      note: newNoteText.trim()
    };

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const updated: AllocatedLeadCustomer = {
            ...l,
            notes: newNoteText.trim(),
            callHistory: [newHistoryItem, ...l.callHistory],
            callCount: l.callCount + 1,
            lastCallTime: 'Vừa xong'
          };
          if (selectedLeadDetail?.id === leadId) {
            setSelectedLeadDetail(updated);
          }
          return updated;
        }
        return l;
      })
    );

    setNewNoteText('');
    onToast('Đã lưu nhật ký ghi chú cuộc gọi thành công!');
  };

  // End VoIP call
  const handleEndVoipCall = () => {
    if (activeVoipLead) {
      const durationStr = `${Math.floor(voipTimer / 60)}p ${(voipTimer % 60)
        .toString()
        .padStart(2, '0')}s`;
      const isConnected = voipStatus === 'connected' && voipTimer > 2;

      // Automatically add to history
      const newHistoryItem: CallHistoryItem = {
        id: `h-${Date.now()}`,
        time: 'Vừa xong',
        status: isConnected ? 'Đã kết nối' : 'Không bắt máy',
        duration: durationStr,
        caller: activeVoipLead.assignedTo,
        note: isConnected
          ? `Cuộc gọi VoIP tự động kết thúc sau ${durationStr}. Khách phản hồi tương tác tốt.`
          : 'Cuộc gọi VoIP đổ chuông nhưng không có người nhấc máy.'
      };

      setLeads((prev) =>
        prev.map((l) => {
          if (l.id === activeVoipLead.id) {
            const updated: AllocatedLeadCustomer = {
              ...l,
              callStatus: isConnected ? 'Đã gọi' : 'Không nghe máy',
              callCount: l.callCount + 1,
              lastCallTime: `Vừa xong (${durationStr})`,
              callHistory: [newHistoryItem, ...l.callHistory]
            };
            if (selectedLeadDetail?.id === activeVoipLead.id) {
              setSelectedLeadDetail(updated);
            }
            return updated;
          }
          return l;
        })
      );

      onToast(
        `Đã ngắt kết nối cuộc gọi VoIP với ${activeVoipLead.name} (${durationStr}). Đã tự động cập nhật nhật ký!`
      );
      setActiveVoipLead(null);
    }
  };

  // Copy phone number
  const handleCopyPhone = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(phone);
    onToast(`Đã sao chép số điện thoại: ${phone}`);
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 space-y-6">
      {/* 1. Header with Title & Stats Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-label-sm text-xs font-bold uppercase tracking-wider text-primary">
              Phân bổ dữ liệu trong ngày
            </span>
            <span className="text-outline-variant">•</span>
            <span className="text-xs text-outline">Đồng bộ tự động từ Marketing & Tổng đài</span>
          </div>
          <h2 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface tracking-tight flex items-center gap-2.5">
            <span>Danh sách số điện thoại được chia (Data Lead)</span>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary text-xs font-mono font-bold">
              {leads.length} số
            </span>
          </h2>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
            Bấm vào bất kỳ khách hàng nào để mở <strong>màn hình chi tiết</strong> (Năm sinh, địa chỉ, lịch sử gọi, nhu cầu BĐS...)
          </p>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center bg-surface-container-high p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Chế độ xem dạng bảng"
            >
              <span className="material-symbols-outlined text-[16px]">table_rows</span>
              <span className="hidden sm:inline">Dạng bảng</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Chế độ xem dạng thẻ"
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span className="hidden sm:inline">Dạng thẻ</span>
            </button>
          </div>

          <button
            onClick={() => onToast(`Đang xuất ${filteredLeads.length} số điện thoại ra file Excel...`)}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Xuất file SĐT</span>
          </button>
        </div>
      </div>

      {/* 2. Bento Quick Counter Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {ALL_STATUS_OPTIONS.map((st) => {
          const cfg = CALL_STATUS_CONFIG[st];
          const count = statusCounts[st] || 0;
          const isActive = statusFilter === st;

          return (
            <button
              key={st}
              onClick={() => setStatusFilter(isActive ? 'Tất cả' : st)}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-xs hover:-translate-y-0.5 ${
                isActive
                  ? `${cfg.bg} ${cfg.text} ${cfg.border} ring-2 ${cfg.activeRing}`
                  : 'bg-white hover:bg-surface-container-low border-outline-variant/30'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className={`text-[11px] font-semibold truncate ${isActive ? cfg.text : 'text-on-surface-variant'}`}>
                  {cfg.label}
                </span>
                <span className={`w-2 h-2 rounded-full ${cfg.dot} ring-2 ring-white/80`}></span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className={`text-xl font-bold font-mono ${isActive ? cfg.text : 'text-on-surface'}`}>{count}</span>
                <span className={`material-symbols-outlined text-[18px] ${isActive ? cfg.text : cfg.iconColor}`}>
                  {cfg.icon}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Search Bar & Status Filter Tabs */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[18px] text-outline">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, SĐT (09...), mã lead, năm sinh, địa chỉ, nghề nghiệp..."
              className="w-full pl-10 pr-9 py-2 bg-surface-container-low text-on-surface font-body-md text-xs sm:text-sm rounded-xl border border-outline-variant/30 focus:outline-none focus:border-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Project Filter */}
          <div className="relative md:w-64">
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-surface-container-low text-on-surface font-body-md text-xs sm:text-sm rounded-xl border border-outline-variant/30 appearance-none focus:outline-none cursor-pointer"
            >
              {uniqueProjects.map((proj) => (
                <option key={proj} value={proj}>
                  Dự án: {proj}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-outline pointer-events-none">
              arrow_drop_down
            </span>
          </div>
        </div>

        {/* Filter Pills row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-outline font-semibold text-[11px] uppercase shrink-0 mr-1">
            Lọc trạng thái:
          </span>
          <button
            onClick={() => setStatusFilter('Tất cả')}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition cursor-pointer ${
              statusFilter === 'Tất cả'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            Tất cả ({leads.length})
          </button>
          {ALL_STATUS_OPTIONS.map((st) => {
            const cfg = CALL_STATUS_CONFIG[st];
            const count = statusCounts[st] || 0;
            const active = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition flex items-center gap-1.5 cursor-pointer border ${
                  active
                    ? `${cfg.bg} ${cfg.text} ${cfg.border} ring-1 ring-current/25 shadow-2xs font-bold`
                    : 'bg-white hover:bg-surface-container-low text-on-surface-variant border-outline-variant/30'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`}></span>
                <span>{st}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    active ? 'bg-white text-current shadow-2xs border border-current/15' : 'bg-surface-container-highest text-outline'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Lead List Table View */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
          <table className="w-full text-left text-xs text-on-surface">
            <thead className="bg-surface-container-high text-[11px] uppercase tracking-wider text-outline font-semibold border-b border-outline-variant/30 whitespace-nowrap select-none">
              <tr>
                <th className="py-3 px-3.5 whitespace-nowrap">Khách hàng & SĐT</th>
                <th className="py-3 px-3 whitespace-nowrap">Năm sinh & Địa chỉ</th>
                <th className="py-3 px-3 whitespace-nowrap">Dự án & Nhu cầu</th>
                <th className="py-3 px-3 whitespace-nowrap">Sale được chia</th>
                <th className="py-3 px-3 whitespace-nowrap">Trạng thái gọi</th>
                <th className="py-3 px-3 whitespace-nowrap">Lịch sử gọi</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 bg-surface-container-lowest">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-outline">
                    <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant block">
                      phone_disabled
                    </span>
                    <p className="font-semibold text-sm">Không tìm thấy số điện thoại nào phù hợp</p>
                    <p className="text-xs text-outline mt-1">
                      Thử thay đổi từ khóa tìm kiếm hoặc bấm &quot;Tất cả&quot; để xem toàn bộ danh sách.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const cfg = CALL_STATUS_CONFIG[lead.callStatus];
                  const currentAge = 2026 - lead.birthYear;

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLeadDetail(lead)}
                      className="hover:bg-primary-fixed/20 transition cursor-pointer group whitespace-nowrap"
                    >
                      {/* 1. Customer & Phone */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3 whitespace-nowrap">
                          <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary font-bold flex items-center justify-center text-sm shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                            {lead.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                              <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors whitespace-nowrap">
                                {lead.name}
                              </span>
                              <span className="font-mono text-[10px] text-outline bg-surface-container px-1.5 py-0.5 rounded whitespace-nowrap">
                                {lead.leadCode}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 whitespace-nowrap">
                              <span className="font-mono font-bold text-xs text-primary tracking-wide whitespace-nowrap">
                                {lead.phone}
                              </span>
                              <button
                                onClick={(e) => handleCopyPhone(lead.phone, e)}
                                title="Sao chép số điện thoại"
                                className="p-0.5 text-outline hover:text-primary hover:bg-surface-container rounded transition shrink-0"
                              >
                                <span className="material-symbols-outlined text-[13px]">
                                  content_copy
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Birth Year & Address */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <span className="font-semibold text-on-surface whitespace-nowrap">
                            {lead.birthYear}
                          </span>
                          <span className="text-[11px] text-outline whitespace-nowrap">({currentAge} tuổi)</span>
                          <span className="text-[10px] px-1 py-0.2 rounded bg-surface-container text-outline whitespace-nowrap">
                            {lead.gender}
                          </span>
                        </div>
                        <div className="text-[11px] text-on-surface-variant truncate max-w-[180px] mt-0.5 flex items-center gap-1 whitespace-nowrap" title={lead.address}>
                          <span className="material-symbols-outlined text-[13px] text-outline shrink-0">
                            location_on
                          </span>
                          <span className="truncate">{lead.district || lead.address}</span>
                        </div>
                      </td>

                      {/* 3. Project & Product */}
                      <td className="py-3.5 px-3 whitespace-nowrap max-w-[190px]">
                        <strong className="text-on-surface block truncate max-w-[190px] whitespace-nowrap" title={lead.project}>
                          {lead.project}
                        </strong>
                        <span className="text-[11px] text-outline block truncate max-w-[190px] whitespace-nowrap" title={lead.productInterest}>
                          {lead.productInterest}
                        </span>
                      </td>

                      {/* 4. Assigned Sale & Allocation Time */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <strong className="text-primary block font-medium whitespace-nowrap">
                          {lead.assignedTo}
                        </strong>
                        <span className="text-[11px] text-outline whitespace-nowrap">{lead.allocatedAt}</span>
                      </td>

                      {/* 5. Call Status with Inline Quick Change Dropdown */}
                      <td className="py-3.5 px-3 whitespace-nowrap relative">
                        <div className="relative inline-block">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setStatusDropdownId(
                                statusDropdownId === lead.id ? null : lead.id
                              );
                            }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs hover:shadow-xs hover:scale-[1.02] transition cursor-pointer select-none ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          >
                            <span className={`w-2 h-2 rounded-full ${cfg.dot} ring-2 ring-white/80 shrink-0`}></span>
                            <span className="font-semibold">{lead.callStatus}</span>
                            <span className="material-symbols-outlined text-[15px] opacity-70">
                              expand_more
                            </span>
                          </button>

                          {/* Dropdown Menu */}
                          {statusDropdownId === lead.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute left-0 mt-1.5 z-40 w-48 bg-white rounded-2xl shadow-xl border border-outline-variant/30 py-2 divide-y divide-outline-variant/10 animate-in fade-in zoom-in-95"
                            >
                              <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-outline">
                                Đổi trạng thái gọi
                              </div>
                              <div className="py-1">
                                {ALL_STATUS_OPTIONS.map((st) => {
                                  const stCfg = CALL_STATUS_CONFIG[st];
                                  const isCurrent = lead.callStatus === st;
                                  return (
                                    <button
                                      key={st}
                                      onClick={(e) => handleUpdateStatus(lead.id, st, e)}
                                      className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between transition cursor-pointer ${
                                        isCurrent
                                          ? `${stCfg.bg} ${stCfg.text} font-bold`
                                          : 'text-on-surface hover:bg-surface-container-low'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${stCfg.dot} ring-1 ring-white shrink-0`}></span>
                                        <span>{st}</span>
                                      </div>
                                      {isCurrent && (
                                        <span className="material-symbols-outlined text-[15px] text-current">
                                          check
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 6. Call History & Counter */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold font-mono ${
                              lead.callCount > 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-surface-container text-outline'
                            }`}
                          >
                            {lead.callCount} cuộc
                          </span>
                        </div>
                        <span className="text-[11px] text-outline block mt-0.5">
                          {lead.lastCallTime ? lead.lastCallTime : 'Chưa gọi lần nào'}
                        </span>
                      </td>

                      {/* 7. Action Buttons: Nút nhỏ gọn, siêu đẹp */}
                      <td className="py-2.5 px-2.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setActiveVoipLead(lead);
                              onToast(`Đang kết nối VoIP với ${lead.name} (${lead.phone})...`);
                            }}
                            className="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center transition shadow-2xs hover:shadow-xs cursor-pointer group/btn"
                            title="Gọi điện VoIP ngay"
                          >
                            <span className="material-symbols-outlined text-[15px] group-hover/btn:scale-110 transition-transform">call</span>
                          </button>

                          <button
                            onClick={() => setSelectedLeadDetail(lead)}
                            className="w-7 h-7 rounded-lg bg-indigo-50 hover:bg-indigo-600 active:scale-95 text-indigo-700 hover:text-white border border-indigo-200/80 hover:border-indigo-600 flex items-center justify-center transition shadow-2xs hover:shadow-xs cursor-pointer group/btn"
                            title="Xem chi tiết năm sinh, địa chỉ, lịch sử..."
                          >
                            <span className="material-symbols-outlined text-[15px] group-hover/btn:scale-110 transition-transform">visibility</span>
                          </button>

                          {onScheduleCall && (
                            <button
                              onClick={() => onScheduleCall(lead.name, lead.phone)}
                              className="w-7 h-7 rounded-lg bg-purple-50 hover:bg-purple-600 active:scale-95 text-purple-700 hover:text-white border border-purple-200/80 hover:border-purple-600 flex items-center justify-center transition shadow-2xs hover:shadow-xs cursor-pointer group/btn"
                              title="Tạo lịch hẹn gọi lại"
                            >
                              <span className="material-symbols-outlined text-[15px] group-hover/btn:scale-110 transition-transform">
                                more_time
                              </span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* 4B. Lead Cards Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => {
            const cfg = CALL_STATUS_CONFIG[lead.callStatus];
            const currentAge = 2026 - lead.birthYear;

            return (
              <div
                key={lead.id}
                onClick={() => setSelectedLeadDetail(lead)}
                className="bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 hover:border-primary/50 rounded-2xl p-4 transition shadow-xs flex flex-col justify-between space-y-3 cursor-pointer group"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-primary-fixed text-primary font-bold flex items-center justify-center text-base shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-on-surface group-hover:text-primary transition-colors">
                          {lead.name}
                        </strong>
                        <span className="font-mono text-[10px] text-outline bg-surface-container-highest px-1.5 py-0.5 rounded">
                          {lead.leadCode}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono font-bold text-xs text-primary">
                          {lead.phone}
                        </span>
                        <button
                          onClick={(e) => handleCopyPhone(lead.phone, e)}
                          title="Sao chép số điện thoại"
                          className="p-0.5 text-outline hover:text-primary transition"
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            content_copy
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs ${cfg.bg} ${cfg.text} ${cfg.border}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${cfg.dot} ring-2 ring-white/80 shrink-0`}></span>
                    <span>{lead.callStatus}</span>
                  </span>
                </div>

                {/* Core Customer Info */}
                <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-on-surface">
                    <span className="text-outline">Năm sinh & Tuổi:</span>
                    <strong className="font-medium">
                      {lead.birthYear} ({currentAge} tuổi) • {lead.gender}
                    </strong>
                  </div>
                  <div className="flex items-start justify-between text-on-surface gap-2">
                    <span className="text-outline shrink-0">Địa chỉ:</span>
                    <span className="text-right truncate font-medium text-[11px]" title={lead.address}>
                      {lead.address}
                    </span>
                  </div>
                  <div className="flex items-start justify-between text-on-surface gap-2">
                    <span className="text-outline shrink-0">Dự án:</span>
                    <span className="text-right font-medium text-secondary truncate">
                      {lead.project}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface">
                    <span className="text-outline">Đã gọi:</span>
                    <span className="font-mono font-bold">
                      {lead.callCount} cuộc {lead.lastCallTime && `• ${lead.lastCallTime}`}
                    </span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div
                  className="flex items-center justify-between pt-1 border-t border-outline-variant/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[11px] text-outline">
                    Sale: <strong>{lead.assignedTo}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedLeadDetail(lead)}
                      className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => {
                        setActiveVoipLead(lead);
                        onToast(`Đang kết nối VoIP với ${lead.name}...`);
                      }}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition cursor-pointer shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-[14px]">call</span>
                      Gọi ngay
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CUSTOMER DETAIL MODAL (Màn hình chi tiết thông tin của khách)          */}
      {/* ========================================================================= */}
      {selectedLeadDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5">
          <div className="bg-surface-container-lowest rounded-3xl max-w-3xl w-full max-h-[92vh] shadow-2xl border border-outline-variant/40 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-primary-fixed/40 via-surface-container-lowest to-surface-container-lowest border-b border-outline-variant/20 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-md shrink-0">
                  {selectedLeadDetail.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface">
                      {selectedLeadDetail.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary text-xs font-mono font-bold">
                      {selectedLeadDetail.leadCode}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                      {selectedLeadDetail.priority}
                    </span>
                  </div>
                  <p className="text-xs text-outline mt-1 flex items-center gap-2 flex-wrap">
                    <span>Năm sinh: <strong>{selectedLeadDetail.birthYear}</strong> ({2026 - selectedLeadDetail.birthYear} tuổi)</span>
                    <span>•</span>
                    <span>Giới tính: <strong>{selectedLeadDetail.gender}</strong></span>
                    <span>•</span>
                    <span>Sale phụ trách: <strong className="text-primary">{selectedLeadDetail.assignedTo}</strong></span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedLeadDetail(null)}
                className="p-1.5 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Modal Body: Scrollable Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
              {/* Quick Status Bar */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-outline font-semibold uppercase text-[11px]">
                    Trạng thái cuộc gọi hiện tại:
                  </span>
                  {(() => {
                    const cfg = CALL_STATUS_CONFIG[selectedLeadDetail.callStatus];
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${cfg.bg} ${cfg.text} ${cfg.border}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${cfg.dot} ring-2 ring-white/80 shrink-0`}></span>
                        <span>{selectedLeadDetail.callStatus}</span>
                      </span>
                    );
                  })()}
                </div>

                {/* Quick Status Switcher */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-outline font-semibold">Chuyển nhanh:</span>
                  {ALL_STATUS_OPTIONS.map((st) => {
                    const stCfg = CALL_STATUS_CONFIG[st];
                    const isSelected = selectedLeadDetail.callStatus === st;
                    return (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(selectedLeadDetail.id, st)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition cursor-pointer border ${
                          isSelected
                            ? `${stCfg.bg} ${stCfg.text} ${stCfg.border} ring-1 ring-current/25 font-bold shadow-2xs`
                            : 'bg-white hover:bg-surface-container text-on-surface-variant border-outline-variant/30'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 1: Detailed Personal Information (Năm sinh, Địa chỉ, CCCD...) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  <h4>1. Thông tin cá nhân & Liên hệ chi tiết</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Phone */}
                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                    <span className="text-outline text-[11px] block">Số điện thoại</span>
                    <div className="flex items-center justify-between mt-1">
                      <strong className="font-mono text-sm text-primary tracking-wide">
                        {selectedLeadDetail.phone}
                      </strong>
                      <button
                        onClick={(e) => handleCopyPhone(selectedLeadDetail.phone, e)}
                        className="text-outline hover:text-primary p-1 cursor-pointer"
                        title="Sao chép SĐT"
                      >
                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      </button>
                    </div>
                  </div>

                  {/* Birth Year & Age */}
                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                    <span className="text-outline text-[11px] block">Năm sinh / Tuổi</span>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <strong className="text-sm text-on-surface">
                        {selectedLeadDetail.birthYear}
                      </strong>
                      <span className="text-xs text-outline font-medium">
                        ({2026 - selectedLeadDetail.birthYear} tuổi)
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-surface-container text-outline text-[10px]">
                        {selectedLeadDetail.gender}
                      </span>
                    </div>
                  </div>

                  {/* ID Card */}
                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                    <span className="text-outline text-[11px] block">Số CCCD / CMND</span>
                    <div className="mt-1 font-mono text-on-surface font-semibold text-xs">
                      {selectedLeadDetail.idCard || 'Đang cập nhật'}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                    <span className="text-outline text-[11px] block">Địa chỉ Email</span>
                    <div className="mt-1 text-on-surface truncate font-medium text-xs" title={selectedLeadDetail.email}>
                      {selectedLeadDetail.email}
                    </div>
                  </div>

                  {/* Occupation */}
                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 sm:col-span-2">
                    <span className="text-outline text-[11px] block">Nghề nghiệp & Nơi công tác</span>
                    <div className="mt-1 text-on-surface font-semibold text-xs">
                      {selectedLeadDetail.occupation || 'Chưa cập nhật'}
                    </div>
                  </div>

                  {/* Full Address */}
                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 sm:col-span-3">
                    <span className="text-outline text-[11px] block flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      Địa chỉ cư trú thường trú & Hiện tại
                    </span>
                    <div className="mt-1 text-on-surface font-bold text-xs sm:text-sm">
                      {selectedLeadDetail.address}
                    </div>
                  </div>

                  {/* Financial / Budget */}
                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 sm:col-span-3">
                    <span className="text-outline text-[11px] block flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
                      Khả năng tài chính & Ngân sách sẵn sàng
                    </span>
                    <div className="mt-1 text-emerald-700 font-bold text-xs sm:text-sm">
                      {selectedLeadDetail.incomeRange || 'Khách chưa tiết lộ cụ thể'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Real Estate Interests & Allocation Data */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                  <span className="material-symbols-outlined text-[18px]">apartment</span>
                  <h4>2. Nhu cầu dự án & Thông tin phân bổ</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                  <div>
                    <span className="text-outline text-[11px] block">Dự án quan tâm:</span>
                    <strong className="text-sm text-on-surface">{selectedLeadDetail.project}</strong>
                  </div>
                  <div>
                    <span className="text-outline text-[11px] block">Loại hình sản phẩm mong muốn:</span>
                    <span className="text-secondary font-bold text-xs">
                      {selectedLeadDetail.productInterest}
                    </span>
                  </div>
                  <div>
                    <span className="text-outline text-[11px] block">Nguồn tiếp nhận lead:</span>
                    <span className="text-on-surface-variant font-medium text-xs">
                      {selectedLeadDetail.source}
                    </span>
                  </div>
                  <div>
                    <span className="text-outline text-[11px] block">Thời gian chia data:</span>
                    <span className="text-primary font-semibold text-xs">
                      {selectedLeadDetail.allocatedAt}
                    </span>
                  </div>
                </div>

                {/* Initial Notes */}
                <div className="p-3.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-[#92400e] space-y-1">
                  <span className="font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 text-[#b45309]">
                    <span className="material-symbols-outlined text-[15px]">info</span>
                    Ghi chú nhu cầu tư vấn:
                  </span>
                  <p className="text-xs leading-relaxed font-medium">{selectedLeadDetail.notes}</p>
                </div>
              </div>

              {/* Section 3: Call Logs & Interaction History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                    <span className="material-symbols-outlined text-[18px]">history</span>
                    <h4>3. Lịch sử cuộc gọi & Nhật ký tương tác ({selectedLeadDetail.callHistory.length})</h4>
                  </div>
                  <span className="text-outline text-xs">
                    Tổng cộng: <strong>{selectedLeadDetail.callCount} cuộc gọi</strong>
                  </span>
                </div>

                {/* Add New Note / Call Record Box */}
                <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2">
                  <label className="block text-[11px] font-bold uppercase text-outline">
                    Thêm ghi chú sau cuộc gọi mới:
                  </label>
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Nhập nội dung trao đổi, kết quả phản hồi của khách hàng, mức chiết khấu đã báo..."
                    className="w-full p-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
                  ></textarea>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddNoteToLead(selectedLeadDetail.id)}
                      className="px-3.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-container transition cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-[15px]">save</span>
                      Lưu nhật ký cuộc gọi
                    </button>
                  </div>
                </div>

                {/* Timeline */}
                {selectedLeadDetail.callHistory.length === 0 ? (
                  <div className="p-4 rounded-xl bg-surface-container-lowest text-center text-outline border border-dashed border-outline-variant/40">
                    Chưa có nhật ký cuộc gọi nào được ghi lại cho khách hàng này. Bấm &quot;Gọi ngay (VoIP)&quot; để bắt đầu cuộc gọi đầu tiên!
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedLeadDetail.callHistory.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/25 flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">
                            phone_in_talk
                          </span>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <strong className="text-on-surface font-semibold text-xs">
                              {item.status} ({item.duration})
                            </strong>
                            <span className="text-outline text-[11px] font-mono">{item.time}</span>
                          </div>
                          <p className="text-on-surface-variant text-xs leading-relaxed">
                            {item.note}
                          </p>
                          <div className="text-[11px] text-outline font-medium">
                            Người thực hiện: <span className="text-primary">{item.caller}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 sm:p-5 bg-surface-container-low border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-outline">
                <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
                <span>Thông tin khách hàng được bảo mật bởi CRM SalesFlow</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                {onScheduleCall && (
                  <button
                    onClick={() => {
                      onScheduleCall(selectedLeadDetail.name, selectedLeadDetail.phone);
                      setSelectedLeadDetail(null);
                    }}
                    className="px-3.5 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">more_time</span>
                    Đặt lịch gọi lại
                  </button>
                )}

                <button
                  onClick={() => {
                    setActiveVoipLead(selectedLeadDetail);
                    onToast(`Đang kết nối VoIP với ${selectedLeadDetail.name}...`);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  Gọi ngay (VoIP)
                </button>

                <button
                  onClick={() => setSelectedLeadDetail(null)}
                  className="px-4 py-2 bg-surface-container-highest hover:bg-outline-variant/40 text-on-surface rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. VOIP CALL DIALER POPUP SIMULATOR                                        */}
      {/* ========================================================================= */}
      {activeVoipLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-outline-variant/30 text-center space-y-5 animate-in fade-in zoom-in-95">
            {/* Pulsing VoIP Avatar */}
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping"></div>
              <div className="relative w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-[36px]">
                  {voipStatus === 'connected' ? 'phone_in_talk' : 'ring_volume'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">
                {voipStatus === 'connected' ? 'Cuộc gọi đang kết nối' : 'Đang đổ chuông...'}
              </span>
              <h4 className="font-headline-sm text-xl font-bold text-on-surface mt-1">
                {activeVoipLead.name}
              </h4>
              <p className="font-mono font-bold text-sm text-primary mt-0.5">
                {activeVoipLead.phone}
              </p>
              <span className="text-xs text-outline block mt-1">
                {activeVoipLead.project} • {activeVoipLead.birthYear} ({2026 - activeVoipLead.birthYear} tuổi)
              </span>
            </div>

            {/* Timer */}
            <div className="py-2 px-4 rounded-xl bg-surface-container-low inline-block border border-outline-variant/20">
              <span className="font-mono text-xl font-bold text-on-surface">
                {formatTimer(voipTimer)}
              </span>
            </div>

            {/* Technical VoIP specs */}
            <div className="p-3 bg-surface-container-low rounded-xl text-xs text-on-surface-variant text-left space-y-1">
              <p className="flex justify-between">
                <span>Tổng đài ảo:</span>
                <strong className="text-on-surface font-mono">SIP Trunking VNPT-01</strong>
              </p>
              <p className="flex justify-between">
                <span>Ghi âm cuộc gọi:</span>
                <span className="text-emerald-700 font-bold">Đang bật (Auto Rec)</span>
              </p>
              <p className="flex justify-between">
                <span>Đường truyền:</span>
                <span className="text-emerald-700 font-semibold">Tín hiệu HD Voice 100%</span>
              </p>
            </div>

            {/* End Call Button */}
            <button
              onClick={handleEndVoipCall}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">call_end</span>
              <span>Kết thúc cuộc gọi</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
