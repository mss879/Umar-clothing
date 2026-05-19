-- Enable the uuid-ossp extension for generating UUIDs if not already enabled
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (extends auth.users)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  email text,
  phone text,
  role text check (role in ('admin', 'customer')) default 'customer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Categories Table
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Products Table
create table products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  description text,
  price numeric not null,
  status text check (status in ('draft', 'active', 'out_of_stock', 'archived')) default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Product Images Table
create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  image_url text not null,
  is_primary boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Inventory Table
create table inventory (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  size text,
  color text,
  stock_quantity integer default 0 not null,
  low_stock_limit integer default 5 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (product_id, size, color)
);

-- 6. Orders Table
create table orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references profiles(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  total_amount numeric not null,
  order_status text check (order_status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')) default 'pending',
  payment_status text check (payment_status in ('pending', 'paid', 'failed', 'refunded')) default 'pending',
  payment_method text,
  shipping_address text not null,
  shipping_city text not null,
  shipping_postal_code text not null,
  delivery_status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Order Items Table
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  size text,
  color text,
  quantity integer not null,
  price numeric not null,
  subtotal numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Promotions Table
create table promotions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  code text unique not null,
  discount_type text check (discount_type in ('percentage', 'fixed_amount')) not null,
  discount_value numeric not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone,
  status text check (status in ('active', 'inactive', 'expired')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Updated_at triggers
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at before update on products for each row execute procedure handle_updated_at();
create trigger inventory_updated_at before update on inventory for each row execute procedure handle_updated_at();
create trigger orders_updated_at before update on orders for each row execute procedure handle_updated_at();
create trigger promotions_updated_at before update on promotions for each row execute procedure handle_updated_at();

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, 'customer');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ROW LEVEL SECURITY (RLS) POLICIES

-- Helper function to check if user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table inventory enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table promotions enable row level security;

-- Profiles: Users can view/edit their own profile. Admins can view/edit all.
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on profiles for select using (is_admin());
create policy "Admins can update all profiles" on profiles for update using (is_admin());

-- Categories: Public read. Admin all access.
create policy "Categories are publicly readable" on categories for select using (true);
create policy "Admins can manage categories" on categories using (is_admin());

-- Products: Public read for active. Admin all access.
create policy "Active products are publicly readable" on products for select using (status = 'active');
create policy "Admins can view all products" on products for select using (is_admin());
create policy "Admins can insert products" on products for insert with check (is_admin());
create policy "Admins can update products" on products for update using (is_admin());
create policy "Admins can delete products" on products for delete using (is_admin());

-- Product Images: Public read. Admin all access.
create policy "Product images are publicly readable" on product_images for select using (true);
create policy "Admins can manage product images" on product_images using (is_admin());

-- Inventory: Public read. Admin all access.
create policy "Inventory is publicly readable" on inventory for select using (true);
create policy "Admins can manage inventory" on inventory using (is_admin());

-- Orders: Users can view own. Admin all access.
create policy "Users can view own orders" on orders for select using (auth.uid() = customer_id);
create policy "Users can insert own orders" on orders for insert with check (auth.uid() = customer_id);
create policy "Admins can view all orders" on orders for select using (is_admin());
create policy "Admins can manage orders" on orders using (is_admin());

-- Order Items: Users can view own. Admin all access.
create policy "Users can view own order items" on order_items for select using (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.customer_id = auth.uid())
);
create policy "Users can insert own order items" on order_items for insert with check (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.customer_id = auth.uid())
);
create policy "Admins can manage order items" on order_items using (is_admin());

-- Promotions: Public read for active. Admin all access.
create policy "Active promotions are publicly readable" on promotions for select using (status = 'active' and start_date <= now() and (end_date is null or end_date >= now()));
create policy "Admins can view all promotions" on promotions for select using (is_admin());
create policy "Admins can manage promotions" on promotions using (is_admin());

-- Set up Storage for product images
insert into storage.buckets (id, name, public) values ('products', 'products', true);
create policy "Public Access to product images" on storage.objects for select using (bucket_id = 'products');
create policy "Admin upload access" on storage.objects for insert with check (bucket_id = 'products' and is_admin());
create policy "Admin update access" on storage.objects for update using (bucket_id = 'products' and is_admin());
create policy "Admin delete access" on storage.objects for delete using (bucket_id = 'products' and is_admin());
