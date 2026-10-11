'use client';

import React, { useState, useMemo } from 'react';
import { MOCK_SYSTEM_USERS, MOCK_ROLES, MOCK_PERMISSIONS, MOCK_PROJECTS } from '../../data/mockCrmData';
import { SystemUser, RoleDefinition, UserRoleKey, PermissionItem } from '../../types/crm';

interface RolesScreenProps {
  onToast: (msg: string) => void;
}

export default function RolesScreen({ onToast }: RolesScreenProps) {
  const [users, setUsers] = useState<SystemUser[]>(MOCK_SYSTEM_USERS);
  const [roles, setRoles] = useState<RoleDefinition[]>(MOCK_ROLES);
  const [activeTab, setActiveTab] = useState<'users' | 'matrix'>('users');

  // Filter States for Users List
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('Tất cả vai trò');
  const [departmentFilter, setDepartmentFilter] = useState<string>('Tất cả phòng ban');
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');

  // Selected User for Detail / Edit
  const [selectedUserDetail, setSelectedUserDetail] = useState<SystemUser | null>(null);
  const [editPermissionsUser, setEditPermissionsUser] = useState<SystemUser | null>(null);
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false);

  // New Account Form State
  const [newAccount, setNewAccount] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    role: 'sales_agent' as UserRoleKey,
    department: 'Phòng Kinh doanh 1',
    password: '',
    assignedProjects: ['BĐS Green Residence'],
    canExportExcel: false,
    canViewFullPhone: true,
    canReallocate: false,
    maxLeadsQuota: 25
  });

  // Unique Department List
  const departmentList = useMemo(() => {
    const list = Array.from(new Set(users.map((u) => u.department)));
    return ['Tất cả phòng ban', ...list];
  }, [users]);

  // Bento Stats for Management
  const stats = useMemo(() => {
    const total = users.length;
    const superAdmins = users.filter((u) => u.role === 'super_admin').length;
    const managers = users.filter((u) => u.role === 'manager').length;
    const teamLeaders = users.filter((u) => u.role === 'team_leader').length;
    const salesAgents = users.filter((u) => u.role === 'sales_agent').length;
    const collaborators = users.filter((u) => u.role === 'collaborator').length;
    const activeUsers = users.filter((u) => u.status === 'active').length;
    const lockedUsers = users.filter((u) => u.status === 'locked').length;

    return {
      total,
      superAdmins,
      managers,
      teamLeaders,
      salesAgents,
      collaborators,
      activeUsers,
      lockedUsers
    };
  }, [users]);

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.userCode.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q);

      const matchRole =
        roleFilter === 'Tất cả vai trò' ||
        u.role === roleFilter ||
        u.roleTitle.toLowerCase().includes(roleFilter.toLowerCase());

      const matchDepartment =
        departmentFilter === 'Tất cả phòng ban' || u.department === departmentFilter;

      const matchStatus =
        statusFilter === 'Tất cả' ||
        (statusFilter === 'Hoạt động' && u.status === 'active') ||
        (statusFilter === 'Tạm khóa' && u.status === 'locked');

      return matchSearch && matchRole && matchDepartment && matchStatus;
    });
  }, [users, searchTerm, roleFilter, departmentFilter, statusFilter]);

  // Action: Toggle Account Status (Lock / Unlock)
  const handleToggleLockUser = (userId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'locked' : 'active';
          onToast(
            newStatus === 'locked'
              ? `Đã tạm khóa tài khoản của ${u.name}!`
              : `Đã mở khóa tài khoản cho ${u.name}!`
          );
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  // Action: Reset Password
  const handleResetPassword = (u: SystemUser, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onToast(`Đã cấp lại mật khẩu mặc định (SalesFlow@2026) cho ${u.name} và gửi về email ${u.email}!`);
  };

  // Action: Create New User Account
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccount.name || !newAccount.username || !newAccount.email) {
      onToast('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const roleObj = roles.find((r) => r.key === newAccount.role);

    const newUser: SystemUser = {
      id: `usr-${Date.now()}`,
      userCode: `NV-${String(users.length + 1).padStart(2, '0')}`,
      name: newAccount.name.trim(),
      username: newAccount.username.trim().toLowerCase(),
      email: newAccount.email.trim(),
      phone: newAccount.phone.trim() || '0900 000 000',
      role: newAccount.role,
      roleTitle: roleObj?.title || 'Nhân viên',
      department: newAccount.department,
      assignedProjects: newAccount.assignedProjects.length > 0 ? newAccount.assignedProjects : ['Tất cả dự án'],
      status: 'active',
      lastActive: 'Vừa tạo',
      createdAt: 'Hôm nay',
      canExportExcel: newAccount.canExportExcel,
      canViewFullPhone: newAccount.canViewFullPhone,
      canReallocate: newAccount.canReallocate,
      maxLeadsQuota: newAccount.maxLeadsQuota,
      customPermissions: []
    };

    setUsers([newUser, ...users]);
    setCreateAccountModalOpen(false);
    onToast(`Đã cấp tài khoản thành công cho ${newUser.name} (${newUser.roleTitle})!`);

    // Reset Form
    setNewAccount({
      name: '',
      username: '',
      email: '',
      phone: '',
      role: 'sales_agent',
      department: 'Phòng Kinh doanh 1',
      password: '',
      assignedProjects: ['BĐS Green Residence'],
      canExportExcel: false,
      canViewFullPhone: true,
      canReallocate: false,
      maxLeadsQuota: 25
    });
  };

  // Action: Save Edited Permissions for User
  const handleSaveUserPermissions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPermissionsUser) return;

    setUsers((prev) =>
      prev.map((u) => (u.id === editPermissionsUser.id ? editPermissionsUser : u))
    );

    if (selectedUserDetail?.id === editPermissionsUser.id) {
      setSelectedUserDetail(editPermissionsUser);
    }

    setEditPermissionsUser(null);
    onToast(`Đã cập nhật cấu hình phân quyền cho tài khoản ${editPermissionsUser.name}!`);
  };

  // Action: Toggle Permission in Matrix for a Role
  const handleToggleMatrixPermission = (roleKey: UserRoleKey, permCode: string) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.key === roleKey) {
          const has = r.defaultPermissions.includes(permCode);
          const updated = has
            ? r.defaultPermissions.filter((p) => p !== permCode)
            : [...r.defaultPermissions, permCode];
          return { ...r, defaultPermissions: updated };
        }
        return r;
      })
    );
    onToast(`Đã cập nhật quyền "${permCode}" cho vai trò ${roleKey}`);
  };

  return (
    <div className="flex flex-col w-full space-y-5">
      {/* 1. Header: Access Control & Role-based Permissions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-5 sm:p-6 rounded-2xl shadow-sm border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse"></span>
            <span className="font-label-sm text-xs font-bold uppercase tracking-wider text-purple-700">
              Quản Trị Hệ Thống & Bảo Mật
            </span>
            <span className="text-outline-variant">•</span>
            <span className="text-xs text-outline font-medium">Phân quyền vai trò RBAC & Cấp tài khoản</span>
            <span className="text-outline-variant">•</span>
            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">
              Dành cho Quản lý cấp cao
            </span>
          </div>
          <h1 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface tracking-tight flex items-center gap-2.5">
            <span>Cấp Tài Khoản & Phân Quyền Nhân Sự</span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-mono font-bold">
              {users.length} tài khoản
            </span>
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
            Quản trị cấp phát tài khoản, thiết lập quyền truy cập cho quản lý cấp thấp, trưởng phòng và nhân viên kinh doanh telesale theo tiêu chuẩn an toàn dữ liệu
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* Sub-tab view switcher */}
          <div className="flex items-center bg-surface-container-high p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-surface-container-lowest text-purple-700 shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
              <span>Tài khoản ({users.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-surface-container-lowest text-purple-700 shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span>Ma trận quyền hạn</span>
            </button>
          </div>

          <button
            onClick={() => onToast(`Đang xuất danh sách ${users.length} nhân sự ra Excel...`)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs rounded-xl shadow-xs transition cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={() => setCreateAccountModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-label-md text-xs rounded-xl shadow-sm transition cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Cấp tài khoản mới</span>
          </button>
        </div>
      </div>

      {/* 2. Bento KPI Cards (Chỉ số cơ cấu nhân sự) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Card 1: Tổng tài khoản */}
        <div className="p-3.5 rounded-2xl bg-white border border-outline-variant/30 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-outline text-[11px] font-semibold mb-1">
            <span>Tổng nhân sự</span>
            <span className="material-symbols-outlined text-[16px] text-purple-600">group</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-on-surface">{stats.total}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">{stats.activeUsers} online</span>
          </div>
        </div>

        {/* Card 2: Super Admin */}
        <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-purple-900 text-[11px] font-bold mb-1">
            <span>Quản lý cấp cao</span>
            <span className="material-symbols-outlined text-[16px] text-purple-600">shield_person</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-purple-900">{stats.superAdmins}</span>
            <span className="text-[10px] text-purple-700 font-medium">Toàn quyền</span>
          </div>
        </div>

        {/* Card 3: Manager & Team Leader (Quản lý cấp thấp / Trưởng phòng) */}
        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-amber-900 text-[11px] font-bold mb-1">
            <span>QL Cấp thấp / TP</span>
            <span className="material-symbols-outlined text-[16px] text-amber-600">supervisor_account</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-amber-900">{stats.managers + stats.teamLeaders}</span>
            <span className="text-[10px] text-amber-700 font-medium">QL phòng ban</span>
          </div>
        </div>

        {/* Card 4: Sales Agents */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-emerald-900 text-[11px] font-bold mb-1">
            <span>Sale / Telesale</span>
            <span className="material-symbols-outlined text-[16px] text-emerald-600">support_agent</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-emerald-900">{stats.salesAgents}</span>
            <span className="text-[10px] text-emerald-700 font-medium">Gọi & Chăm sóc</span>
          </div>
        </div>

        {/* Card 5: CTV & Thử việc */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-slate-700 text-[11px] font-semibold mb-1">
            <span>Cộng tác viên</span>
            <span className="material-symbols-outlined text-[16px] text-slate-600">badge</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-slate-800">{stats.collaborators}</span>
            <span className="text-[10px] text-slate-500 font-medium">Giới hạn SĐT</span>
          </div>
        </div>

        {/* Card 6: Tạm khóa */}
        <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-200 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-red-900 text-[11px] font-bold mb-1">
            <span>Tạm khóa</span>
            <span className="material-symbols-outlined text-[16px] text-red-600">lock</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-red-700">{stats.lockedUsers}</span>
            <span className="text-[10px] text-red-600 font-medium">Bảo mật</span>
          </div>
        </div>
      </div>

      {/* 3. Main Views Content */}
      {activeTab === 'users' ? (
        /* ================= SUB-VIEW 1: DANH SÁCH NHÂN SỰ & CẤP QUYỀN ================= */
        <div className="space-y-4">
          {/* Toolbar: Search & Filters */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Box */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên, mã NV, username, SĐT..."
                className="w-full pl-9 pr-7 py-2 bg-surface-container-low text-on-surface font-body-md text-xs sm:text-sm rounded-xl border border-outline-variant/30 focus:outline-none focus:border-purple-600"
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

            {/* Role Filter */}
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-surface-container-low text-on-surface font-body-md text-xs sm:text-sm rounded-xl border border-outline-variant/30 appearance-none focus:outline-none cursor-pointer font-medium"
              >
                <option value="Tất cả vai trò">Tất cả vai trò</option>
                <option value="super_admin">Quản lý cấp cao (Super Admin)</option>
                <option value="manager">Quản lý chi nhánh (Manager)</option>
                <option value="team_leader">Trưởng phòng / QL cấp thấp (Team Leader)</option>
                <option value="sales_agent">Nhân viên Sale / Telesale</option>
                <option value="collaborator">Cộng tác viên / CTV</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-outline pointer-events-none">
                arrow_drop_down
              </span>
            </div>

            {/* Department Filter */}
            <div className="relative">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-surface-container-low text-on-surface font-body-md text-xs sm:text-sm rounded-xl border border-outline-variant/30 appearance-none focus:outline-none cursor-pointer font-medium"
              >
                {departmentList.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-outline pointer-events-none">
                arrow_drop_down
              </span>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-surface-container-low text-on-surface font-body-md text-xs sm:text-sm rounded-xl border border-outline-variant/30 appearance-none focus:outline-none cursor-pointer font-medium"
              >
                <option value="Tất cả">Trạng thái: Tất cả</option>
                <option value="Hoạt động">✓ Đang hoạt động</option>
                <option value="Tạm khóa">🔒 Tạm khóa</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-outline pointer-events-none">
                arrow_drop_down
              </span>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-high text-[11px] uppercase tracking-wider text-outline font-semibold border-b border-outline-variant/30 whitespace-nowrap select-none">
                    <th className="py-2.5 px-3">Mã NV</th>
                    <th className="py-2.5 px-3">Nhân sự & Tài khoản</th>
                    <th className="py-2.5 px-3">Vai trò & Cấp bậc</th>
                    <th className="py-2.5 px-3">Phòng ban & Dự án</th>
                    <th className="py-2.5 px-3">Đặc quyền dữ liệu</th>
                    <th className="py-2.5 px-3">Trạng thái</th>
                    <th className="py-2.5 px-3 text-right">Thao tác cấp quyền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 bg-surface-container-lowest">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-outline">
                        <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant block">
                          person_off
                        </span>
                        <p className="font-semibold text-sm">Không tìm thấy tài khoản nhân sự phù hợp</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const roleObj = roles.find((r) => r.key === user.role);

                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-purple-50/20 transition cursor-pointer group"
                          onClick={() => setSelectedUserDetail(user)}
                        >
                          {/* User Code */}
                          <td className="py-3 px-3 font-mono font-bold text-purple-700 whitespace-nowrap">
                            <span className="bg-surface-container px-2 py-0.5 rounded text-[11px]">
                              {user.userCode}
                            </span>
                          </td>

                          {/* Name, Username, Phone */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-outline-variant/30 shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                                  {user.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <strong className="text-xs text-on-surface group-hover:text-purple-700 transition-colors">
                                    {user.name}
                                  </strong>
                                  <span className="text-[10px] text-outline font-mono">
                                    (@{user.username})
                                  </span>
                                </div>
                                <div className="text-[11px] text-outline flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono text-purple-700 font-medium">
                                    {user.phone}
                                  </span>
                                  <span>•</span>
                                  <span className="truncate max-w-[150px]">{user.email}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role Badge */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-2xs ${
                                roleObj?.badgeBg || 'bg-gray-100'
                              } ${roleObj?.badgeText || 'text-gray-800'}`}
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                {roleObj?.icon || 'person'}
                              </span>
                              <span>{user.roleTitle}</span>
                            </span>
                            <span className="block text-[10px] text-outline mt-0.5">
                              {roleObj?.level}
                            </span>
                          </td>

                          {/* Department & Projects */}
                          <td className="py-3 px-3 whitespace-nowrap max-w-[180px]">
                            <strong className="text-xs text-on-surface block truncate">
                              {user.department}
                            </strong>
                            <span
                              className="text-[10px] text-outline block truncate"
                              title={user.assignedProjects.join(', ')}
                            >
                              {user.assignedProjects.join(', ')}
                            </span>
                          </td>

                          {/* Permissions Flags */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-1 flex-wrap">
                              {user.canExportExcel ? (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold" title="Được xuất file Excel">
                                  Xuất Excel
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 border border-gray-200 text-[10px]" title="Không được xuất Excel">
                                  Cấm Excel
                                </span>
                              )}

                              {user.canViewFullPhone ? (
                                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold" title="Xem SĐT đầy đủ">
                                  Full SĐT
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold" title="SĐT bị che 098***">
                                  Che SĐT
                                </span>
                              )}

                              {user.canReallocate && (
                                <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-semibold" title="Được điều phối & phân bổ data">
                                  Phân bổ
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-outline block mt-0.5">
                              Hạn mức nhận: <strong>{user.maxLeadsQuota}</strong> lead/ngày
                            </span>
                          </td>

                          {/* Account Status */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            {user.status === 'active' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>Hoạt động</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                <span>Tạm khóa</span>
                              </span>
                            )}
                            <span className="text-[10px] text-outline block mt-0.5">
                              {user.lastActive}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <div
                              className="flex items-center justify-end gap-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Edit Permissions */}
                              <button
                                onClick={() => setEditPermissionsUser(user)}
                                className="w-7 h-7 rounded-lg bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white border border-purple-200 flex items-center justify-center transition shadow-2xs cursor-pointer"
                                title="Chỉnh sửa vai trò & phân quyền"
                              >
                                <span className="material-symbols-outlined text-[15px]">tune</span>
                              </button>

                              {/* Reset Password */}
                              <button
                                onClick={(e) => handleResetPassword(user, e)}
                                className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white border border-amber-200 flex items-center justify-center transition shadow-2xs cursor-pointer"
                                title="Cấp lại mật khẩu"
                              >
                                <span className="material-symbols-outlined text-[15px]">key</span>
                              </button>

                              {/* Lock / Unlock */}
                              <button
                                onClick={(e) => handleToggleLockUser(user.id, e)}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition shadow-2xs cursor-pointer border ${
                                  user.status === 'active'
                                    ? 'bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border-red-200'
                                    : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border-emerald-200'
                                }`}
                                title={user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                              >
                                <span className="material-symbols-outlined text-[15px]">
                                  {user.status === 'active' ? 'lock' : 'lock_open'}
                                </span>
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
        </div>
      ) : (
        /* ================= SUB-VIEW 2: MA TRẬN PHÂN QUYỀN VAI TRÒ ================= */
        <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/20 pb-4">
            <div>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">
                Ma Trận Phân Quyền Chi Tiết Theo Cấp Bậc (Role Matrix)
              </h3>
              <p className="text-xs text-outline mt-0.5">
                Bật hoặc tắt quyền hạn trực tiếp để áp dụng ngay cho tất cả nhân viên thuộc vai trò tương ứng
              </p>
            </div>
            <button
              onClick={() => onToast('Đã lưu cấu hình ma trận phân quyền thành công!')}
              className="px-4 py-2 bg-purple-700 text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-purple-800 transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Lưu cấu hình quyền</span>
            </button>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-high text-[11px] uppercase tracking-wider text-outline font-semibold border-b border-outline-variant/30 whitespace-nowrap">
                  <th className="py-3 px-3 w-64">Quyền hạn hệ thống</th>
                  {roles.map((r) => (
                    <th key={r.key} className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="font-bold text-on-surface text-xs">{r.title.split('(')[0]}</div>
                      <span className="text-[10px] text-outline normal-case font-normal">
                        ({r.userCount} người)
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 bg-surface-container-lowest">
                {/* Group 1: Quản lý Data Khách hàng */}
                <tr className="bg-surface-container-low font-bold text-purple-900 text-xs">
                  <td colSpan={6} className="py-2.5 px-3 uppercase tracking-wide">
                    1. Quản lý Data Khách hàng & Số Điện Thoại
                  </td>
                </tr>
                {MOCK_PERMISSIONS.filter((p) => p.category === 'data').map((perm) => (
                  <tr key={perm.id} className="hover:bg-surface-container-low transition">
                    <td className="py-2.5 px-3">
                      <strong className="text-xs text-on-surface block">{perm.name}</strong>
                      <span className="text-[10px] text-outline">{perm.description}</span>
                    </td>
                    {roles.map((role) => {
                      const isAllowed = role.defaultPermissions.includes(perm.code);
                      const isSuper = role.key === 'super_admin';

                      return (
                        <td key={role.key} className="py-2.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isAllowed}
                            disabled={isSuper}
                            onChange={() => handleToggleMatrixPermission(role.key, perm.code)}
                            className="rounded border-outline-variant text-purple-600 focus:ring-purple-600 w-4 h-4 cursor-pointer disabled:opacity-50"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Group 2: Điều phối & Phân bổ */}
                <tr className="bg-surface-container-low font-bold text-purple-900 text-xs">
                  <td colSpan={6} className="py-2.5 px-3 uppercase tracking-wide">
                    2. Điều phối & Phân bổ Data Bán Hàng
                  </td>
                </tr>
                {MOCK_PERMISSIONS.filter((p) => p.category === 'allocation').map((perm) => (
                  <tr key={perm.id} className="hover:bg-surface-container-low transition">
                    <td className="py-2.5 px-3">
                      <strong className="text-xs text-on-surface block">{perm.name}</strong>
                      <span className="text-[10px] text-outline">{perm.description}</span>
                    </td>
                    {roles.map((role) => {
                      const isAllowed = role.defaultPermissions.includes(perm.code);
                      const isSuper = role.key === 'super_admin';

                      return (
                        <td key={role.key} className="py-2.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isAllowed}
                            disabled={isSuper}
                            onChange={() => handleToggleMatrixPermission(role.key, perm.code)}
                            className="rounded border-outline-variant text-purple-600 focus:ring-purple-600 w-4 h-4 cursor-pointer disabled:opacity-50"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Group 3: Báo cáo & Hiệu suất */}
                <tr className="bg-surface-container-low font-bold text-purple-900 text-xs">
                  <td colSpan={6} className="py-2.5 px-3 uppercase tracking-wide">
                    3. Báo cáo Doanh thu & Hiệu suất KPI
                  </td>
                </tr>
                {MOCK_PERMISSIONS.filter((p) => p.category === 'reports').map((perm) => (
                  <tr key={perm.id} className="hover:bg-surface-container-low transition">
                    <td className="py-2.5 px-3">
                      <strong className="text-xs text-on-surface block">{perm.name}</strong>
                      <span className="text-[10px] text-outline">{perm.description}</span>
                    </td>
                    {roles.map((role) => {
                      const isAllowed = role.defaultPermissions.includes(perm.code);
                      const isSuper = role.key === 'super_admin';

                      return (
                        <td key={role.key} className="py-2.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isAllowed}
                            disabled={isSuper}
                            onChange={() => handleToggleMatrixPermission(role.key, perm.code)}
                            className="rounded border-outline-variant text-purple-600 focus:ring-purple-600 w-4 h-4 cursor-pointer disabled:opacity-50"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Group 4: Quản trị hệ thống */}
                <tr className="bg-surface-container-low font-bold text-purple-900 text-xs">
                  <td colSpan={6} className="py-2.5 px-3 uppercase tracking-wide">
                    4. Quản trị Tài khoản & Cấu hình Dự án
                  </td>
                </tr>
                {MOCK_PERMISSIONS.filter((p) => p.category === 'system').map((perm) => (
                  <tr key={perm.id} className="hover:bg-surface-container-low transition">
                    <td className="py-2.5 px-3">
                      <strong className="text-xs text-on-surface block">{perm.name}</strong>
                      <span className="text-[10px] text-outline">{perm.description}</span>
                    </td>
                    {roles.map((role) => {
                      const isAllowed = role.defaultPermissions.includes(perm.code);
                      const isSuper = role.key === 'super_admin';

                      return (
                        <td key={role.key} className="py-2.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isAllowed}
                            disabled={isSuper}
                            onChange={() => handleToggleMatrixPermission(role.key, perm.code)}
                            className="rounded border-outline-variant text-purple-600 focus:ring-purple-600 w-4 h-4 cursor-pointer disabled:opacity-50"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: CẤP TÀI KHOẢN MỚI ================= */}
      {createAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2 text-purple-700 font-bold">
                <span className="material-symbols-outlined text-[24px]">person_add</span>
                <h3 className="text-base">Cấp tài khoản & Thiết lập phân quyền mới</h3>
              </div>
              <button
                onClick={() => setCreateAccountModalOpen(false)}
                className="text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4 text-xs">
              {/* Họ tên & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-outline mb-1">
                    Họ và tên nhân sự *
                  </label>
                  <input
                    required
                    type="text"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    placeholder="Ví dụ: Nguyễn Văn Hoàng"
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-outline mb-1">
                    Tên đăng nhập (Username) *
                  </label>
                  <input
                    required
                    type="text"
                    value={newAccount.username}
                    onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                    placeholder="Ví dụ: vanhoang.sales"
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl font-mono text-on-surface focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              {/* Email & SĐT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-outline mb-1">
                    Email công ty *
                  </label>
                  <input
                    required
                    type="email"
                    value={newAccount.email}
                    onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                    placeholder="hoang.nguyen@salesflow.vn"
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-outline mb-1">
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    required
                    type="text"
                    value={newAccount.phone}
                    onChange={(e) => setNewAccount({ ...newAccount, phone: e.target.value })}
                    placeholder="0982 123 456"
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl font-mono text-on-surface focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              {/* Vai trò & Phòng ban */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-outline mb-1">
                    Vai trò & Cấp bậc *
                  </label>
                  <select
                    value={newAccount.role}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, role: e.target.value as UserRoleKey })
                    }
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:border-purple-600 font-medium cursor-pointer"
                  >
                    <option value="super_admin">Quản lý cấp cao (Super Admin)</option>
                    <option value="manager">Quản lý chi nhánh (Manager)</option>
                    <option value="team_leader">Quản lý cấp thấp / Trưởng phòng (Team Leader)</option>
                    <option value="sales_agent">Nhân viên Sale / Telesale</option>
                    <option value="collaborator">Cộng tác viên (CTV)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-outline mb-1">
                    Phòng ban trực thuộc *
                  </label>
                  <select
                    value={newAccount.department}
                    onChange={(e) => setNewAccount({ ...newAccount, department: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:border-purple-600 font-medium cursor-pointer"
                  >
                    <option value="Phòng Kinh doanh 1">Phòng Kinh doanh 1</option>
                    <option value="Phòng Kinh doanh 2">Phòng Kinh doanh 2</option>
                    <option value="Trung tâm Telesales & CSKH">Trung tâm Telesales & CSKH</option>
                    <option value="Ban Giám Đốc Điều Hành">Ban Giám Đốc Điều Hành</option>
                    <option value="Kênh Đối Tác & CTV">Kênh Đối Tác & CTV</option>
                  </select>
                </div>
              </div>

              {/* Hạn mức & Mật khẩu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-outline mb-1">
                    Hạn mức nhận lead / ngày
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    value={newAccount.maxLeadsQuota}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, maxLeadsQuota: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl font-mono text-on-surface focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-outline mb-1">
                    Mật khẩu ban đầu
                  </label>
                  <input
                    type="text"
                    defaultValue="SalesFlow@2026"
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl font-mono text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              {/* Phân quyền đặc biệt */}
              <div className="p-3.5 bg-purple-50/50 rounded-2xl border border-purple-200/80 space-y-2">
                <span className="text-[11px] font-bold text-purple-900 block uppercase">
                  Thiết lập bảo mật & Quyền riêng tư:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={newAccount.canExportExcel}
                      onChange={(e) =>
                        setNewAccount({ ...newAccount, canExportExcel: e.target.checked })
                      }
                      className="rounded border-outline-variant text-purple-600 focus:ring-purple-600"
                    />
                    <span>Cho phép Xuất Excel</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={newAccount.canViewFullPhone}
                      onChange={(e) =>
                        setNewAccount({ ...newAccount, canViewFullPhone: e.target.checked })
                      }
                      className="rounded border-outline-variant text-purple-600 focus:ring-purple-600"
                    />
                    <span>Xem số điện thoại đầy đủ</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={newAccount.canReallocate}
                      onChange={(e) =>
                        setNewAccount({ ...newAccount, canReallocate: e.target.checked })
                      }
                      className="rounded border-outline-variant text-purple-600 focus:ring-purple-600"
                    />
                    <span>Quyền chia data</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setCreateAccountModalOpen(false)}
                  className="px-4 py-2 text-outline hover:text-on-surface font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold transition cursor-pointer shadow-sm"
                >
                  Cấp tài khoản & Hoàn tất
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: CHỈNH SỬA VAI TRÒ & QUYỀN HẠN TÀI KHOẢN ================= */}
      {editPermissionsUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2 text-purple-700 font-bold">
                <span className="material-symbols-outlined text-[22px]">tune</span>
                <h3 className="text-base">
                  Điều chỉnh quyền: {editPermissionsUser.name} ({editPermissionsUser.userCode})
                </h3>
              </div>
              <button
                onClick={() => setEditPermissionsUser(null)}
                className="text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveUserPermissions} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-outline mb-1">
                  Vai trò / Cấp bậc
                </label>
                <select
                  value={editPermissionsUser.role}
                  onChange={(e) => {
                    const r = e.target.value as UserRoleKey;
                    const rObj = roles.find((item) => item.key === r);
                    setEditPermissionsUser({
                      ...editPermissionsUser,
                      role: r,
                      roleTitle: rObj?.title || ''
                    });
                  }}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:border-purple-600 font-bold cursor-pointer"
                >
                  <option value="super_admin">Quản lý cấp cao (Super Admin)</option>
                  <option value="manager">Quản lý chi nhánh (Manager)</option>
                  <option value="team_leader">Quản lý cấp thấp / Trưởng phòng (Team Leader)</option>
                  <option value="sales_agent">Nhân viên Sale / Telesale</option>
                  <option value="collaborator">Cộng tác viên (CTV)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-outline mb-1">
                  Phòng ban công tác
                </label>
                <select
                  value={editPermissionsUser.department}
                  onChange={(e) =>
                    setEditPermissionsUser({ ...editPermissionsUser, department: e.target.value })
                  }
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:border-purple-600 cursor-pointer"
                >
                  <option value="Phòng Kinh doanh 1">Phòng Kinh doanh 1</option>
                  <option value="Phòng Kinh doanh 2">Phòng Kinh doanh 2</option>
                  <option value="Trung tâm Telesales & CSKH">Trung tâm Telesales & CSKH</option>
                  <option value="Ban Giám Đốc Điều Hành">Ban Giám Đốc Điều Hành</option>
                  <option value="Kênh Đối Tác & CTV">Kênh Đối Tác & CTV</option>
                </select>
              </div>

              <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30 space-y-2">
                <span className="text-[11px] font-bold text-on-surface block uppercase">
                  Cấu hình quyền cá nhân hóa (Override permissions):
                </span>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editPermissionsUser.canExportExcel}
                      onChange={(e) =>
                        setEditPermissionsUser({
                          ...editPermissionsUser,
                          canExportExcel: e.target.checked
                        })
                      }
                      className="rounded border-outline-variant text-purple-600 focus:ring-purple-600"
                    />
                    <span>Quyền tải xuống file Excel/CSV danh sách khách hàng</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editPermissionsUser.canViewFullPhone}
                      onChange={(e) =>
                        setEditPermissionsUser({
                          ...editPermissionsUser,
                          canViewFullPhone: e.target.checked
                        })
                      }
                      className="rounded border-outline-variant text-purple-600 focus:ring-purple-600"
                    />
                    <span>Xem đầy đủ số điện thoại khách hàng (Không che giấu masking)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editPermissionsUser.canReallocate}
                      onChange={(e) =>
                        setEditPermissionsUser({
                          ...editPermissionsUser,
                          canReallocate: e.target.checked
                        })
                      }
                      className="rounded border-outline-variant text-purple-600 focus:ring-purple-600"
                    />
                    <span>Quyền điều phối và phân bổ data cho các nhân viên khác</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-outline mb-1">
                  Hạn mức nhận lead tối đa / ngày
                </label>
                <input
                  type="number"
                  min={0}
                  value={editPermissionsUser.maxLeadsQuota}
                  onChange={(e) =>
                    setEditPermissionsUser({
                      ...editPermissionsUser,
                      maxLeadsQuota: Number(e.target.value)
                    })
                  }
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl font-mono text-on-surface focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditPermissionsUser(null)}
                  className="px-4 py-2 text-outline hover:text-on-surface font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold transition cursor-pointer shadow-sm"
                >
                  Lưu thay đổi quyền
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: XEM CHI TIẾT HỒ SƠ TÀI KHOẢN ================= */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-start justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-3">
                {selectedUserDetail.avatar ? (
                  <img
                    src={selectedUserDetail.avatar}
                    alt={selectedUserDetail.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-600"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-lg">
                    {selectedUserDetail.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-headline-sm text-base font-bold text-on-surface">
                    {selectedUserDetail.name}
                  </h3>
                  <p className="text-xs text-outline font-mono">
                    @{selectedUserDetail.username} • {selectedUserDetail.userCode}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserDetail(null)}
                className="text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                <div>
                  <span className="text-outline text-[11px] block">Vai trò:</span>
                  <strong className="text-purple-800 font-bold text-xs">{selectedUserDetail.roleTitle}</strong>
                </div>
                <div>
                  <span className="text-outline text-[11px] block">Phòng ban:</span>
                  <span className="font-semibold text-on-surface">{selectedUserDetail.department}</span>
                </div>
                <div>
                  <span className="text-outline text-[11px] block">Số điện thoại:</span>
                  <span className="font-mono font-bold text-purple-700">{selectedUserDetail.phone}</span>
                </div>
                <div>
                  <span className="text-outline text-[11px] block">Email:</span>
                  <span className="text-on-surface-variant truncate block">{selectedUserDetail.email}</span>
                </div>
                <div>
                  <span className="text-outline text-[11px] block">Trạng thái:</span>
                  <span className={selectedUserDetail.status === 'active' ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                    {selectedUserDetail.status === 'active' ? 'Đang hoạt động' : 'Tạm khóa'}
                  </span>
                </div>
                <div>
                  <span className="text-outline text-[11px] block">Hạn mức nhận:</span>
                  <span className="font-mono font-bold text-on-surface">{selectedUserDetail.maxLeadsQuota} lead/ngày</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-1.5">
                <span className="font-bold text-outline text-[11px] block uppercase">
                  Dự án được quyền tiếp cận:
                </span>
                <p className="font-medium text-on-surface">
                  {selectedUserDetail.assignedProjects.join(', ')}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-1.5">
                <span className="font-bold text-outline text-[11px] block uppercase">
                  Lịch sử đăng nhập:
                </span>
                <p className="text-outline text-[11px]">
                  Lần truy cập cuối: <strong>{selectedUserDetail.lastActive}</strong> • Ngày tạo tài khoản: <strong>{selectedUserDetail.createdAt}</strong>
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => {
                  setEditPermissionsUser(selectedUserDetail);
                  setSelectedUserDetail(null);
                }}
                className="px-3.5 py-1.5 bg-purple-50 text-purple-700 font-semibold rounded-xl hover:bg-purple-100 transition cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Điều chỉnh quyền</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedUserDetail(null)}
                className="px-4 py-1.5 bg-surface-container text-on-surface font-semibold rounded-xl hover:bg-surface-container-high transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
