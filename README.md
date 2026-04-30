# Emphasis Engineering — Next.js

This project has been migrated from **Vite + React Router** to **Next.js 15 (App Router)**.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Migration Changes

| Before (Vite) | After (Next.js) |
|---|---|
| `react-router-dom` | `next/link` + `next/navigation` |
| `<Link to="...">` | `<Link href="...">` |
| `useNavigate()` | `useRouter()` |
| `useLocation()` | `usePathname()` |
| `useParams()` | `useParams()` from `next/navigation` |
| `<Outlet />` | `{children}` in root layout |
| `vite.config.ts` | `next.config.ts` |
| `src/pages/` | `src/app/*/page.tsx` |

## Project Structure

```
src/
  app/                    ← Next.js App Router pages
    layout.tsx            ← Root layout (Navbar, Footer, CartProvider)
    page.tsx              ← Home
    about/page.tsx
    courses/page.tsx
    courses/[id]/page.tsx
    practice-tests/...
    services/...
    testimonials/...
    contact/...
    cart/...
    blog/...
    globals.css
  components/
    layout/               ← Navbar, Footer
    sections/             ← Hero, TrustSection, etc.
    ui/                   ← Button, Card, ChatBot, etc.
    pages/                ← Page content components
  context/                ← CartContext
  data/                   ← Static data files
  types/                  ← TypeScript interfaces
  utils/                  ← cn() utility
  api/                    ← AI API helper
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your keys:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion**
- **Lucide React**
- **Axios**
