import { useEffect, useMemo, useState } from 'react'
import DataTable, { EmptyState, TableFooter } from '../../components/common/DataTable'
import Icon from '../../components/common/Icon'
import { formatDate, matchesTimeText } from '../../utils/dateTime'
import { getSensorLabel } from '../../utils/sensorLabels'
import Loading from '../../components/common/Loading'
import { getSensorHistoryApi, getSensorsApi } from '../../api/apiService'

const API_PAGE_SIZE = 100

async function loadAllSensorRows() {
  const firstPage = await getSensorHistoryApi({ page: 0, size: API_PAGE_SIZE })
  const rows = [...(firstPage.content || firstPage)]
  const totalPages = firstPage.totalPages || 1

  if (totalPages <= 1) return rows

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getSensorHistoryApi({ page: index + 1, size: API_PAGE_SIZE }),
    ),
  )

  return rows.concat(...remainingPages.map((page) => page.content || page))
}

function getSensorName(row) {
  return row.sensorName || row.sensor?.name || ''
}

function getSensorTime(row) {
  return row.createdAt || row.timestamp || row.time
}

function formatSensorValue(row) {
  const value = row.value ?? '--'
  const sensorName = String(getSensorName(row)).toLowerCase()

  if (value === '--') return value
  if (sensorName === 'temperature') return `${value} °C`
  if (sensorName === 'humidity') return `${value} %`
  if (sensorName === 'light') return `${value} Lux`
  return value
}

export default function SensorHistoryPage() {
  const [sensors, setSensors] = useState([])
  const [sensorRows, setSensorRows] = useState([])
  const [searchField, setSearchField] = useState('all')
  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState(null)
  const [sortDirection, setSortDirection] = useState('desc')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      try {
        const [sensorData, historyData] = await Promise.all([getSensorsApi(), loadAllSensorRows()])
        if (cancelled) return

        setSensors(sensorData.content || sensorData)
        setSensorRows(historyData)
      } catch {
        if (!cancelled) {
          setError('Không thể tải dữ liệu cảm biến. Vui lòng tải lại trang.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadData()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredRows = useMemo(() => {
    if (!appliedSearch) return sensorRows

    const { field, value } = appliedSearch
    if (field === 'time') {
      return sensorRows.filter((row) => matchesTimeText(row, value))
    }

    if (field === 'all') {
      const keyword = value.toLocaleLowerCase('vi')
      return sensorRows.filter((row) => {
        const searchableValues = [
          getSensorName(row),
          getSensorLabel(getSensorName(row)),
          row.value,
        ]

        return (
          searchableValues.some((item) =>
            String(item ?? '').toLocaleLowerCase('vi').includes(keyword),
          ) || matchesTimeText(row, value)
        )
      })
    }

    const sensorId = field.replace('sensor-', '')
    const valueKeyword = value.replace(',', '.')
    return sensorRows.filter(
      (row) =>
        String(row.sensorId ?? row.sensor?.id) === sensorId &&
        (!valueKeyword || String(row.value ?? '').includes(valueKeyword)),
    )
  }, [sensorRows, appliedSearch])

  const sortedRows = useMemo(
    () =>
      [...filteredRows].sort((firstRow, secondRow) => {
        const comparison = new Date(getSensorTime(firstRow)) - new Date(getSensorTime(secondRow))
        return sortDirection === 'asc' ? comparison : -comparison
      }),
    [filteredRows, sortDirection],
  )

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const visibleRows = sortedRows.slice(page * pageSize, (page + 1) * pageSize)

  const handleFieldChange = (event) => {
    setSearchField(event.target.value)
    setSearchInput('')
    setAppliedSearch(null)
    setPage(0)
  }

  const handleSearch = (event) => {
    event.preventDefault()
    const value = searchInput.trim()

    setAppliedSearch({ field: searchField, value })
    setPage(0)
  }

  const toggleTimeSort = () => {
    setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
    setPage(0)
  }

  const handlePageSizeChange = (nextPageSize) => {
    setPageSize(nextPageSize)
    setPage(0)
  }

  const isAll = searchField === 'all'
  const isTime = searchField === 'time'
  let searchPlaceholder = 'Nhập giá trị cần tìm...'
  if (isAll) searchPlaceholder = 'Nhập nội dung cần tìm...'
  if (isTime) searchPlaceholder = 'VD: 10:45 hoặc 18/08/2026 10:45'

  return (
    <div className="content-page">
      <form className="filter-box sensor-filter" onSubmit={handleSearch}>
        <div className="filter-field">
          <select
            aria-label="Chọn trường tìm kiếm"
            value={searchField}
            onChange={handleFieldChange}
            disabled={loading}
          >
            <option value="all">Tất cả</option>
            {sensors.map((sensor) => (
              <option key={sensor.id} value={`sensor-${sensor.id}`}>
                {getSensorLabel(sensor.name)}
              </option>
            ))}
            <option value="time">Thời gian</option>
          </select>
        </div>

        <div className="sensor-search-control">
          <div className="filter-field search-field">
            <Icon name="search" size={18} />
            <input
              type={isAll || isTime ? 'text' : 'number'}
              step={isAll || isTime ? undefined : 'any'}
              aria-label={
                isTime
                  ? 'Nhập thời gian cần tìm'
                  : isAll
                    ? 'Nhập nội dung cần tìm'
                    : 'Nhập giá trị cảm biến'
              }
              aria-describedby={isTime ? 'sensor-time-hint' : undefined}
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={searchPlaceholder}
              disabled={loading}
              autoComplete="off"
            />
          </div>
          {isTime && (
            <small className="sensor-time-hint" id="sensor-time-hint">
              Định dạng: HH:mm, HH:mm:ss hoặc DD/MM/YYYY HH:mm.
            </small>
          )}
        </div>

        <div className="filter-buttons">
          <button className="primary-btn" type="submit" disabled={loading}>
            <Icon name="search" size={16} />
            {loading ? 'Đang tải...' : 'Tìm'}
          </button>
        </div>
      </form>

      {error && (
        <p className="sensor-load-error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <Loading />
      ) : (
        <DataTable
          columns={[
            'STT',
            'Loại cảm biến',
            'Giá trị',
            { key: 'time', label: 'Thời gian', direction: sortDirection, onSort: toggleTimeSort },
          ]}
          label="Dữ liệu cảm biến"
        >
          {visibleRows.length === 0 ? (
            <EmptyState colSpan={4} />
          ) : (
            visibleRows.map((row, index) => (
              <tr key={row.id}>
                <td>{page * pageSize + index + 1}</td>
                <td>
                  <span className={`sensor-type ${String(getSensorName(row)).toLowerCase()}`}>
                    {getSensorLabel(getSensorName(row))}
                  </span>
                </td>
                <td>{formatSensorValue(row)}</td>
                <td>{formatDate(getSensorTime(row))}</td>
              </tr>
            ))
          )}
        </DataTable>
      )}

      <TableFooter
        page={page}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 20]}
        totalPages={totalPages}
        totalElements={filteredRows.length}
        rowCount={visibleRows.length}
        loading={loading}
        onChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  )
}
