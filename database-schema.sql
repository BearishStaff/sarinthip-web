-- Database schema reference
-- Added incrementally from user-provided table definitions.

create table public.branches (
  id uuid not null default gen_random_uuid (),
  name text not null,
  created_at timestamp with time zone null default now(),
  deleted_at timestamp with time zone null,
  constraint branches_pkey primary key (id)
) TABLESPACE pg_default;

create table public.categories (
  id serial not null,
  name text not null,
  keywords text[] null,
  constraint categories_pkey primary key (id)
) TABLESPACE pg_default;

create table public.bills (
  id uuid not null default gen_random_uuid (),
  branch_id uuid null,
  billing_date date not null,
  source text null,
  is_smart_input boolean null default false,
  created_at timestamp with time zone null default now(),
  constraint bills_pkey primary key (id),
  constraint bills_branch_id_fkey foreign KEY (branch_id) references branches (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.income (
  id uuid not null default gen_random_uuid (),
  branch_id uuid null,
  entry_date date not null,
  amount numeric not null,
  source text null,
  note text null,
  created_at timestamp with time zone null default now(),
  constraint income_pkey primary key (id),
  constraint income_branch_id_fkey foreign KEY (branch_id) references branches (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.expenses (
  id uuid not null default gen_random_uuid (),
  branch_id uuid null,
  bill_id uuid null,
  category_id integer null,
  entry_date date not null,
  item_name text not null,
  qty numeric not null,
  unit text null,
  price_per_unit numeric not null,
  total_amount numeric not null,
  created_at timestamp with time zone null default now(),
  constraint expenses_pkey primary key (id),
  constraint expenses_bill_id_fkey foreign KEY (bill_id) references bills (id) on delete CASCADE,
  constraint expenses_branch_id_fkey foreign KEY (branch_id) references branches (id),
  constraint expenses_category_id_fkey foreign KEY (category_id) references categories (id)
) TABLESPACE pg_default;
