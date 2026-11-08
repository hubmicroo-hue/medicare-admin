import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { LayoutDashboard, UserCheck, Stethoscope, Users, CalendarDays, Wallet, Star, Tags, MapPin, Megaphone, Send, MessageSquare, LifeBuoy, FileText, ShieldCheck, Settings, ScrollText, BarChart3, Menu, Moon, Sun, LogOut, Languages, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Logo } from './ui'
import { useAuth, Perm } from '../lib/auth'
import { applyLang, Lang } from '../i18n'
import { applyTheme, initialTheme } from '../lib/util'
import { pendingDoctors } from '../mock/api'

interface Item { to: string; key: string; icon: typeof Menu; perm: Perm }
export const NAV: Item[] = [
  { to: '/', key: 'dashboard', icon: LayoutDashboard, perm: 'read' },
  { to: '/approvals', key: 'approvals', icon: UserCheck, perm: 'read' },
  { to: '/doctors', key: 'doctors', icon: Stethoscope, perm: 'read' },
  { to: '/patients', key: 'patients', icon: Users, perm: 'read' },
  { to: '/appointments', key: 'appointments', icon: CalendarDays, perm: 'read' },
  { to: '/payments', key: 'payments', icon: Wallet, perm: 'read' },
  { to: '/reviews', key: 'reviews', icon: Star, perm: 'read' },
  { to: '/specialties', key: 'specialties', icon: Tags, perm: 'read' },
  { to: '/cities', key: 'cities', icon: MapPin, perm: 'read' },
  { to: '/banners', key: 'banners', icon: Megaphone, perm: 'read' },
  { to: '/broadcasts', key: 'broadcasts', icon: Send, perm: 'read' },
  { to: '/chats', key: 'chats', icon: MessageSquare, perm: 'support' },
  { to: '/tickets', key: 'tickets', icon: LifeBuoy, perm: 'support' },
  { to: '/content', key: 'content', icon: FileText, perm: 'read' },
  { to: '/admins', key: 'admins', icon: ShieldCheck, perm: 'admins' },
  { to: '/settings', key: 'settings', icon: Settings, perm: 'settings' },
  { to: '/audit', key: 'audit', icon: ScrollText, perm: 'audit' },
  { to: '/reports', key: 'reports', icon: BarChart3, perm: 'read' },
]

export function Layout() {
  const { t, i18n } = useTranslation()
  const { user, logout, can } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(initialTheme())
  const [collapsed, setCollapsed] = useState(() => { try { return localStorage.getItem('sidebar') === 'closed' } catch { return false } })
  const toggleCollapsed = () => setCollapsed((c) => {
    try { localStorage.setItem('sidebar', c ? 'open' : 'closed') } catch { /* ignore */ }
    return !c
  })
  const pending = useQuery({ queryKey: ['pending-count'], queryFn: pendingDoctors })

  useEffect(() => { applyTheme(theme) }, [theme])
  useEffect(() => { setOpen(false) }, [loc.pathname])

  const switchLang = () => {
    const l: Lang = i18n.language === 'ur' ? 'en' : 'ur'
    i18n.changeLanguage(l)
    applyLang(l)
  }
  const count = pending.data?.length ?? 0

  // compact = icon-only (desktop collapsed). Mobile drawer is always expanded.
  const renderSidebar = (compact: boolean) => (
    <div className="flex h-full flex-col bg-gradient-to-b from-primary via-[#4C1D95] to-[#2E1065] text-white">
      <div className={`flex items-center p-5 ${compact ? 'justify-center px-2' : 'justify-between'}`}>
        <Logo light iconOnly={compact} />
        {!compact && <button className="rounded-lg p-1.5 hover:bg-white/10 lg:hidden" onClick={() => setOpen(false)} aria-label={t('common.close')}><X size={20} /></button>}
      </div>
      <nav className={`sidebar-scroll flex-1 space-y-0.5 overflow-y-auto pb-4 ${compact ? 'compact px-2' : 'px-3'}`} aria-label="Main">
        {NAV.filter((n) => can(n.perm)).map((n) => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'} title={compact ? t(`nav.${n.key}`) : undefined} aria-label={t(`nav.${n.key}`)}
            className={({ isActive }) => `relative flex items-center rounded-xl py-2.5 text-sm font-medium transition ${compact ? 'justify-center px-0' : 'gap-3 px-3'} ${isActive ? 'bg-white/20' : 'text-white/80 hover:bg-white/10'}`}>
            <n.icon size={20} className="shrink-0" />
            {!compact && <span className="flex-1">{t(`nav.${n.key}`)}</span>}
            {n.key === 'approvals' && count > 0 && (compact
              ? <span className="absolute end-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-pink" />
              : <span className="rounded-full bg-pink px-2 py-0.5 text-xs font-bold">{count}</span>)}
          </NavLink>
        ))}
      </nav>
      <div className={`border-t border-white/15 ${compact ? 'p-2' : 'p-4'}`}>
        <div className={`mb-3 flex items-center gap-3 ${compact ? 'justify-center' : ''}`} title={compact ? user?.name : undefined}>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-pink to-magenta font-bold">{user?.name[0]}</div>
          {!compact && <div className="min-w-0 text-sm"><div className="truncate font-semibold">{user?.name}</div><div className="truncate text-xs text-white/70">{user?.role.replace('_', ' ')}</div></div>}
        </div>
        <button title={compact ? t('auth.logout') : undefined} aria-label={t('auth.logout')}
          className={`flex w-full items-center rounded-xl py-2 text-sm text-white/90 hover:bg-white/10 ${compact ? 'justify-center' : 'gap-2 px-3'}`} onClick={() => { logout(); nav('/login') }}>
          <LogOut size={18} className="flip" />{!compact && t('auth.logout')}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen lg:flex">
      {/* desktop sidebar */}
      <aside className={`sticky top-0 hidden h-screen shrink-0 transition-[width] duration-200 lg:block ${collapsed ? 'w-20' : 'w-64'}`}>{renderSidebar(collapsed)}</aside>
      {/* mobile drawer */}
      {open && <div className="fixed inset-0 z-40 bg-[#14102B]/60 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 start-0 z-50 w-72 max-w-[85vw] transition-transform lg:hidden ${open ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'}`}>{renderSidebar(false)}</aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-line bg-surface/90 px-3 py-3 backdrop-blur sm:px-6">
          <button className="rounded-xl p-2 hover:bg-tint lg:hidden" onClick={() => setOpen(true)} aria-label={t('common.menu')}><Menu size={22} /></button>
          <button className="hidden rounded-xl p-2 hover:bg-tint lg:block" onClick={toggleCollapsed}
            aria-label={collapsed ? 'Open sidebar' : 'Close sidebar'} title={collapsed ? 'Open sidebar' : 'Close sidebar'} aria-expanded={!collapsed}>
            {collapsed ? <PanelLeftOpen size={20} className="flip" /> : <PanelLeftClose size={20} className="flip" />}
          </button>
          <div className="lg:hidden"><Logo size={30} /></div>
          <div className="flex-1" />
          <button className="btn-ghost !px-3 !py-2" onClick={switchLang}><Languages size={16} />{t('common.language')}</button>
          <button className="btn-ghost !px-3 !py-2" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={t('common.theme')}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6">
          {user?.role === 'SUPPORT' && <div className="mb-4 rounded-xl bg-warnbg px-4 py-2 text-sm text-warn">{t('common.readOnly')}</div>}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
