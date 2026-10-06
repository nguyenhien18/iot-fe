import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Icon from '../common/Icon'
import { NAV_ITEMS } from '../../config/navigation'
import Brand from './Brand'

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <Brand collapsed={collapsed} onToggle={onToggle} />

      <nav className="sidebar-nav" aria-label="Điều hướng chính">
        <p className="sidebar-caption">DANH MỤC</p>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={item.label}
            aria-label={item.label}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">
              <Icon name={item.icon} />
            </span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="logout-button"
          type="button"
          onClick={handleLogout}
          aria-label="Đăng xuất"
          title="Đăng xuất"
        >
          <Icon name="logout" />
          <span className="sidebar-label">Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
