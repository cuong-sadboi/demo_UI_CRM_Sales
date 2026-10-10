'use client';

import React, { useState } from 'react';

interface ImportScreenProps {
  onToast: (msg: string) => void;
  onNavigateTab: (tab: any) => void;
}

export default function ImportScreen({ onToast, onNavigateTab }: ImportScreenProps) {
  const [currentStep, setCurrentStep] = useState(3);
  const [duplicateAction, setDuplicateAction] = useState<'skip' | 'overwrite' | 'append'>('overwrite');
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const handleStartImport = () => {
    setIsImporting(true);
    setImportProgress(10);
    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsImporting(false);
          setCurrentStep(4);
          onToast('Nạp thành công 1,200 dòng dữ liệu vào hệ thống SalesFlow CRM!');
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  return (
    <div className="flex flex-col w-full space-y-6 pb-12">
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-sm text-xs uppercase tracking-wider text-outline">
              Data khách hàng
            </span>
            <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
            <span className="font-label-sm text-xs text-primary font-semibold">Quy trình nhập dữ liệu</span>
          </div>
          <h1 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
            Nhập dữ liệu khách hàng (Excel / CSV Wizard)
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
            Trình tải lên, ánh xạ cột thông minh và tự động kiểm tra trùng lặp dữ liệu trước khi nạp vào hệ thống
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToast('Đang tải lịch sử các phiên nhập tệp trước...')}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-outline">history</span>
            <span>Lịch sử nhập tệp</span>
          </button>
          <button
            onClick={() => onNavigateTab('customers')}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-lowest hover:bg-surface-container-low text-error font-label-md text-xs rounded-xl shadow-xs transition cursor-pointer border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
            <span>Hủy phiên</span>
          </button>
        </div>
      </div>

      {/* 2. 4-Step Stepper */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
              <span className="material-symbols-outlined text-[20px]">check</span>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Bước 1 • Hoàn thành</span>
              <span className="text-xs font-semibold text-on-surface truncate block">Tải lên tệp dữ liệu</span>
              <span className="text-[10px] text-outline truncate block">.xlsx, .csv định dạng chuẩn</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
              <span className="material-symbols-outlined text-[20px]">check</span>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Bước 2 • Hoàn thành</span>
              <span className="text-xs font-semibold text-on-surface truncate block">Chọn dự án & Ánh xạ</span>
              <span className="text-[10px] text-outline truncate block">Khớp 12/12 trường dữ liệu</span>
            </div>
          </div>

          {/* Step 3: Current */}
          <div className="flex items-center gap-3 bg-primary-fixed/30 p-2.5 rounded-xl border border-primary/30">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
              03
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-primary">Bước 3</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-primary text-white animate-pulse">
                  Đang duyệt
                </span>
              </div>
              <span className="text-xs font-bold text-on-surface truncate block">Xem trước & Xác thực</span>
              <span className="text-[10px] text-primary font-medium truncate block">Kiểm tra 1,200 dòng</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className={`flex items-center gap-3 ${currentStep === 4 ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
              currentStep === 4 ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-container text-outline'
            }`}>
              {currentStep === 4 ? <span className="material-symbols-outlined text-[20px]">check</span> : '04'}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase text-outline block">
                {currentStep === 4 ? 'Bước 4 • Hoàn tất' : 'Bước 4 • Chờ'}
              </span>
              <span className="text-xs font-semibold text-on-surface truncate block">Xác nhận nạp dữ liệu</span>
              <span className="text-[10px] text-outline truncate block">Lưu dữ liệu vào CRM</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Session File Information */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">description</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-on-surface">
                Danh_sach_Lead_Facebook_Ads_Dot4.xlsx
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface">
                1.8 MB
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                1,200 dòng hợp lệ
              </span>
            </div>
            <p className="text-xs text-outline mt-0.5">
              Ánh xạ tới dự án: <strong>BĐS Green Residence</strong> • Nguồn: <strong>Facebook Lead Form</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => onToast('Đang quét lại tệp Excel để cập nhật số dòng...')}
          className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 self-start lg:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          Tải lại file kiểm tra
        </button>
      </div>

      {/* 4. Deduplication Configuration */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-500 text-[22px]">security</span>
          <h2 className="font-headline-sm text-base font-bold text-on-surface">
            Cấu hình thuật toán xử lý dữ liệu trùng lặp
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <label
            className={`p-3.5 rounded-xl border-2 cursor-pointer transition space-y-1 block ${
              duplicateAction === 'overwrite'
                ? 'border-primary bg-primary-fixed/20'
                : 'border-outline-variant/30 hover:bg-surface-container-low'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-on-surface">Ghi đè thông tin mới</span>
              <input
                type="radio"
                name="dup"
                checked={duplicateAction === 'overwrite'}
                onChange={() => setDuplicateAction('overwrite')}
                className="text-primary"
              />
            </div>
            <p className="text-outline text-[11px] leading-relaxed">
              Nếu số điện thoại đã tồn tại, cập nhật email và ghi chú mới nhất, giữ nguyên nhân viên sale đang phụ trách.
            </p>
          </label>

          <label
            className={`p-3.5 rounded-xl border-2 cursor-pointer transition space-y-1 block ${
              duplicateAction === 'skip'
                ? 'border-primary bg-primary-fixed/20'
                : 'border-outline-variant/30 hover:bg-surface-container-low'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-on-surface">Bỏ qua dữ liệu trùng</span>
              <input
                type="radio"
                name="dup"
                checked={duplicateAction === 'skip'}
                onChange={() => setDuplicateAction('skip')}
                className="text-primary"
              />
            </div>
            <p className="text-outline text-[11px] leading-relaxed">
              Giữ nguyên toàn bộ khách hàng cũ, bỏ qua các dòng có số điện thoại trùng và xuất danh sách tệp lỗi.
            </p>
          </label>

          <label
            className={`p-3.5 rounded-xl border-2 cursor-pointer transition space-y-1 block ${
              duplicateAction === 'append'
                ? 'border-primary bg-primary-fixed/20'
                : 'border-outline-variant/30 hover:bg-surface-container-low'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-on-surface">Tạo dưới dạng ghi chú mới</span>
              <input
                type="radio"
                name="dup"
                checked={duplicateAction === 'append'}
                onChange={() => setDuplicateAction('append')}
                className="text-primary"
              />
            </div>
            <p className="text-outline text-[11px] leading-relaxed">
              Không tạo lead trùng lặp, tự động gắn lượt đăng ký này vào timeline lịch sử của khách hàng cũ.
            </p>
          </label>
        </div>
      </div>

      {/* 5. Preview Sample Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-4 bg-surface-container-low flex justify-between items-center text-xs">
          <span className="font-bold uppercase text-outline">
            Xem trước 3 dòng tiêu biểu từ file Excel (Đã kiểm tra định dạng)
          </span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            1,192 dòng hợp lệ / 8 dòng cảnh báo trùng
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-outline font-semibold bg-surface-container-low/50">
                <th className="py-2.5 px-3">STT</th>
                <th className="py-2.5 px-3">Họ và tên</th>
                <th className="py-2.5 px-3">Số điện thoại</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Nhu cầu đăng ký</th>
                <th className="py-2.5 px-3">Trạng thái kiểm tra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              <tr className="hover:bg-surface-container-low">
                <td className="py-3 px-3 font-mono">1</td>
                <td className="py-3 px-3 font-semibold text-on-surface">Nguyễn Văn Hùng</td>
                <td className="py-3 px-3 font-mono">0982 458 819</td>
                <td className="py-3 px-3">hung.nguyen@vinagroup.com</td>
                <td className="py-3 px-3">Quan tâm căn 3PN hướng Đông Nam</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                    <span className="material-symbols-outlined text-[14px]">check</span> Hợp lệ
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low bg-amber-50/30">
                <td className="py-3 px-3 font-mono">2</td>
                <td className="py-3 px-3 font-semibold text-on-surface">Trần Linh Chi</td>
                <td className="py-3 px-3 font-mono">0914 832 326</td>
                <td className="py-3 px-3">linhchi.tran@outlook.com</td>
                <td className="py-3 px-3">Hỏi thông tin cam kết thuê Shophouse</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold">
                    <span className="material-symbols-outlined text-[14px]">warning</span> Trùng SĐT (Sẽ ghi đè)
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low">
                <td className="py-3 px-3 font-mono">3</td>
                <td className="py-3 px-3 font-semibold text-on-surface">Hoàng Quốc Huy</td>
                <td className="py-3 px-3 font-mono">0933 671 998</td>
                <td className="py-3 px-3">huy.hoang@gmail.com</td>
                <td className="py-3 px-3">Đăng ký xem căn Duplex mẫu</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                    <span className="material-symbols-outlined text-[14px]">check</span> Hợp lệ
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress & Confirm Action */}
      {isImporting && (
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-primary/30 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span>Đang nạp dữ liệu vào cơ sở dữ liệu SalesFlow...</span>
            <span className="text-primary font-mono">{importProgress}%</span>
          </div>
          <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300 rounded-full"
              style={{ width: `${importProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => onNavigateTab('customers')}
          className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold cursor-pointer"
        >
          Quay lại danh sách khách hàng
        </button>
        <button
          onClick={handleStartImport}
          disabled={isImporting || currentStep === 4}
          className={`flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold shadow-lg transition cursor-pointer ${
            isImporting || currentStep === 4 ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
          <span>{currentStep === 4 ? 'Đã hoàn tất nạp dữ liệu' : 'Bắt đầu nạp 1,200 khách hàng vào CRM'}</span>
        </button>
      </div>
    </div>
  );
}
