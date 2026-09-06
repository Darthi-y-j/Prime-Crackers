# Aura Crackers — Product Catalogue & Enquiry Platform

A modern, responsive fireworks/crackers product catalogue with WhatsApp enquiry flow and a separate admin management panel.

## Features

### Customer Website
- Premium festive design (navy, gold, clean layout)
- Product catalogue with search, filters, and sorting
- Category browsing
- Product detail pages with quantity selector
- **WhatsApp enquiry flow** (no cart, no payment)
- SEO metadata, responsive mobile design

### Admin Panel
- Secure login via Supabase Auth
- Dashboard with stats and recent enquiries
- Product & category CRUD with image upload
- Enquiry management with status tracking
- Customer view (from enquiry data)
- Website settings (business info, WhatsApp number, etc.)

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage, RLS)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env` and add your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run database migration

In Supabase SQL Editor, run the contents of:

```
supabase/migrations/001_initial_schema.sql
```

### 4. Create storage buckets

In Supabase Dashboard → Storage, create these **public** buckets:
- `product-images`
- `category-images`
- `logos`

Then uncomment and run the storage policies at the bottom of the migration file.

### 5. Create admin user

1. In Supabase Dashboard → Authentication → Users, create a user with email/password
2. Copy the user's UUID from the auth.users table
3. Run in SQL Editor:

```sql
INSERT INTO admin_users (auth_user_id, name, email, role)
VALUES ('YOUR-AUTH-USER-UUID', 'Admin', 'admin@example.com', 'admin');
```

### 6. Start development server

```bash
npm run dev
```

- Customer site: `http://localhost:5173`
- Admin panel: `http://localhost:5173/admin/login`

## Important Notes

- **No shopping cart** — customers enquire about one product at a time via WhatsApp
- **No payment gateway** — this is an enquiry/catalogue system only
- WhatsApp number is stored in `website_settings` — never hardcoded
- Enquiries are saved to Supabase before opening WhatsApp

## Project Structure

```
src/
├── components/
│   ├── customer/     # Customer-facing UI components
│   ├── admin/        # Admin dashboard components
│   └── shared/       # Shared components (SEO)
├── contexts/         # React contexts (Auth, Settings, Toast)
├── layouts/          # Customer & Admin layouts
├── lib/              # Utilities, Supabase client, WhatsApp helpers
├── pages/
│   ├── customer/     # Customer pages
│   └── admin/        # Admin pages
├── services/         # Supabase service layer
└── types/            # TypeScript types
supabase/
└── migrations/       # Database schema & RLS policies
```

## Build for Production

```bash
npm run build
npm run preview
```
