import Icon from '../common/Icon'

export default function Brand({ collapsed, onToggle }) {
  return (
    <div className="sidebar-brand">
      <div className="brand-mark">
        <Icon name="home" size={26} />
      </div>
      <div className="brand-copy">
        <strong>Smart Room</strong>
      </div>
      <button
        type="button"
        className="sidebar-toggle"
        onClick={onToggle}
        aria-label={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
        aria-expanded={!collapsed}
        title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
      >
        <Icon name="panel" size={18} />
      </button>
    </div>
  )
}
