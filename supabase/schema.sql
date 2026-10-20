-- AAKAAR by Meenal — production data model (Supabase / Postgres).
-- NOT APPLIED ANYWHERE YET. Run in a new Supabase project, load real products,
-- then point src/data/catalog.ts at this data (see README).
-- Row-level security is on for every table. Orders, payments and stock are
-- written only by server functions using the service role, never by the browser.

create extension if not exists "pgcrypto";

-- ---------- catalogue ----------
create table categories (
  slug        text primary key,                -- planters, candle-holders, trays-bowls, decor
  name        text not null,
  blurb       text not null default '',
  sort_order  int  not null default 0
);

create type material as enum ('cement', 'concrete', 'resin');
create type availability as enum ('in_stock', 'low_stock', 'made_to_order', 'sold_out');

create table products (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  sku              text unique not null,
  name             text not null,
  short            text not null default '',
  description      text not null default '',
  category         text not null references categories(slug),
  material         material not null,
  material_label   text not null,
  finish           text not null default '',
  price_paise      int  not null check (price_paise > 0),   -- money as integers
  compare_at_paise int  check (compare_at_paise > price_paise),
  dimensions       text not null default '',
  weight           text,
  images           jsonb not null default '[]',              -- [{src, alt}]
  spaces           text[] not null default '{}',             -- living, desk, bedroom, balcony, gifting
  care             text[] not null default '{}',
  shipping_note    text,
  set_of           int,
  featured         boolean not null default false,
  bestseller       boolean not null default false,
  limited          boolean not null default false,
  active           boolean not null default true,
  seo_title        text,
  seo_description  text,
  created_at       timestamptz not null default now()
);

-- one row per colour / finish option
create table product_variants (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references products(id) on delete cascade,
  code          text not null,                               -- e.g. natural-grey
  label         text not null,
  hex           text,
  price_delta_paise int not null default 0,
  unique (product_id, code)
);

-- stock per variant; null quantity = made to order
create table inventory (
  variant_id   uuid primary key references product_variants(id) on delete cascade,
  quantity     int check (quantity >= 0),
  updated_at   timestamptz not null default now()
);

-- availability is derived from stock so the storefront never invents it
create view product_availability as
select p.id as product_id,
  case
    when bool_and(i.quantity is null) then 'made_to_order'
    when coalesce(sum(i.quantity), 0) = 0 then 'sold_out'
    when sum(i.quantity) <= 3 then 'low_stock'
    else 'in_stock'
  end::availability as availability
from products p
join product_variants v on v.product_id = p.id
left join inventory i on i.variant_id = v.id
group by p.id;

-- ---------- customers & orders ----------
create table customer_profiles (
  id          uuid primary key default gen_random_uuid(),
  auth_user   uuid unique references auth.users(id) on delete set null,
  name        text not null,
  email       text not null,
  phone       text not null,
  created_at  timestamptz not null default now()
);

create type order_status as enum ('pending_payment', 'paid', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded');

create table orders (
  id                  uuid primary key default gen_random_uuid(),
  number              text unique not null,                  -- e.g. AAK-K3Z9Q
  customer_id         uuid not null references customer_profiles(id),
  status              order_status not null default 'pending_payment',
  subtotal_paise      int not null,
  shipping_paise      int not null,
  total_paise         int not null,
  shipping_address    jsonb not null,
  razorpay_order_id   text unique,
  razorpay_payment_id text unique,
  created_at          timestamptz not null default now(),
  paid_at             timestamptz
);

create table order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references orders(id) on delete cascade,
  product_id   uuid not null references products(id),
  variant_id   uuid not null references product_variants(id),
  qty          int  not null check (qty between 1 and 10),
  unit_paise   int  not null                                 -- price snapshot at purchase
);

-- ---------- enquiries, messages, newsletter ----------
create table custom_enquiries (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(name) between 2 and 120),
  phone         text not null check (char_length(phone) between 10 and 15),
  email         text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  product_type  text not null,
  quantity      int  not null check (quantity between 1 and 5000),
  budget        text not null,
  colour        text,
  details       text not null check (char_length(details) between 15 and 4000),
  message       text check (char_length(message) <= 4000),
  image_path    text,                                         -- key in the private 'custom-references' bucket
  status        text not null default 'new' check (status in ('new', 'replied', 'quoted', 'accepted', 'declined')),
  created_at    timestamptz not null default now()
);

create table contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 120),
  email       text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  topic       text not null,
  message     text not null check (char_length(message) between 10 and 4000),
  created_at  timestamptz not null default now()
);

create table newsletter_subscriptions (
  email       text primary key check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  consented_at timestamptz not null default now(),
  confirmed   boolean not null default false              -- double opt-in via the email provider
);

-- product_reviews: add only when reviews come from verified delivered orders.

-- ---------- admins ----------
create table admins (user_id uuid primary key references auth.users(id) on delete cascade);
create function is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where user_id = auth.uid())
$$;

-- ---------- row-level security ----------
alter table categories enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table inventory enable row level security;
alter table customer_profiles enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table custom_enquiries enable row level security;
alter table contact_messages enable row level security;
alter table newsletter_subscriptions enable row level security;
alter table admins enable row level security;

-- public catalogue reads
create policy "read categories" on categories for select using (true);
create policy "read active products" on products for select using (active or is_admin());
create policy "read variants" on product_variants for select using (true);
create policy "admins read inventory" on inventory for select using (is_admin());

-- customers see only their own records (once accounts exist)
create policy "own profile" on customer_profiles for select using (auth_user = auth.uid() or is_admin());
create policy "own orders" on orders for select using (customer_id in (select id from customer_profiles where auth_user = auth.uid()) or is_admin());
create policy "own order items" on order_items for select using (order_id in (select o.id from orders o join customer_profiles c on c.id = o.customer_id where c.auth_user = auth.uid()) or is_admin());

-- visitors may submit, never read back
create policy "submit enquiry" on custom_enquiries for insert with check (status = 'new' and image_path is null);
create policy "admins read enquiries" on custom_enquiries for select using (is_admin());
create policy "admins update enquiries" on custom_enquiries for update using (is_admin());
create policy "submit message" on contact_messages for insert with check (true);
create policy "admins read messages" on contact_messages for select using (is_admin());
create policy "subscribe" on newsletter_subscriptions for insert with check (confirmed = false);

-- admin-only catalogue management
create policy "admin write products" on products for all using (is_admin()) with check (is_admin());
create policy "admin write variants" on product_variants for all using (is_admin()) with check (is_admin());
create policy "admin write inventory" on inventory for all using (is_admin()) with check (is_admin());
create policy "admin write categories" on categories for all using (is_admin()) with check (is_admin());
-- orders, order_items and payment fields: written only by the service role in supabase/functions.

-- ---------- storage ----------
-- PRIVATE bucket for custom-order reference images. Uploads go through a signed
-- upload URL from a server function that checks type (jpg/png/webp/heic) and size (<= 5 MB).
insert into storage.buckets (id, name, public) values ('custom-references', 'custom-references', false) on conflict do nothing;
create policy "admins read references" on storage.objects for select using (bucket_id = 'custom-references' and is_admin());
