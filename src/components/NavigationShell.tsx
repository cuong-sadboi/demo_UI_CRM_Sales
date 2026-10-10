'use client';

import React, { useState } from 'react';
import { ScreenTab } from '../types/crm';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [receiveDataActive, setReceiveDataActive] = useState(true);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState('Dự án Bất động sản Green Residence');
  const [currentRole, setCurrentRole] = useState('Quản lý chính (Super Admin)');
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navGroups = [
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
        {
          tab: 'calendar' as ScreenTab,
          label: 'Lịch gọi lại',
          icon: 'assignment_late',
          badge: '18',
          badgeColor: 'bg-error-container text-on-error-container'
        }
      ]
    },
    {
      group: 'Báo cáo & Hiệu suất',
      items: [
        { tab: 'reports' as ScreenTab, label: 'Báo cáo và KPI', icon: 'bar_chart', badge: null }
      ]
    },
    {
      group: 'Quản trị hệ thống',
      items: [
        {
          tab: 'import' as ScreenTab,
          label: 'Nhập Excel/CSV',
          icon: 'upload_file',
          badge: 'Mới',
          badgeColor: 'bg-primary-fixed text-primary'
        }
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen text-on-surface antialiased font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl border border-outline/20">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
          <span className="font-label-md text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed left-0 top-0 h-full bg-surface-container-lowest border-r border-outline-variant/30 z-50 flex flex-col justify-between transition-all duration-300 select-none ${
          collapsed ? 'w-[72px]' : 'w-[260px]'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-outline-variant/20 shrink-0">
            <div
              onClick={() => onTabChange('overview')}
              className="flex items-center gap-2.5 overflow-hidden cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary font-bold shadow-xs shrink-0">
                <span className="material-symbols-outlined text-[20px]">hub</span>
              </div>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-headline-sm text-sm font-bold text-on-surface leading-none tracking-tight">
                    SalesFlow
                  </span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant leading-none mt-1">
                    CRM Suite
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

          {/* Nav Menu Groups */}
          <nav className="p-3 space-y-4">
            {navGroups.map((grp, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {!collapsed && (
                  <p className="px-3 font-label-sm text-[10px] uppercase tracking-wider text-outline font-semibold">
                    {grp.group}
                  </p>
                )}
                {grp.items.map((item) => {
                  const isActive = currentTab === item.tab;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => {
                        onTabChange(item.tab);
                        setMobileMenuOpen(false);
                      }}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer text-left ${
                        isActive
                          ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`material-symbols-outlined text-[20px] shrink-0 ${
                            isActive ? 'text-on-primary' : 'text-on-surface-variant'
                          }`}
                        >
                          {item.icon}
                        </span>
                        {!collapsed && (
                          <span className="truncate text-body-md text-xs">{item.label}</span>
                        )}
                      </div>

                      {!collapsed && item.badge && (
                        <span
                          className={`font-numeric-data text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            item.badgeColor ||
                            (isActive
                              ? 'bg-white/25 text-white'
                              : 'bg-surface-container text-secondary')
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

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-outline-variant/20 space-y-2 bg-surface-container-lowest shrink-0">
          {!collapsed ? (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-low">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    receiveDataActive ? 'bg-tertiary-container animate-pulse' : 'bg-gray-400'
                  }`}
                />
                <span className="font-body-sm text-xs text-on-surface font-medium">Nhận data</span>
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
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-surface-container-lowest shadow ring-0 transition duration-200 ease-in-out ${
                    receiveDataActive ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <span
                className={`h-3 w-3 rounded-full ${
                  receiveDataActive ? 'bg-tertiary-container' : 'bg-gray-400'
                }`}
                title="Trạng thái nhận data"
              />
            </div>
          )}

          {/* Collapse/Expand Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-body-md text-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              {collapsed ? 'menu' : 'menu_open'}
            </span>
            {!collapsed && <span>Thu gọn menu</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Layout with Fixed Header */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'
        }`}
      >
        {/* Fixed Top Header (Exact Stitch Specs: h-16, fixed, top-0, z-40) */}
        <header
          className={`fixed top-0 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 z-40 px-4 sm:px-6 flex items-center justify-between gap-3 shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-all duration-300 left-0 ${
            collapsed ? 'lg:left-[72px]' : 'lg:left-[260px]'
          }`}
        >
          {/* Left: Mobile hamburger + Project Select */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container lg:hidden cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>

            <div className="hidden sm:flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">home</span>
              <span className="text-outline-variant">/</span>
            </div>

            <div className="relative">
              <select
                value={currentProject}
                onChange={(e) => {
                  setCurrentProject(e.target.value);
                  showToast(`Đã chuyển dự án sang: ${e.target.value}`);
                }}
                className="font-label-md text-xs sm:text-sm font-semibold text-on-surface bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 rounded-lg pl-3 pr-8 py-1.5 appearance-none focus:outline-none focus:border-primary cursor-pointer max-w-[200px] sm:max-w-[320px] truncate"
              >
                <option>Dự án Bất động sản Green Residence</option>
                <option>Khu Đô Thị EcoPark Riverside</option>
                <option>Chung cư Sun Grand City</option>
                <option>Dự án Tư vấn tài chính VIP</option>
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
              <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm khách hàng, SĐT..."
                className="w-full font-body-md text-xs bg-surface-container-low rounded-lg pl-9 pr-14 py-2 border border-outline-variant/30 focus:outline-none focus:border-primary placeholder:text-outline-variant/80"
              />
              <span className="absolute right-3 font-label-sm text-[11px] px-1.5 py-0.5 rounded border border-outline-variant/40 text-outline bg-surface-container-lowest select-none">
                Ctrl+K
              </span>
            </div>
          </div>

          {/* Right: Actions, Role, Notifications, User */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Role select */}
            <div className="relative hidden xl:block">
              <select
                value={currentRole}
                onChange={(e) => {
                  setCurrentRole(e.target.value);
                  showToast(`Đổi quyền truy cập: ${e.target.value}`);
                }}
                className="font-label-sm text-xs font-medium text-secondary bg-surface-container-low border border-outline-variant/30 rounded-lg pl-3 pr-7 py-1.5 appearance-none focus:outline-none cursor-pointer"
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

            {/* Quick Add Lead Button */}
            <button
              onClick={() => setQuickAddOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-xs shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span className="hidden sm:inline">Thêm data nhanh</span>
            </button>

            {/* Notifications with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 rounded-full bg-error text-on-error font-label-sm text-[10px] flex items-center justify-center font-bold">
                  4
                </span>
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 p-4 space-y-3 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                    <strong className="text-on-surface">Thông báo mới (4)</strong>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-primary hover:underline text-[11px]"
                    >
                      Đóng
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-red-50 text-red-900 border border-red-100">
                      <p className="font-bold">⚠️ 2 cuộc hẹn gọi lại đã quá hạn</p>
                      <span className="text-[11px] text-red-700">Khách Trịnh Quang Khải & Phạm Hương Ly</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-100">
                      <p className="font-bold">📥 50 lead Facebook Ads mới vừa đổ về</p>
                      <span className="text-[11px] text-blue-700">Chiến dịch căn 3PN Green Residence</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Info */}
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-2 border-l border-outline-variant/30 cursor-pointer"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-R1X9UD4e6BhSiIveHwFGhhTfusd0VgpL8tAWvMv0IT1wH_J4MGgzMkUVwwuHUmRqbul4GH0Op_LebMMAUcWcp9xK9ubtpd_u3XMTnoDw6f7T__CcWeWHHe0N6ju4AwvwWMsRqVyXKcVM6V2BtKJzZabpn9fOYBx1IWn68TbUwUTxy5zkcoOAlNv4VuThco8BwZ8nx10ZKmrd19ictQh4w4gpIdq-Pn7GF9e-1HQRV-fZn3WkGA3SuQ"
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="font-label-md text-xs font-semibold text-on-surface leading-tight">
                  Nguyễn Minh Anh
                </span>
                <span className="font-label-sm text-[10px] text-outline leading-tight">
                  Quản lý chính
                </span>
              </div>
              <span className="material-symbols-outlined text-[18px] text-outline">
                expand_more
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area (pt-16 to match header exactly) */}
        <main className="w-full pt-16 min-h-screen px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>

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
                  <h3 className="font-headline-sm text-base font-bold text-on-surface">
                    Thêm data khách hàng nhanh
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">
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
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-outline uppercase mb-1">
                  Họ và tên khách hàng *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn Hoàng"
                  className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-outline uppercase mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="09xx xxx xxx"
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-outline uppercase mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="khachhang@gmail.com"
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-outline uppercase mb-1">
                    Dự án quan tâm
                  </label>
                  <select className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary text-xs cursor-pointer">
                    <option>BĐS Green Residence</option>
                    <option>EcoPark Riverside</option>
                    <option>Sun Grand City</option>
                    <option>Tư vấn tài chính VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-outline uppercase mb-1">
                    Mức độ ưu tiên
                  </label>
                  <select className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary text-xs cursor-pointer">
                    <option>Cao (Hot Lead)</option>
                    <option>Trung bình</option>
                    <option>Thấp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-outline uppercase mb-1">
                  Ghi chú nhu cầu tư vấn
                </label>
                <textarea
                  rows={2}
                  placeholder="Nhu cầu căn hộ, ngân sách, khung giờ gọi phù hợp..."
                  className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setQuickAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high text-xs cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary-container text-on-primary hover:bg-primary font-medium text-xs shadow-xs cursor-pointer"
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
