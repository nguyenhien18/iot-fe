# IoT Room Monitoring - React Frontend

Frontend React/Vite cho hệ thống giám sát và điều khiển phòng IoT.
Cấu trúc và cách viết tham khảo `D:\toaniot\IOT_Light_Sensor\Frontend`.

## Chạy dự án

Chạy lệnh tại thư mục chứa `package.json` của dự án này:

```powershell
cd D:\Downloads\iot-fe-ui-sidebar-profile-upload\iot-fe-ui-frame
npm install
npm run dev
```

Sao chép `.env.example` thành `.env` để cấu hình kết nối:

```env
VITE_API_URL=http://localhost:8080
VITE_USE_MOCK=true
```

Chế độ mock mặc định được bật. Tài khoản thử nghiệm: `Nguyễn Văn Hiển` / `123456`.
Build production bằng `npm run build`, xem bản build bằng `npm run preview`.

## Tổ chức code

```text
src/
├── api/                 # Axios và các hàm gọi API
├── components/
│   ├── common/          # DataTable và các phần bảng, PageIntro, Toggle, Loading, Icon
│   └── layout/          # DashboardLayout, Sidebar, Brand, Topbar
├── config/              # Menu và tiêu đề các trang
├── context/             # AuthProvider lưu trạng thái đăng nhập
├── features/
│   ├── auth/            # LoginPage và ProtectedRoute
│   ├── overview/        # Dashboard, biểu đồ, thẻ cảm biến, điều khiển LED
│   ├── sensors/         # Lịch sử cảm biến, bộ lọc và bảng
│   ├── activity/        # Lịch sử điều khiển, bộ lọc và bảng
│   └── profile/         # Thông tin cá nhân và liên kết dự án
├── hooks/               # useAuth để sử dụng trạng thái đăng nhập
├── mocks/               # Dữ liệu giả và mô phỏng điều khiển
├── styles/
│   ├── layout/          # Shell, sidebar, topbar
│   ├── components/      # Page, filters, table, feedback
│   ├── pages/           # CSS riêng từng trang, gồm responsive
│   ├── globals.css      # Reset, font và biến màu
│   └── index.css        # Nơi import toàn bộ CSS
└── utils/               # Định dạng ngày giờ và tên cảm biến
```

Chi tiết từng file nằm trong `PROJECT_STRUCTURE.txt`.
Mỗi chức năng có page riêng. State, hàm xử lý, bộ lọc và cách hiển thị dòng nằm ngay
trong page của hai trang lịch sử để dễ theo dõi.
`overview/components` chứa `MetricCard` và `SensorChart` dùng cho Dashboard.
Profile có sẵn thông tin trong `PROFILE`, liên kết trong `PROFILE_LINKS` và hai component nhỏ
`InfoField`, `ProjectLink` ngay trong `features/profile/ProfilePage.jsx`.
`components/common/DataTable.jsx` chứa `DataTable`, `DataTableHead`, `StatusBadge`, `EmptyState`, `TableFooter`.
Menu, nhãn và tiêu đề nằm trong `config/navigation.js`.

Luồng chạy: `main.jsx` → `App.jsx` → `AuthProvider` + `AppRoutes` →
`ProtectedRoute` → `DashboardLayout` → page tương ứng trong `features`.
Các trang dữ liệu gọi `api/apiService.js`; service chọn backend hoặc `mocks/iotData.js` theo biến môi trường.
Riêng Profile đọc thông tin viết sẵn trong file, không gọi API.
Danh sách route nằm ngay trong `App.jsx`, tương tự mẫu. Phần đăng nhập và API là chức năng
riêng của dự án này nên vẫn có `features/auth`, `context`, `hooks` và `api`.

## Chức năng

- Dashboard: ba chỉ số cảm biến và một biểu đồ chung có ba đường nhiệt độ, độ ẩm, ánh sáng.
  Trục trái dùng °C/%, trục phải dùng lux. Điều khiển từng LED hoặc Bật tất cả / Tắt tất cả.
  Khi điều khiển, các nút tạm khóa; chỉ gửi lệnh cho thiết bị cần đổi trạng thái, rồi tải lại trạng thái từng LED.
