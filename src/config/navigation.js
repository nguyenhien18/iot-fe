export const DEFAULT_PATH = '/'

export const NAV_ITEMS = [
  { to: '/', label: 'Tổng quan', icon: 'home', end: true },
  { to: '/data-sensor', label: 'Dữ liệu cảm biến', icon: 'sensor' },
  { to: '/action-history', label: 'Lịch sử điều khiển', icon: 'history' },
  { to: '/profile', label: 'Thông tin cá nhân', icon: 'user' },
]

export const PAGE_META = {
  '/': {
    title: 'Tổng quan',
    description: 'Theo dõi cảm biến và điều khiển thiết bị trong thời gian thực.',
  },
  '/data-sensor': {
    title: 'Dữ liệu cảm biến',
    description: 'Tra cứu và lọc lịch sử dữ liệu cảm biến.',
  },
  '/action-history': {
    title: 'Lịch sử điều khiển',
    description: 'Theo dõi lịch sử bật / tắt và trạng thái xử lý thiết bị.',
  },
  '/profile': {
    title: 'Thông tin cá nhân',
    description: 'Thông tin sinh viên và các liên kết của dự án.',
  },
}
