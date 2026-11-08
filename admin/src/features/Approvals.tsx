import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, CheckCircle2, ExternalLink, MapPin, RotateCw, XCircle, ZoomIn, MessageSquare, IdCard, FileBadge } from 'lucide-react'
import { ConfirmDialog, Modal, Spinner, useToast } from '../components/ui'
import { decideDoctor, pendingDoctors } from '../mock/api'
import type { PendingDoctor } from '../mock/data'
import { useAuth } from '../lib/auth'

type Action = 'approve' | 'reject' | 'info'

function DocImage({ label, icon }: { label: string; icon: React.ReactNode }) {
  const { t } = useTranslation()
  const [zoom, setZoom] = useState(1)
  const [rot, setRot] = useState(0)
  return (
    <div className="rounded-xl border border-line p-3">
      <div className="mb-2 flex items-center justify-between text-sm font-semibold">
        <span className="flex items-center gap-2">{icon}{label}</span>
        <span className="flex gap-1">
          <button className="rounded-lg p-1.5 hover:bg-tint" onClick={() => setZoom(zoom >= 2 ? 1 : zoom + 0.5)} aria-label={t('appr.zoom')}><ZoomIn size={16} /></button>
          <button className="rounded-lg p-1.5 hover:bg-tint" onClick={() => setRot((rot + 90) % 360)} aria-label={t('appr.rotate')}><RotateCw size={16} /></button>
        </span>
      </div>
      <div className="grid h-40 place-items-center overflow-hidden rounded-lg bg-tint">
        <div style={{ transform: `scale(${zoom}) rotate(${rot}deg)` }} className="grid h-24 w-36 place-items-center rounded-lg bg-gradient-to-br from-primary to-pink text-white transition-transform">
          {icon}
        </div>
      </div>
    </div>
  )
}

export default function Approvals() {
  const { t } = useTranslation()
  const { can } = useAuth()
  const toast = useToast()
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['pending-count'], queryFn: pendingDoctors })
  const [sel, setSel] = useState<PendingDoctor | null>(null)
  const [action, setAction] = useState<Action | null>(null)
  const [msg, setMsg] = useState('')

  const m = useMutation({
    mutationFn: async ({ d, a, reason }: { d: PendingDoctor; a: Action; reason: string }) => {
      if (a === 'info') return decideDoctor(d.id, 'PENDING', `doctor.request-info: ${reason}`)
      return decideDoctor(d.id, a === 'approve' ? 'APPROVED' : 'REJECTED', `doctor.${a}${reason ? `: ${reason}` : ''}`)
    },
    onSuccess: (_r, v) => {
      toast(v.a === 'approve' ? t('appr.approved') : v.a === 'reject' ? t('appr.rejected') : t('appr.infoSent'))
      qc.invalidateQueries({ queryKey: ['pending-count'] })
      qc.invalidateQueries({ queryKey: ['dash'] })
      setAction(null); setSel(null); setMsg('')
    },
  })

  const write = can('write')
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline gap-3">
        <h1 className="text-2xl font-bold">{t('appr.title')}</h1>
        <span className="badge bg-warnbg text-warn">{data?.length ?? 0}</span>
        <span className="text-sm text-muted">{t('appr.queue')}</span>
      </div>

      {isLoading && <Spinner />}
      {data && data.length === 0 && <div className="card p-10 text-center text-muted">{t('appr.none')}</div>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {data?.map((d) => (
          <button key={d.id} onClick={() => setSel(d)} className="card p-4 text-start transition hover:border-primary">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-pink font-bold text-white">{d.name.replace('Dr. ', '')[0]}</div>
              <div className="min-w-0">
                <div className="truncate font-semibold">{d.name}</div>
                <div className="truncate text-sm text-muted">{d.specialty} · {d.city}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted">
              <span dir="ltr">{d.submitted.slice(0, 10)}</span>
              {d.duplicate && <span className="inline-flex items-center gap-1 text-bad"><AlertTriangle size={14} />{t('appr.dupe')}</span>}
            </div>
          </button>
        ))}
      </div>

      <Modal open={!!sel && !action} onClose={() => setSel(null)} title={sel?.name ?? ''} wide>
        {sel && (
          <div className="space-y-4">
            {sel.duplicate && <div className="flex items-center gap-2 rounded-xl bg-badbg px-3 py-2 text-sm text-bad"><AlertTriangle size={16} />{t('appr.dupe')}</div>}
            <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              {([
                [t('common.specialty'), sel.specialty], [t('common.city'), sel.city], [t('cols.email'), sel.email], [t('cols.phone'), sel.phone],
                [t('appr.fee'), `PKR ${sel.fee}`], [t('appr.exp'), `${sel.experience} y`], [t('appr.clinic'), sel.clinic], [t('appr.submitted'), sel.submitted.slice(0, 10)],
              ] as const).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-line py-1.5"><dt className="text-muted">{k}</dt><dd className="text-end font-medium" dir="auto">{v}</dd></div>
              ))}
              <div className="flex items-center justify-between gap-3 border-b border-line py-1.5 sm:col-span-2">
                <dt className="text-muted">{t('appr.pmdc')}</dt>
                <dd className="flex items-center gap-2 font-medium"><span dir="ltr">{sel.pmdc}</span>
                  <a className="inline-flex items-center gap-1 text-primary" href="https://pmdc.pk" target="_blank" rel="noreferrer">{t('appr.verify')}<ExternalLink size={14} /></a>
                </dd>
              </div>
            </dl>
            <div className="flex items-center gap-2 rounded-xl bg-tint px-3 py-2 text-sm"><MapPin size={16} className="text-primary" />{sel.clinic}</div>
            <h3 className="font-semibold">{t('appr.docs')}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <DocImage label={t('appr.license')} icon={<FileBadge size={28} />} />
              <DocImage label={t('appr.cnic')} icon={<IdCard size={28} />} />
            </div>
            {write ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button className="btn-ghost" onClick={() => setAction('info')}><MessageSquare size={16} />{t('appr.info')}</button>
                <button className="btn-danger" onClick={() => setAction('reject')}><XCircle size={16} />{t('appr.reject')}</button>
                <button className="btn-primary" onClick={() => setAction('approve')}><CheckCircle2 size={16} />{t('appr.approve')}</button>
              </div>
            ) : <p className="text-sm text-muted">{t('common.noAccess')}</p>}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!action && !!sel}
        title={action ? t(`appr.${action}`) : ''}
        needReason={action === 'reject' || action === 'info'}
        danger={action === 'reject'}
        busy={m.isPending}
        onClose={() => setAction(null)}
        onConfirm={(reason) => sel && action && m.mutate({ d: sel, a: action, reason: action === 'info' ? (msg || reason) : reason })}
      >
        <p className="text-sm text-muted">{sel?.name}</p>
        {action === 'info' && <p className="mt-1 text-xs text-muted">{t('appr.message')}</p>}
      </ConfirmDialog>
    </div>
  )
}
