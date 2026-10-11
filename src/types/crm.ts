export type ScreenTab =
  | 'overview'
  | 'projects'
  | 'customers'
  | 'allocation'
  | 'calendar'
  | 'reports'
  | 'import'
  | 'roles';

export type LeadStatus =
  | 'Mới tiếp nhận'
  | 'Đang liên hệ'
  | 'Quan tâm cao'
  | 'Hẹn gọi lại'
  | 'Đã chốt cọc'
  | 'Không quan tâm';

export interface LeadCustomer {
  id: string;
  leadCode: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  birthYear?: number;
  gender?: 'Nam' | 'Nữ';
  address?: string;
  city?: string;
  district?: string;
  occupation?: string;
  incomeRange?: string;
  idCard?: string;
  project: string;
  productInterest?: string;
  source: string;
  assignedTo: string;
  assignedAvatar?: string;
  status: LeadStatus;
  priority: 'Cao (Hot)' | 'Trung bình' | 'Thấp';
  createdAt: string;
  lastCallTime?: string;
  callCount: number;
  notes?: string;
  callHistory?: CallHistoryItem[];
}

export interface CrmProject {
  id: string;
  code: string;
  name: string;
  segment: string;
  productType: string;
  totalLeads: number;
  allocatedLeads: number;
  conversionRate: number;
  status: 'Đang chạy' | 'Tạm dừng' | 'Đã chốt';
  manager: string;
  targetDeals: number;
  closedDeals: number;
}

export interface SalesAgent {
  id: string;
  name: string;
  avatar: string;
  role: string;
  team: string;
  isOnline: boolean;
  allocationRatio: number;
  leadsToday: number;
  maxLeadsPerDay: number;
  totalCalls: number;
  closedDeals: number;
  conversionRate: number;
}

export interface CallbackTask {
  id: string;
  leadCode: string;
  customerName: string;
  phone: string;
  project: string;
  scheduledTime: string;
  status: 'overdue' | 'today' | 'upcoming';
  priority: 'Khẩn cấp' | 'Cao' | 'Bình thường';
  agent: string;
  reason: string;
  note: string;
}

export interface StitchScreenManifest {
  id: string;
  title: string;
  deviceType: string;
  tab: ScreenTab;
  screenshotUrl: string;
  localScreenshot: string;
  sourceName: string;
  description: string;
}

export type CallStatus =
  | 'Chưa gọi'
  | 'Đã gọi'
  | 'Không nghe máy'
  | 'Gọi lại sau'
  | 'Thuê bao / Bận'
  | 'Quan tâm cao'
  | 'Từ chối';

export interface CallHistoryItem {
  id: string;
  time: string;
  status: string;
  duration: string;
  caller: string;
  note: string;
}

export interface AllocatedLeadCustomer {
  id: string;
  leadCode: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  birthYear: number;
  gender: 'Nam' | 'Nữ';
  address: string;
  city: string;
  district: string;
  occupation: string;
  incomeRange: string;
  idCard: string;
  project: string;
  productInterest: string;
  source: string;
  assignedTo: string;
  assignedAvatar?: string;
  allocatedAt: string;
  callStatus: CallStatus;
  priority: 'Cao (Hot)' | 'Trung bình' | 'Thấp';
  callCount: number;
  lastCallTime?: string;
  notes: string;
  callHistory: CallHistoryItem[];
}

export type UserRoleKey = 'super_admin' | 'manager' | 'team_leader' | 'sales_agent' | 'collaborator';

export interface PermissionItem {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'data' | 'allocation' | 'reports' | 'system';
}

export interface RoleDefinition {
  key: UserRoleKey;
  title: string;
  level: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
  description: string;
  userCount: number;
  defaultPermissions: string[]; // Permission codes
}

export interface SystemUser {
  id: string;
  userCode: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRoleKey;
  roleTitle: string;
  department: string;
  assignedProjects: string[];
  status: 'active' | 'locked' | 'pending';
  lastActive: string;
  createdAt: string;
  canExportExcel: boolean;
  canViewFullPhone: boolean;
  canReallocate: boolean;
  maxLeadsQuota: number;
  customPermissions: string[];
}

