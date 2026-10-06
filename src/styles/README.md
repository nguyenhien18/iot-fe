# Cấu trúc CSS

`main.jsx` chỉ import `styles/index.css`. File này nạp stylesheet theo thứ tự:
toàn cục → layout → component dùng chung → từng trang.

## Thư mục

- `globals.css`: reset, font, biến màu và chế độ giảm chuyển động.
- `layout/`: khung ứng dụng, sidebar và topbar.
- `components/`: tiêu đề/nút, bộ lọc, bảng/phân trang, loading và công tắc.
- `pages/`: CSS riêng của Dashboard, hai trang lịch sử, Profile và đăng nhập.

## Vị trí cần sửa

| Thành phần                              | File                         |
| --------------------------------------- | ---------------------------- |
| Khung trang, độ rộng sidebar            | `layout/shell.css`           |
| Sidebar, logo, menu, nút đăng xuất      | `layout/sidebar.css`         |
| Header và tiêu đề trang                 | `layout/topbar.css`          |
| Vùng nội dung và nút dùng chung         | `components/page.css`        |
| Ô tìm kiếm, bộ lọc                      | `components/filters.css`     |
| Bảng, badge, phân trang và chọn số dòng | `components/table.css`       |
| Loading, spinner và công tắc            | `components/feedback.css`    |
| Thẻ cảm biến, biểu đồ, điều khiển LED   | `pages/dashboard.css`        |
| Bố cục bộ lọc, màu loại cảm biến        | `pages/sensor-history.css`   |
| Bố cục bộ lọc lịch sử điều khiển        | `pages/activity-history.css` |
| Ảnh đại diện, thông tin và liên kết     | `pages/profile.css`          |
| Form đăng nhập                          | `pages/login.css`            |

Responsive đặt ở cuối chính file phụ trách thành phần đó. Khi thêm stylesheet,
khai báo trong `index.css`; không import từng stylesheet từ component.

Form đăng nhập nằm trong `pages/login.css`; thông tin và liên kết cố định của Profile nằm trong `pages/profile.css`.
Quy tắc Dashboard vừa một màn hình desktop nằm cuối `pages/dashboard.css`.
