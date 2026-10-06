import { useEffect, useState } from 'react'
import DataTable, { EmptyState, StatusBadge, TableFooter } from '../../components/common/DataTable'
import Icon from '../../components/common/Icon'
import { formatDate } from '../../utils/dateTime'
import Loading from '../../components/common/Loading'
import { getActionsApi, getDevicesApi } from '../../api/apiService'

const INITIAL_FILTERS = {
  deviceId: '',
  keyword: '',
  action: '',
  status: '',
}

const ACTION_LABELS = { ON: 'Bật', OFF: 'Tắt' }
const DEFAULT_PAGE_SIZE = 10

export default function ActivityHistoryPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS)
  const [sortDirection, setSortDirection] = useState('desc')
  const [devices, setDevices] = useState([])
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadData = async (
    nextPage = 0,
    activeFilters = appliedFilters,
    activePageSize = pageSize,
    direction = sortDirection,
  ) => {
    setLoading(true)
    setError('')
    try {
      const data = await getActionsApi({
        ...activeFilters,
        page: nextPage,
        size: activePageSize,
        sort: `createdAt,${direction}`,
      })
      setRows(data.content || data)
      setPage(nextPage)
      setPageSize(activePageSize)
      setAppliedFilters(activeFilters)
      setSortDirection(direction)
      setTotalPages(data.totalPages || 1)
      setTotalElements(data.totalElements ?? (Array.isArray(data) ? data.length : undefined))
    } catch {
      setError('Không thể tải lịch sử điều khiển. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDevicesApi()
      .then((data) => setDevices(data.content || data))
      .catch(() => setError('Không thể tải danh sách thiết bị. Vui lòng tải lại trang.'))
    loadData(0, INITIAL_FILTERS)
  }, [])

  const handleChange = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  const handleSearch = (event) => {
    event.preventDefault()
    loadData(0, filters)
  }

  const handlePageSizeChange = (nextPageSize) => {
    loadData(0, appliedFilters, nextPageSize)
  }

  const toggleTimeSort = () => {
    const nextDirection = sortDirection === 'asc' ? 'desc' : 'asc'
    loadData(0, appliedFilters, pageSize, nextDirection)
  }

  return (
    <div className="content-page">
      <form className="filter-box action-filter" onSubmit={handleSearch}>
        <div className="filter-field search-field">
          <Icon name="search" size={18} />
          <input
            type="search"
            aria-label="Tìm theo thời gian"
            value={filters.keyword}
            onChange={(event) => handleChange('keyword', event.target.value)}
            placeholder="Nhập thời gian..."
            autoComplete="off"
          />
        </div>

        <div className="filter-field">
          <select
            aria-label="Thiết bị"
            value={filters.deviceId}
            onChange={(event) => handleChange('deviceId', event.target.value)}
          >
            <option value="">Thiết bị</option>
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <select
            aria-label="Hành động"
            value={filters.action}
            onChange={(event) => handleChange('action', event.target.value)}
          >
            <option value="">Hành động</option>
            <option value="ON">Bật</option>
            <option value="OFF">Tắt</option>
          </select>
        </div>

        <div className="filter-field">
          <select
            aria-label="Trạng thái"
            value={filters.status}
            onChange={(event) => handleChange('status', event.target.value)}
          >
            <option value="">Trạng thái</option>
            <option value="SUCCESS">Thành công</option>
            <option value="FAILED">Thất bại</option>
            <option value="PROCESSING">Đang xử lý</option>
          </select>
        </div>

        <div className="filter-buttons">
          <button className="primary-btn" type="submit" disabled={loading}>
            <Icon name="refresh" size={16} />
            {loading ? 'Đang tải...' : 'Tải lại'}
          </button>
        </div>
      </form>

      {error && (
        <p className="history-load-error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <Loading />
      ) : (
        <DataTable
          columns={[
            'STT',
            'Người thực hiện',
            'Thiết bị',
            'Hành động',
            'Trạng thái',
            { key: 'time', label: 'Thời gian', direction: sortDirection, onSort: toggleTimeSort },
          ]}
          label="Lịch sử điều khiển"
        >
          {rows.length === 0 ? (
            <EmptyState colSpan={6} />
          ) : (
            rows.map((row, index) => (
              <tr key={row.id}>
                <td>{page * pageSize + index + 1}</td>
                <td>{row.username || row.userName || row.user?.username || '--'}</td>
                <td>{row.deviceName || row.device?.name || '--'}</td>
                <td>
                  <span className={`table-tag ${String(row.action).toLowerCase()}`}>
                    {ACTION_LABELS[String(row.action).toUpperCase()] || row.action || '--'}
                  </span>
                </td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td>{formatDate(row.createdAt || row.time)}</td>
              </tr>
            ))
          )}
        </DataTable>
      )}

      <TableFooter
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        totalElements={totalElements}
        rowCount={rows.length}
        loading={loading}
        onChange={(nextPage) => loadData(nextPage)}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  )
}
