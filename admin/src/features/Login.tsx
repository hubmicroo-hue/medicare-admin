import { FormEvent, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Eye, EyeOff, Languages, Lock, Mail, ShieldCheck, Stethoscope, CalendarCheck, ScrollText, Loader2, KeyRound } from 'lucide-react'
import { Logo } from '../components/ui'
import { useAuth, Role } from '../lib/auth'
import { applyLang, Lang } from '../i18n'

const ACCOUNTS: Record<string, { pass: string; name: string; role: Role }> = {
  'admin@medicare.pk': { pass: 'Admin@123', name: 'Super Admin', role: 'SUPER_ADMIN' },
  'ops@medicare.pk': { pass: 'Admin@123', name: 'Operations', role: 'ADMIN' },
  'support@medicare.pk': { pass: 'Admin@123', name: 'Support Agent', role: 'SUPPORT' },
}
const DEMOS = [
  { email: 'admin@medicare.pk', key: 'superAdmin' },
  { email: 'ops@medicare.pk', key: 'admin' },
  { email: 'support@medicare.pk', key: 'support' },
] as const

type Step = 'creds' | 'otp' | 'forgot'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const { t, i18n } = useTranslation()
  const { user, login } = useAuth()
  const nav = useNavigate()
  const [step, setStep] = useState<Step>('creds')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)
  const [shake, setShake] = useState(0)

  if (user) return <Navigate to="/" replace />

  const switchLang = () => {
    const l: Lang = i18n.language === 'ur' ? 'en' : 'ur'
    i18n.changeLanguage(l); applyLang(l)
  }
  const fail = (m: string) => { setErr(m); setShake((s) => s + 1) }
  const go = (s: Step) => { setStep(s); setErr(''); setInfo(''); setCode('') }

  const canSubmit =
    step === 'creds' ? EMAIL_RE.test(email.trim()) && pass.length > 0 :
    step === 'otp' ? code.length === 6 : EMAIL_RE.test(email.trim())

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!canSubmit || busy) return
    setErr(''); setInfo(''); setBusy(true)
    await new Promise((r) => setTimeout(r, 500))
    setBusy(false)
    const a = ACCOUNTS[email.trim().toLowerCase()]
    if (step === 'creds') {
      if (!a || a.pass !== pass) return fail(t('auth.invalid'))
      go('otp')
    } else if (step === 'otp') {
      if (code !== '123456') { setCode(''); return fail(t('auth.badcode')) }
      login({ name: a.name, email: email.trim().toLowerCase(), role: a.role })
      nav('/', { replace: true })
    } else {
      setInfo(t('auth.resetSent'))
    }
  }

  const title = step === 'otp' ? t('auth.twofa') : step === 'forgot' ? t('auth.forgot') : t('auth.welcome')
  const sub = step === 'otp' ? t('auth.otpSub') : step === 'forgot' ? t('auth.forgotSub') : t('auth.sub')
  const features = [
    { icon: Stethoscope, text: t('auth.f1') },
    { icon: CalendarCheck, text: t('auth.f2') },
    { icon: ScrollText, text: t('auth.f3') },
  ]

  // Login is always rendered in the light palette so contrast is identical in both app themes.
  return (
    <div data-theme="light" className="grid min-h-screen bg-bg text-ink lg:grid-cols-[1.05fr_1fr]">
      {/* ---------- hero (desktop) ---------- */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-b from-primary via-[#4C1D95] to-[#2E1065] p-12 text-white lg:flex xl:p-16">
        <div className="pointer-events-none absolute -top-24 -start-24 h-96 w-96 rounded-full bg-pink/25 blur-3xl" />
        <div className="floaty pointer-events-none absolute -bottom-28 -end-20 h-[26rem] w-[26rem] rounded-full bg-magenta/35 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[.07]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '26px 26px' }} />

        <div className="relative"><Logo light size={44} /></div>

        <div className="relative">
          <h1 className="text-4xl font-extrabold leading-tight xl:text-5xl">{t('app')}</h1>
          <p className="mt-4 max-w-md text-lg text-white/80">{t('tagline')}</p>
          <ul className="mt-10 max-w-md space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15"><Icon size={20} /></span>
                <span className="text-sm font-medium text-white/95">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative flex items-center gap-2 text-sm text-white/70"><ShieldCheck size={16} />{t('auth.secure')}</p>
      </div>

      {/* ---------- form column ---------- */}
      <div className="flex min-h-screen flex-col lg:min-h-0">
        <div className="flex items-center justify-between bg-gradient-to-r from-primary to-magenta px-4 py-3 text-white lg:bg-none lg:px-8 lg:py-6 lg:text-ink">
          <div className="lg:hidden"><Logo light size={34} /></div>
          <span className="hidden lg:block" />
          <button onClick={switchLang} className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-3.5 py-2 text-sm font-semibold transition hover:bg-white/20 lg:border-line lg:bg-surface lg:hover:bg-tint">
            <Languages size={16} />{t('common.language')}
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
          <div className="w-full max-w-md">
            <form key={shake} onSubmit={submit} noValidate className={`card space-y-5 p-6 shadow-[0_20px_50px_-20px_rgba(124,58,237,.35)] sm:p-8 ${shake ? 'shake' : ''}`}>
              {step !== 'creds' && (
                <button type="button" onClick={() => go('creds')} className="-mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary">
                  <ArrowLeft size={16} className="flip" />{t('auth.back')}
                </button>
              )}
              <div>
                <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-magenta text-white shadow-card">
                  {step === 'otp' ? <KeyRound size={22} /> : <Lock size={22} />}
                </div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="mt-1 text-sm text-muted">{sub}</p>
              </div>

              {step !== 'otp' && (
                <label className="block text-sm font-medium">{t('auth.email')}
                  <div className="relative mt-1.5">
                    <Mail size={18} className="pointer-events-none absolute inset-y-0 start-3.5 my-auto text-muted" />
                    <input className="input ps-11" type="email" autoComplete="username" required autoFocus value={email} onChange={(e) => { setEmail(e.target.value); setErr('') }} dir="ltr" placeholder="admin@medicare.pk" />
                  </div>
                </label>
              )}
              {step === 'creds' && (
                <label className="block text-sm font-medium">{t('auth.password')}
                  <div className="relative mt-1.5">
                    <Lock size={18} className="pointer-events-none absolute inset-y-0 start-3.5 my-auto text-muted" />
                    <input className="input px-11" type={show ? 'text' : 'password'} autoComplete="current-password" required value={pass} onChange={(e) => { setPass(e.target.value); setErr('') }} dir="ltr" placeholder="••••••••" />
                    <button type="button" onClick={() => setShow(!show)} className="absolute inset-y-0 end-3 my-auto h-8 w-8 rounded-lg text-muted transition hover:bg-tint hover:text-primary" aria-label={show ? t('auth.hide') : t('auth.show')}>
                      {show ? <EyeOff size={18} className="mx-auto" /> : <Eye size={18} className="mx-auto" />}
                    </button>
                  </div>
                </label>
              )}
              {step === 'otp' && (
                <label className="block text-sm font-medium">{t('auth.code')}
                  <input className="input mt-1.5 text-center text-2xl font-semibold tracking-[.6em]" inputMode="numeric" autoComplete="one-time-code" maxLength={6} autoFocus value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setErr('') }} dir="ltr" placeholder="······" />
                </label>
              )}

              {err && <p role="alert" className="rounded-xl bg-badbg px-3.5 py-2.5 text-sm font-medium text-bad">{err}</p>}
              {info && <p role="status" className="rounded-xl bg-okbg px-3.5 py-2.5 text-sm font-medium text-ok">{info}</p>}

              <button className="btn-primary w-full !py-3" disabled={busy || !canSubmit}>
                {busy && <Loader2 size={18} className="animate-spin" />}
                {step === 'creds' ? t('auth.signin') : step === 'otp' ? t('auth.verify') : t('auth.reset')}
              </button>

              {step === 'creds' && (
                <button type="button" className="w-full text-center text-sm font-semibold text-primary hover:underline" onClick={() => go('forgot')}>{t('auth.forgot')}</button>
              )}
            </form>

            {/* quick demo accounts */}
            {step === 'creds' && (
              <div className="mt-5 text-center">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">{t('auth.quick')}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {DEMOS.map((d) => (
                    <button key={d.email} type="button" onClick={() => { setEmail(d.email); setPass('Admin@123'); setErr('') }}
                      className="rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-medium transition hover:border-primary hover:bg-tint hover:text-primary">
                      {t(`auth.${d.key}`)}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted" dir="ltr">Password: Admin@123 · Code: 123456</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
