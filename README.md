# GSoC 2026 Sprint Tracker

A personal dashboard to track GSoC 2026 contributions across ML4SCI, Kubeflow, and Apache Airflow.

## Features

- Track pull requests across 3 organizations
- Sprint task checklist
- Mentor interaction log
- Deadline countdown
- Persistent data via Supabase

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (PostgreSQL)
- Tailwind CSS
- Vercel (deployment)

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up Supabase

Run this SQL in your Supabase SQL editor:
```sql
create table prs (
  id text primary key,
  org text,
  repo text,
  description text,
  link text,
  issue text,
  type text,
  status text,
  date text,
  created_at timestamptz default now()
);

create table mentors (
  id text primary key,
  name text,
  org text,
  platform text,
  topic text,
  notes text,
  status text,
  date text,
  created_at timestamptz default now()
);

create table sprint_tasks (
  id text primary key,
  day text,
  text text,
  done boolean default false,
  created_at timestamptz default now()
);

alter table prs disable row level security;
alter table mentors disable row level security;
alter table sprint_tasks disable row level security;
```

### 5. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deployed on Vercel. Add environment variables in Vercel dashboard under Project Settings → Environment Variables.

## License

Private — personal use only.