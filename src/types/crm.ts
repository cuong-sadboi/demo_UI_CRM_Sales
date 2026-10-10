export type ScreenTab =
  | 'overview'
  | 'projects'
  | 'customers'
  | 'allocation'
  | 'calendar'
  | 'reports'
  | 'import';

export interface LeadCustomer {
  id: string;
  leadCode: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  project: string;
  source: string;
  assignedTo: string;
  assignedAvatar?: string;
  status: 'Mới tiếp nhận' | 'Đang liên hệ' | 'Quan tâm cao' | 'Hẹn gọi lại' | 'Đã chốt cọc' | 'Không quan tâm';
  priority: 'Cao (Hot)' | 'Trung bình' | 'Thấp';
  createdAt: string;
  lastCallTime?: string;
  callCount: number;
  notes?: string;
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
