create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  experience_id uuid references experiences(id) on delete cascade,
  quantity integer not null default 1,
  selected_date timestamptz,
  selected_time text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table cart_items enable row level security;

-- RLS Policies
create policy "Users can view their own cart items"
  on cart_items for select
  using (auth.uid() = user_id);

create policy "Users can add items to their cart"
  on cart_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their cart items"
  on cart_items for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can remove items from their cart"
  on cart_items for delete
  using (auth.uid() = user_id); 