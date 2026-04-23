# Abílio Marcos — Website

Premium editorial site for the Portuguese abstract-expressionist painter Abílio Marcos.
Built with Vite + React + TypeScript + Tailwind, with a Supabase backend (database, auth, storage, Edge Functions) and Stripe Checkout for direct artwork purchases.

Live: https://abiliomarcos.com

---

## Stack

- **Frontend**: Vite 5, React 18, TypeScript 5, Tailwind CSS 3, shadcn/ui, framer-motion
- **Backend**: Supabase (Postgres, Auth, Storage bucket `artworks`, Edge Functions)
- **Payments**: Stripe Checkout (dynamic sessions via Edge Function + signed webhook)
- **i18n**: pt / en / fr / de
- **Analytics**: GA4 + Meta Pixel + custom `analytics_events` table (Supabase)

---

## Requirements

- Node.js **>= 18.18** (LTS recommended)
- **npm** (canonical package manager — see note below)
- A Supabase project (for backend) and Stripe account (for payments) if running the full stack

> ### Package manager
> The canonical package manager for this repo is **npm**.
> Historically Lovable generated both a `bun.lock(b)` and `package-lock.json`; the source of truth going forward is `package-lock.json`.
> If working locally outside Lovable, you can safely delete `bun.lock` and `bun.lockb` from your working copy. They are kept in the Lovable workspace for compatibility but only `package-lock.json` should be relied upon.

---

## Local setup

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server (http://localhost:8080)
npm run dev

# 3. Production build
npm run build

# 4. Preview the production build
npm run preview

# Other useful scripts
npm run lint          # ESLint
npm test              # Vitest (unit)
npm run test:watch    # Vitest watch mode
```

No `.env` file is required to run the frontend locally — the Supabase URL and **publishable** anon key are committed in `src/lib/supabase.ts` (this is safe; the anon key is a public identifier protected by Row-Level Security on the database).

---

## Backend: Supabase Edge Functions

Two Edge Functions live in `supabase/functions/`:

| Function          | Purpose                                                    | `verify_jwt` |
|-------------------|------------------------------------------------------------|--------------|
| `create-checkout` | Creates a Stripe Checkout Session for a given artwork      | `false`      |
| `stripe-webhook`  | Receives Stripe events, marks artworks as `sold`, inserts orders | `false`  |

Both are configured in `supabase/config.toml`.

### Required secrets (Supabase Edge Functions)

Configure these in the Supabase dashboard (Project Settings → Edge Functions → Secrets) **or** via Lovable Cloud secrets:

| Secret                       | Used by                          | Notes                                                          |
|------------------------------|----------------------------------|----------------------------------------------------------------|
| `STRIPE_SECRET_KEY`          | both                             | `sk_live_…` (or `sk_test_…` for staging)                       |
| `STRIPE_WEBHOOK_SECRET`      | `stripe-webhook`                 | The signing secret of the webhook endpoint configured in Stripe |
| `SITE_URL`                   | `create-checkout`                | e.g. `https://abiliomarcos.com` — used for success/cancel URLs. Defaults to `https://abiliomarcos.com` if missing. |
| `SUPABASE_URL`               | both (auto-injected by Supabase) | —                                                              |
| `SUPABASE_SERVICE_ROLE_KEY`  | both (auto-injected by Supabase) | —                                                              |

### Manual deploy (one-time / when Edge Functions change)

```bash
# Login + link project (once)
supabase login
supabase link --project-ref hbrvappgklorjxojyvqz

# Deploy
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook --no-verify-jwt
```

### Stripe webhook configuration

In the Stripe dashboard → Developers → Webhooks, create an endpoint pointing to:

```
https://hbrvappgklorjxojyvqz.supabase.co/functions/v1/stripe-webhook
```

Subscribe at minimum to `checkout.session.completed`, then copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

---

## Database

The Supabase project hosts the following key tables:

- `artworks` — catalogue (status, availability, price, images, …)
- `orders` — confirmed purchases (written by `stripe-webhook`)
- `inquiries` — leads from the inquiry modal
- `analytics_events` — raw event log for the admin Métricas dashboard
- `user_roles` — admin role assignments (Auth gating)

Recommended indexes for analytics performance:

```sql
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
```

---

## Admin

The admin lives at `/admin` and is gated by Supabase Auth + the `user_roles` table.
Admin users are created manually in the Supabase dashboard (no public signup).

---

## Deployment

The site is deployed via Lovable hosting (custom domain `abiliomarcos.com`).

- **Frontend changes** ship when you click **Publish → Update** in Lovable.
- **Edge Function changes** must be deployed manually with the Supabase CLI (see above).
- SPA fallback is handled automatically by Lovable hosting — no `_redirects` / `vercel.json` / `netlify.toml` needed.

---

## Project structure

```
src/
  components/        UI components (incl. shadcn/ui in components/ui)
  pages/             Route components (public + admin/)
  lib/               supabase client, types, analytics, checkout helpers
  i18n/              pt / en / fr / de translations
  contexts/          AuthContext
supabase/
  config.toml        Edge Function configuration (verify_jwt = false)
  functions/
    create-checkout/
    stripe-webhook/
public/              Static assets (favicon, robots.txt, …)
```

---

## License

© Abílio Marcos. All artwork copyright belongs to the artist.
Website by [Ardo Media](https://ardo.media/).