- Dữ liệu cảm biến: chọn trường rồi bấm Tìm để áp dụng; có thể nhập thêm nội dung tìm kiếm.
  Tất cả chỉ tìm theo tên cảm biến, giá trị và thời gian; từng cảm biến tìm theo giá trị.
  Chọn từng cảm biến và để ô trống sẽ hiện tất cả bản ghi của cảm biến đó sau khi bấm Tìm.
  Thời gian có ví dụ định dạng ngày/giờ. Đổi trường sẽ bỏ bộ lọc cũ; chọn Tất cả hoặc Thời gian
  và tìm với ô trống sẽ hiện toàn bộ dữ liệu.
  Bấm tiêu đề Thời gian để đổi thứ tự mới nhất/cũ nhất. Từ khóa đang gõ không ảnh hưởng
  đến kết quả đã tìm khi chuyển trang hoặc đổi số dòng. Dữ liệu được tải một lần khi mở trang,
  sau đó lọc/sắp xếp/phân trang tại frontend; tải lại trang để lấy dữ liệu mới.
  Tên cảm biến hiển thị tiếng Việt; giá trị nội bộ giữ tiếng Anh.
- Lịch sử điều khiển: các cột Người thực hiện, Thiết bị, Hành động, Trạng thái, Thời gian.
  Nhãn hiển thị Bật/Tắt và Thành công/Thất bại/Đang xử lý; mã gửi API vẫn là
  ON/OFF và SUCCESS/FAILED/PROCESSING.
  Bấm tiêu đề Thời gian để đổi mới nhất/cũ nhất cho toàn bộ kết quả trước khi phân trang.
  Đổi thứ tự hoặc số dòng sẽ về trang đầu và giữ bộ lọc đã áp dụng.
- Bảng cảm biến mặc định 5 dòng, có lựa chọn 5/10/20 giống dự án mẫu.
  Bảng lịch sử điều khiển vẫn hỗ trợ 5/10/20/50; đổi số dòng quay về trang đầu.
- Profile: hiển thị thông tin cố định và các mục GitHub, Figma, Postman, PDF báo cáo.
  Sửa `PROFILE` và `PROFILE_LINKS` ở đầu `src/features/profile/ProfilePage.jsx` để thay nội dung.
  Link chưa điền sẽ hiển thị "Chưa có liên kết". Ảnh chọn lên chỉ xem tạm;
  tải lại trang sẽ dùng `PROFILE.avatarUrl`. Profile không đọc/ghi `localStorage`.
- Đăng nhập, đăng xuất và chặn truy cập trang chính khi chưa đăng nhập.

URL giữ nguyên: `/`, `/data-sensor`, `/action-history`, `/profile`, `/login`.

## CSS và cách viết

`main.jsx` chỉ import `styles/index.css`. File này nạp lần lượt:

1. `globals.css`: màu sắc, font và reset.
2. `layout/`: khung ứng dụng, sidebar, topbar.
3. `components/`: nội dung trang/nút, bộ lọc, bảng/phân trang, loading/công tắc.
4. `pages/`: dashboard, hai trang lịch sử, profile và đăng nhập.

Responsive nằm ở cuối file của thành phần tương ứng. Xem `src/styles/README.md`
để biết chính xác nơi sửa từng phần giao diện.

JavaScript/JSX dùng nháy đơn, không có dấu chấm phẩy cuối câu, thụt 2 khoảng trắng.
Tên component dùng PascalCase, hàm/biến dùng camelCase, hằng dùng UPPER_SNAKE_CASE.
`.prettierrc.json` và `.editorconfig` lưu quy tắc định dạng để trình soạn thảo áp dụng thống nhất.
Các thuộc tính JSX vẫn dùng nháy kép; CSS vẫn có dấu chấm phẩy theo cú pháp CSS.

## Ghép backend

Đặt `VITE_USE_MOCK=false` để gọi các API:

- POST `/api/auth/login`
- GET `/api/sensors`
- GET `/api/sensors/latest`
- GET `/api/data-sensors`
- GET `/api/data-sensors/chart`
- GET `/api/devices`
- POST `/api/devices/{id}/control`
- GET `/api/actions`

Lịch sử cần trả về `username` (hoặc `userName` / `user.username`) để hiển thị người thực hiện.
GET `/api/actions` nhận `sort=createdAt,asc` hoặc `sort=createdAt,desc`; backend cần
sắp xếp toàn bộ kết quả đã lọc trước khi phân trang.
