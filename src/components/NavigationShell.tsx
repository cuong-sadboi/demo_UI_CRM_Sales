'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ScreenTab, StitchScreenManifest } from '../types/crm';
import { STITCH_SCREENS } from '../data/mockCrmData';

interface NavigationShellProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  children: React.ReactNode;
}

export default function NavigationShell({
  currentTab,
  onTabChange,
  children
}: NavigationShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [receiveDataActive, setReceiveDataActive] = useState(true);
  const [stitchModalOpen, setStitchModalOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentProject, setCurrentProject] = useState('Dự án Bất động sản Green Residence');
  const [currentRole, setCurrentRole] = useState('Quản lý chính (Super Admin)');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentStitchScreen = STITCH_SCREENS.find((s) => s.tab === currentTab) || STITCH_SCREENS[0];

  const navItems = [
    {
      group: 'Tổng quan',
      items: [
        { tab: 'overview' as ScreenTab, label: 'Tổng quan', icon: 'dashboard', badge: null }
      ]
    },
    {
      group: 'Quản lý Sale',
      items: [
        { tab: 'projects' as ScreenTab, label: 'Quản lý dự án', icon: 'folder_special', badge: null },
        { tab: 'customers' as ScreenTab, label: 'Data khách hàng', icon: 'group', badge: '1,420' },
        { tab: 'allocation' as ScreenTab, label: 'Phân bổ data', icon: 'tune', badge: null },
        { tab: 'calendar' as ScreenTab, label: 'Lịch gọi lại', icon: 'assignment_late', badge: '18', badgeColor: 'bg-red-100 text-red-700' }
      ]
    },
    {
      group: 'Báo cáo & Hiệu suất',
      items: [
        { tab: 'reports' as ScreenTab, label: 'Báo cáo và KPI', icon: 'bar_chart', badge: null }
      ]
    },
    {
      group: 'Công cụ dữ liệu',
      items: [
        { tab: 'import' as ScreenTab, label: 'Nhập Excel / CSV', icon: 'upload_file', badge: 'Mới', badgeColor: 'bg-indigo-100 text-indigo-700' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl border border-outline/20 animate-bounce">
          <span className="material-symbols-outlined text-tertiary-container">check_circle</span>
          <span className="font-label-md text-label-md">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner: Google Stitch Integration Info */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-primary text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 z-50">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white font-bold text-[10px]">
            ⚡
          </span>
          <span className="font-semibold tracking-wide">
            Google Stitch MCP Demo
          </span>
          <span className="hidden sm:inline text-white/70">|</span>
          <span className="hidden sm:inline text-white/90">
            Dự án: <strong className="text-white">SalesFlow CRM System</strong> (7 màn hình thiết kế hoàn chỉnh)
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setStitchModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 hover:bg-white/25 text-white rounded-md text-[11px] font-medium transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">design_services</span>
            <span>Đối chiếu bản vẽ Google Stitch</span>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-[37px] bottom-0 bg-surface-container-lowest border-r border-outline-variant/30 z-40 flex flex-col justify-between transition-all duration-300 select-none ${
          collapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo & Version */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-outline-variant/20">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">hub</span>
              </div>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-headline-sm text-headline-sm text-on-surface leading-none tracking-tight truncate">
                    SalesFlow
                  </span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant leading-none mt-1">
                    CRM Suite • Stitch
                  </span>
                </div>
              )}
            </div>
            {!collapsed && (
              <span className="font-label-sm text-[10px] px-2 py-0.5 rounded bg-surface-container text-primary font-semibold">
                v2.4
              </span>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="p-3 space-y-4">
            {navItems.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {!collapsed && (
                  <p className="px-3 font-label-sm text-[10px] uppercase tracking-wider text-outline font-semibold">
                    {group.group}
                  </p>
                )}
                {group.items.map((item) => {
                  const isActive = currentTab === item.tab;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => onTabChange(item.tab)}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer text-left ${
                        isActive
                          ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`material-symbols-outlined text-[20px] shrink-0 ${
                            isActive ? 'text-white' : 'text-on-surface-variant'
                          }`}
                        >
                          {item.icon}
                        </span>
                        {!collapsed && (
                          <span className="truncate text-body-md">{item.label}</span>
                        )}
                      </div>
                      {!collapsed && item.badge && (
                        <span
                          className={`font-numeric-data text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-surface-container text-secondary')
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Actions in Sidebar */}
        <div className="p-3 border-t border-outline-variant/20 space-y-2 bg-surface-container-lowest">
          {!collapsed ? (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-low">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    receiveDataActive
                      ? 'bg-emerald-500 animate-pulse'
                      : 'bg-gray-400'
                  }`}
                ></span>
                <span className="font-body-sm text-body-sm text-on-surface font-medium">
                  Nhận data
                </span>
              </div>
              <button
                onClick={() => {
                  setReceiveDataActive(!receiveDataActive);
                  showToast(
                    !receiveDataActive
                      ? 'Đã bật chế độ tự động nhận data trực tiếp'
                      : 'Đã tạm dừng nhận data phân bổ'
                  );
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                  receiveDataActive ? 'bg-primary-container' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                    receiveDataActive ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <span
                className={`h-3 w-3 rounded-full ${
                  receiveDataActive ? 'bg-emerald-500' : 'bg-gray-400'
                }`}
                title="Trạng thái nhận data"
              ></span>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              {collapsed ? 'menu' : 'menu_open'}
            </span>
            {!collapsed && <span>Thu gọn menu</span>}
          </button>
        </div>
      </aside>

      {/* Header */}
      <header
        className={`fixed top-[37px] right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 z-30 px-6 flex items-center justify-between gap-4 shadow-sm transition-all duration-300 ${
          collapsed ? 'left-[72px]' : 'left-[260px]'
        }`}
      >
        {/* Left: Project Selector */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">home</span>
            <span className="text-outline-variant">/</span>
          </div>
          <div className="relative">
            <select
              value={currentProject}
              onChange={(e) => {
                setCurrentProject(e.target.value);
                showToast(`Đã chuyển sang: ${e.target.value}`);
              }}
              className="font-label-md text-label-md font-semibold text-on-surface bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 rounded-lg pl-3 pr-8 py-1.5 appearance-none focus:outline-none focus:border-primary cursor-pointer"
            >
              <option>Dự án Bất động sản Green Residence</option>
              <option>Khu Đô Thị EcoPark Riverside</option>
              <option>Chung cư Sun Grand City</option>
              <option>Dự án Tư vấn tài chính cá nhân VIP</option>
              <option>Dự án CSKH Miền Bắc</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2 top-2 text-[18px] text-outline">
              arrow_drop_down
            </span>
          </div>
        </div>

        {/* Center: Search Box */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[20px] text-outline">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm khách hàng, SĐT (VD: 0982...)..."
              className="w-full font-body-md text-body-md bg-surface-container-low rounded-lg pl-9 pr-14 py-1.5 border border-outline-variant/30 focus:outline-none focus:border-primary placeholder:text-outline-variant/80 transition"
            />
            <span className="absolute right-3 font-label-sm text-label-sm px-1.5 py-0.5 rounded border border-outline-variant/40 text-outline bg-surface-container-lowest select-none">
              Ctrl+K
            </span>
          </div>
        </div>

        {/* Right: Role, Actions, User */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative hidden lg:block">
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="font-label-sm text-label-sm font-medium text-secondary bg-surface-container-low border border-outline-variant/30 rounded-lg pl-3 pr-7 py-1.5 appearance-none focus:outline-none cursor-pointer"
            >
              <option>Quản lý chính (Super Admin)</option>
              <option>Quản lý thường (Manager)</option>
              <option>Trưởng phòng (Team Leader)</option>
              <option>Nhân viên sale (Sales Agent)</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-1.5 top-2 text-[16px] text-secondary">
              expand_more
            </span>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={() => setQuickAddOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="hidden sm:inline">Thêm data nhanh</span>
          </button>

          {/* Notification Button */}
          <button
            onClick={() => showToast('Bạn có 4 thông báo mới: 2 lead mới chưa gán, 2 cuộc gọi đến hạn')}
            className="relative p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer"
            title="Thông báo"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 rounded-full bg-error text-on-error font-label-sm text-[10px] flex items-center justify-center font-bold">
              4
            </span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/30 cursor-pointer">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-R1X9UD4e6BhSiIveHwFGhhTfusd0VgpL8tAWvMv0IT1wH_J4MGgzMkUVwwuHUmRqbul4GH0Op_LebMMAUcWcp9xK9ubtpd_u3XMTnoDw6f7T__CcWeWHHe0N6ju4AwvwWMsRqVyXKcVM6V2BtKJzZabpn9fOYBx1IWn68TbUwUTxy5zkcoOAlNv4VuThco8BwZ8nx10ZKmrd19ictQh4w4gpIdq-Pn7GF9e-1HQRV-fZn3WkGA3SuQ"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="font-label-md text-label-md font-semibold text-on-surface leading-tight">
                Nguyễn Minh Anh
              </span>
              <span className="font-label-sm text-label-sm text-outline leading-tight">
                Quản lý chính
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main
        className={`pt-[101px] min-h-screen px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300 ${
          collapsed ? 'pl-[96px]' : 'pl-[284px]'
        }`}
      >
        {children}
      </main>

      {/* Modal: Google Stitch Inspector */}
      {stitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-outline-variant/40 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[28px]">palette</span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    Bản vẽ thiết kế gốc Google Stitch
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Đối chiếu giao diện hiện tại với thiết kế gốc từ Google Stitch
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStitchModalOpen(false)}
                className="p-1 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Current Screen Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-surface-container-low text-xs">
              <div>
                <span className="text-outline block">Màn hình đang chọn:</span>
                <strong className="text-on-surface font-semibold">{currentStitchScreen.title}</strong>
              </div>
              <div>
                <span className="text-outline block">Định dạng thiết bị:</span>
                <span className="text-primary font-medium">{currentStitchScreen.deviceType}</span>
              </div>
              <div>
                <span className="text-outline block">Mã nguồn Stitch Screen ID:</span>
                <code className="text-secondary font-mono text-[11px] truncate block">{currentStitchScreen.id}</code>
              </div>
            </div>

            {/* Screenshot Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md font-semibold text-on-surface">
                  Ảnh chụp thiết kế Google Stitch (Full Resolution)
                </span>
                <a
                  href={currentStitchScreen.localScreenshot}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                >
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  Mở ảnh gốc trong tab mới
                </a>
              </div>
              <div className="max-h-[500px] overflow-y-auto rounded-xl border border-outline-variant/30 bg-surface-container-low p-2">
                <img
                  src={currentStitchScreen.localScreenshot}
                  alt={currentStitchScreen.title}
                  className="w-full rounded-lg shadow-sm object-top object-contain"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-xs text-outline">
                Được đồng bộ trực tiếp qua <strong>Stitch MCP API</strong> (StatelessServer)
              </div>
              <button
                onClick={() => setStitchModalOpen(false)}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container transition cursor-pointer"
              >
                Đóng đối chiếu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Quick Add Lead */}
      {quickAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    Thêm data khách hàng nhanh
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Nhập thông tin khách hàng mới vào hệ thống SalesFlow
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQuickAddOpen(false)}
                className="p-1 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setQuickAddOpen(false);
                showToast('Đã thêm khách hàng mới thành công!');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-outline uppercase mb-1">
                  Họ và tên khách hàng *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn Hoàng"
                  className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-outline uppercase mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="09xx xxx xxx"
                    className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-outline uppercase mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="khachhang@gmail.com"
                    className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-outline uppercase mb-1">
                    Dự án quan tâm
                  </label>
                  <select className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary text-sm cursor-pointer">
                    <option>BĐS Green Residence</option>
                    <option>EcoPark Riverside</option>
                    <option>Sun Grand City</option>
                    <option>Tư vấn tài chính VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-outline uppercase mb-1">
                    Mức độ ưu tiên
                  </label>
                  <select className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary text-sm cursor-pointer">
                    <option>Cao (Hot Lead)</option>
                    <option>Trung bình</option>
                    <option>Thấp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-outline uppercase mb-1">
                  Ghi chú nhu cầu tư vấn
                </label>
                <textarea
                  rows={2}
                  placeholder="Nhu cầu căn hộ, ngân sách, khung giờ gọi phù hợp..."
                  className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary text-sm"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setQuickAddOpen(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-sm cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-medium text-sm shadow cursor-pointer"
                >
                  Lưu & Gán tự động
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
