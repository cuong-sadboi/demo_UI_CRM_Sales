'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_LEADS, MOCK_AGENTS, MOCK_PROJECTS } from '../../data/mockCrmData';
import { LeadCustomer, LeadStatus, CallHistoryItem } from '../../types/crm';

interface CustomersScreenProps {
  onToast: (msg: string) => void;
}

const ALL_LEAD_STATUSES: LeadStatus[] = [
  'Mới tiếp nhận',
  'Đang liên hệ',
  'Quan tâm cao',
  'Hẹn gọi lại',
  'Đã chốt cọc',
  'Không quan tâm'
];

const LEAD_STATUS_CONFIG: Record<
  LeadStatus,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    dot: string;
    icon: string;
    activeRing: string;
    activeBg: string;
    iconColor: string;
  }
> = {
  'Mới tiếp nhận': {
    label: 'Mới tiếp nhận',
    bg: 'bg-[#eef2ff]',
    text: 'text-[#3730a3]',
    border: 'border-[#c7d2fe]',
    dot: 'bg-[#6366f1]',
    icon: 'mark_email_unread',
    activeRing: 'ring-[#6366f1]',
    activeBg: 'bg-[#e0e7ff]',
    iconColor: 'text-[#4f46e5]'
  },
  'Đang liên hệ': {
    label: 'Đang liên hệ',
    bg: 'bg-[#f0f9ff]',
    text: 'text-[#075985]',
    border: 'border-[#bae6fd]',
    dot: 'bg-[#0ea5e9]',
    icon: 'ring_volume',
    activeRing: 'ring-[#0ea5e9]',
    activeBg: 'bg-[#e0f2fe]',
    iconColor: 'text-[#0284c7]'
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
    iconColor: 'text-[#ea580c]'
  },
  'Hẹn gọi lại': {
    label: 'Hẹn gọi lại',
    bg: 'bg-[#faf5ff]',
    text: 'text-[#6b21a8]',
    border: 'border-[#e9d5ff]',
    dot: 'bg-[#a855f7]',
    icon: 'update',
    activeRing: 'ring-[#a855f7]',
    activeBg: 'bg-[#f3e8ff]',
    iconColor: 'text-[#9333ea]'
  },
  'Đã chốt cọc': {
    label: 'Đã chốt cọc',
    bg: 'bg-[#ecfdf5]',
    text: 'text-[#065f46]',
    border: 'border-[#a7f3d0]',
    dot: 'bg-[#10b981]',
    icon: 'verified',
    activeRing: 'ring-[#10b981]',
    activeBg: 'bg-[#d1fae5]',
    iconColor: 'text-[#059669]'
  },
  'Không quan tâm': {
    label: 'Không quan tâm',
    bg: 'bg-[#f1f5f9]',
    text: 'text-[#334155]',
    border: 'border-[#cbd5e1]',
    dot: 'bg-[#94a3b8]',
    icon: 'do_not_disturb',
    activeRing: 'ring-[#94a3b8]',
    activeBg: 'bg-[#e2e8f0]',
    iconColor: 'text-[#64748b]'
  }
};

type SortField = 'createdAt' | 'name' | 'leadCode' | 'project' | 'source' | 'assignedTo' | 'status' | 'callCount';

