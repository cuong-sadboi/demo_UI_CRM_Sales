'use client';

import React, { useState } from 'react';
import { MOCK_LEADS, MOCK_AGENTS } from '../../data/mockCrmData';
import { LeadCustomer } from '../../types/crm';

interface CustomersScreenProps {
  onToast: (msg: string) => void;
}

export default function CustomersScreen({ onToast }: CustomersScreenProps) {
  const [leads, setLeads] = useState<LeadCustomer[]>(MOCK_LEADS);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>(['ld-1', 'ld-2']);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [sourceFilter, setSourceFilter] = useState('Tất cả');
  const [activeCustomerDetail, setActiveCustomerDetail] = useState<LeadCustomer | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [callModalLead, setCallModalLead] = useState<LeadCustomer | null>(null);

  const toggleSelectAll = () => {
    if (selectedLeadIds.length === leads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(leads.map((l) => l.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(selectedLeadIds.filter((item) => item !== id));
    } else {
      setSelectedLeadIds([...selectedLeadIds, id]);
    }
  };

  const filteredLeads = leads.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm) ||
      l.leadCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'Tất cả' || l.status === statusFilter;
    const matchSource = sourceFilter === 'Tất cả' || l.source.includes(sourceFilter);
    return matchSearch && matchStatus && matchSource;
  });

  const handleBulkAssign = (agentName: string) => {
    setLeads((prev) =>
      prev.map((l) =>
        selectedLeadIds.includes(l.id)
          ? { ...l, assignedTo: agentName }
          : l
      )
    );
    setAssignModalOpen(false);
    onToast(`Đã phân bổ thành công ${selectedLeadIds.length} lead cho ${agentName}`);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* 1. Header Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-sm text-xs uppercase tracking-wider text-primary font-semibold">
              Quản trị Dữ liệu
            </span>
            <span className="text-outline-variant">•</span>
            <span className="font-label-sm text-xs text-outline">Leads Pipeline</span>
          </div>
          <h1 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
            Khách hàng & Data Sale
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
            Quản lý tập trung thông tin liên hệ, tiến trình tương tác telesale và phân loại tiềm năng khách hàng
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => onToast('Đang xuất 1,420 bản ghi khách hàng ra tệp Excel...')}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={() => {
              if (selectedLeadIds.length === 0) {
                onToast('Vui lòng chọn ít nhất 1 khách hàng để phân bổ');
                return;
              }
              setAssignModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-container hover:bg-primary text-on-primary font-label-md text-xs rounded-xl shadow-sm transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Phân bổ nhanh ({selectedLeadIds.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Comprehensive Filter Toolbar */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên, SĐT, mã lead..."
              className="w-full pl-9 pr-3 py-2 bg-surface-container-low text-on-surface font-body-md text-xs rounded-xl border border-outline-variant/30 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-surface-container-low text-on-surface font-body-md text-xs rounded-xl border border-outline-variant/30 appearance-none focus:outline-none cursor-pointer"
            >
              <option value="Tất cả">Trạng thái: Tất cả</option>
              <option value="Mới tiếp nhận">Mới tiếp nhận</option>
              <option value="Đang liên hệ">Đang liên hệ</option>
              <option value="Quan tâm cao">Quan tâm cao</option>
              <option value="Hẹn gọi lại">Hẹn gọi lại</option>
              <option value="Đã chốt cọc">Đã chốt cọc</option>
              <option value="Không quan tâm">Không quan tâm</option>
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
              className="w-full pl-3 pr-8 py-2 bg-surface-container-low text-on-surface font-body-md text-xs rounded-xl border border-outline-variant/30 appearance-none focus:outline-none cursor-pointer"
            >
              <option value="Tất cả">Nguồn lead: Tất cả</option>
              <option value="Facebook">Facebook Ads</option>
              <option value="Google">Google Search</option>
              <option value="Hotline">Hotline công ty</option>
              <option value="Zalo">Zalo OA</option>
              <option value="Sự kiện">Sự kiện mở bán</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-outline pointer-events-none">
              arrow_drop_down
            </span>
          </div>

          {/* Date Range Simulation */}
          <div className="flex items-center bg-surface-container-low text-on-surface rounded-xl px-3 py-2 border border-outline-variant/30 text-xs">
            <span className="material-symbols-outlined text-[18px] text-outline mr-2">date_range</span>
            <span className="truncate">Tháng 10/2024 (Toàn thời gian)</span>
            <span className="material-symbols-outlined ml-auto text-[16px] text-outline">expand_more</span>
          </div>
        </div>

        {/* Secondary Filter Tags */}
        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-outline font-medium">Lọc nhanh:</span>
            <button
              onClick={() => { setStatusFilter('Quan tâm cao'); onToast('Lọc danh sách: Khách quan tâm cao'); }}
              className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-medium transition cursor-pointer"
            >
              🔥 Hot Lead ({leads.filter(l => l.status === 'Quan tâm cao').length})
            </button>
            <button
              onClick={() => { setStatusFilter('Mới tiếp nhận'); onToast('Lọc danh sách: Lead mới chưa gán'); }}
              className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 font-medium transition cursor-pointer"
            >
              📥 Lead mới ({leads.filter(l => l.status === 'Mới tiếp nhận').length})
            </button>
            <button
              onClick={() => { setStatusFilter('Đã chốt cọc'); onToast('Lọc danh sách: Đã chốt cọc'); }}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-medium transition cursor-pointer"
            >
              ✅ Đã cọc ({leads.filter(l => l.status === 'Đã chốt cọc').length})
            </button>
          </div>
          <button
            onClick={() => { setSearchTerm(''); setStatusFilter('Tất cả'); setSourceFilter('Tất cả'); onToast('Đã xóa tất cả bộ lọc'); }}
            className="text-outline hover:text-on-surface font-medium transition cursor-pointer"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      </div>

      {/* 3. Bulk Action Alert Bar (When rows selected) */}
      {selectedLeadIds.length > 0 && (
        <div className="flex items-center justify-between p-3.5 bg-primary-fixed/40 border border-primary/20 rounded-2xl text-xs text-primary font-medium animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_box</span>
            <span>
              Đang chọn <strong>{selectedLeadIds.length}</strong> khách hàng trong danh sách
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAssignModalOpen(true)}
              className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-container transition cursor-pointer"
            >
              Gán cho nhân viên
            </button>
            <button
              onClick={() => onToast(`Đã gửi mẫu khảo sát Zalo tới ${selectedLeadIds.length} khách hàng!`)}
              className="px-3 py-1.5 bg-surface-container text-on-surface rounded-lg hover:bg-surface-container-high transition cursor-pointer"
            >
              Gửi Zalo ZNS
            </button>
            <button
              onClick={() => setSelectedLeadIds([])}
              className="px-2 py-1 text-outline hover:text-on-surface cursor-pointer"
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* 4. Leads Data Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-low text-outline uppercase font-semibold border-b border-outline-variant/30">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedLeadIds.length === leads.length && leads.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">Mã lead</th>
                <th className="py-3 px-3">Họ và tên</th>
                <th className="py-3 px-3">Số điện thoại</th>
                <th className="py-3 px-3">Dự án quan tâm</th>
                <th className="py-3 px-3">Nguồn</th>
                <th className="py-3 px-3">Phụ trách</th>
                <th className="py-3 px-3">Trạng thái</th>
                <th className="py-3 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredLeads.map((lead) => {
                const isSelected = selectedLeadIds.includes(lead.id);
                return (
                  <tr
                    key={lead.id}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-primary-fixed/20 hover:bg-primary-fixed/30'
                        : 'hover:bg-surface-container-low/70'
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(lead.id)}
                        className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">
                      {lead.leadCode}
                    </td>
                    <td className="py-3 px-3 font-semibold text-on-surface">
                      <div
                        onClick={() => setActiveCustomerDetail(lead)}
                        className="hover:text-primary hover:underline cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{lead.name}</span>
                        {lead.priority === 'Cao (Hot)' && (
                          <span className="material-symbols-outlined text-[15px] text-amber-500 fill" title="Hot Lead">
                            local_fire_department
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-outline font-normal block truncate max-w-[140px]">
                        {lead.email}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span>{lead.phone}</span>
                        <button
                          onClick={() => setCallModalLead(lead)}
                          className="p-1 rounded-md hover:bg-emerald-100 text-emerald-600 transition cursor-pointer"
                          title="Bấm gọi ngay qua VoIP"
                        >
                          <span className="material-symbols-outlined text-[16px]">call</span>
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-on-surface font-medium max-w-[150px] truncate">
                      {lead.project}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[11px]">
                        {lead.source}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {lead.assignedTo === 'Chưa phân bổ' ? (
                        <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                          Chưa phân bổ
                        </span>
                      ) : (
                        <span className="font-medium text-on-surface">{lead.assignedTo}</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                          lead.status === 'Quan tâm cao'
                            ? 'bg-amber-100 text-amber-800'
                            : lead.status === 'Đã chốt cọc'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lead.status === 'Đang liên hệ'
                            ? 'bg-blue-100 text-blue-800'
                            : lead.status === 'Hẹn gọi lại'
                            ? 'bg-purple-100 text-purple-800'
                            : lead.status === 'Không quan tâm'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setActiveCustomerDetail(lead)}
                          className="p-1 rounded hover:bg-surface-container text-primary transition cursor-pointer"
                          title="Xem hồ sơ & lịch sử"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedLeadIds([lead.id]);
                            setAssignModalOpen(true);
                          }}
                          className="p-1 rounded hover:bg-surface-container text-secondary transition cursor-pointer"
                          title="Đổi nhân viên phụ trách"
                        >
                          <span className="material-symbols-outlined text-[18px]">person_switch</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Customer Profile Drawer / Modal */}
      {activeCustomerDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-outline-variant/40 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-outline-variant/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center text-xl font-bold">
                  {activeCustomerDetail.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                      {activeCustomerDetail.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary text-xs font-mono font-bold">
                      {activeCustomerDetail.leadCode}
                    </span>
                  </div>
                  <p className="text-xs text-outline">
                    {activeCustomerDetail.phone} • {activeCustomerDetail.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveCustomerDetail(null)}
                className="p-1 text-outline hover:text-on-surface rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Lead Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-surface-container-low rounded-xl text-xs">
              <div>
                <span className="text-outline block">Dự án:</span>
                <strong className="text-on-surface">{activeCustomerDetail.project}</strong>
              </div>
              <div>
                <span className="text-outline block">Nguồn data:</span>
                <span className="text-secondary font-medium">{activeCustomerDetail.source}</span>
              </div>
              <div>
                <span className="text-outline block">Nhân viên sale:</span>
                <strong className="text-primary">{activeCustomerDetail.assignedTo}</strong>
              </div>
              <div>
                <span className="text-outline block">Số cuộc gọi:</span>
                <span className="font-bold">{activeCustomerDetail.callCount} cuộc</span>
              </div>
            </div>

            {/* Note and Requirements */}
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase text-outline">Ghi chú nhu cầu khách hàng:</span>
              <p className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs text-amber-900 leading-relaxed">
                {activeCustomerDetail.notes || 'Chưa có ghi chú đặc biệt.'}
              </p>
            </div>

            {/* Consultation Timeline */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-outline">Nhật ký chăm sóc & cuộc gọi:</span>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">phone_in_talk</span>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <strong className="text-on-surface">Cuộc gọi tư vấn chính sách thanh toán</strong>
                      <span className="text-outline text-[11px]">{activeCustomerDetail.lastCallTime || 'Vừa xong'}</span>
                    </div>
                    <p className="text-on-surface-variant text-[11px] mt-0.5">
                      Khách phản hồi tích cực, đang cân nhắc mức chiết khấu 2.5% và gói vay ngân hàng ân hạn 24 tháng.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/20">
              <button
                onClick={() => {
                  setCallModalLead(activeCustomerDetail);
                  setActiveCustomerDetail(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                Bấm gọi ngay
              </button>
              <button
                onClick={() => {
                  setActiveCustomerDetail(null);
                  onToast('Đã lưu cập nhật thông tin khách hàng');
                }}
                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-container cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Assign Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <h3 className="font-headline-sm text-base font-bold text-on-surface">
              Phân bổ {selectedLeadIds.length} lead đã chọn
            </h3>
            <p className="text-xs text-on-surface-variant">
              Chọn nhân viên kinh doanh tiếp nhận và gọi điện chăm sóc ngay
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {MOCK_AGENTS.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => handleBulkAssign(agent.name)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-outline-variant/30 hover:bg-primary-fixed/30 hover:border-primary cursor-pointer transition"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary font-bold flex items-center justify-center text-xs">
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <strong className="text-xs block text-on-surface">{agent.name}</strong>
                      <span className="text-[11px] text-outline">{agent.team} • {agent.leadsToday} lead hôm nay</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-primary">Gán ngay</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-outline hover:text-on-surface text-xs cursor-pointer"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Quick VoIP Call Simulation Modal */}
      {callModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-outline-variant/30 text-center space-y-4 animate-scaleIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-[32px]">ring_volume</span>
            </div>
            <div>
              <h4 className="font-headline-sm text-lg font-bold text-on-surface">
                Đang kết nối VoIP...
              </h4>
              <p className="text-sm font-semibold text-primary mt-1">
                {callModalLead.name} ({callModalLead.phone})
              </p>
              <span className="text-xs text-outline">{callModalLead.project}</span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl text-xs text-on-surface-variant text-left space-y-1">
              <p>• Tổng đài: <strong>VoIP SIP Center HN-01</strong></p>
              <p>• Thu âm tự động: <strong>Bật</strong></p>
              <p>• Trạng thái chuông: <strong>Đang đổ chuông (Ringing...)</strong></p>
            </div>

            <button
              onClick={() => {
                setCallModalLead(null);
                onToast(`Đã kết thúc cuộc gọi với ${callModalLead.name}. Đã lưu nhật ký vào CRM.`);
              }}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition cursor-pointer"
            >
              Ngắt kết nối cuộc gọi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
