import { createContext, useContext, useMemo, useState, ReactNode } from 'react'

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'SUPPORT'
export type Perm = 'read' | 'write' | 'settings' | 'admins' | 'audit' | 'support'
export interface User { name: string; email: string; role: Role }

const PERMS: Record<Role, Perm[]> = {
  SUPER_ADMIN: ['read', 'write', 'settings', 'admins', 'audit', 'support'],
  ADMIN: ['read', 'write', 'audit', 'support'],
  SUPPORT: ['read', 'support'],
}

interface Ctx { user: User | null; login: (u: User) => void; logout: () => void; can: (p: Perm) => boolean }
const AuthCtx = createContext<Ctx>(null as unknown as Ctx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { const s = sessionStorage.getItem('user'); return s ? (JSON.parse(s) as User) : null } catch { return null }
  })
  const value = useMemo<Ctx>(() => ({
    user,
    login: (u) => { setUser(u); try { sessionStorage.setItem('user', JSON.stringify(u)) } catch { /* ignore */ } },
    logout: () => { setUser(null); try { sessionStorage.removeItem('user') } catch { /* ignore */ } },
    can: (p) => !!user && PERMS[user.role].includes(p),
  }), [user])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}
export const useAuth = () => useContext(AuthCtx)
