'use client';

import React, { useState } from 'react';
import { MOCK_PROJECTS } from '../../data/mockCrmData';
import { CrmProject } from '../../types/crm';

interface ProjectsScreenProps {
  onToast: (msg: string) => void;
}

export default function ProjectsScreen({ onToast }: ProjectsScreenProps) {
  const [projects, setProjects] = useState<CrmProject[]>(MOCK_PROJECTS);
  const [activeTab, setActiveTab] = useState<'all' | 'running' | 'paused' | 'done'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newProjectModal, setNewProjectModal] = useState(false);

  const filteredProjects = projects.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'running') return matchSearch && p.status === 'Đang chạy';
    if (activeTab === 'paused') return matchSearch && p.status === 'Tạm dừng';
    if (activeTab === 'done') return matchSearch && p.status === 'Đã chốt';
    return matchSearch;
  });

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-sm text-xs uppercase tracking-wider text-primary font-semibold">
              Phân hệ Quản trị
            </span>
            <span className="text-outline-variant">•</span>
            <span className="font-label-sm text-xs text-outline">Pipeline Portfolio</span>
          </div>
          <h1 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
            Quản lý dự án
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
            Theo dõi tiến độ, phân bổ nguồn lực và quản lý danh mục dự án bán hàng tập trung theo thời gian thực
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onToast('Đang tải danh sách 8 dự án BĐS & Tài chính...')}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Xuất danh sách</span>
          </button>
          <button
            onClick={() => setNewProjectModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-container hover:bg-primary text-on-primary font-label-md text-xs rounded-xl shadow-sm transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>+ Tạo dự án mới</span>
          </button>
        </div>
      </div>

      {/* 2. 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                Tổng dự án
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-bold text-on-surface font-mono">8</span>
                <span className="text-xs text-on-surface-variant">dự án</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">corporate_fare</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>+2 dự án quý này</span>
            <span className="text-outline font-normal ml-auto">Toàn hệ thống</span>
          </div>
        </div>

        {/* Card 2: Active */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                Đang hoạt động
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-bold text-emerald-600 font-mono">5</span>
                <span className="text-xs text-on-surface-variant">chiến dịch</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <span className="material-symbols-outlined text-[22px]">rocket_launch</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center gap-1.5 text-on-surface-variant text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Đang mở bán & tiếp nhận data</span>
          </div>
        </div>

        {/* Card 3: Paused */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                Tạm dừng
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-bold text-amber-600 font-mono">1</span>
                <span className="text-xs text-on-surface-variant">dự án</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <span className="material-symbols-outlined text-[22px]">pause_circle</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center gap-1.5 text-outline text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Chờ duyệt giỏ hàng đợt 2</span>
          </div>
        </div>

        {/* Card 4: Completed */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                Đã hoàn thành
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-bold text-primary font-mono">2</span>
                <span className="text-xs text-on-surface-variant">dự án</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">task_alt</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center gap-1.5 text-primary text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Đã chốt 100% chỉ tiêu</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Toolbar & Tabs */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên dự án, mã dự án (VD: DA-GR01)..."
              className="w-full pl-9 pr-3 py-2 bg-surface-container-low text-on-surface font-body-md text-xs rounded-xl border border-outline-variant/30 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center p-1 bg-surface-container-low rounded-xl text-xs border border-outline-variant/30">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Tất cả (8)
              </button>
              <button
                onClick={() => setActiveTab('running')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  activeTab === 'running'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Đang chạy (5)
              </button>
              <button
                onClick={() => setActiveTab('paused')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  activeTab === 'paused'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Tạm dừng (1)
              </button>
              <button
                onClick={() => setActiveTab('done')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  activeTab === 'done'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Đã chốt (2)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Projects Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-outline uppercase font-semibold border-b border-outline-variant/30">
                <th className="py-3 px-4 font-semibold">Mã dự án</th>
                <th className="py-3 px-4 font-semibold">Tên dự án & Phân khúc</th>
                <th className="py-3 px-4 font-semibold">Sản phẩm / Dịch vụ</th>
                <th className="py-3 px-4 font-semibold text-right">Tổng Data</th>
                <th className="py-3 px-4 font-semibold text-right">Đã phân bổ</th>
                <th className="py-3 px-4 font-semibold text-right">Tỷ lệ chốt</th>
                <th className="py-3 px-4 font-semibold">Quản lý</th>
                <th className="py-3 px-4 font-semibold">Trạng thái</th>
                <th className="py-3 px-4 font-semibold text-right">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low transition">
                  <td className="py-3 px-4 font-mono font-bold text-primary">
                    {p.code}
                  </td>
                  <td className="py-3 px-4 font-semibold text-on-surface">
                    <span className="block text-sm">{p.name}</span>
                    <span className="text-[11px] text-outline font-normal">{p.segment}</span>
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">
                    {p.productType}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">
                    {p.totalLeads.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-primary font-semibold">
                    {p.allocatedLeads.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-mono font-bold text-emerald-700">
                      {p.conversionRate}%
                    </span>
                    <span className="text-[10px] text-outline block">
                      {p.closedDeals}/{p.targetDeals} cọc
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-on-surface">
                    {p.manager}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                        p.status === 'Đang chạy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'Tạm dừng'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onToast(`Đang mở giỏ hàng chiến dịch: ${p.name}`)}
                      className="px-2.5 py-1 bg-surface-container hover:bg-primary hover:text-white rounded-lg text-primary font-medium transition cursor-pointer"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Project */}
      {newProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant/20">
              <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                Khởi tạo dự án kinh doanh mới
              </h3>
              <button
                onClick={() => setNewProjectModal(false)}
                className="p-1 text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setNewProjectModal(false);
                onToast('Đã tạo dự án mới thành công vào danh mục SalesFlow!');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold uppercase text-outline mb-1">Mã dự án *</label>
                <input
                  required
                  defaultValue="DA-NEW09"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl font-mono text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase text-outline mb-1">Tên dự án *</label>
                <input
                  required
                  placeholder="Ví dụ: Căn hộ cao cấp Masteri Grand View"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-outline mb-1">Phân khúc</label>
                  <input
                    defaultValue="Căn hộ cao cấp"
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-outline mb-1">Quản lý phụ trách</label>
                  <select className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm cursor-pointer">
                    <option>Nguyễn Minh Anh</option>
                    <option>Trần Hoàng Nam</option>
                    <option>Lê Thu Hà</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setNewProjectModal(false)}
                  className="px-4 py-2 bg-surface-container rounded-xl text-on-surface cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-container text-on-primary rounded-xl font-semibold shadow cursor-pointer"
                >
                  Tạo & Kích hoạt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
