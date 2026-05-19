-- Migration: Add Collections and Tags
-- Add this to your Supabase SQL Editor and run it.

-- 1. Add tags array to products table
alter table public.products add column tags text[] default '{}'::text[];

-- 2. Create Collections Table
create table public.collections (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  image_url text,
  collection_type text check (collection_type in ('manual', 'smart')) default 'manual',
  smart_rule_value text, -- E.g., the tag value to match for smart collections
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create manual collection to products junction table
create table public.collection_products (
  collection_id uuid references public.collections(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  position integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (collection_id, product_id)
);

-- 4. Triggers for updated_at
create trigger collections_updated_at before update on public.collections for each row execute procedure handle_updated_at();

-- 5. Row Level Security
alter table public.collections enable row level security;
alter table public.collection_products enable row level security;

-- Collections policies
create policy "Collections are publicly readable" on public.collections for select using (true);
create policy "Admins can view all collections" on public.collections for select using (is_admin());
create policy "Admins can manage collections" on public.collections using (is_admin());

-- Collection Products policies
create policy "Collection products are publicly readable" on public.collection_products for select using (true);
create policy "Admins can view all collection products" on public.collection_products for select using (is_admin());
create policy "Admins can manage collection products" on public.collection_products using (is_admin());

-- 6. Setup storage for collection images
insert into storage.buckets (id, name, public) values ('collections', 'collections', true) on conflict do nothing;
create policy "Public Access to collection images" on storage.objects for select using (bucket_id = 'collections');
create policy "Admin upload access for collections" on storage.objects for insert with check (bucket_id = 'collections' and is_admin());
create policy "Admin update access for collections" on storage.objects for update using (bucket_id = 'collections' and is_admin());
create policy "Admin delete access for collections" on storage.objects for delete using (bucket_id = 'collections' and is_admin());
