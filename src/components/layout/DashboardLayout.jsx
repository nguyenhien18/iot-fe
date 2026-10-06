import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { DEFAULT_PATH } from '../../config/navigation'

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useLocation()
  const shellClasses = [
    'app-shell',
    pathname === DEFAULT_PATH ? 'dashboard-shell' : '',
    collapsed ? 'sidebar-collapsed' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={shellClasses}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      <div className="app-main">
        <Topbar pathname={pathname} />

        <main className="page-panel">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
