# Văn phòng Sài Gòn - Cấu hình Local Server

Dự án này đã được cấu hình để chạy trên local tại địa chỉ: **http://localhost:3001**

## Yêu cầu
- Đã cài đặt [Node.js](https://nodejs.org/) (đã được xác nhận trên máy của bạn).

## Cách khởi động dự án
1. Mở terminal tại thư mục này (`vanphongsg`).
2. Chạy lệnh cài đặt các thư viện phụ thuộc (nếu chưa chạy trước đó):
   ```bash
   npm install
   ```
3. Khởi động server phát triển bằng một trong hai lệnh sau:
   ```bash
   npm run dev
   # Hoặc:
   npm start
   ```
4. Trình duyệt sẽ tự động mở trang web tại địa chỉ `http://localhost:3001` (hoặc `http://127.0.0.1:3001`). Khi bạn chỉnh sửa code (HTML, CSS, JS), trang web sẽ tự động tải lại (Live Reload).

> **Lưu ý:** Nếu cổng 3001 đang bị chiếm dụng bởi một ứng dụng khác (như dự án `taphoasg` đang chạy chẳng hạn), `live-server` sẽ tự động chuyển sang một cổng ngẫu nhiên khác để không bị lỗi. Hãy tắt ứng dụng đang chạy ở cổng 3001 nếu bạn muốn dự án này chạy chính xác trên cổng 3001.
