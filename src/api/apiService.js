import axiosClient from './axiosClient'
import { matchesTimeText } from '../utils/dateTime'
import {
  mockActions,
  mockControlDevice,
  mockDevices,
  mockLatestSensors,
  mockSensorData,
  mockSensors,
} from '../mocks/iotData'

const useMock = String(import.meta.env.VITE_USE_MOCK ?? 'true') === 'true'

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

function createRequestParams(params) {
  const requestParams = { ...params }

  if (requestParams.date) {
    requestParams.from = `${requestParams.date}T00:00:00`
    requestParams.to = `${requestParams.date}T23:59:59.999`
    delete requestParams.date
  }

  return requestParams
}

function filterRowsByDate(rows, date) {
  if (!date) return rows

  const [year, month, day] = date.split('-').map(Number)
  const startOfDay = new Date(year, month - 1, day).getTime()
  const startOfNextDay = new Date(year, month - 1, day + 1).getTime()

  return rows.filter((row) => {
    const createdAt = new Date(row.createdAt).getTime()
    return createdAt >= startOfDay && createdAt < startOfNextDay
  })
}

function pageResult(items, page = 0, size = 10) {
  const start = page * size
  return {
    content: items.slice(start, start + size),
    page,
    size,
    totalElements: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / size)),
  }
}

export async function loginApi(payload) {
  if (!useMock) {
    return (await axiosClient.post('/api/auth/login', payload)).data
  }

  await delay()

  if (payload.username === 'Nguyễn Văn Hiển' && payload.password === '123456') {
    return { token: 'mock-jwt-token', username: payload.username }
  }

  throw new Error('INVALID_CREDENTIALS')
}

export async function getLatestSensorsApi() {
  if (!useMock) {
    return (await axiosClient.get('/api/sensors/latest')).data
  }

  await delay(80)
  return mockLatestSensors()
}

export async function getSensorsApi() {
  if (!useMock) {
    return (await axiosClient.get('/api/sensors')).data
  }

  await delay()
  return [...mockSensors]
}

export async function getSensorHistoryApi(params = {}) {
  if (!useMock) {
    const requestParams = createRequestParams(params)
    return (await axiosClient.get('/api/data-sensors', { params: requestParams })).data
  }

  await delay()

  let rows = [...mockSensorData]

  if (params.sensorId) {
    rows = rows.filter((row) => row.sensorId === Number(params.sensorId))
  }

  rows = filterRowsByDate(rows, params.date)

  const sort = params.sort || 'createdAt,desc'
  rows.sort((a, b) => {
    if (sort === 'createdAt,asc') return new Date(a.createdAt) - new Date(b.createdAt)
    if (sort === 'value,asc') return a.value - b.value
    if (sort === 'value,desc') return b.value - a.value
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  return pageResult(rows, Number(params.page || 0), Number(params.size || 10))
}

export async function getChartDataApi() {
  if (!useMock) {
    return (await axiosClient.get('/api/data-sensors/chart')).data
  }

  await delay()

  const grouped = {}
  for (const row of [...mockSensorData].reverse()) {
    const key = row.createdAt.slice(0, 16)
    grouped[key] ??= {
      time: row.createdAt,
      temperature: null,
      humidity: null,
      light: null,
    }
    if (row.sensorName === 'Temperature') {
      grouped[key].temperature = row.value
    }
    if (row.sensorName === 'Humidity') {
      grouped[key].humidity = row.value
    }
    if (row.sensorName === 'Light') {
      grouped[key].light = row.value
    }
  }

  return Object.values(grouped).slice(-12)
}

export async function getDevicesApi() {
  if (!useMock) {
    return (await axiosClient.get('/api/devices')).data
  }

  await delay()
  return mockDevices.map((item) => ({ ...item }))
}

export async function controlDeviceApi(id, action) {
  if (!useMock) {
    return (await axiosClient.post(`/api/devices/${id}/control`, { action })).data
  }

  const username = localStorage.getItem('username') || 'Nguyễn Văn Hiển'
  return mockControlDevice(id, action, username)
}

export async function getActionsApi(params = {}) {
  if (!useMock) {
    const requestParams = createRequestParams(params)
    return (await axiosClient.get('/api/actions', { params: requestParams })).data
  }

  await delay()

  let rows = [...mockActions]

  if (params.deviceId) {
    rows = rows.filter((row) => row.deviceId === Number(params.deviceId))
  }
  if (params.action) {
    rows = rows.filter((row) => row.action === params.action)
  }
  if (params.status) {
    rows = rows.filter((row) => row.status === params.status)
  }
  if (params.keyword) {
    rows = rows.filter((row) => matchesTimeText(row, params.keyword))
  }

  rows = filterRowsByDate(rows, params.date)

  rows.sort((a, b) => {
    const comparison = new Date(a.createdAt) - new Date(b.createdAt)
    return params.sort === 'createdAt,asc' ? comparison : -comparison
  })
  return pageResult(rows, Number(params.page || 0), Number(params.size || 10))
}
