import Icon from './Icon'

const STATUS_LABELS = {
  SUCCESS: 'Thành công',
  FAILED: 'Thất bại',
  PROCESSING: 'Đang xử lý',
}

export function DataTableHead({ columns }) {
  return (
    <thead>
      <tr>
        {columns.map((column) => {
          const config = typeof column === 'string' ? { key: column, label: column } : column
          const sortOrder = config.direction === 'asc' ? 'ascending' : 'descending'

          return (
            <th key={config.key} aria-sort={config.onSort ? sortOrder : undefined}>
              {config.onSort ? (
                <button
                  className="table-sort-button"
                  type="button"
                  onClick={config.onSort}
                  aria-label={
                    config.direction === 'asc'
                      ? 'Sắp xếp thời gian mới nhất trước'
                      : 'Sắp xếp thời gian cũ nhất trước'
                  }
                >
                  {config.label}
                  <span aria-hidden="true">{config.direction === 'asc' ? '↑' : '↓'}</span>
                </button>
              ) : (
                config.label
              )}
            </th>
          )
        })}
      </tr>
    </thead>
  )
}

export function StatusBadge({ status }) {
  const statusKey = String(status ?? '').toUpperCase()

  return (
    <span className={`status-tag ${statusKey.toLowerCase()}`}>
      {STATUS_LABELS[statusKey] || status || '--'}
    </span>
  )
}

export default function DataTable({ columns, label, children }) {
  return (
    <div className="table-card">
      <div className="table-scroll">
        <table aria-label={label}>
          <DataTableHead columns={columns} />
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  )
}

export function EmptyState({ colSpan, text = 'Không có dữ liệu' }) {
  return (
    <tr>
      <td className="empty-cell" colSpan={colSpan}>
        {text}
      </td>
    </tr>
  )
}

function createPageItems(currentPage, totalPages) {
  const lastPage = Math.max(1, totalPages) - 1
  const visiblePages = new Set([0, lastPage, currentPage - 1, currentPage, currentPage + 1])

  if (currentPage < 2) visiblePages.add(2)
  if (currentPage > lastPage - 2) visiblePages.add(lastPage - 2)

  const pages = [...visiblePages]
    .filter((page) => page >= 0 && page <= lastPage)
    .sort((first, second) => first - second)

  const items = []

  pages.forEach((page, index) => {
    const previousPage = pages[index - 1]
    if (index > 0 && page - previousPage > 1) {
      items.push(`gap-${page}`)
    }
    items.push(page)
  })

  return { items, lastPage }
}

export function TableFooter({
  page,
  totalPages,
  totalElements,
  rowCount = 0,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  onPageSizeChange,
  onChange,
  loading,
}) {
  const { items, lastPage } = createPageItems(page, totalPages)
  const start = rowCount ? page * pageSize + 1 : 0
  const end = rowCount ? page * pageSize + rowCount : 0
  const totalLabel = Number.isFinite(totalElements) ? ` / ${totalElements}` : ''

  return (
    <nav className="pagination" aria-label="Phân trang">
      <div className="pagination-summary">
        <span aria-live="polite">
          Hiển thị {start}–{end}
          {totalLabel} kết quả
        </span>

        {onPageSizeChange && (
          <label className="page-size-control">
            <span>Số dòng</span>
            <select
              aria-label="Số phần tử trên một trang"
              value={pageSize}
              disabled={loading}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="pagination-controls">
        <button
          type="button"
          aria-label="Trang trước"
          disabled={loading || page <= 0}
          onClick={() => onChange(page - 1)}
        >
          <Icon name="left" size={14} />
        </button>

        {items.map((item) =>
          typeof item === 'string' ? (
            <span key={item} className="pagination-ellipsis" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-label={`Trang ${item + 1}`}
              aria-current={item === page ? 'page' : undefined}
              disabled={loading}
              onClick={() => item !== page && onChange(item)}
            >
              {item + 1}
            </button>
          ),
        )}

        <button
          type="button"
          aria-label="Trang sau"
          disabled={loading || page >= lastPage}
          onClick={() => onChange(page + 1)}
        >
          <Icon name="right" size={14} />
        </button>
      </div>
    </nav>
  )
}
