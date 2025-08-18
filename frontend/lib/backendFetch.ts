import { cookies, headers } from 'next/headers'
import 'server-only'

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') + '/api'

export async function backendFetch(path: string, init: RequestInit = {}) {
  const cookieStore = await cookies()
  const hdrs = await headers()
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ')

  const mergedHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...Object.fromEntries(Object.entries(init.headers || {}).map(([k, v]) => [k, String(v)])),
  }
  if (cookieHeader) mergedHeaders.Cookie = cookieHeader
  // Optional: propagate useful request headers
  const ua = hdrs.get('user-agent')
  if (ua && !mergedHeaders['User-Agent']) mergedHeaders['User-Agent'] = ua

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...init,
    headers: mergedHeaders,
    cache: 'no-store'
  })

  return res.json()



}

