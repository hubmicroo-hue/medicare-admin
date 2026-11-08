import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../components/ui'
import { useAuth } from '../lib/auth'

export default function Settings() {
  const { t } = useTranslation()
  const { can } = useAuth()
  const toast = useToast()
  const ok = can('settings')
  const [s, setS] = useState({ commission: 10, window: 24, maintenance: false, version: '1.0.0', otp: 'Twilio' })

  const save = (e: FormEvent) => { e.preventDefault(); toast(t('settings.saved')) }
  const field = 'block text-sm font-medium'

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
      {!ok && <p className="rounded-xl bg-warnbg px-4 py-2 text-sm text-warn">{t('settings.locked')}</p>}
      <form onSubmit={save} className="card grid gap-4 p-5 sm:grid-cols-2">
        <label className={field}>{t('settings.commission')}
          <input className="input mt-1.5" type="number" min={0} max={100} disabled={!ok} value={s.commission} onChange={(e) => setS({ ...s, commission: +e.target.value })} dir="ltr" /></label>
        <label className={field}>{t('settings.window')}
          <input className="input mt-1.5" type="number" min={0} disabled={!ok} value={s.window} onChange={(e) => setS({ ...s, window: +e.target.value })} dir="ltr" /></label>
        <label className={field}>{t('settings.force')}
          <input className="input mt-1.5" disabled={!ok} value={s.version} onChange={(e) => setS({ ...s, version: e.target.value })} dir="ltr" /></label>
        <label className={field}>{t('settings.otp')}
          <select className="input mt-1.5" disabled={!ok} value={s.otp} onChange={(e) => setS({ ...s, otp: e.target.value })}><option>Twilio</option><option>Jazz SMS</option></select></label>
        <label className="flex items-center gap-3 text-sm font-medium sm:col-span-2">
          <input type="checkbox" className="h-5 w-5 accent-primary" disabled={!ok} checked={s.maintenance} onChange={(e) => setS({ ...s, maintenance: e.target.checked })} />{t('settings.maintenance')}</label>
        <div className="sm:col-span-2"><button className="btn-primary w-full sm:w-auto" disabled={!ok}>{t('common.save')}</button></div>
      </form>
    </div>
  )
}
