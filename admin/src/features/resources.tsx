import type { ReactNode } from 'react'
import { Star } from 'lucide-react'
import { StatusBadge } from '../components/ui'
import type { Perm } from '../lib/auth'
import type { Row } from '../mock/data'

export interface RowAction { en: string; ur: string; from: string[]; to: string; reason?: boolean; danger?: boolean }
export interface ResourceCfg {
  key: string; nav: string; perm: Perm
  cols: { key: string; label: string; render?: (r: Row) => ReactNode }[]
  statuses?: string[]; actions?: RowAction[]
}

const badge = (r: Row) => <StatusBadge value={String(r.status)} />
const money = (r: Row) => <span dir="ltr">PKR {Number(r.amount).toLocaleString('en-PK')}</span>
const stars = (r: Row) => <span className="inline-flex items-center gap-1" dir="ltr"><Star size={14} className="fill-star text-star" />{String(r.rating)}</span>
const ltr = (k: string) => (r: Row) => <span dir="ltr">{String(r[k])}</span>

export const RESOURCES: ResourceCfg[] = [
  { key: 'doctors', nav: 'doctors', perm: 'read', statuses: ['APPROVED', 'PENDING', 'REJECTED', 'SUSPENDED'],
    cols: [{ key: 'name', label: 'common.name' }, { key: 'specialty', label: 'common.specialty' }, { key: 'city', label: 'common.city' }, { key: 'rating', label: 'common.rating', render: stars }, { key: 'status', label: 'common.status', render: badge }],
    actions: [{ en: 'Suspend', ur: 'معطل کریں', from: ['APPROVED'], to: 'SUSPENDED', reason: true, danger: true }, { en: 'Reactivate', ur: 'بحال کریں', from: ['SUSPENDED'], to: 'APPROVED' }] },
  { key: 'patients', nav: 'patients', perm: 'read', statuses: ['ACTIVE', 'BLOCKED'],
    cols: [{ key: 'name', label: 'common.name' }, { key: 'email', label: 'cols.email', render: ltr('email') }, { key: 'city', label: 'common.city' }, { key: 'bookings', label: 'cols.bookings' }, { key: 'status', label: 'common.status', render: badge }],
    actions: [{ en: 'Block', ur: 'بلاک کریں', from: ['ACTIVE'], to: 'BLOCKED', reason: true, danger: true }, { en: 'Unblock', ur: 'بحال کریں', from: ['BLOCKED'], to: 'ACTIVE' }] },
  { key: 'appointments', nav: 'appointments', perm: 'read', statuses: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
    cols: [{ key: 'id', label: 'cols.id' }, { key: 'doctor', label: 'cols.doctor' }, { key: 'patient', label: 'cols.patient' }, { key: 'date', label: 'common.date', render: ltr('date') }, { key: 'type', label: 'cols.type' }, { key: 'amount', label: 'common.amount', render: money }, { key: 'status', label: 'common.status', render: badge }],
    actions: [{ en: 'Force cancel', ur: 'منسوخ کریں', from: ['PENDING', 'CONFIRMED'], to: 'CANCELLED', reason: true, danger: true }] },
  { key: 'payments', nav: 'payments', perm: 'read', statuses: ['PAID', 'FAILED', 'REFUNDED'],
    cols: [{ key: 'id', label: 'cols.id' }, { key: 'patient', label: 'cols.patient' }, { key: 'channel', label: 'cols.channel' }, { key: 'date', label: 'common.date', render: ltr('date') }, { key: 'amount', label: 'common.amount', render: money }, { key: 'status', label: 'common.status', render: badge }],
    actions: [{ en: 'Refund', ur: 'رقم واپس', from: ['PAID'], to: 'REFUNDED', reason: true, danger: true }] },
  { key: 'reviews', nav: 'reviews', perm: 'read', statuses: ['VISIBLE', 'HIDDEN'],
    cols: [{ key: 'patient', label: 'cols.patient' }, { key: 'doctor', label: 'cols.doctor' }, { key: 'rating', label: 'common.rating', render: stars }, { key: 'text', label: 'cols.text' }, { key: 'reports', label: 'cols.reports' }, { key: 'status', label: 'common.status', render: badge }],
    actions: [{ en: 'Hide', ur: 'چھپائیں', from: ['VISIBLE'], to: 'HIDDEN', reason: true, danger: true }, { en: 'Unhide', ur: 'دکھائیں', from: ['HIDDEN'], to: 'VISIBLE' }] },
  { key: 'specialties', nav: 'specialties', perm: 'read', statuses: ['ACTIVE', 'DRAFT'],
    cols: [{ key: 'name', label: 'common.name' }, { key: 'doctors', label: 'nav.doctors' }, { key: 'status', label: 'common.status', render: badge }],
    actions: [{ en: 'Deactivate', ur: 'غیر فعال', from: ['ACTIVE'], to: 'DRAFT' }, { en: 'Activate', ur: 'فعال کریں', from: ['DRAFT'], to: 'ACTIVE' }] },
  { key: 'cities', nav: 'cities', perm: 'read', cols: [{ key: 'name', label: 'common.name' }, { key: 'doctors', label: 'nav.doctors' }, { key: 'radius', label: 'cols.value' }, { key: 'status', label: 'common.status', render: badge }] },
  { key: 'banners', nav: 'banners', perm: 'read', statuses: ['PUBLISHED', 'SCHEDULED', 'DRAFT'],
    cols: [{ key: 'title', label: 'cols.title' }, { key: 'code', label: 'cols.code' }, { key: 'date', label: 'common.date', render: ltr('date') }, { key: 'status', label: 'common.status', render: badge }],
    actions: [{ en: 'Publish', ur: 'شائع کریں', from: ['DRAFT', 'SCHEDULED'], to: 'PUBLISHED' }, { en: 'Unpublish', ur: 'واپس لیں', from: ['PUBLISHED'], to: 'DRAFT' }] },
  { key: 'broadcasts', nav: 'broadcasts', perm: 'read', cols: [{ key: 'title', label: 'cols.title' }, { key: 'channel', label: 'cols.channel' }, { key: 'segment', label: 'cols.segment' }, { key: 'delivered', label: 'cols.delivered' }, { key: 'status', label: 'common.status', render: badge }] },
  { key: 'chats', nav: 'chats', perm: 'support', cols: [{ key: 'id', label: 'cols.id' }, { key: 'patient', label: 'cols.patient' }, { key: 'doctor', label: 'cols.doctor' }, { key: 'reports', label: 'cols.reports' }, { key: 'status', label: 'common.status', render: badge }] },
  { key: 'tickets', nav: 'tickets', perm: 'support', statuses: ['OPEN', 'IN_PROGRESS', 'CLOSED'],
    cols: [{ key: 'id', label: 'cols.id' }, { key: 'title', label: 'cols.title' }, { key: 'patient', label: 'cols.patient' }, { key: 'priority', label: 'cols.priority' }, { key: 'status', label: 'common.status', render: badge }],
    actions: [{ en: 'Close', ur: 'بند کریں', from: ['OPEN', 'IN_PROGRESS'], to: 'CLOSED' }, { en: 'Reopen', ur: 'دوبارہ کھولیں', from: ['CLOSED'], to: 'OPEN' }] },
  { key: 'content', nav: 'content', perm: 'read', cols: [{ key: 'title', label: 'cols.title' }, { key: 'value', label: 'cols.value' }, { key: 'date', label: 'common.date', render: ltr('date') }, { key: 'status', label: 'common.status', render: badge }] },
  { key: 'admins', nav: 'admins', perm: 'admins', cols: [{ key: 'name', label: 'common.name' }, { key: 'email', label: 'cols.email', render: ltr('email') }, { key: 'role', label: 'cols.role' }, { key: 'status', label: 'common.status', render: badge }] },
  { key: 'audit', nav: 'audit', perm: 'audit', cols: [{ key: 'time', label: 'cols.time', render: ltr('time') }, { key: 'by', label: 'cols.by' }, { key: 'action', label: 'cols.action' }, { key: 'ip', label: 'cols.ip', render: ltr('ip') }] },
  { key: 'reports', nav: 'reports', perm: 'read', cols: [{ key: 'metric', label: 'cols.metric' }, { key: 'period', label: 'cols.period' }, { key: 'value', label: 'cols.value', render: (r) => <span dir="ltr">{Number(r.value).toLocaleString('en-PK')}</span> }] },
]
