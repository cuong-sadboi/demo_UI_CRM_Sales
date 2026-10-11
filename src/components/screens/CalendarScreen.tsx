'use client';

import React, { useState } from 'react';
import { MOCK_CALLBACKS } from '../../data/mockCrmData';
import { CallbackTask } from '../../types/crm';
import AllocatedLeadsSection from '../AllocatedLeadsSection';

interface CalendarScreenProps {
  onToast: (msg: string) => void;
}

export default function CalendarScreen({ onToast }: CalendarScreenProps) {
  const [tasks, setTasks] = useState<CallbackTask[]>(MOCK_CALLBACKS);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [newScheduleModal, setNewScheduleModal] = useState(false);
  const [activeCallTask, setActiveCallTask] = useState<CallbackTask | null>(null);
  const [schedulePrefill, setSchedulePrefill] = useState<{ name: string; phone: string } | null>(null);

  const completeTask = (id: string, name: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    onToast(`Đã hoàn tất cuộc hẹn với khách hàng ${name}`);
  };

  const overdueTasks = tasks.filter((t) => t.status === 'overdue');
  const todayTasks = tasks.filter((t) => t.status === 'today');
  const upcomingTasks = tasks.filter((t) => t.status === 'upcoming');

  return (
    <div className="flex flex-col w-full space-y-6 pb-12">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-sm text-xs uppercase tracking-wider text-outline">
              Hệ thống Sale
            </span>
            <span className="text-outline-variant">/</span>
            <span className="font-label-sm text-xs text-primary font-semibold">Điều phối liên hệ</span>
          </div>
          <h1 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
            Lịch gọi lại & Chăm sóc khách hàng
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
            Theo dõi nhắc hẹn, cuộc gọi đến hạn và tối ưu tỷ lệ tiếp cận khách hàng tiềm năng
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-surface-container-high p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
              <span>Danh sách công việc</span>
            </button>
            <button
              onClick={() => {
                setViewMode('calendar');
                onToast('Chuyển sang chế độ xem Lịch biểu theo tuần');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              <span>Lịch biểu (Calendar)</span>
            </button>
          </div>

          <button
            onClick={() => setNewScheduleModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-container hover:bg-primary text-on-primary font-label-md text-xs rounded-xl shadow-sm transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_ic_call</span>
            <span>+ Đặt lịch gọi mới</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Bento KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Đến hạn hôm nay */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-outline font-semibold">Đến hạn hôm nay</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface font-mono">28</span>
              <span className="text-xs text-on-surface-variant">cuộc gọi</span>
            </div>
            <p className="text-xs text-primary font-medium mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              Ưu tiên gọi trước 17:30
            </p>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-primary h-full rounded-full" style={{ width: '70%' }}></div>
          </div>
        </div>

        {/* Card 2: Quá hạn */}
        <div className="bg-red-50/70 p-5 rounded-2xl shadow-sm border border-red-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-error font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
              Quá hạn xử lý
            </span>
            <div className="w-8 h-8 rounded-lg bg-error text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-error font-mono">{overdueTasks.length}</span>
              <span className="text-xs text-error font-medium">nhiệm vụ khẩn</span>
            </div>
            <p className="text-xs text-red-700 mt-1">Khách hàng chờ phản hồi &gt; 1 giờ</p>
          </div>
          <div className="w-full bg-red-200 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-error h-full rounded-full" style={{ width: '90%' }}></div>
          </div>
        </div>

        {/* Card 3: Lịch ngày mai */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-outline font-semibold">Lịch hẹn ngày mai</span>
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">event</span>
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface font-mono">14</span>
              <span className="text-xs text-on-surface-variant">cuộc gọi</span>
            </div>
            <p className="text-xs text-sky-700 mt-1">Đã chốt khung giờ với khách</p>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: '50%' }}></div>
          </div>
        </div>

        {/* Card 4: Hoàn thành tuần này */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-outline font-semibold">Đã hoàn thành</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-700 font-mono">112</span>
              <span className="text-xs text-on-surface-variant">cuộc gọi</span>
            </div>
            <p className="text-xs text-emerald-700 mt-1">92% gọi đúng giờ hẹn</p>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: '92%' }}></div>
          </div>
        </div>
      </div>

      {/* 3. Task Sections */}
      <div className="space-y-6">
        {/* Section A: CẢNH BÁO QUÁ HẠN */}
        {overdueTasks.length > 0 && (
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-red-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-red-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[20px]">error</span>
                <h2 className="font-bold text-sm text-error uppercase tracking-wider">
                  Cảnh báo quá hạn ({overdueTasks.length} nhiệm vụ cần xử lý ngay)
                </h2>
              </div>
              <span className="text-xs text-red-600 font-medium">Ưu tiên gọi điện lập tức</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {overdueTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl bg-red-50/50 border border-red-200/80 hover:bg-red-50 transition space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-on-surface">{t.customerName}</strong>
                        <span className="font-mono text-[11px] text-primary">{t.leadCode}</span>
                      </div>
                      <span className="font-mono text-outline block">{t.phone}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-error font-bold text-[10px]">
                      {t.scheduledTime}
                    </span>
                  </div>

                  <p className="text-red-950 font-medium bg-white/70 p-2 rounded-lg border border-red-200/50">
                    Nội dung: {t.reason}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-outline">Sale: <strong>{t.agent}</strong></span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => completeTask(t.id, t.customerName)}
                        className="px-2.5 py-1 bg-surface-container hover:bg-emerald-100 text-on-surface rounded-lg font-medium transition cursor-pointer"
                      >
                        Đã gọi xong
                      </button>
                      <button
                        onClick={() => {
                          setActiveCallTask(t);
                          onToast(`Đang kết nối VoIP với ${t.customerName}...`);
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        Gọi ngay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section B: ĐẾN HẠN HÔM NAY */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">today</span>
              <h2 className="font-bold text-sm text-on-surface uppercase tracking-wider">
                Đến hạn hôm nay (Khung giờ chiều 14:00 - 17:30)
              </h2>
            </div>
            <span className="text-xs text-primary font-medium">{todayTasks.length} cuộc hẹn</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {todayTasks.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 hover:border-primary/40 transition space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <strong className="text-sm text-on-surface block">{t.customerName}</strong>
                    <span className="font-mono text-outline">{t.phone}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-bold text-[10px]">
                    {t.scheduledTime}
                  </span>
                </div>

                <p className="text-on-surface-variant bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/20">
                  {t.reason}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-outline">Sale: <strong>{t.agent}</strong></span>
                  <button
                    onClick={() => {
                      setActiveCallTask(t);
                      onToast(`Đang kết nối VoIP với ${t.customerName}...`);
                    }}
                    className="px-3 py-1 bg-primary text-white hover:bg-primary-container rounded-lg font-semibold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">call</span>
                    Gọi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section C: LỊCH HẸN NGÀY MAI & SẮP TỚI */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sky-600 text-[20px]">next_plan</span>
              <h2 className="font-bold text-sm text-on-surface uppercase tracking-wider">
                Lịch hẹn ngày mai & sắp tới
              </h2>
            </div>
            <span className="text-xs text-outline">{upcomingTasks.length} nhiệm vụ</span>
          </div>

          <div className="space-y-2 text-xs">
            {upcomingTasks.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-outline text-[20px]">calendar_today</span>
                  <div>
                    <strong className="text-on-surface">{t.customerName} ({t.phone})</strong>
                    <span className="text-outline block text-[11px]">{t.reason}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-primary font-semibold">{t.scheduledTime}</span>
                  <span className="text-on-surface-variant font-medium">Sale: {t.agent}</span>
                  <button
                    onClick={() => onToast(`Đã chuyển lịch của ${t.customerName}`)}
                    className="px-2 py-1 bg-surface-container hover:bg-surface-container-high rounded text-outline hover:text-on-surface cursor-pointer"
                  >
                    Đổi giờ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Section D: Danh sách số điện thoại được chia (Allocated Leads Pipeline) */}
      <AllocatedLeadsSection
        onToast={onToast}
        onScheduleCall={(customerName, phone) => {
          setSchedulePrefill({ name: customerName, phone });
          setNewScheduleModal(true);
        }}
      />

      {/* Modal: Add New Call Schedule */}
      {newScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant/20">
              <h3 className="font-headline-sm text-base font-bold text-on-surface">
                Đặt lịch hẹn gọi lại mới
              </h3>
              <button
                onClick={() => {
                  setNewScheduleModal(false);
                  setSchedulePrefill(null);
                }}
                className="p-1 text-outline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setNewScheduleModal(false);
                setSchedulePrefill(null);
                onToast('Đã thêm lịch hẹn gọi lại thành công!');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block uppercase font-bold text-outline mb-1">Khách hàng / SĐT *</label>
                <input
                  required
                  defaultValue={
                    schedulePrefill
                      ? `${schedulePrefill.name} (${schedulePrefill.phone})`
                      : ''
                  }
                  placeholder="Nhập tên hoặc số điện thoại..."
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-bold text-outline mb-1">Giờ hẹn *</label>
                  <input
                    type="time"
                    defaultValue="14:30"
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold text-outline mb-1">Ngày hẹn *</label>
                  <input
                    type="date"
                    defaultValue="2024-10-24"
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block uppercase font-bold text-outline mb-1">Nội dung trao đổi</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú chi tiết lý do gọi lại, thông tin khách yêu cầu..."
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => {
                    setNewScheduleModal(false);
                    setSchedulePrefill(null);
                  }}
                  className="px-3 py-2 bg-surface-container rounded-xl text-on-surface cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-xl font-semibold shadow cursor-pointer"
                >
                  Lưu lịch hẹn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VoIP Call Task Modal Simulator (for task calls) */}
      {activeCallTask && (
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
                {activeCallTask.customerName} ({activeCallTask.phone})
              </p>
              <span className="text-xs text-outline">{activeCallTask.project} • {activeCallTask.reason}</span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl text-xs text-on-surface-variant text-left space-y-1">
              <p>• Tổng đài: <strong>VoIP SIP Center HN-01</strong></p>
              <p>• Thu âm tự động: <strong>Bật (HD Quality)</strong></p>
              <p>• Trạng thái: <strong>Đang đổ chuông (Ringing...)</strong></p>
            </div>

            <button
              onClick={() => {
                onToast(`Đã kết thúc cuộc gọi với ${activeCallTask.customerName}.`);
                setActiveCallTask(null);
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

