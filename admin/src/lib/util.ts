export function applyTheme(t: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', t)
  try { localStorage.setItem('theme', t) } catch { /* ignore */ }
}
export function initialTheme(): 'light' | 'dark' {
  try { if (localStorage.getItem('theme') === 'dark') return 'dark' } catch { /* ignore */ }
  return 'light'
}
export function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return ''
  const keys = Object.keys(rows[0])
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [keys.join(','), ...rows.map((r) => keys.map((k) => esc(r[k])).join(','))].join('\n')
}
export function downloadCsv(name: string, rows: Record<string, unknown>[]) {
  const blob = new Blob(['﻿' + toCsv(rows)], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${name}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}
