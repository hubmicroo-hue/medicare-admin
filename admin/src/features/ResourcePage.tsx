import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Download, Search } from 'lucide-react'
import { DataTable } from '../components/DataTable'
import { ConfirmDialog, useToast } from '../components/ui'
import { listAll, listResource, setStatus } from '../mock/api'
import type { Row } from '../mock/data'
import type { ResourceCfg, RowAction } from './resources'
import { useAuth } from '../lib/auth'
import { downloadCsv } from '../lib/util'

const LIMIT = 10

export default function ResourcePage({ cfg }: { cfg: ResourceCfg }) {
  const { t, i18n } = useTranslation()
  const { can } = useAuth()
  const toast = useToast()
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [dq, setDq] = useState('')
  const [status, setStatusF] = useState('')
  const [sort, setSort] = useState<string>()
  const [dir, setDir] = useState<'asc' | 'desc'>('asc')
  const [pending, setPending] = useState<{ row: Row; act: RowAction } | null>(null)

  useEffect(() => { const h = setTimeout(() => { setDq(q); setPage(1) }, 300); return () => clearTimeout(h) }, [q])
  useEffect(() => { setPage(1); setQ(''); setDq(''); setStatusF(''); setSort(undefined) }, [cfg.key])

  const key = ['res', cfg.key, page, dq, status, sort, dir]
  const { data, isFetching } = useQuery({
    queryKey: key, placeholderData: keepPreviousData,
    queryFn: () => listResource(cfg.key, { page, limit: LIMIT, q: dq, status: status || undefined, sort, dir }),
  })
  const mut = useMutation({
    mutationFn: ({ row, act }: { row: Row; act: RowAction }) => setStatus(cfg.key, row.id, act.to),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['res', cfg.key] }); qc.invalidateQueries({ queryKey: ['pending-count'] }); toast(t('settings.saved')); setPending(null) },
  })

  const lang = i18n.language === 'ur' ? 'ur' : 'en'
  const total = data?.total ?? 0
  const writable = can('write')

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t(`nav.${cfg.nav}`)}</h1>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute inset-y-0 start-3 my-auto text-muted" />
          <input className="input ps-10" placeholder={t('common.search')} value={q} onChange={(e) => setQ(e.target.value)} aria-label={t('common.search')} />
        </div>
        {cfg.statuses && (
          <select className="input sm:w-48" value={status} onChange={(e) => { setStatusF(e.target.value); setPage(1) }} aria-label={t('common.status')}>
            <option value="">{t('common.status')}: {t('common.all')}</option>
            {cfg.statuses.map((s) => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
          </select>
        )}
        <button className="btn-ghost" onClick={() => downloadCsv(cfg.key, listAll(cfg.key, { q: dq, status: status || undefined, sort, dir }) as Record<string, unknown>[])}>
          <Download size={16} />{t('common.export')}
        </button>
      </div>

      <DataTable<Row>
        cols={cfg.cols.map((c) => ({ key: c.key, label: t(c.label), render: c.render }))}
        rows={data?.rows ?? []} rowKey={(r) => r.id} loading={isFetching && !data}
        page={page} pages={Math.ceil(total / LIMIT)} total={total} onPage={setPage}
        sort={sort} dir={dir} onSort={(k) => { if (sort === k) setDir(dir === 'asc' ? 'desc' : 'asc'); else { setSort(k); setDir('asc') } }}
        actions={cfg.actions && writable ? (r) => cfg.actions!.filter((a) => a.from.includes(String(r.status))).map((a) => (
          <button key={a.en} className={`btn-ghost !px-3 !py-1.5 text-xs ${a.danger ? '!text-bad' : '!text-primary'}`} onClick={() => setPending({ row: r, act: a })}>{a[lang]}</button>
        )) : undefined}
      />

      <ConfirmDialog
        open={!!pending} title={pending?.act[lang] ?? ''} needReason={pending?.act.reason} danger={pending?.act.danger} busy={mut.isPending}
        onClose={() => setPending(null)} onConfirm={() => pending && mut.mutate(pending)}
      >
        <p className="text-sm text-muted" dir="auto">{pending ? String(pending.row.name ?? pending.row.title ?? pending.row.id) : ''}</p>
      </ConfirmDialog>
    </div>
  )
}
