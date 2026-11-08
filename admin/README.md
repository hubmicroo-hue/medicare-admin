# MediCare+ Super Admin Panel

React 18 + Vite + TypeScript + Tailwind CSS. English + Urdu (RTL), light/dark, mobile responsive.

## Run
    npm install
    npm run dev      # http://localhost:5173
    npm run build

## Demo logins (password `Admin@123`, 2FA code `123456`)
- admin@medicare.pk  - Super Admin (everything)
- ops@medicare.pk    - Admin (no Settings / Admin users)
- support@medicare.pk - Support (read-only + tickets/chats)

Data comes from an in-memory mock API (`src/mock`), so no backend is needed. Swap `src/mock/api.ts` for real `/api/v1/admin` calls later.
