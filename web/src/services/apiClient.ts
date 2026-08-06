// 统一请求层（T06）：Mock 开关 + axios + 统一信封解析 + 错误态（原则 10 P0/P2）
// 组件只依赖 service，Mock/真实对组件透明（原则 2 数据分离）
import axios from 'axios'
import type { ApiEnvelope } from '../types'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000'

const http = axios.create({ baseURL: BASE, timeout: 8000 })

// 模拟网络延迟，便于验证 loading/error 态（T04 4.4）
function delay<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

// 统一解析信封：code!=0 抛错，由调用方进入错误态
async function unwrap<T>(p: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  const res = await p
  if (res.data.code !== 0) throw new Error(res.data.message || '请求失败')
  return res.data.data
}

export const apiClient = {
  useMock: USE_MOCK,
  // 真实请求：GET /api/*
  async get<T>(path: string): Promise<T> {
    if (USE_MOCK) throw new Error('Mock 模式不应走真实请求')
    return unwrap<T>(http.get(`/api${path}`))
  },
  async post<T>(path: string, body: unknown): Promise<T> {
    if (USE_MOCK) throw new Error('Mock 模式不应走真实请求')
    return unwrap<T>(http.post(`/api${path}`, body))
  },
  // Mock 取值：直接返回本地 JSON（带延迟）
  async mock<T>(data: T): Promise<T> {
    return delay(data)
  },
}
