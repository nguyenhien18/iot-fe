import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const SENSOR_SERIES = [
  { key: 'temperature', label: 'Nhiệt độ', unit: ' °C', color: '#2563eb', axis: 'climate' },
  { key: 'humidity', label: 'Độ ẩm', unit: ' %', color: '#16a34a', axis: 'climate' },
  { key: 'light', label: 'Ánh sáng', unit: ' lux', color: '#d08b12', axis: 'light' },
]

export default function SensorChart({ data = [] }) {
  const chartData = data.filter((item) => SENSOR_SERIES.some((series) => item[series.key] != null))

  return (
    <section className="chart-card" aria-labelledby="sensor-chart-title">
      <div className="chart-inner">
        <h2 className="chart-title" id="sensor-chart-title">
          Dữ liệu cảm biến
        </h2>
        {chartData.length === 0 ? (
          <div className="chart-empty">Chưa có dữ liệu cảm biến.</div>
        ) : (
          <>
            <div className="chart-axis-labels" aria-hidden="true">
              <span>°C / %</span>
              <span>lux</span>
            </div>
            <div className="chart-plot">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#e5e7eb" vertical={false} />
                  <XAxis
                    dataKey="timeLabel"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#64748b' }}
                    minTickGap={24}
                  />
                  <YAxis
                    yAxisId="climate"
                    domain={[0, 'auto']}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#64748b' }}
                    width={36}
                  />
                  <YAxis
                    yAxisId="light"
                    orientation="right"
                    domain={[0, 'auto']}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#a56c0a' }}
                    width={44}
                  />
                  <Tooltip />
                  <Legend />
                  {SENSOR_SERIES.map((series) => (
                    <Line
                      key={series.key}
                      type="monotone"
                      dataKey={series.key}
                      name={series.label}
                      unit={series.unit}
                      yAxisId={series.axis}
                      stroke={series.color}
                      strokeWidth={2.5}
                      dot={false}
                      connectNulls={false}
                      isAnimationActive={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