export default function CustomersScreen({ onToast }: CustomersScreenProps) {
  const [leads, setLeads] = useState<LeadCustomer[]>(MOCK_LEADS);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>(['ld-6', 'ld-7']);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('Tất cả dự án');
  const [allocationFilter, setAllocationFilter] = useState<'Tất cả' | 'Chưa phân bổ' | 'Đã phân bổ'>('Tất cả');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [sourceFilter, setSourceFilter] = useState('Tất cả');
  const [agentFilter, setAgentFilter] = useState('Tất cả');

  // Sorting States
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // View & Modals
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [activeCustomerDetail, setActiveCustomerDetail] = useState<LeadCustomer | null>(null);
  const [editCustomerModal, setEditCustomerModal] = useState<LeadCustomer | null>(null);
  const [statusDropdownId, setStatusDropdownId] = useState<string | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assigningSingleLeadId, setAssigningSingleLeadId] = useState<string | null>(null);
  const [managerNoteText, setManagerNoteText] = useState('');

  // 1. Projects List for Dropdown
  const projectList = useMemo(() => {
    const fromProjects = MOCK_PROJECTS.map((p) => p.name);
    const fromLeads = leads.map((l) => l.project);
    const unique = Array.from(new Set([...fromProjects, ...fromLeads]));
    return ['Tất cả dự án', ...unique];
  }, [leads]);

  // 2. Agents List for Dropdown
  const agentList = useMemo(() => {
    return ['Tất cả nhân viên', 'Chưa phân bổ', ...MOCK_AGENTS.map((a) => a.name)];
  }, []);

  // 3. Selection Handlers (Hỗ trợ chọn theo trang hoặc chọn toàn bộ)
  const toggleSelectOne = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(selectedLeadIds.filter((item) => item !== id));
    } else {
      setSelectedLeadIds([...selectedLeadIds, id]);
    }
  };

  // 4. Bento Counts for Management
  const stats = useMemo(() => {
    const total = leads.length;
    const unassigned = leads.filter((l) => l.assignedTo === 'Chưa phân bổ').length;
    const assigned = leads.filter((l) => l.assignedTo !== 'Chưa phân bổ').length;
    const hotLeads = leads.filter((l) => l.status === 'Quan tâm cao' || l.priority === 'Cao (Hot)').length;
    const closed = leads.filter((l) => l.status === 'Đã chốt cọc').length;
    const contacting = leads.filter((l) => l.status === 'Đang liên hệ').length;
    const newLeads = leads.filter((l) => l.status === 'Mới tiếp nhận').length;

    return { total, unassigned, assigned, hotLeads, closed, contacting, newLeads };
  }, [leads]);

  // 5. Filter Logic
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.leadCode.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.address && l.address.toLowerCase().includes(q)) ||
        (l.occupation && l.occupation.toLowerCase().includes(q)) ||
        l.project.toLowerCase().includes(q) ||
        l.source.toLowerCase().includes(q) ||
        l.assignedTo.toLowerCase().includes(q);

      const matchProject = projectFilter === 'Tất cả dự án' || l.project === projectFilter;

      const matchAllocation =
        allocationFilter === 'Tất cả'
          ? true
          : allocationFilter === 'Chưa phân bổ'
          ? l.assignedTo === 'Chưa phân bổ'
          : l.assignedTo !== 'Chưa phân bổ';

      const matchAgent =
        agentFilter === 'Tất cả'
          ? true
          : agentFilter === 'Chưa phân bổ'
          ? l.assignedTo === 'Chưa phân bổ'
          : l.assignedTo === agentFilter;

      const matchStatus = statusFilter === 'Tất cả' || l.status === statusFilter;
      const matchSource = sourceFilter === 'Tất cả' || l.source.includes(sourceFilter);

      return matchSearch && matchProject && matchAllocation && matchAgent && matchStatus && matchSource;
    });
  }, [leads, searchTerm, projectFilter, allocationFilter, agentFilter, statusFilter, sourceFilter]);

  // 6. Sort Logic
  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      let aVal: string | number = a[sortField] || '';
      let bVal: string | number = b[sortField] || '';

      if (sortField === 'callCount') {
        aVal = a.callCount || 0;
        bVal = b.callCount || 0;
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredLeads, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 6b. Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(sortedLeads.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedLeads = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return sortedLeads.slice(start, start + pageSize);
  }, [sortedLeads, safeCurrentPage, pageSize]);

  // Reset to page 1 on filter, search, sort, or pageSize change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, projectFilter, allocationFilter, agentFilter, statusFilter, sourceFilter, sortField, sortDirection, pageSize]);

  // Selection across page vs all filtered leads
  const allCurrentPageSelected =
    paginatedLeads.length > 0 && paginatedLeads.every((l) => selectedLeadIds.includes(l.id));

  const toggleSelectCurrentPage = () => {
    if (allCurrentPageSelected) {
      const pageIds = paginatedLeads.map((l) => l.id);
      setSelectedLeadIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      const pageIds = paginatedLeads.map((l) => l.id);
      setSelectedLeadIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const selectAllFiltered = () => {
    setSelectedLeadIds(filteredLeads.map((l) => l.id));
    onToast(`Đã chọn toàn bộ ${filteredLeads.length} lead trong bộ lọc!`);
  };

  // 7. Actions Handlers
  const handleUpdateStatus = (leadId: string, newStatus: LeadStatus, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    if (activeCustomerDetail?.id === leadId) {
      setActiveCustomerDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    setStatusDropdownId(null);
    onToast(`Đã chuyển trạng thái lead sang "${newStatus}"`);
  };

  const handleBulkAssign = (agentName: string) => {
    const targetIds = assigningSingleLeadId ? [assigningSingleLeadId] : selectedLeadIds;
    if (targetIds.length === 0) return;

    setLeads((prev) =>
      prev.map((l) =>
        targetIds.includes(l.id)
          ? { ...l, assignedTo: agentName, createdAt: 'Vừa phân bổ' }
          : l
      )
    );

    if (activeCustomerDetail && targetIds.includes(activeCustomerDetail.id)) {
      setActiveCustomerDetail((prev) => (prev ? { ...prev, assignedTo: agentName } : null));
    }

    setAssignModalOpen(false);
    setAssigningSingleLeadId(null);
    onToast(`Đã phân bổ thành công ${targetIds.length} lead cho nhân viên ${agentName}`);
  };

  const handleRevokeAllocation = () => {
    if (selectedLeadIds.length === 0) {
      onToast('Vui lòng chọn ít nhất 1 lead để thu hồi');
      return;
    }
    setLeads((prev) =>
      prev.map((l) =>
        selectedLeadIds.includes(l.id)
          ? { ...l, assignedTo: 'Chưa phân bổ' }
          : l
      )
    );
    onToast(`Đã thu hồi ${selectedLeadIds.length} lead về kho data chưa phân bổ`);
    setSelectedLeadIds([]);
  };

  const handleAddManagerNote = (leadId: string) => {
    if (!managerNoteText.trim()) {
      onToast('Vui lòng nhập nội dung chỉ đạo / ghi chú');
      return;
    }

    const newHistoryItem: CallHistoryItem = {
      id: `m-note-${Date.now()}`,
      time: 'Vừa xong',
      status: 'Chỉ đạo quản lý',
      duration: 'Chỉ đạo nội bộ',
      caller: 'Quản lý chính (Admin)',
      note: managerNoteText.trim()
    };

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const updated: LeadCustomer = {
            ...l,
            notes: managerNoteText.trim(),
            callHistory: [newHistoryItem, ...(l.callHistory || [])]
          };
          if (activeCustomerDetail?.id === leadId) {
            setActiveCustomerDetail(updated);
          }
          return updated;
        }
        return l;
      })
    );

    setManagerNoteText('');
    onToast('Đã lưu chỉ đạo quản lý vào hồ sơ khách hàng!');
  };

  const handleSaveEditCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCustomerModal) return;

    setLeads((prev) =>
      prev.map((l) => (l.id === editCustomerModal.id ? editCustomerModal : l))
    );

    if (activeCustomerDetail?.id === editCustomerModal.id) {
      setActiveCustomerDetail(editCustomerModal);
    }

    setEditCustomerModal(null);
    onToast(`Đã cập nhật thông tin khách hàng ${editCustomerModal.name}`);
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setProjectFilter('Tất cả dự án');
    setAllocationFilter('Tất cả');
    setStatusFilter('Tất cả');
    setSourceFilter('Tất cả');
    setAgentFilter('Tất cả');
    setCurrentPage(1);
    onToast('Đã đặt lại toàn bộ bộ lọc');
  };

  const isFilterActive =
    searchTerm !== '' ||
    projectFilter !== 'Tất cả dự án' ||
    allocationFilter !== 'Tất cả' ||
    statusFilter !== 'Tất cả' ||
    sourceFilter !== 'Tất cả' ||
    agentFilter !== 'Tất cả';

  return (
    <div className="flex flex-col w-full space-y-5">
      {/* 1. Header: Master Leads Database (Góc nhìn Quản lý) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-5 sm:p-6 rounded-2xl shadow-sm border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-sm text-xs font-bold uppercase tracking-wider text-primary">
              Trung Tâm Quản Trị Data
            </span>
            <span className="text-outline-variant">•</span>
            <span className="text-xs text-outline font-medium">Master Leads Database Toàn Hệ Thống</span>
            <span className="text-outline-variant">•</span>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
              Chức năng Quản lý
            </span>
          </div>
          <h1 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface tracking-tight flex items-center gap-2.5">
            <span>Kho Dữ Liệu Khách Hàng & Dự Án</span>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary text-xs font-mono font-bold">
              {leads.length} / 1,420 lead
            </span>
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
            Quản trị tập trung toàn bộ data đã tải lên từ tất cả các dự án, điều phối phân bổ cho nhân viên kinh doanh và giám sát tỷ lệ chuyển đổi
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <div className="flex items-center bg-surface-container-high p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Chế độ xem bảng quản lý"
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
              title="Chế độ xem lưới thẻ"
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span className="hidden sm:inline">Dạng thẻ</span>
            </button>
          </div>

          <button
            onClick={() => onToast(`Đang xuất file Excel danh sách ${filteredLeads.length} lead...`)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs rounded-xl shadow-xs transition cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={() => {
              if (selectedLeadIds.length === 0) {
                onToast('Vui lòng tích chọn khách hàng để phân bổ');
                return;
              }
              setAssigningSingleLeadId(null);
              setAssignModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-container hover:bg-primary text-on-primary font-label-md text-xs rounded-xl shadow-sm transition cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Phân bổ lead ({selectedLeadIds.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Manager Bento KPI Cards (Chỉ số vĩ mô cho Quản lý) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {/* Card 1: Toàn bộ data */}
        <button
          onClick={() => {
            setAllocationFilter('Tất cả');
            setStatusFilter('Tất cả');
          }}
          className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-xs hover:-translate-y-0.5 ${
            allocationFilter === 'Tất cả' && statusFilter === 'Tất cả'
              ? 'bg-primary/8 text-primary border-primary ring-2 ring-primary'
              : 'bg-white hover:bg-surface-container-low border-outline-variant/30'
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[11px] font-semibold truncate text-on-surface-variant">Toàn bộ Data</span>
            <span className="w-2 h-2 rounded-full bg-primary ring-2 ring-white/80"></span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-on-surface">{stats.total}</span>
            <span className="material-symbols-outlined text-[18px] text-primary">inventory_2</span>
          </div>
        </button>

        {/* Card 2: Chưa phân bổ (Cực kỳ quan trọng với Quản lý) */}
        <button
          onClick={() => {
            setAllocationFilter('Chưa phân bổ');
            setStatusFilter('Tất cả');
          }}
          className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-xs hover:-translate-y-0.5 ${
            allocationFilter === 'Chưa phân bổ'
              ? 'bg-red-50 text-red-900 border-red-300 ring-2 ring-red-500'
              : 'bg-white hover:bg-red-50/50 border-red-200/80'
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[11px] font-bold truncate text-red-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              Chưa phân bổ
            </span>
            <span className="w-2 h-2 rounded-full bg-red-500 ring-2 ring-white/80"></span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-red-700">{stats.unassigned}</span>
            <span className="material-symbols-outlined text-[18px] text-red-600">pending_actions</span>
          </div>
        </button>

        {/* Card 3: Đã phân bổ */}
        <button
          onClick={() => {
            setAllocationFilter('Đã phân bổ');
            setStatusFilter('Tất cả');
          }}
          className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-xs hover:-translate-y-0.5 ${
            allocationFilter === 'Đã phân bổ'
              ? 'bg-blue-50 text-blue-900 border-blue-300 ring-2 ring-blue-500'
              : 'bg-white hover:bg-surface-container-low border-outline-variant/30'
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[11px] font-semibold truncate text-on-surface-variant">Đã phân bổ</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white/80"></span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-on-surface">{stats.assigned}</span>
            <span className="material-symbols-outlined text-[18px] text-blue-600">assignment_turned_in</span>
          </div>
        </button>

        {/* Card 4: Mới tiếp nhận */}
        <button
          onClick={() => {
            setAllocationFilter('Tất cả');
            setStatusFilter(statusFilter === 'Mới tiếp nhận' ? 'Tất cả' : 'Mới tiếp nhận');
          }}
          className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-xs hover:-translate-y-0.5 ${
            statusFilter === 'Mới tiếp nhận'
              ? 'bg-[#eef2ff] text-[#3730a3] border-[#c7d2fe] ring-2 ring-[#6366f1]'
              : 'bg-white hover:bg-surface-container-low border-outline-variant/30'
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[11px] font-semibold truncate text-on-surface-variant">Mới tiếp nhận</span>
            <span className="w-2 h-2 rounded-full bg-[#6366f1] ring-2 ring-white/80"></span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-on-surface">{stats.newLeads}</span>
            <span className="material-symbols-outlined text-[18px] text-[#4f46e5]">mark_email_unread</span>
          </div>
        </button>

        {/* Card 5: Đang liên hệ */}
        <button
          onClick={() => {
            setAllocationFilter('Tất cả');
            setStatusFilter(statusFilter === 'Đang liên hệ' ? 'Tất cả' : 'Đang liên hệ');
          }}
          className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-xs hover:-translate-y-0.5 ${
            statusFilter === 'Đang liên hệ'
              ? 'bg-[#f0f9ff] text-[#075985] border-[#bae6fd] ring-2 ring-[#0ea5e9]'
              : 'bg-white hover:bg-surface-container-low border-outline-variant/30'
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[11px] font-semibold truncate text-on-surface-variant">Đang liên hệ</span>
            <span className="w-2 h-2 rounded-full bg-[#0ea5e9] ring-2 ring-white/80"></span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-on-surface">{stats.contacting}</span>
            <span className="material-symbols-outlined text-[18px] text-[#0284c7]">ring_volume</span>
          </div>
        </button>

        {/* Card 6: Quan tâm cao (Hot) */}
        <button
          onClick={() => {
            setAllocationFilter('Tất cả');
            setStatusFilter(statusFilter === 'Quan tâm cao' ? 'Tất cả' : 'Quan tâm cao');
          }}
          className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-xs hover:-translate-y-0.5 ${
            statusFilter === 'Quan tâm cao'
              ? 'bg-[#fff7ed] text-[#9a3412] border-[#fed7aa] ring-2 ring-[#f97316]'
              : 'bg-white hover:bg-surface-container-low border-outline-variant/30'
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[11px] font-semibold truncate text-on-surface-variant">Quan tâm cao</span>
            <span className="w-2 h-2 rounded-full bg-[#f97316] ring-2 ring-white/80"></span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-on-surface">{stats.hotLeads}</span>
            <span className="material-symbols-outlined text-[18px] text-[#ea580c]">local_fire_department</span>
          </div>
        </button>

        {/* Card 7: Đã chốt cọc */}
        <button
          onClick={() => {
            setAllocationFilter('Tất cả');
            setStatusFilter(statusFilter === 'Đã chốt cọc' ? 'Tất cả' : 'Đã chốt cọc');
          }}
          className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-xs hover:-translate-y-0.5 ${
            statusFilter === 'Đã chốt cọc'
              ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0] ring-2 ring-[#10b981]'
              : 'bg-white hover:bg-surface-container-low border-outline-variant/30'
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[11px] font-semibold truncate text-on-surface-variant">Đã chốt cọc</span>
            <span className="w-2 h-2 rounded-full bg-[#10b981] ring-2 ring-white/80"></span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-on-surface">{stats.closed}</span>
            <span className="material-symbols-outlined text-[18px] text-[#059669]">verified</span>
          </div>
        </button>
      </div>

      {/* 3. Comprehensive Multi-level Filter Toolbar */}
      <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl shadow-sm border border-outline-variant/30 space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên, SĐT, mã lead, địa chỉ..."
              className="w-full pl-9 pr-7 py-2 bg-surface-container-low text-on-surface font-body-md text-xs sm:text-sm rounded-xl border border-outline-variant/30 focus:outline-none focus:border-primary"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Project Filter (TOÀN BỘ DỰ ÁN) */}
          <div className="relative">
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-surface-container-low text-on-surface font-body-md text-xs sm:text-sm rounded-xl border border-outline-variant/30 appearance-none focus:outline-none cursor-pointer font-medium"
            >
              {projectList.map((p) => (
                <option key={p} value={p}>
                  Dự án: {p}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-outline pointer-events-none">
              arrow_drop_down
            </span>
          </div>

          {/* Allocation Status Filter */}
          <div className="relative">
            <select
              value={allocationFilter}
              onChange={(e) => setAllocationFilter(e.target.value as any)}
              className="w-full pl-3 pr-8 py-2 bg-surface-container-low text-on-surface font-body-md text-xs sm:text-sm rounded-xl border border-outline-variant/30 appearance-none focus:outline-none cursor-pointer font-medium"
            >
              <option value="Tất cả">Phân bổ: Tất cả tình trạng</option>
              <option value="Chưa phân bổ">⚠️ Chưa phân bổ (Cần chia)</option>
              <option value="Đã phân bổ">✓ Đã phân bổ cho Sale</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-outline pointer-events-none">
              arrow_drop_down
            </span>
          </div>

          {/* Assigned Agent Filter */}
          <div className="relative">
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-surface-container-low text-on-surface font-body-md text-xs sm:text-sm rounded-xl border border-outline-variant/30 appearance-none focus:outline-none cursor-pointer"
            >
              {agentList.map((ag) => (
                <option key={ag} value={ag}>
                  Phụ trách: {ag}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-outline pointer-events-none">
              arrow_drop_down
            </span>
          </div>

          {/* Source Filter */}
          <div className="relative">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-surface-container-low text-on-surface font-body-md text-xs sm:text-sm rounded-xl border border-outline-variant/30 appearance-none focus:outline-none cursor-pointer"
            >
              <option value="Tất cả">Nguồn: Tất cả nguồn data</option>
              <option value="Excel">Tải lên từ Excel (.xlsx)</option>
              <option value="Facebook">Facebook Ads</option>
              <option value="Google">Google Search Ads</option>
              <option value="Hotline">Hotline công ty / CSKH</option>
              <option value="Zalo">Zalo OA</option>
              <option value="TikTok">TikTok Ads</option>
              <option value="Sự kiện">Sự kiện mở bán</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-outline pointer-events-none">
              arrow_drop_down
            </span>
          </div>
        </div>

        {/* Quick Filter Status Pills + Reset button */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pt-2 border-t border-outline-variant/20 text-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-outline font-semibold text-[11px] uppercase mr-1">Trạng thái lead:</span>
            <button
              onClick={() => setStatusFilter('Tất cả')}
              className={`px-2.5 py-1 rounded-xl font-semibold transition cursor-pointer ${
                statusFilter === 'Tất cả'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Tất cả ({leads.length})
            </button>
            {ALL_LEAD_STATUSES.map((st) => {
              const cfg = LEAD_STATUS_CONFIG[st];
              const count = leads.filter((l) => l.status === st).length;
              const isActive = statusFilter === st;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(isActive ? 'Tất cả' : st)}
                  className={`px-2.5 py-1 rounded-xl font-semibold transition flex items-center gap-1.5 cursor-pointer border ${
                    isActive
                      ? `${cfg.bg} ${cfg.text} ${cfg.border} ring-1 ring-current/25 font-bold shadow-2xs`
                      : 'bg-white hover:bg-surface-container-low text-on-surface-variant border-outline-variant/30'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                  <span>{st}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          {isFilterActive && (
            <button
              onClick={resetAllFilters}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0 cursor-pointer ml-auto"
            >
              <span className="material-symbols-outlined text-[15px]">restart_alt</span>
              <span>Đặt lại bộ lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Manager Bulk Actions Bar */}
      {selectedLeadIds.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-primary-fixed/40 border border-primary/25 rounded-2xl text-xs text-primary font-medium animate-fadeIn">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="material-symbols-outlined text-[18px]">check_box</span>
            <span>
              Đang chọn <strong>{selectedLeadIds.length}</strong> khách hàng trong kho data
            </span>
            {selectedLeadIds.length < filteredLeads.length && (
              <button
                onClick={selectAllFiltered}
                className="ml-1 text-xs text-primary underline font-bold hover:text-primary-container cursor-pointer"
              >
                (Chọn tất cả {filteredLeads.length} lead trong bộ lọc)
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setAssigningSingleLeadId(null);
                setAssignModalOpen(true);
              }}
              className="px-3.5 py-1.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-container transition cursor-pointer shadow-2xs flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">person_add</span>
              <span>Phân bổ cho Sale</span>
            </button>
            <button
              onClick={handleRevokeAllocation}
              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 font-semibold rounded-xl transition cursor-pointer flex items-center gap-1"
              title="Chuyển các lead đã chọn về trạng thái Chưa phân bổ"
            >
              <span className="material-symbols-outlined text-[15px]">undo</span>
              <span>Thu hồi về kho chung</span>
            </button>
            <button
              onClick={() => onToast(`Đã xuất ${selectedLeadIds.length} lead đã chọn ra Excel!`)}
              className="px-3 py-1.5 bg-surface-container text-on-surface font-semibold rounded-xl hover:bg-surface-container-high transition cursor-pointer"
            >
              Xuất Excel ({selectedLeadIds.length})
            </button>
            <button
              onClick={() => setSelectedLeadIds([])}
              className="px-2.5 py-1 text-outline hover:text-on-surface cursor-pointer"
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* 5. Master Leads Table View (Có Sort trực tiếp trên từng cột) */}
      {viewMode === 'table' ? (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-high text-[11px] uppercase tracking-wider text-outline font-semibold border-b border-outline-variant/30 whitespace-nowrap select-none">
                  {/* Select All on Current Page Checkbox */}
                  <th className="py-2.5 px-2.5 w-9 text-center">
                    <input
                      type="checkbox"
                      checked={allCurrentPageSelected}
                      onChange={toggleSelectCurrentPage}
                      title="Chọn tất cả trên trang này"
                      className="rounded border-outline-variant text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
                    />
                  </th>

                  {/* Col: Mã lead */}
                  <th
                    onClick={() => handleSort('leadCode')}
                    className="py-2.5 px-2 whitespace-nowrap cursor-pointer hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Mã lead</span>
                      {sortField === 'leadCode' && (
                        <span className="material-symbols-outlined text-[13px] text-primary">
                          {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>

                  {/* Col: Khách hàng & SĐT */}
                  <th
                    onClick={() => handleSort('name')}
                    className="py-2.5 px-2.5 whitespace-nowrap cursor-pointer hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Khách hàng & Liên hệ</span>
                      {sortField === 'name' && (
                        <span className="material-symbols-outlined text-[13px] text-primary">
                          {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>

                  {/* Col: Dự án */}
                  <th
                    onClick={() => handleSort('project')}
                    className="py-2.5 px-2 whitespace-nowrap cursor-pointer hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Dự án quan tâm</span>
                      {sortField === 'project' && (
                        <span className="material-symbols-outlined text-[13px] text-primary">
                          {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>

                  {/* Col: Nguồn data */}
                  <th
                    onClick={() => handleSort('source')}
                    className="py-2.5 px-2 whitespace-nowrap cursor-pointer hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Nguồn data</span>
                      {sortField === 'source' && (
                        <span className="material-symbols-outlined text-[13px] text-primary">
                          {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>

                  {/* Col: Phụ trách / Tình trạng phân bổ */}
                  <th
                    onClick={() => handleSort('assignedTo')}
                    className="py-2.5 px-2 whitespace-nowrap cursor-pointer hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Phụ trách / Phân bổ</span>
                      {sortField === 'assignedTo' && (
                        <span className="material-symbols-outlined text-[13px] text-primary">
                          {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>

                  {/* Col: Trạng thái Lead */}
                  <th
                    onClick={() => handleSort('status')}
                    className="py-2.5 px-2 whitespace-nowrap cursor-pointer hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Trạng thái</span>
                      {sortField === 'status' && (
                        <span className="material-symbols-outlined text-[13px] text-primary">
                          {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>

                  {/* Col: Tiến độ tương tác */}
                  <th
                    onClick={() => handleSort('callCount')}
                    className="py-2.5 px-2 whitespace-nowrap cursor-pointer hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Tiến độ Sale</span>
                      {sortField === 'callCount' && (
                        <span className="material-symbols-outlined text-[13px] text-primary">
                          {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>

                  {/* Col: Thời gian nhập */}
                  <th
                    onClick={() => handleSort('createdAt')}
                    className="py-2.5 px-2 whitespace-nowrap cursor-pointer hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Ngày nhập data</span>
                      {sortField === 'createdAt' && (
                        <span className="material-symbols-outlined text-[13px] text-primary">
                          {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>

                  {/* Col: Thao tác Quản trị */}
                  <th className="py-2.5 px-2.5 text-right whitespace-nowrap">Thao tác QL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 bg-surface-container-lowest">
                {sortedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-outline">
                      <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant block">
                        group_off
                      </span>
                      <p className="font-semibold text-sm">Không tìm thấy khách hàng nào phù hợp với bộ lọc</p>
                      <p className="text-xs text-outline mt-1">
                        Thử bấm &quot;Đặt lại bộ lọc&quot; hoặc chọn &quot;Tất cả dự án&quot; để hiển thị toàn bộ data hệ thống.
                      </p>
                      <button
                        onClick={resetAllFilters}
                        className="mt-3 px-3.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-container transition cursor-pointer shadow-2xs"
                      >
                        Đặt lại bộ lọc
                      </button>
                    </td>
                  </tr>
                ) : (
                  paginatedLeads.map((lead) => {
                    const isSelected = selectedLeadIds.includes(lead.id);
                    const cfg = LEAD_STATUS_CONFIG[lead.status] || LEAD_STATUS_CONFIG['Mới tiếp nhận'];
                    const isUnassigned = lead.assignedTo === 'Chưa phân bổ';

                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setActiveCustomerDetail(lead)}
                        className={`transition cursor-pointer group whitespace-nowrap ${
                          isSelected
                            ? 'bg-primary-fixed/25 hover:bg-primary-fixed/35'
                            : 'hover:bg-primary-fixed/15'
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-2.5 px-2.5 text-center whitespace-nowrap" onClick={(e) => toggleSelectOne(lead.id, e)}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded border-outline-variant text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
                          />
                        </td>

                        {/* Lead Code */}
                        <td className="py-2.5 px-2 font-mono font-bold text-primary whitespace-nowrap">
                          <span className="bg-surface-container px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap inline-block tracking-tight font-mono">
                            {lead.leadCode}
                          </span>
                        </td>

                        {/* Customer & Phone */}
                        <td className="py-2.5 px-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-2.5 whitespace-nowrap">
                            <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary font-bold flex items-center justify-center text-xs shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                              {lead.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <span className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors whitespace-nowrap">
                                  {lead.name}
                                </span>
                                {lead.priority === 'Cao (Hot)' && (
                                  <span className="material-symbols-outlined text-[14px] text-amber-500 fill shrink-0" title="Hot Lead tiềm năng">
                                    local_fire_department
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5 whitespace-nowrap text-[11px]">
                                <span className="font-mono font-bold text-primary tracking-wide">
                                  {lead.phone}
                                </span>
                                <span className="text-outline text-[10px] truncate max-w-[110px]" title={lead.email}>
                                  • {lead.email}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Project */}
                        <td className="py-2.5 px-2 whitespace-nowrap max-w-[150px]">
                          <strong className="text-xs text-on-surface block truncate max-w-[150px]" title={lead.project}>
                            {lead.project}
                          </strong>
                          <span className="text-[10px] text-outline block truncate max-w-[150px]" title={lead.productInterest}>
                            {lead.productInterest || 'Quan tâm chung'}
                          </span>
                        </td>

                        {/* Source */}
                        <td className="py-2.5 px-2 whitespace-nowrap max-w-[120px]">
                          <span className="bg-surface-container px-2 py-0.5 rounded text-[10px] font-medium text-on-surface-variant block truncate max-w-[120px]" title={lead.source}>
                            {lead.source}
                          </span>
                        </td>

                        {/* Assigned Agent / Allocation Status */}
                        <td className="py-2.5 px-2 whitespace-nowrap">
                          {isUnassigned ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAssigningSingleLeadId(lead.id);
                                setAssignModalOpen(true);
                              }}
                              className="text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1 transition cursor-pointer shadow-2xs"
                              title="Bấm để phân bổ ngay cho nhân viên"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                              <span>Chưa phân bổ</span>
                              <span className="material-symbols-outlined text-[13px] text-red-600">person_add</span>
                            </button>
                          ) : (
                            <div className="whitespace-nowrap">
                              <strong className="text-xs text-primary block font-medium">
                                {lead.assignedTo}
                              </strong>
                              <span className="text-[10px] text-outline">Đã gán cho Sale</span>
                            </div>
                          )}
                        </td>

                        {/* Status Pill with Inline Dropdown */}
                        <td className="py-2.5 px-2 whitespace-nowrap relative">
                          <div className="relative inline-block whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setStatusDropdownId(statusDropdownId === lead.id ? null : lead.id);
                              }}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border shadow-2xs hover:shadow-xs hover:scale-[1.02] transition cursor-pointer select-none whitespace-nowrap ${cfg.bg} ${cfg.text} ${cfg.border}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ring-2 ring-white/80 shrink-0`}></span>
                              <span className="font-semibold whitespace-nowrap">{lead.status}</span>
                              <span className="material-symbols-outlined text-[14px] opacity-70 shrink-0">
                                expand_more
                              </span>
                            </button>

                            {/* Dropdown Menu */}
                            {statusDropdownId === lead.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute left-0 mt-1.5 z-40 w-48 bg-white rounded-2xl shadow-xl border border-outline-variant/30 py-2 divide-y divide-outline-variant/10 animate-in fade-in zoom-in-95"
                              >
                                <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
                                  Đổi trạng thái lead
                                </div>
                                <div className="py-1">
                                  {ALL_LEAD_STATUSES.map((st) => {
                                    const stCfg = LEAD_STATUS_CONFIG[st];
                                    const isCurrent = lead.status === st;
                                    return (
                                      <button
                                        key={st}
                                        onClick={(e) => handleUpdateStatus(lead.id, st, e)}
                                        className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between transition cursor-pointer whitespace-nowrap ${
                                          isCurrent
                                            ? `${stCfg.bg} ${stCfg.text} font-bold`
                                            : 'text-on-surface hover:bg-surface-container-low'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                          <span className={`w-2 h-2 rounded-full ${stCfg.dot} ring-1 ring-white shrink-0`}></span>
                                          <span className="whitespace-nowrap">{st}</span>
                                        </div>
                                        {isCurrent && (
                                          <span className="material-symbols-outlined text-[15px] text-current shrink-0">
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

                        {/* Call Progress */}
                        <td className="py-2.5 px-2 whitespace-nowrap">
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono whitespace-nowrap inline-block ${
                              lead.callCount > 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-surface-container text-outline'
                            }`}
                          >
                            {lead.callCount} cuộc gọi
                          </span>
                          <span className="text-[10px] text-outline block mt-0.5 whitespace-nowrap">
                            {lead.lastCallTime ? lead.lastCallTime : 'Chưa tương tác'}
                          </span>
                        </td>

                        {/* Created At / Import Time */}
                        <td className="py-2.5 px-2 whitespace-nowrap text-outline text-[11px]">
                          <span>{lead.createdAt}</span>
                        </td>

                        {/* Manager Actions (Nút chức năng của Quản lý) */}
                        <td className="py-2.5 px-2.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            {/* Action 1: Phân bổ / Đổi Sale phụ trách */}
                            <button
                              onClick={() => {
                                setAssigningSingleLeadId(lead.id);
                                setAssignModalOpen(true);
                              }}
                              className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-600 active:scale-95 text-amber-700 hover:text-white border border-amber-200/80 hover:border-amber-600 flex items-center justify-center transition shadow-2xs hover:shadow-xs cursor-pointer group/btn shrink-0 overflow-hidden"
                              title="Gán / Đổi nhân viên kinh doanh phụ trách"
                            >
                              <span className="material-symbols-outlined text-[15px] group-hover/btn:scale-110 transition-transform">person_add</span>
                            </button>

                            {/* Action 2: Xem chi tiết hồ sơ & lịch sử tương tác */}
                            <button
                              onClick={() => setActiveCustomerDetail(lead)}
                              className="w-7 h-7 rounded-lg bg-indigo-50 hover:bg-indigo-600 active:scale-95 text-indigo-700 hover:text-white border border-indigo-200/80 hover:border-indigo-600 flex items-center justify-center transition shadow-2xs hover:shadow-xs cursor-pointer group/btn shrink-0 overflow-hidden"
                              title="Xem chi tiết hồ sơ khách & nhật ký Sale chăm sóc"
                            >
                              <span className="material-symbols-outlined text-[15px] group-hover/btn:scale-110 transition-transform">visibility</span>
                            </button>

                            {/* Action 3: Chỉnh sửa thông tin khách hàng */}
                            <button
                              onClick={() => setEditCustomerModal(lead)}
                              className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-container-highest active:scale-95 text-on-surface-variant hover:text-primary border border-outline-variant/30 flex items-center justify-center transition cursor-pointer group/btn shrink-0 overflow-hidden"
                              title="Chỉnh sửa thông tin lead"
                            >
                              <span className="material-symbols-outlined text-[15px] group-hover/btn:scale-110 transition-transform">edit</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 5B. Cards Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginatedLeads.map((lead) => {
            const isSelected = selectedLeadIds.includes(lead.id);
            const cfg = LEAD_STATUS_CONFIG[lead.status] || LEAD_STATUS_CONFIG['Mới tiếp nhận'];
            const isUnassigned = lead.assignedTo === 'Chưa phân bổ';

            return (
              <div
                key={lead.id}
                onClick={() => setActiveCustomerDetail(lead)}
                className={`rounded-2xl p-4 transition shadow-xs flex flex-col justify-between space-y-3 cursor-pointer group border ${
                  isSelected
                    ? 'bg-primary-fixed/20 border-primary shadow-sm'
                    : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/30 hover:border-primary/50'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary-fixed text-primary font-bold flex items-center justify-center text-sm shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-sm text-on-surface group-hover:text-primary transition-colors">
                          {lead.name}
                        </strong>
                        {lead.priority === 'Cao (Hot)' && (
                          <span className="material-symbols-outlined text-[15px] text-amber-500 fill" title="Hot Lead">
                            local_fire_department
                          </span>
                        )}
                        <span className="font-mono text-[10px] text-outline bg-surface-container-highest px-1.5 py-0.5 rounded">
                          {lead.leadCode}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono font-bold text-xs text-primary">
                          {lead.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-2xs ${cfg.bg} ${cfg.text} ${cfg.border}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ring-2 ring-white/80 shrink-0`}></span>
                    <span>{lead.status}</span>
                  </span>
                </div>

                {/* Body info */}
                <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 space-y-1.5 text-xs">
                  <div className="flex items-start justify-between text-on-surface gap-2">
                    <span className="text-outline shrink-0">Dự án:</span>
                    <strong className="text-right truncate font-medium text-secondary">
                      {lead.project}
                    </strong>
                  </div>
                  <div className="flex items-start justify-between text-on-surface gap-2">
                    <span className="text-outline shrink-0">Nguồn data:</span>
                    <span className="text-right truncate font-medium text-[11px]">
                      {lead.source}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface">
                    <span className="text-outline">Phụ trách:</span>
                    {isUnassigned ? (
                      <span className="text-red-700 bg-red-50 border border-red-200 px-2 py-0.2 rounded-full font-bold text-[10px]">
                        Chưa phân bổ
                      </span>
                    ) : (
                      <strong className="font-medium text-primary">{lead.assignedTo}</strong>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-on-surface">
                    <span className="text-outline">Tiến độ gọi:</span>
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
                    Nhập: {lead.createdAt}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setAssigningSingleLeadId(lead.id);
                        setAssignModalOpen(true);
                      }}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white border border-amber-200 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">person_add</span>
                      <span>Gán Sale</span>
                    </button>
                    <button
                      onClick={() => setActiveCustomerDetail(lead)}
                      className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5C. Pagination Control Bar (Phân trang Quản lý) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-xs shadow-2xs">
        {/* Left: Summary & Page Size Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-outline font-medium">
            Hiển thị <strong className="text-on-surface font-mono font-bold">{filteredLeads.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1}</strong> – <strong className="text-on-surface font-mono font-bold">{Math.min(safeCurrentPage * pageSize, filteredLeads.length)}</strong> trên tổng số <strong className="text-primary font-mono font-bold">{filteredLeads.length}</strong> khách hàng
            {filteredLeads.length !== leads.length && (
              <span className="text-outline text-[11px] ml-1 font-normal">(Toàn kho: {leads.length})</span>
            )}
          </span>

          <div className="flex items-center gap-1.5 border-l border-outline-variant/30 pl-3">
            <span className="text-outline text-[11px] whitespace-nowrap font-medium">Dòng / trang:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-surface-container-low border border-outline-variant/30 rounded-lg px-2.5 py-1 text-xs font-bold text-on-surface focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Right: Page Navigation Buttons */}
        <div className="flex items-center gap-1">
          {/* First Page */}
          <button
            onClick={() => setCurrentPage(1)}
            disabled={safeCurrentPage <= 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-outline-variant/30 hover:bg-surface-container-high disabled:opacity-35 disabled:pointer-events-none transition cursor-pointer text-on-surface shadow-2xs"
            title="Trang đầu"
          >
            <span className="material-symbols-outlined text-[16px]">first_page</span>
          </button>

          {/* Prev Page */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage <= 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-outline-variant/30 hover:bg-surface-container-high disabled:opacity-35 disabled:pointer-events-none transition cursor-pointer text-on-surface shadow-2xs"
            title="Trang trước"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1 px-1">
            {(() => {
              const pages: (number | string)[] = [];
              if (totalPages <= 5) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);
                if (safeCurrentPage > 3) pages.push('...');
                const start = Math.max(2, safeCurrentPage - 1);
                const end = Math.min(totalPages - 1, safeCurrentPage + 1);
                for (let i = start; i <= end; i++) {
                  if (!pages.includes(i)) pages.push(i);
                }
                if (safeCurrentPage < totalPages - 2) pages.push('...');
                if (!pages.includes(totalPages)) pages.push(totalPages);
              }

              return pages.map((page, idx) => {
                if (page === '...') {
                  return (
                    <span key={`dots-${idx}`} className="px-1 text-outline select-none font-bold">
                      …
                    </span>
                  );
                }
                const isCurrent = page === safeCurrentPage;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`min-w-8 h-8 px-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isCurrent
                        ? 'bg-primary text-white shadow-2xs scale-105'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/30'
                    }`}
                  >
                    {page}
                  </button>
                );
              });
            })()}
          </div>

          {/* Next Page */}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage >= totalPages}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-outline-variant/30 hover:bg-surface-container-high disabled:opacity-35 disabled:pointer-events-none transition cursor-pointer text-on-surface shadow-2xs"
            title="Trang tiếp"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>

          {/* Last Page */}
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={safeCurrentPage >= totalPages}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-outline-variant/30 hover:bg-surface-container-high disabled:opacity-35 disabled:pointer-events-none transition cursor-pointer text-on-surface shadow-2xs"
            title="Trang cuối"
          >
            <span className="material-symbols-outlined text-[16px]">last_page</span>
          </button>
        </div>
      </div>

      {/* 6. Manager Customer Detail & Care History Modal */}
      {activeCustomerDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5">
          <div className="bg-surface-container-lowest rounded-3xl max-w-3xl w-full max-h-[92vh] shadow-2xl border border-outline-variant/40 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-primary-fixed/40 via-surface-container-lowest to-surface-container-lowest border-b border-outline-variant/20 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-md shrink-0">
                  {activeCustomerDetail.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface">
                      {activeCustomerDetail.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary text-xs font-mono font-bold">
                      {activeCustomerDetail.leadCode}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                      {activeCustomerDetail.priority}
                    </span>
                  </div>
                  <p className="text-xs text-outline mt-1 flex items-center gap-2 flex-wrap">
                    <span>Dự án: <strong className="text-on-surface">{activeCustomerDetail.project}</strong></span>
                    <span>•</span>
                    <span>Nguồn: <strong>{activeCustomerDetail.source}</strong></span>
                    <span>•</span>
                    <span>
                      Phụ trách:{' '}
                      <strong className={activeCustomerDetail.assignedTo === 'Chưa phân bổ' ? 'text-red-600' : 'text-primary'}>
                        {activeCustomerDetail.assignedTo}
                      </strong>
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveCustomerDetail(null)}
                className="p-1.5 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
              {/* Status & Allocation Action */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-outline font-semibold uppercase text-[11px]">
                    Trạng thái lead:
                  </span>
                  {(() => {
                    const cfg = LEAD_STATUS_CONFIG[activeCustomerDetail.status] || LEAD_STATUS_CONFIG['Mới tiếp nhận'];
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`}></span>
                        <span>{activeCustomerDetail.status}</span>
                      </span>
                    );
                  })()}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAssigningSingleLeadId(activeCustomerDetail.id);
                      setAssignModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">person_add</span>
                    <span>Phân bổ / Đổi Sale phụ trách</span>
                  </button>
                </div>
              </div>

              {/* Section 1: Customer Profile Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  <h4>1. Thông tin liên hệ & Hồ sơ nhân khẩu học</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                    <span className="text-outline text-[11px] block">Số điện thoại</span>
                    <strong className="font-mono text-sm text-primary mt-1 block">
                      {activeCustomerDetail.phone}
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                    <span className="text-outline text-[11px] block">Địa chỉ Email</span>
                    <strong className="text-xs text-on-surface mt-1 block truncate">
                      {activeCustomerDetail.email}
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                    <span className="text-outline text-[11px] block">Năm sinh & Tuổi</span>
                    <strong className="text-xs text-on-surface mt-1 block">
                      {activeCustomerDetail.birthYear ? `${activeCustomerDetail.birthYear} (${2026 - activeCustomerDetail.birthYear} tuổi) • ${activeCustomerDetail.gender || 'Nam'}` : 'Chưa cập nhật'}
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 sm:col-span-2">
                    <span className="text-outline text-[11px] block">Địa chỉ thường trú & Hiện tại</span>
                    <strong className="text-xs text-on-surface mt-1 block">
                      {activeCustomerDetail.address || 'Hà Nội, Việt Nam'}
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                    <span className="text-outline text-[11px] block">Khả năng tài chính</span>
                    <strong className="text-xs text-emerald-700 mt-1 block">
                      {activeCustomerDetail.incomeRange || 'Chưa khảo sát'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Section 2: Project Interest & Upload Batch */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                  <span className="material-symbols-outlined text-[18px]">domain</span>
                  <h4>2. Nhu cầu dự án & Thông tin nhập data</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                  <div>
                    <span className="text-outline text-[11px] block">Dự án quan tâm:</span>
                    <strong className="text-sm text-on-surface">{activeCustomerDetail.project}</strong>
                  </div>
                  <div>
                    <span className="text-outline text-[11px] block">Loại hình căn hộ / sản phẩm:</span>
                    <span className="text-secondary font-bold text-xs">{activeCustomerDetail.productInterest || 'Căn hộ chung'}</span>
                  </div>
                  <div>
                    <span className="text-outline text-[11px] block">Nguồn tiếp nhận data:</span>
                    <span className="text-on-surface-variant font-medium text-xs">{activeCustomerDetail.source}</span>
                  </div>
                  <div>
                    <span className="text-outline text-[11px] block">Thời gian nhập vào hệ thống:</span>
                    <span className="text-primary font-semibold text-xs">{activeCustomerDetail.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Sale Interaction Timeline & Manager Instruction */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                    <span className="material-symbols-outlined text-[18px]">history_edu</span>
                    <h4>3. Tiến độ chăm sóc của Sale & Nhật ký tương tác ({(activeCustomerDetail.callHistory || []).length})</h4>
                  </div>
                  <span className="text-outline text-xs">
                    Sale phụ trách: <strong>{activeCustomerDetail.assignedTo}</strong>
                  </span>
                </div>

                {/* Manager Instruction Box */}
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                  <label className="block text-[11px] font-bold uppercase text-amber-900">
                    Ghi chú chỉ đạo của Quản lý:
                  </label>
                  <textarea
                    rows={2}
                    value={managerNoteText}
                    onChange={(e) => setManagerNoteText(e.target.value)}
                    placeholder="Nhập yêu cầu chỉ đạo cho nhân viên sale phụ trách (ví dụ: ưu tiên gọi lại trước 15h, gửi chính sách chiết khấu căn góc...)"
                    className="w-full p-2.5 bg-white border border-amber-200 rounded-xl text-xs text-on-surface focus:outline-none focus:border-amber-500"
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleAddManagerNote(activeCustomerDetail.id)}
                      className="px-3.5 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-xl hover:bg-amber-700 transition cursor-pointer shadow-2xs"
                    >
                      Lưu chỉ đạo quản lý
                    </button>
                  </div>
                </div>

                {/* History Timeline */}
                {(!activeCustomerDetail.callHistory || activeCustomerDetail.callHistory.length === 0) ? (
                  <div className="p-4 rounded-xl bg-surface-container-lowest text-center text-outline border border-dashed border-outline-variant/40">
                    Chưa có nhật ký tương tác nào từ nhân viên kinh doanh.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeCustomerDetail.callHistory.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/25 flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">history</span>
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
                          <div className="text-[11px] text-outline">
                            Người thực hiện: <span className="text-primary font-medium">{item.caller}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-between gap-3">
              <span className="text-xs text-outline">
                Kho dữ liệu CRM SalesFlow Toàn Hệ Thống
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditCustomerModal(activeCustomerDetail);
                    setActiveCustomerDetail(null);
                  }}
                  className="px-3.5 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                  <span>Chỉnh sửa thông tin</span>
                </button>
                <button
                  onClick={() => setActiveCustomerDetail(null)}
                  className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-container transition cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal Phân Bổ (Assign / Re-allocate Modal) */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2 text-primary font-bold">
                <span className="material-symbols-outlined text-[22px]">person_add</span>
                <h3 className="text-base">
                  Phân bổ {assigningSingleLeadId ? '1 lead' : `${selectedLeadIds.length} lead đã chọn`}
                </h3>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Chọn nhân viên kinh doanh tiếp nhận và chăm sóc data từ kho quản lý:
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {MOCK_AGENTS.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => handleBulkAssign(agent.name)}
                  className="flex items-center justify-between p-3 rounded-2xl border border-outline-variant/30 hover:bg-primary-fixed/30 hover:border-primary cursor-pointer transition"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary font-bold flex items-center justify-center text-xs shadow-2xs">
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <strong className="text-xs block text-on-surface">{agent.name}</strong>
                      <span className="text-[11px] text-outline">
                        {agent.team} • Đang giữ {agent.leadsToday} lead
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary hover:text-white transition">
                    Gán ngay
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 rounded-xl text-outline hover:text-on-surface text-xs font-semibold cursor-pointer"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Modal Chỉnh Sửa Thông Tin Khách Hàng (Edit Lead Modal) */}
      {editCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">edit</span>
                <span>Chỉnh sửa thông tin: {editCustomerModal.leadCode}</span>
              </h3>
              <button
                onClick={() => setEditCustomerModal(null)}
                className="text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEditCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-outline font-semibold mb-1">Họ và tên khách hàng</label>
                <input
                  type="text"
                  value={editCustomerModal.name}
                  onChange={(e) => setEditCustomerModal({ ...editCustomerModal, name: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-outline font-semibold mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={editCustomerModal.phone}
                    onChange={(e) => setEditCustomerModal({ ...editCustomerModal, phone: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl font-mono text-on-surface focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-outline font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={editCustomerModal.email}
                    onChange={(e) => setEditCustomerModal({ ...editCustomerModal, email: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-outline font-semibold mb-1">Dự án quan tâm</label>
                  <select
                    value={editCustomerModal.project}
                    onChange={(e) => setEditCustomerModal({ ...editCustomerModal, project: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {projectList.filter((p) => p !== 'Tất cả dự án').map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-outline font-semibold mb-1">Trạng thái lead</label>
                  <select
                    value={editCustomerModal.status}
                    onChange={(e) => setEditCustomerModal({ ...editCustomerModal, status: e.target.value as LeadStatus })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {ALL_LEAD_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-outline font-semibold mb-1">Địa chỉ thường trú</label>
                <input
                  type="text"
                  value={editCustomerModal.address || ''}
                  onChange={(e) => setEditCustomerModal({ ...editCustomerModal, address: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-outline font-semibold mb-1">Ghi chú nhu cầu</label>
                <textarea
                  rows={2}
                  value={editCustomerModal.notes || ''}
                  onChange={(e) => setEditCustomerModal({ ...editCustomerModal, notes: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:border-primary"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditCustomerModal(null)}
                  className="px-4 py-2 rounded-xl text-outline hover:text-on-surface font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-container transition cursor-pointer shadow-sm"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
