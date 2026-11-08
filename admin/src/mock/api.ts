import * as d from './data'
import type { Row } from './data'

const wait = <T,>(v: T, ms = 250) => new Promise<T>((r) => setTimeout(() => r(v), ms))

export const TABLES: Record<string, Row[]> = {
  doctors: d.doctors, patients: d.patients, appointments: d.appointments, payments: d.payments,
  reviews: d.reviews, specialties: d.specialties, cities: d.cities, banners: d.banners,
  broadcasts: d.broadcasts, chats: d.chats, tickets: d.tickets, content: d.content,
  admins: d.admins, audit: d.audit, reports: d.reports,
}

export interface ListQuery { page: number; limit: number; q: string; sort?: string; dir?: 'asc' | 'desc'; status?: string }
export interface ListResult { rows: Row[]; total: number }

export function listAll(key: string, qy: Omit<ListQuery, 'page' | 'limit'>): Row[] {
  let rows = [...(TABLES[key] ?? [])]
  if (qy.status) rows = rows.filter((r) => r.status === qy.status)
  if (qy.q) {
    const n = qy.q.toLowerCase()
    rows = rows.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(n)))
  }
  if (qy.sort) {
    const k = qy.sort, m = qy.dir === 'desc' ? -1 : 1
    rows.sort((a, b) => (a[k]! > b[k]! ? 1 : a[k]! < b[k]! ? -1 : 0) * m)
  }
  return rows
}

export function listResource(key: string, qy: ListQuery): Promise<ListResult> {
  const rows = listAll(key, qy)
  return wait({ rows: rows.slice((qy.page - 1) * qy.limit, qy.page * qy.limit), total: rows.length })
}

export function setStatus(key: string, id: string, status: string) {
  const r = TABLES[key]?.find((x) => x.id === id)
  if (r) r.status = status
  return wait(r)
}

export const pendingDoctors = () =>
  wait(d.doctors.filter((x) => x.status === 'PENDING').sort((a, b) => a.submitted.localeCompare(b.submitted)))

export function decideDoctor(id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING', audit: string) {
  const r = d.doctors.find((x) => x.id === id)
  if (r) r.status = status
  d.audit.unshift({ id: `AU${Date.now()}`, by: 'You', action: audit, time: new Date().toISOString().replace('T', ' ').slice(0, 16), ip: '127.0.0.1' })
  return wait(r)
}

export const dashboard = () =>
  wait({
    kpis: {
      patients: d.patients.length * 120, doctors: d.doctors.filter((x) => x.status === 'APPROVED').length,
      pending: d.doctors.filter((x) => x.status === 'PENDING').length, today: 142, month: 3860, revenue: 9_840_000, cancel: 6.4,
    },
    trend: d.trend, cities: d.cityBookings, specialties: d.topSpecialties, feed: d.feed,
  })
