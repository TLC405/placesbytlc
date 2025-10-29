-- Create app_role enum
create type public.app_role as enum ('admin', 'moderator', 'user');

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  gender text check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create policy "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

-- Security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Create couples table
create table public.couples (
  id uuid default gen_random_uuid() primary key,
  partner_1_id uuid references public.profiles(id) on delete cascade not null,
  partner_2_id uuid references public.profiles(id) on delete cascade,
  pairing_code text unique,
  code_expires_at timestamp with time zone,
  paired_at timestamp with time zone,
  status text check (status in ('pending', 'paired', 'unpaired')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.couples enable row level security;

create policy "Users can view their own couple"
  on public.couples for select
  using (
    auth.uid() = partner_1_id or 
    auth.uid() = partner_2_id
  );

create policy "Users can create couple pairing"
  on public.couples for insert
  with check (auth.uid() = partner_1_id);

create policy "Users can update their couple"
  on public.couples for update
  using (
    auth.uid() = partner_1_id or 
    auth.uid() = partner_2_id
  );

-- Create shared_data table
create table public.shared_data (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references public.couples(id) on delete cascade not null,
  data_type text check (data_type in ('plan', 'favorite', 'memory', 'note')) not null,
  data jsonb not null,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.shared_data enable row level security;

create policy "Couple members can view shared data"
  on public.shared_data for select
  using (
    exists (
      select 1 from public.couples
      where id = couple_id
      and (partner_1_id = auth.uid() or partner_2_id = auth.uid())
    )
  );

create policy "Couple members can insert shared data"
  on public.shared_data for insert
  with check (
    exists (
      select 1 from public.couples
      where id = couple_id
      and (partner_1_id = auth.uid() or partner_2_id = auth.uid())
    )
  );

create policy "Couple members can update shared data"
  on public.shared_data for update
  using (
    exists (
      select 1 from public.couples
      where id = couple_id
      and (partner_1_id = auth.uid() or partner_2_id = auth.uid())
    )
  );

-- Create updates table (for Coming Up features)
create table public.app_updates (
  id uuid default gen_random_uuid() primary key,
  version text not null,
  release_date date,
  update_type text check (update_type in ('feature', 'bugfix', 'security', 'launch')) not null,
  title text not null,
  description text,
  changes jsonb not null,
  status text check (status in ('implemented', 'coming_up', 'archived')) default 'coming_up',
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.app_updates enable row level security;

create policy "Everyone can view updates"
  on public.app_updates for select
  using (true);

create policy "Moderators can insert updates"
  on public.app_updates for insert
  with check (public.has_role(auth.uid(), 'moderator') or public.has_role(auth.uid(), 'admin'));

create policy "Moderators can update updates"
  on public.app_updates for update
  using (public.has_role(auth.uid(), 'moderator') or public.has_role(auth.uid(), 'admin'));

create policy "Moderators can delete updates"
  on public.app_updates for delete
  using (public.has_role(auth.uid(), 'moderator') or public.has_role(auth.uid(), 'admin'));

-- Create themes table (for Felicia's custom themes)
create table public.custom_themes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  colors jsonb not null,
  is_active boolean default false,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.custom_themes enable row level security;

create policy "Everyone can view themes"
  on public.custom_themes for select
  using (true);

create policy "Moderators can manage themes"
  on public.custom_themes for all
  using (public.has_role(auth.uid(), 'moderator') or public.has_role(auth.uid(), 'admin'));

-- Auto-update timestamp trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger couples_updated_at before update on public.couples
  for each row execute procedure public.handle_updated_at();

create trigger shared_data_updated_at before update on public.shared_data
  for each row execute procedure public.handle_updated_at();

create trigger app_updates_updated_at before update on public.app_updates
  for each row execute procedure public.handle_updated_at();

create trigger custom_themes_updated_at before update on public.custom_themes
  for each row execute procedure public.handle_updated_at();

-- Profile creation trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, new.raw_user_meta_data->>'display_name');
  
  -- Auto-assign user role
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');
  
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();