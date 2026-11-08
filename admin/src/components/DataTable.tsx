import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'

export interface Col<T> { key: string; label: string; render?: (r: T) => ReactNode; sortable?: boolean }

interface Props<T> {
  cols: Col<T>[]; rows: T[]; rowKey: (r: T) => string; loading?: boolean
  page: number; pages: number; total: number; onPage: (p: number) => void
  sort?: string; dir?: 'asc' | 'desc'; onSort?: (k: string) => void
  actions?: (r: T) => ReactNode
}

/** Table on >=md, stacked cards on phones. */
export function DataTable<T>({ cols, rows, rowKey, loading, page, pages, total, onPage, sort, dir, onSort, actions }: Props<T>) {
  const { t } = useTranslation()
  const cell = (r: T, c: Col<T>) => (c.render ? c.render(r) : String((r as Record<string, unknown>)[c.key] ?? ''))
  return (
    <div className="card overflow-hidden">
      {/* desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead className="bg-tint/60 text-start text-xs uppercase text-muted">
            <tr>
              {cols.map((c) => (
                <th key={c.key} className="px-4 py-3 text-start font-semibold">
                  {c.sortable !== false && onSort ? (
                    <button className="inline-flex items-center gap-1 hover:text-primary" onClick={() => onSort(c.key)}>
                      {c.label}<ArrowUpDown size={12} className={sort === c.key ? 'text-primary' : 'opacity-40'} aria-label={sort === c.key ? dir : undefined} />
                    </button>
                  ) : c.label}
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-start font-semibold">{t('common.actions')}</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={rowKey(r)} className="border-t border-line hover:bg-tint/40">
                {cols.map((c) => <td key={c.key} className="px-4 py-3">{cell(r, c)}</td>)}
                {actions && <td className="px-4 py-3"><div className="flex flex-wrap gap-1.5">{actions(r)}</div></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* mobile */}
      <ul className="divide-y divide-line md:hidden">
        {rows.map((r) => (
          <li key={rowKey(r)} className="space-y-1.5 p-4">
            {cols.map((c) => (
              <div key={c.key} className="flex items-start justify-between gap-3 text-sm">
                <span className="shrink-0 text-xs font-medium text-muted">{c.label}</span>
                <span className="text-end">{cell(r, c)}</span>
              </div>
            ))}
            {actions && <div className="flex flex-wrap justify-end gap-1.5 pt-2">{actions(r)}</div>}
          </li>
        ))}
      </ul>
      {loading && <div className="mx-auto my-8 h-7 w-7 animate-spin rounded-full border-4 border-tint border-t-primary" aria-label={t('common.loading')} />}
      {!loading && rows.length === 0 && <p className="p-10 text-center text-muted">{t('common.empty')}</p>}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 text-sm text-muted">
        <span>{t('common.rows', { n: total })}</span>
        <div className="flex items-center gap-2">
          <button className="btn-ghost !px-2.5 !py-1.5" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label={t('common.prev')}><ChevronLeft size={16} className="flip" /></button>
          <span>{t('common.page', { p: page, n: Math.max(pages, 1) })}</span>
          <button className="btn-ghost !px-2.5 !py-1.5" disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label={t('common.next')}><ChevronRight size={16} className="flip" /></button>
        </div>
      </div>
    </div>
  )
}
