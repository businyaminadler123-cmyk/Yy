# Arba Minim — Luxury Four Species commerce

A bilingual (English / Hebrew) storefront for selling the Four Species to visitors in
Israel, with two distinct order flows and a staff dashboard.

- **Hotel QR flow** — `/hotel/[hotel_id]` — co-branded landing page, room-number
  checkout, no payment step: the order is charged to the guest's room folio.
- **Private delivery flow** — `/` → `/checkout` — cart, Israeli delivery address,
  and a choice of Bit or cash on delivery.
- **Admin dashboard** — `/admin` — KPIs, order pipeline, hotel partners with
  auto-generated QR links, and product/stock management.

Stack: Next.js 14 (App Router) · Tailwind CSS · Supabase (PostgreSQL, Auth, RLS).

---

## Getting started

```bash
npm install
cp .env.example .env.local     # fill in your Supabase keys
npm run dev
```

Then, in the Supabase SQL editor, run in order:

1. `supabase/schema.sql` — tables, enums, triggers, RPCs and RLS policies
2. `supabase/seed.sql` — the three product tiers and two demo hotels

Create your first staff account in Supabase → Authentication → Users. The
`on_auth_user_created` trigger gives the **first** user the `admin` role; anyone
created after that lands as `staff`. A user with no `profiles` row cannot reach
`/admin` at all.

### Environment variables

| Variable | Where it is used |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | browser + server clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser + server clients (RLS applies) |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** — checkout and admin writes |
| `NEXT_PUBLIC_SITE_URL` | building hotel QR links in the dashboard |

---

## Folder structure

```
.
├── supabase/
│   ├── schema.sql                  Tables, enums, RPCs, RLS policies
│   └── seed.sql                    Product tiers + demo hotels
├── src/
│   ├── middleware.ts               Session refresh + /admin gate
│   ├── app/
│   │   ├── layout.tsx              Fonts, locale cookie, LTR/RTL, providers
│   │   ├── globals.css             Design tokens and component classes
│   │   ├── page.tsx                Homepage (private flow)
│   │   ├── not-found.tsx
│   │   ├── checkout/page.tsx       Private checkout
│   │   ├── order/[id]/page.tsx     Order confirmation
│   │   ├── login/page.tsx          Staff sign-in
│   │   ├── hotel/[hotel_id]/
│   │   │   ├── page.tsx            Co-branded QR landing page
│   │   │   └── checkout/page.tsx   Room-charge checkout
│   │   ├── actions/orders.ts       placeOrder() server action
│   │   └── admin/
│   │       ├── layout.tsx          Sidebar shell + staff guard
│   │       ├── page.tsx            KPI dashboard
│   │       ├── orders/page.tsx     Orders table
│   │       ├── hotels/page.tsx     Hotel CRUD + QR links
│   │       ├── products/page.tsx   Product & stock CRUD
│   │       └── actions.ts          Admin server actions
│   ├── components/
│   │   ├── CartProvider.tsx        localStorage-backed cart
│   │   ├── StoreShell.tsx          Storefront chrome
│   │   ├── SiteHeader.tsx  SiteFooter.tsx  LanguageToggle.tsx
│   │   ├── store/                  ProductCard, ProductGrid, CartDrawer,
│   │   │                           CheckoutForm, HotelHeader
│   │   ├── admin/                  AdminSidebar, KpiCard, StatusBadge,
│   │   │                           OrdersTable, HotelsManager,
│   │   │                           ProductsManager, LoginForm
│   │   └── ui/                     Logo, Section
│   └── lib/
│       ├── types.ts constants.ts format.ts data.ts auth.ts
│       ├── i18n/                   dictionaries.ts, LanguageProvider.tsx, server.ts
│       └── supabase/               client.ts, server.ts, admin.ts, middleware.ts
└── tailwind.config.ts
```

---

## How the pieces fit

**Money is never trusted from the browser.** Checkout posts only product ids and
quantities. The `place_order()` Postgres function re-reads prices, locks each
product row (`for update`) so two guests cannot claim the last VIP set,
decrements stock, and writes the order and its line items in one transaction.
The delivery fee is likewise recomputed server-side.

**Authorization is a database row, not a claim.** `is_staff()` checks for a
`profiles` row; every table policy calls it. The service-role client is only
ever reached through `requireStaff()`, and never imported into a client
component.

**Language is a cookie, not a URL segment.** That keeps `/hotel/[hotel_id]`
exactly as printed on the QR cards while still letting server components render
in Hebrew. `LanguageProvider` writes the cookie and calls `router.refresh()`, so
server- and client-rendered strings switch together. Direction is set on `<html>`
and the CSS uses logical properties (`ms-`, `-start`, `-end`), so RTL needs no
mirrored stylesheet.

**Order status** moves through Received → Packing → Out for delivery →
Delivered (plus Cancelled), editable inline from the orders table.

## Scripts

```bash
npm run dev        # development server
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```
