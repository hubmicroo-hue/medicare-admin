import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, X, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

export function Logo({ light = false, size = 36, iconOnly = false }: { light?: boolean; size?: number; iconOnly?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div style={{ width: size, height: size }} className="grid place-items-center rounded-xl bg-gradient-to-r from-primary to-magenta shadow-card">
        <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="#fff"><path d="M9.5 3h5v6.5H21v5h-6.5V21h-5v-6.5H3v-5h6.5z" /></svg>
      </div>
      {!iconOnly && <span className={clsx('text-lg font-bold tracking-tight', light ? 'text-white' : 'text-ink')}>MediCare<span className="text-magenta">+</span></span>}
    </div>
  )
}

const TONES: Record<string, string> = {
  APPROVED: 'bg-okbg text-ok', PAID: 'bg-okbg text-ok', COMPLETED: 'bg-okbg text-ok', ACTIVE: 'bg-okbg text-ok', PUBLISHED: 'bg-okbg text-ok', SENT: 'bg-okbg text-ok', VISIBLE: 'bg-okbg text-ok',
  PENDING: 'bg-warnbg text-warn', IN_PROGRESS: 'bg-warnbg text-warn', SCHEDULED: 'bg-warnbg text-warn', DRAFT: 'bg-warnbg text-warn', OPEN: 'bg-warnbg text-warn',
  REJECTED: 'bg-badbg text-bad', CANCELLED: 'bg-badbg text-bad', FAILED: 'bg-badbg text-bad', BLOCKED: 'bg-badbg text-bad', SUSPENDED: 'bg-badbg text-bad', HIDDEN: 'bg-badbg text-bad',
  CONFIRMED: 'bg-tint text-primary', REFUNDED: 'bg-infobg text-info', CLOSED: 'bg-infobg text-info',
}
export function StatusBadge({ value }: { value: string }) {
  const { t, i18n } = useTranslation()
  const label = i18n.exists(`status.${value}`) ? t(`status.${value}`) : value
  return <span className={clsx('badge', TONES[value] ?? 'bg-tint text-primary')}>{label}</span>
}

/* ---------- Toasts ---------- */
interface Toast { id: number; msg: string; kind: 'ok' | 'err' }
const ToastCtx = createContext<(msg: string, kind?: 'ok' | 'err') => void>(() => {})
export const useToast = () => useContext(ToastCtx)
export function ToastProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<Toast[]>([])
  const push = useCallback((msg: string, kind: 'ok' | 'err' = 'ok') => {
    const id = Date.now() + Math.random()
    setList((l) => [...l, { id, msg, kind }])
    setTimeout(() => setList((l) => l.filter((x) => x.id !== id)), 3500)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
        {list.map((x) => (
          <div key={x.id} className="pointer-events-auto flex items-center gap-2 rounded-xl bg-[#14102B] px-4 py-3 text-sm text-white shadow-lg">
            {x.kind === 'ok' ? <CheckCircle2 size={18} className="text-green-400" /> : <AlertCircle size={18} className="text-red-400" />}
            {x.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

/* ---------- Modal / ConfirmDialog ---------- */
export function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#14102B]/60 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}
        className={clsx('card max-h-[92vh] w-full overflow-y-auto rounded-b-none p-5 sm:rounded-b-2xl', wide ? 'sm:max-w-3xl' : 'sm:max-w-md')}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-tint" aria-label="Close"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function ConfirmDialog({ open, title, onClose, onConfirm, needReason = false, danger = false, busy = false, children }:
  { open: boolean; title: string; onClose: () => void; onConfirm: (reason: string) => void; needReason?: boolean; danger?: boolean; busy?: boolean; children?: ReactNode }) {
  const { t } = useTranslation()
  const [reason, setReason] = useState('')
  useEffect(() => { if (open) setReason('') }, [open])
  const blocked = needReason && reason.trim().length < 3
  return (
    <Modal open={open} onClose={onClose} title={title}>
      {children}
      {needReason && <textarea className="input mt-2 min-h-[90px]" placeholder={t('common.reason')} value={reason} onChange={(e) => setReason(e.target.value)} autoFocus />}
      <div className="mt-4 flex justify-end gap-2">
        <button className="btn-ghost" onClick={onClose}>{t('common.cancel')}</button>
        <button className={danger ? 'btn-danger' : 'btn-primary'} disabled={blocked || busy} onClick={() => onConfirm(reason.trim())}>{t('common.confirm')}</button>
      </div>
    </Modal>
  )
}

export function StatCard({ label, value, icon, hot = false }: { label: string; value: ReactNode; icon: ReactNode; hot?: boolean }) {
  return (
    <div className={clsx('rounded-2xl p-4 shadow-card', hot ? 'bg-gradient-to-r from-primary to-magenta text-white' : 'card')}>
      <div className="flex items-center justify-between">
        <span className={clsx('text-xs font-medium', hot ? 'text-white/80' : 'text-muted')}>{label}</span>
        <span className={clsx('grid h-8 w-8 place-items-center rounded-xl', hot ? 'bg-white/20' : 'bg-tint text-primary')}>{icon}</span>
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  )
}

export function Spinner() {
  return <div className="mx-auto my-10 h-8 w-8 animate-spin rounded-full border-4 border-tint border-t-primary" />
}
