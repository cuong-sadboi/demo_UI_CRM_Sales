# SalesFlow CRM — Frontend Demo (Google Stitch MCP)

Hệ thống quản lý dữ liệu bán hàng & CRM thông minh (SalesFlow CRM System) được khởi tạo bằng **Next.js (App Router, TypeScript, Tailwind CSS v4)** và đồng bộ trực tiếp từ thiết kế trên **Google Stitch** thông qua giao thức MCP (Model Context Protocol).

---

## 🌟 7 Màn hình Demo từ Google Stitch

1. **Tổng quan (`/` hoặc `#overview`)**: 
   - 4 Bento KPI Cards (Tổng data khách hàng 12,480, Data chưa phân bổ 1,245, Cuộc gọi hôm nay 348/500, Hot Lead 286).
   - Biểu đồ xu hướng tương tác SVG tương tác theo ngày (Tổng cuộc gọi, Đã kết nối, Hẹn gọi lại).
   - Bảng xếp hạng Top nhân viên kinh doanh nổi bật theo tỷ lệ chốt cọc.
   - Phễu chuyển đổi bán hàng (Sales Funnel) và nhật ký cuộc gọi VoIP thời gian thực.

2. **Quản lý dự án (`#projects`)**:
   - Thống kê danh mục 8 dự án BĐS & Tài chính.
   - Bảng theo dõi tiến độ phân bổ giỏ hàng, doanh số cọc, tỷ lệ chuyển đổi và người phụ trách.
   - Modal tạo mới dự án kinh doanh.

3. **Data Khách hàng & Sales (`#customers`)**:
   - Quản lý danh sách lead chi tiết với bộ lọc đa tầng (chiến dịch, trạng thái, nhân viên phụ trách, nguồn lead).
   - Thanh tác vụ hàng loạt: Phân bổ nhanh cho sale, gửi Zalo ZNS, đổi trạng thái.
   - **Hồ sơ khách hàng chi tiết (Customer Dossier)**: Xem lịch sử tư vấn, ghi chú nhu cầu, mô phỏng cuộc gọi VoIP 1-click.

4. **Phân bổ Data (`#allocation`)**:
   - Thuật toán điều phối lead tự động: **Round-Robin (Xoay vòng)**, **Theo KPI & Tỷ lệ %**, hoặc **Thủ công**.
   - Hàng đợi lead chưa phân bổ (FB Ads, Google, Landing Page).
   - Danh sách nhân sự trực ca: Bật/tắt trực tuyến (Online/Offline), thanh hạn mức tối đa/ngày và nút chạy phân bổ tự động.

5. **Nhập Excel / CSV Wizard (`#import`)**:
   - Quy trình Wizard 4 bước nhập tệp chuẩn hóa.
   - Cấu hình thuật toán chống trùng lặp dữ liệu (Ghi đè, Bỏ qua, Thêm ghi chú mới).
   - Bảng xem trước dữ liệu và thanh tiến độ nạp 1,200 khách hàng vào hệ thống.

6. **Báo cáo & Phân tích KPI (`#reports`)**:
   - 6 thẻ KPI tổng quan doanh thu, tỷ lệ kết nối, cuộc hẹn và chi phí lead.
   - Biểu đồ phân tích cơ cấu kết quả telesale (Đã trao đổi, Máy bận, Hẹn gọi lại, Sai số).
   - Bảng xếp hạng năng suất chi tiết từng tư vấn viên.

7. **Lịch gọi lại & Chăm sóc khách hàng (`#calendar`)**:
   - Nhắc hẹn cuộc gọi theo khung giờ với phân loại ưu tiên.
   - Cảnh báo nhiệm vụ quá hạn (màu đỏ khẩn cấp) kèm nút gọi điện giải quyết ngay.
   - Chuyển đổi giữa chế độ Danh sách công việc và Lịch biểu (Calendar View).

---

## 🎨 Tính năng đặc biệt: "Đối chiếu bản vẽ Google Stitch"
Ngay tại thanh banner trên cùng của ứng dụng, nhấn nút **"Đối chiếu bản vẽ Google Stitch"** để mở modal xem ảnh chụp thiết kế gốc độ phân giải cao, thông số kỹ thuật (viewport 2588x2962), và mã Screen ID trích xuất trực tiếp từ Google Stitch MCP.

---

## 🚀 Khởi chạy dự án

### Cài đặt dependencies (nếu clone mới):
```bash
npm install
```

### Chạy môi trường Development:
```bash
npm run dev
```
Truy cập: [http://localhost:3000](http://localhost:3000)

### Kiểm tra bản Build Production:
```bash
npm run build
```

---

## 🔌 Cấu hình MCP Server (Google Stitch)
Cấu hình kết nối Stitch MCP đã được lưu tại `.agents/mcp_config.json` và `mcp_config.json`:
```json
{
  "mcpServers": {
    "stitch": {
      "serverUrl": "https://stitch.googleapis.com/mcp",
      "headers": {
        "X-Goog-Api-Key": "${STITCH_API_KEY}"
      }
    }
  }
}
```
Mã dự án Stitch: `projects/13098932382894710925` (SalesFlow CRM System).
