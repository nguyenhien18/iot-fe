import { useCallback, useEffect, useState } from 'react'
import MetricCard from './components/MetricCard'
import SensorChart from './components/SensorChart'
import Toggle from '../../components/common/Toggle'
import Loading from '../../components/common/Loading'
import {
  controlDeviceApi,
  getChartDataApi,
  getDevicesApi,
  getLatestSensorsApi,
} from '../../api/apiService'

const METRICS = [
  { key: 'temperature', label: 'Nhiệt độ', unit: '°C', note: 'Nhiệt độ phòng hiện tại' },
  { key: 'humidity', label: 'Độ ẩm', unit: '%', note: 'Độ ẩm phòng hiện tại' },
  { key: 'light', label: 'Ánh sáng', unit: ' lux', note: 'Cường độ ánh sáng' },
]

export default function OverviewPage() {
  const [sensors, setSensors] = useState({ temperature: null, humidity: null, light: null })
  const [chartData, setChartData] = useState([])
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState([])
  const [bulkAction, setBulkAction] = useState('')
  const [controlError, setControlError] = useState('')
  const isProcessing = processingIds.length > 0
  const activeDeviceCount = devices.filter((device) => device.status === 'ON').length
  const allOn = devices.length > 0 && devices.every((device) => device.status === 'ON')
  const allOff = devices.length > 0 && devices.every((device) => device.status === 'OFF')

  const loadSensors = useCallback(async () => {
    const data = await getLatestSensorsApi()
    setSensors(data)
  }, [])

  const loadDevices = useCallback(async () => {
    const data = await getDevicesApi()
    setDevices(data.content || data)
  }, [])

  const loadChart = useCallback(async () => {
    const raw = await getChartDataApi()
    setChartData(
      (raw.content || raw).map((item) => ({
        ...item,
        timeLabel: new Date(item.time || item.createdAt).toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      })),
    )
  }, [])

  useEffect(() => {
    Promise.all([loadSensors(), loadDevices(), loadChart()]).finally(() => setLoading(false))

    const sensorTimer = setInterval(loadSensors, 2000)
    const chartTimer = setInterval(loadChart, 5000)

    return () => {
      clearInterval(sensorTimer)
      clearInterval(chartTimer)
    }
  }, [loadSensors, loadDevices, loadChart])

  const handleControl = async (targetDevices, action, bulk = false) => {
    if (isProcessing || targetDevices.length === 0) return

    setProcessingIds(targetDevices.map((device) => device.id))
    setBulkAction(bulk ? action : '')
    setControlError('')

    try {
      const results = await Promise.allSettled(
        targetDevices.map((device) => controlDeviceApi(device.id, action)),
      )
      await loadDevices()

      const failedCount = results.filter((result) => result.status === 'rejected').length
      if (failedCount > 0) {
        setControlError(`Không thể điều khiển ${failedCount} thiết bị. Vui lòng thử lại.`)
      }
    } catch (error) {
      console.error(error)
      setControlError('Không thể cập nhật trạng thái thiết bị. Vui lòng tải lại trang.')
    } finally {
      setProcessingIds([])
      setBulkAction('')
    }
  }

  const handleToggle = (device) => {
    const action = device.status === 'ON' ? 'OFF' : 'ON'
    handleControl([device], action)
  }

  const handleAll = (action) => {
    const targetDevices = devices.filter((device) => device.status !== action)
    handleControl(targetDevices, action, true)
  }

  if (loading) return <Loading text="Đang tải trang tổng quan..." />

  return (
    <div className="dashboard-page">
      <section aria-label="Thông tin tổng quan">
        <div className="summary-strip">
          {METRICS.map((metric) => (
            <MetricCard
              key={metric.key}
              label={metric.label}
              value={sensors[metric.key]}
              unit={metric.unit}
              note={metric.note}
              icon={metric.key}
            />
          ))}
        </div>
      </section>

      <div className="dashboard-grid">
        <SensorChart data={chartData} />
        <section className="device-panel" aria-labelledby="device-panel-title">
          <div className="device-panel-body">
            <div className="device-panel-heading">
              <h2 className="chart-title" id="device-panel-title">
                Điều khiển thiết bị
              </h2>
              <p className="device-active-count" role="status">
                {activeDeviceCount}/{devices.length} đang hoạt động
              </p>
            </div>
            <div className="device-actions">
              <button
                className="primary-btn"
                type="button"
                disabled={isProcessing || devices.length === 0 || allOn}
                onClick={() => handleAll('ON')}
              >
                {bulkAction === 'ON' ? 'Đang bật...' : 'Bật tất cả'}
              </button>
              <button
                className="ghost-btn"
                type="button"
                disabled={isProcessing || devices.length === 0 || allOff}
                onClick={() => handleAll('OFF')}
              >
                {bulkAction === 'OFF' ? 'Đang tắt...' : 'Tắt tất cả'}
              </button>
            </div>

            {controlError && (
              <p className="device-error" role="alert">
                {controlError}
              </p>
            )}

            <div className="device-list" aria-busy={isProcessing}>
              {devices.length === 0 && <p className="device-empty">Chưa có thiết bị.</p>}
              {devices.map((device) => {
                const processing = processingIds.includes(device.id)
                const on = device.status === 'ON'

                return (
                  <div className="device-row" key={device.id}>
                    <div>
                      <strong>{device.name}</strong>
                      <small>{processing ? 'Đang xử lý...' : device.status}</small>
                    </div>

                    <Toggle
                      on={on}
                      disabled={isProcessing}
                      onChange={() => handleToggle(device)}
                      label={`${on ? 'Tắt' : 'Bật'} ${device.name}`}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
