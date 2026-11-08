// Deterministic seed data so the panel is fully demoable without a backend.
let seed = 42
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)]
const int = (a: number, b: number) => Math.floor(a + rnd() * (b - a + 1))

export const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta']
export const SPECIALTIES = ['Cardiology', 'Dermatology', 'Pediatrics', 'Gynecology', 'Orthopedics', 'ENT', 'Neurology', 'General Physician', 'Dentistry', 'Psychiatry']
const FIRST = ['Ayesha', 'Ali', 'Hassan', 'Fatima', 'Usman', 'Sana', 'Bilal', 'Hira', 'Zain', 'Maryam', 'Omar', 'Noor', 'Hamza', 'Iqra', 'Saad', 'Zara']
const LAST = ['Khan', 'Ahmed', 'Malik', 'Sheikh', 'Raza', 'Siddiqui', 'Butt', 'Qureshi', 'Chaudhry', 'Hussain']
const name = (pre = '') => `${pre}${pick(FIRST)} ${pick(LAST)}`
const daysAgo = (n: number) => new Date(Date.now() - n * 864e5).toISOString()
const dateOnly = (n: number) => daysAgo(n).slice(0, 10)

export type Row = Record<string, string | number | boolean | null> & { id: string }

export interface PendingDoctor extends Row {
  name: string; specialty: string; city: string; pmdc: string; email: string; phone: string
  fee: number; experience: number; clinic: string; submitted: string; duplicate: boolean; status: string
}

export const doctors: PendingDoctor[] = Array.from({ length: 60 }, (_, i) => ({
  id: `D${1000 + i}`, name: name('Dr. '), specialty: pick(SPECIALTIES), city: pick(CITIES),
  pmdc: `${int(10000, 99999)}-P`, email: `doctor${i}@mail.pk`, phone: `+92 3${int(0, 4)}${int(0, 9)} ${int(1000000, 9999999)}`,
  fee: int(10, 60) * 100, experience: int(2, 25), clinic: `${pick(['Shifa', 'Noor', 'City', 'Care', 'Life'])} Clinic, ${pick(CITIES)}`,
  submitted: daysAgo(int(0, 9)), duplicate: i % 11 === 0,
  status: i < 9 ? 'PENDING' : i % 13 === 0 ? 'SUSPENDED' : i % 17 === 0 ? 'REJECTED' : 'APPROVED',
  rating: +(3.5 + rnd() * 1.5).toFixed(1), bookings: int(5, 400),
}))

export const patients: Row[] = Array.from({ length: 80 }, (_, i) => ({
  id: `P${2000 + i}`, name: name(), email: `patient${i}@mail.pk`, phone: `+92 3${int(0, 4)}${int(0, 9)} ${int(1000000, 9999999)}`,
  city: pick(CITIES), joined: dateOnly(int(1, 400)), bookings: int(0, 30), status: i % 19 === 0 ? 'BLOCKED' : 'ACTIVE',
}))

export const appointments: Row[] = Array.from({ length: 120 }, (_, i) => ({
  id: `A${3000 + i}`, doctor: name('Dr. '), patient: name(), specialty: pick(SPECIALTIES), date: dateOnly(int(-5, 40)),
  type: pick(['Clinic', 'Video']), amount: int(10, 50) * 100,
  payment: pick(['PAID', 'PAID', 'PAID', 'PENDING', 'REFUNDED']),
  status: pick(['CONFIRMED', 'COMPLETED', 'COMPLETED', 'CANCELLED', 'PENDING']),
}))

export const payments: Row[] = Array.from({ length: 90 }, (_, i) => ({
  id: `TX${4000 + i}`, patient: name(), doctor: name('Dr. '), amount: int(10, 50) * 100,
  channel: pick(['JazzCash', 'Easypaisa', 'Card']), date: dateOnly(int(0, 60)),
  status: pick(['PAID', 'PAID', 'PAID', 'FAILED', 'REFUNDED']),
}))

export const reviews: Row[] = Array.from({ length: 50 }, (_, i) => ({
  id: `R${5000 + i}`, patient: name(), doctor: name('Dr. '), rating: int(1, 5),
  text: pick(['Very professional and kind.', 'Waited too long.', 'Excellent diagnosis!', 'Clean clinic, helpful staff.', 'Not satisfied with the treatment.']),
  reports: i % 7 === 0 ? int(1, 4) : 0, status: i % 9 === 0 ? 'HIDDEN' : 'VISIBLE',
}))

