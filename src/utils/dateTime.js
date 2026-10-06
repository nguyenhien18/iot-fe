export function formatDate(value) {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}

function normalizeTimeText(value) {
  return String(value ?? '')
    .trim()
    .replace(/,\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('vi')
}

export function matchesTimeText(row, query) {
  const keyword = normalizeTimeText(query)
  if (!keyword) return true

  const timestamp = row.createdAt || row.timestamp || row.time || ''
  const date = new Date(timestamp)
  const searchableValues = [timestamp, String(timestamp).replace('T', ' '), formatDate(timestamp)]

  if (!Number.isNaN(date.getTime())) {
    const localDate = date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    const localTime = date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    searchableValues.push(date.toLocaleString('vi-VN'), `${localDate} ${localTime}`)
  }

  return searchableValues.some((value) => normalizeTimeText(value).includes(keyword))
}
