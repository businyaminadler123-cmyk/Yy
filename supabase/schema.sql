-- ============================================================================
--  ARBA MINIM — Luxury Four Species commerce
--  Supabase / PostgreSQL schema
--  Run in the Supabase SQL editor, or: supabase db push
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Enumerated types
-- ----------------------------------------------------------------------------
do $$ begin
  create type product_tier as enum ('standard', 'premium', 'vip');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_channel as enum ('hotel', 'private');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('received', 'packing', 'out_for_delivery', 'delivered', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method as enum ('room_charge', 'bit', 'cash_on_delivery');
exception when duplicate_object then null; end $$;

do $$ begin
  create type staff_role as enum ('admin', 'staff');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- 2. profiles — staff accounts, mirrors auth.users
--    A row here is what grants dashboard access. No row => no /admin.
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text        not null,
  full_name   text,
  role        staff_role  not null default 'staff',
  created_at  timestamptz not null default now()
);

comment on table public.profiles is 'Staff users allowed into the admin dashboard.';

-- Every new auth user gets a profile; the first ever user becomes admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    case when (select count(*) from public.profiles) = 0 then 'admin'::staff_role
         else 'staff'::staff_role end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role check used by every admin policy below.
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid());
$$;

-- ----------------------------------------------------------------------------
-- 3. hotels — partner hotels. `slug` is the public QR identifier: /hotel/<slug>
-- ----------------------------------------------------------------------------
create table if not exists public.hotels (
  id              uuid primary key default gen_random_uuid(),
  slug            text        not null unique,
  name            text        not null,
  name_he         text,
  city            text,
  address         text,
  contact_name    text,
  contact_phone   text,
  contact_email   text,
  logo_url        text,
  accent_color    text        default '#C9A227',
  commission_rate numeric(5,2) not null default 10.00,
  delivery_note   text,
  is_active       boolean     not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint hotels_slug_format check (slug ~ '^[a-z0-9]([a-z0-9-]*[a-z0-9])?$')
);

create index if not exists hotels_active_idx on public.hotels (is_active);

-- ----------------------------------------------------------------------------
-- 4. products — the three tiers of Arba Minim sets
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  slug            text        not null unique,
  tier            product_tier not null,
  name_en         text        not null,
  name_he         text        not null,
  subtitle_en     text,
  subtitle_he     text,
  description_en  text,
  description_he  text,
  highlights_en   text[]      not null default '{}',
  highlights_he   text[]      not null default '{}',
  price_ils       numeric(10,2) not null check (price_ils >= 0),
  price_usd       numeric(10,2) not null check (price_usd >= 0),
  compare_at_ils  numeric(10,2),
  stock           integer     not null default 0 check (stock >= 0),
  low_stock_at    integer     not null default 5,
  is_limited      boolean     not null default false,
  image_url       text,
  sort_order      integer     not null default 0,
  is_active       boolean     not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists products_active_idx on public.products (is_active, sort_order);

-- ----------------------------------------------------------------------------
-- 5. orders + order_items
--    Hotel orders carry a room number and are charged to the room.
--    Private orders carry an Israeli delivery address and pay by Bit or cash.
-- ----------------------------------------------------------------------------
create sequence if not exists public.order_number_seq start 1001;

create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  order_number      text        not null unique
                      default 'AM-' || to_char(now(), 'YY') || '-' || nextval('public.order_number_seq'),
  channel           order_channel  not null,
  status            order_status   not null default 'received',
  payment_method    payment_method not null,

  hotel_id          uuid references public.hotels (id) on delete set null,
  hotel_name        text,                       -- snapshot, survives hotel deletion
  room_number       text,

  customer_name     text        not null,
  customer_email    text        not null,
  customer_phone    text        not null,

  address_line1     text,
  address_line2     text,
  city              text,
  postal_code       text,
  delivery_notes    text,

  subtotal_ils      numeric(10,2) not null default 0,
  delivery_fee_ils  numeric(10,2) not null default 0,
  total_ils         numeric(10,2) not null default 0,
  total_usd         numeric(10,2) not null default 0,

  locale            text        not null default 'en',
  internal_notes    text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- A hotel order must name its hotel and room; a private order must have an address.
  constraint orders_channel_fields check (
    (channel = 'hotel'   and hotel_id is not null and room_number is not null
                         and payment_method = 'room_charge')
    or
    (channel = 'private' and address_line1 is not null and city is not null
                         and payment_method in ('bit', 'cash_on_delivery'))
  )
);

create index if not exists orders_created_idx  on public.orders (created_at desc);
create index if not exists orders_status_idx   on public.orders (status);
create index if not exists orders_hotel_idx    on public.orders (hotel_id);
create index if not exists orders_channel_idx  on public.orders (channel);

create table if not exists public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders (id) on delete cascade,
  product_id    uuid references public.products (id) on delete set null,
  product_name  text not null,               -- snapshot at purchase time
  tier          product_tier,
  unit_price_ils numeric(10,2) not null,
  unit_price_usd numeric(10,2) not null default 0,
  quantity      integer not null check (quantity > 0),
  line_total_ils numeric(10,2) generated always as (unit_price_ils * quantity) stored
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- ----------------------------------------------------------------------------
-- 6. Housekeeping triggers
-- ----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists hotels_touch   on public.hotels;
drop trigger if exists products_touch on public.products;
drop trigger if exists orders_touch   on public.orders;

