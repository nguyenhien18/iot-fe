const now = Date.now()
const ONE_DAY_MS = 24 * 60 * 60 * 1000

function getPastTime(minutesAgo) {
  return new Date(now - minutesAgo * 60 * 1000).toISOString()
}

function createAction(id, deviceId, action, status, minutesAgo, username = 'Nguyễn Văn Hiển') {
  return {
    id,
    username,
    deviceId,
    deviceName: `LED ${deviceId}`,
    action,
    status,
    createdAt: getPastTime(minutesAgo),
  }
}

function calculateJitter(sensorName, offset) {
  if (sensorName === 'Temperature') return (offset % 5) * 0.2
  if (sensorName === 'Humidity') return offset % 6
  return (offset % 8) * 6
}

export const mockSensors = [
  { id: 1, name: 'Temperature', createdAt: new Date(now - ONE_DAY_MS).toISOString() },
  { id: 2, name: 'Humidity', createdAt: new Date(now - ONE_DAY_MS).toISOString() },
  { id: 3, name: 'Light', createdAt: new Date(now - ONE_DAY_MS).toISOString() },
]

export const mockDevices = [
  { id: 1, name: 'LED 1', status: 'OFF', createdAt: getPastTime(1440) },
  { id: 2, name: 'LED 2', status: 'ON', createdAt: getPastTime(1440) },
  { id: 3, name: 'LED 3', status: 'OFF', createdAt: getPastTime(1440) },
]

const sensorNames = ['Temperature', 'Humidity', 'Light']
const baseValues = { Temperature: 29.5, Humidity: 68, Light: 520 }

export const mockSensorData = Array.from({ length: 72 }, (_, i) => {
  const sensorName = sensorNames[i % 3]
  const offset = Math.floor(i / 3)
  const jitter = calculateJitter(sensorName, offset)

  return {
    id: i + 1,
    sensorId: (i % 3) + 1,
    sensorName,
    value: Number((baseValues[sensorName] + jitter).toFixed(1)),
    createdAt: new Date(now - offset * 2 * 60 * 1000).toISOString(),
  }
})

export let mockActions = [
  createAction(1, 1, 'ON', 'SUCCESS', 20),
  createAction(2, 1, 'OFF', 'SUCCESS', 16),
  createAction(3, 2, 'ON', 'SUCCESS', 12),
  createAction(4, 2, 'OFF', 'FAILED', 8),
  createAction(5, 2, 'ON', 'SUCCESS', 4),
  createAction(6, 3, 'ON', 'SUCCESS', 28),
  createAction(7, 1, 'ON', 'SUCCESS', 32),
  createAction(8, 3, 'OFF', 'SUCCESS', 36),
  createAction(9, 2, 'OFF', 'SUCCESS', 40),
  createAction(10, 1, 'ON', 'FAILED', 44),
  createAction(11, 3, 'ON', 'SUCCESS', 48),
  createAction(12, 2, 'ON', 'SUCCESS', 52),
  createAction(13, 1, 'OFF', 'SUCCESS', 56),
  createAction(14, 3, 'OFF', 'FAILED', 60),
  createAction(15, 2, 'ON', 'SUCCESS', 64),
]

export function mockLatestSensors() {
  const latest = {}
  for (const item of mockSensorData) {
    if (latest[item.sensorName] == null) {
      latest[item.sensorName] = item
    }
  }
  return {
    temperature: latest.Temperature?.value ?? 0,
    humidity: latest.Humidity?.value ?? 0,
    light: latest.Light?.value ?? 0,
    time: new Date().toISOString(),
  }
}

export function mockControlDevice(deviceId, action, username = 'Nguyễn Văn Hiển') {
  const numericDeviceId = Number(deviceId)
  const device = mockDevices.find((item) => item.id === numericDeviceId)

  if (!device) {
    throw new Error('Device not found')
  }

  const processing = {
    id: mockActions.length + 1,
    username,
    deviceId: numericDeviceId,
    deviceName: device.name,
    action,
    status: 'PROCESSING',
    createdAt: new Date().toISOString(),
  }
  mockActions = [processing, ...mockActions]

  return new Promise((resolve) => {
    setTimeout(() => {
      device.status = action
      processing.status = 'SUCCESS'
      resolve({ ...processing, deviceStatus: device.status })
    }, 700)
  })
}
