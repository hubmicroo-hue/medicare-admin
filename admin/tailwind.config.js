/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#7C3AED', dark: '#5B21B6' },
        magenta: '#C026D3', pink: '#EC4899',
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        tint: 'rgb(var(--tint) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        ok: '#059669', okbg: 'rgb(var(--okbg) / <alpha-value>)',
        warn: '#B45309', warnbg: 'rgb(var(--warnbg) / <alpha-value>)',
        bad: '#DC2626', badbg: 'rgb(var(--badbg) / <alpha-value>)',
        info: '#2563EB', infobg: 'rgb(var(--infobg) / <alpha-value>)',
        star: '#F59E0B',
      },
      borderRadius: { xl: '16px', '2xl': '20px' },
      boxShadow: { card: '0 4px 20px -6px rgba(124,58,237,.15)' },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], ur: ['"Noto Nastaliq Urdu"', '"Noto Sans Arabic"', 'serif'] },
    },
  },
  plugins: [],
}