create trigger hotels_touch   before update on public.hotels   for each row execute function public.touch_updated_at();
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();
create trigger orders_touch   before update on public.orders   for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- 7. place_order() — the single transactional entry point for checkout.
--    Validates stock, decrements it, writes the order and its items, and
--    returns the new order id + human order number.
--    Items arrive as: [{"product_id": "...", "quantity": 2}, ...]
-- ----------------------------------------------------------------------------
create or replace function public.place_order(
  p_channel        order_channel,
  p_payment_method payment_method,
  p_customer_name  text,
  p_customer_email text,
  p_customer_phone text,
  p_items          jsonb,
  p_hotel_id       uuid    default null,
  p_room_number    text    default null,
  p_address_line1  text    default null,
  p_address_line2  text    default null,
  p_city           text    default null,
  p_postal_code    text    default null,
  p_delivery_notes text    default null,
  p_delivery_fee   numeric default 0,
  p_locale         text    default 'en'
)
returns table (order_id uuid, order_number text, total_ils numeric)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id   uuid;
  v_number     text;
  v_hotel_name text;
  v_subtotal   numeric(10,2) := 0;
  v_total_usd  numeric(10,2) := 0;
  v_item       jsonb;
  v_product    public.products%rowtype;
  v_qty        integer;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'ORDER_EMPTY';
  end if;

  if p_channel = 'hotel' then
    select name into v_hotel_name from public.hotels
      where id = p_hotel_id and is_active;
    if v_hotel_name is null then
      raise exception 'HOTEL_NOT_FOUND';
    end if;
  end if;

  insert into public.orders (
    channel, payment_method, hotel_id, hotel_name, room_number,
    customer_name, customer_email, customer_phone,
    address_line1, address_line2, city, postal_code, delivery_notes,
    delivery_fee_ils, locale
  ) values (
    p_channel, p_payment_method, p_hotel_id, v_hotel_name, p_room_number,
    p_customer_name, p_customer_email, p_customer_phone,
    p_address_line1, p_address_line2, p_city, p_postal_code, p_delivery_notes,
    coalesce(p_delivery_fee, 0), coalesce(p_locale, 'en')
  )
  returning id, orders.order_number into v_order_id, v_number;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := greatest(1, (v_item ->> 'quantity')::int);

    -- Lock the row so two guests cannot claim the last VIP set.
    select * into v_product from public.products
      where id = (v_item ->> 'product_id')::uuid and is_active
      for update;

    if not found then
      raise exception 'PRODUCT_UNAVAILABLE';
    end if;

    if v_product.stock < v_qty then
      raise exception 'OUT_OF_STOCK:%', v_product.slug;
    end if;

    update public.products set stock = stock - v_qty where id = v_product.id;

    insert into public.order_items (
      order_id, product_id, product_name, tier,
      unit_price_ils, unit_price_usd, quantity
    ) values (
      v_order_id, v_product.id, v_product.name_en, v_product.tier,
      v_product.price_ils, v_product.price_usd, v_qty
    );

    v_subtotal  := v_subtotal  + v_product.price_ils * v_qty;
    v_total_usd := v_total_usd + v_product.price_usd * v_qty;
  end loop;

  update public.orders
     set subtotal_ils = v_subtotal,
         total_ils    = v_subtotal + coalesce(p_delivery_fee, 0),
         total_usd    = v_total_usd
   where id = v_order_id;

  return query
    select v_order_id, v_number, (v_subtotal + coalesce(p_delivery_fee, 0))::numeric;
end;
$$;

-- ----------------------------------------------------------------------------
-- 8. Dashboard KPIs, computed in one round trip.
-- ----------------------------------------------------------------------------
create or replace function public.admin_kpis(p_since timestamptz default date_trunc('day', now()))
returns table (
  orders_count     bigint,
  revenue_ils      numeric,
  hotel_orders     bigint,
  private_orders   bigint,
  hotel_revenue    numeric,
  private_revenue  numeric,
  pending_count    bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    count(*)                                                          as orders_count,
    coalesce(sum(total_ils), 0)                                       as revenue_ils,
    count(*) filter (where channel = 'hotel')                         as hotel_orders,
    count(*) filter (where channel = 'private')                       as private_orders,
    coalesce(sum(total_ils) filter (where channel = 'hotel'), 0)      as hotel_revenue,
    coalesce(sum(total_ils) filter (where channel = 'private'), 0)    as private_revenue,
    count(*) filter (where status in ('received', 'packing'))          as pending_count
  from public.orders
  where created_at >= p_since
    and status <> 'cancelled';
$$;

-- ----------------------------------------------------------------------------
-- 9. Row Level Security
--    Storefront reads active hotels/products with the anon key.
--    Orders are never readable by anon; checkout goes through place_order()
--    (security definer) or the service-role key inside a server action.
-- ----------------------------------------------------------------------------
alter table public.profiles    enable row level security;
alter table public.hotels      enable row level security;
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "profiles readable by owner"  on public.profiles;
create policy "profiles readable by owner" on public.profiles
  for select using (auth.uid() = id or public.is_staff());

drop policy if exists "hotels public read"   on public.hotels;
create policy "hotels public read" on public.hotels
  for select using (is_active or public.is_staff());

drop policy if exists "hotels staff write"   on public.hotels;
create policy "hotels staff write" on public.hotels
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products
  for select using (is_active or public.is_staff());

drop policy if exists "products staff write" on public.products;
create policy "products staff write" on public.products
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "orders staff only"    on public.orders;
create policy "orders staff only" on public.orders
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "order items staff only" on public.order_items;
create policy "order items staff only" on public.order_items
  for all using (public.is_staff()) with check (public.is_staff());

grant execute on function public.place_order(
  order_channel, payment_method, text, text, text, jsonb, uuid, text,
  text, text, text, text, text, numeric, text
) to anon, authenticated;

grant execute on function public.admin_kpis(timestamptz) to authenticated;