export const specialties: Row[] = SPECIALTIES.map((s, i) => ({ id: `S${i + 1}`, name: s, doctors: int(3, 40), status: i === 9 ? 'DRAFT' : 'ACTIVE' }))
export const cities: Row[] = CITIES.map((c, i) => ({ id: `C${i + 1}`, name: c, doctors: int(5, 80), radius: `${int(5, 25)} km`, status: 'ACTIVE' }))
export const banners: Row[] = Array.from({ length: 6 }, (_, i) => ({
  id: `B${i + 1}`, title: pick(['Eid Health Camp', '20% off first visit', 'Video consults', 'Free lab test', 'Women health week']),
  code: i % 2 ? `SAVE${int(10, 30)}` : '', status: pick(['PUBLISHED', 'SCHEDULED', 'DRAFT']), date: dateOnly(int(-10, 20)),
}))
export const broadcasts: Row[] = Array.from({ length: 12 }, (_, i) => ({
  id: `BR${i + 1}`, title: pick(['Maintenance window', 'New feature: video', 'Ramadan timings', 'Doctor onboarding']),
  channel: pick(['Push', 'SMS', 'Email']), segment: pick(['All', 'Patients', 'Doctors', 'Karachi']),
  delivered: `${int(900, 5000)}`, status: pick(['SENT', 'SENT', 'SCHEDULED']),
}))
export const chats: Row[] = Array.from({ length: 25 }, (_, i) => ({
  id: `CH${i + 1}`, patient: name(), doctor: name('Dr. '), reports: i % 6 === 0 ? int(1, 3) : 0, date: dateOnly(int(0, 20)),
  status: i % 6 === 0 ? 'PENDING' : 'CLOSED',
}))
export const tickets: Row[] = Array.from({ length: 30 }, (_, i) => ({
  id: `T${6000 + i}`, title: pick(['Payment not reflected', 'Cannot login', 'Doctor no-show', 'Refund request', 'App crash']),
  patient: name(), priority: pick(['High', 'Medium', 'Low']), status: pick(['OPEN', 'IN_PROGRESS', 'CLOSED']), date: dateOnly(int(0, 15)),
}))
export const content: Row[] = ['Terms of Service', 'Privacy Policy', 'FAQ', 'About us'].map((t, i) => ({
  id: `CT${i + 1}`, title: t, value: `v${int(1, 6)}`, date: dateOnly(int(1, 90)), status: i === 2 ? 'DRAFT' : 'PUBLISHED',
}))
export const admins: Row[] = [
  { id: 'AD1', name: 'Super Admin', email: 'admin@medicare.pk', role: 'SUPER_ADMIN', status: 'ACTIVE' },
  { id: 'AD2', name: 'Operations', email: 'ops@medicare.pk', role: 'ADMIN', status: 'ACTIVE' },
  { id: 'AD3', name: 'Support Agent', email: 'support@medicare.pk', role: 'SUPPORT', status: 'ACTIVE' },
]
export const audit: Row[] = Array.from({ length: 70 }, (_, i) => ({
  id: `AU${i + 1}`, by: pick(admins).name as string, action: pick(['doctor.approve', 'doctor.reject', 'patient.block', 'refund.create', 'settings.update', 'login']),
  time: daysAgo(int(0, 14)).replace('T', ' ').slice(0, 16), ip: `39.${int(1, 255)}.${int(1, 255)}.${int(1, 255)}`,
}))
export const reports: Row[] = ['Revenue', 'Bookings', 'Doctor performance', 'Retention'].flatMap((m, i) =>
  ['This week', 'This month', 'Last month'].map((p, j) => ({ id: `RP${i}${j}`, metric: m, period: p, value: int(1000, 90000) })))

export const trend = Array.from({ length: 14 }, (_, i) => ({
  day: dateOnly(13 - i).slice(5), bookings: int(60, 180), revenue: int(90, 320) * 1000,
}))
export const cityBookings = CITIES.slice(0, 6).map((c) => ({ name: c, value: int(80, 600) }))
export const topSpecialties = SPECIALTIES.slice(0, 5).map((s) => ({ name: s, value: int(60, 400) }))
export const feed = [
  { id: 1, kind: 'booking', text: 'New booking · Dr. Ali Khan · Karachi', ago: '2m' },
  { id: 2, kind: 'cancel', text: 'Cancelled · Sana Raza with Dr. Hira Malik', ago: '9m' },
  { id: 3, kind: 'rating', text: '5★ review for Dr. Omar Sheikh', ago: '15m' },
  { id: 4, kind: 'booking', text: 'New booking · Dr. Zain Butt · Lahore', ago: '22m' },
  { id: 5, kind: 'doctor', text: 'New doctor awaiting approval', ago: '31m' },
]
