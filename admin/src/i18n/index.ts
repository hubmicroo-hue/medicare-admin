import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import ur from './ur.json'

export type Lang = 'en' | 'ur'
const saved = (() => { try { return localStorage.getItem('lang') } catch { return null } })()
const initial: Lang = saved === 'ur' ? 'ur' : 'en'

export function applyLang(l: Lang) {
  document.documentElement.lang = l
  document.documentElement.dir = l === 'ur' ? 'rtl' : 'ltr'
  try { localStorage.setItem('lang', l) } catch { /* ignore */ }
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ur: { translation: ur } },
  lng: initial, fallbackLng: 'en', interpolation: { escapeValue: false },
})
applyLang(initial)
export default i18n
