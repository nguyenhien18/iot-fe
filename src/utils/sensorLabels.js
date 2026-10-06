const SENSOR_LABELS = {
  temperature: 'Nhiệt độ',
  humidity: 'Độ ẩm',
  light: 'Ánh sáng',
}

export function getSensorLabel(sensorName) {
  const key = String(sensorName || '').toLowerCase()
  return SENSOR_LABELS[key] || sensorName || '--'
}
