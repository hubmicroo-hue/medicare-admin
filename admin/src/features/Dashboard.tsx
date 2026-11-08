import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Users, Stethoscope, UserCheck, CalendarDays, CalendarRange, Wallet, XCircle } from 'lucide-react'
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { StatCard, Spinner } from '../components/ui'
import { dashboard } from '../mock/api'

const PALETTE = ['#7C3AED', '#C026D3', '#EC4899', '#2563EB', '#059669', '#F59E0B']
const fmt = (n: number) => new Intl.NumberFormat('en-PK').format(n)

export default function Dashboard() {
  const { t, i18n } = useTranslation()
  const { data } = useQuery({ queryKey: ['dash'], queryFn: dashboard })
  if (!data) return <Spinner />
  const k = data.kpis
  const rtl = i18n.language === 'ur'
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">{t('nav.dashboard')}</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label={t('dash.patients')} value={fmt(k.patients)} icon={<Users size={16} />} />
        <StatCard label={t('dash.doctors')} value={k.doctors} icon={<Stethoscope size={16} />} />
        <Link to="/approvals" className="contents"><StatCard hot label={t('dash.pending')} value={k.pending} icon={<UserCheck size={16} />} /></Link>
        <StatCard label={t('dash.today')} value={k.today} icon={<CalendarDays size={16} />} />
        <StatCard label={t('dash.month')} value={fmt(k.month)} icon={<CalendarRange size={16} />} />
        <StatCard label={t('dash.revenue')} value={fmt(k.revenue)} icon={<Wallet size={16} />} />
        <StatCard label={t('dash.cancel')} value={`${k.cancel}%`} icon={<XCircle size={16} />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-4 lg:col-span-2">
          <h2 className="mb-3 font-semibold">{t('dash.trend')}</h2>
          <div className="h-64 sm:h-72" dir="ltr">
            <ResponsiveContainer>
              <ComposedChart data={data.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4DFF7" />
                <XAxis dataKey="day" fontSize={11} reversed={rtl} />
                <YAxis yAxisId="l" fontSize={11} orientation={rtl ? 'right' : 'left'} />
                <YAxis yAxisId="r" hide />
                <Tooltip />
                <Area yAxisId="l" dataKey="bookings" stroke="#7C3AED" fill="#EDE9FE" strokeWidth={2} />
                <Line yAxisId="r" dataKey="revenue" stroke="#C026D3" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4">
          <h2 className="mb-3 font-semibold">{t('dash.specialties')}</h2>
          <div className="h-64 sm:h-72" dir="ltr">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data.specialties} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                  {data.specialties.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4 lg:col-span-2">
          <h2 className="mb-3 font-semibold">{t('dash.cities')}</h2>
          <div className="h-56" dir="ltr">
            <ResponsiveContainer>
              <BarChart data={data.cities}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4DFF7" />
                <XAxis dataKey="name" fontSize={11} reversed={rtl} />
                <YAxis fontSize={11} orientation={rtl ? 'right' : 'left'} />
                <Tooltip />
                <Bar dataKey="value" fill="#7C3AED" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4">
          <h2 className="mb-3 font-semibold">{t('dash.feed')}</h2>
          <ul className="space-y-3">
            {data.feed.map((f) => (
              <li key={f.id} className="flex items-start gap-3 text-sm">
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${f.kind === 'cancel' ? 'bg-bad' : f.kind === 'rating' ? 'bg-star' : f.kind === 'doctor' ? 'bg-pink' : 'bg-primary'}`} />
                <span className="flex-1">{f.text}</span>
                <span className="text-xs text-muted" dir="ltr">{f.ago}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
