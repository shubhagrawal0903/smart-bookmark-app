# Smart Bookmark App

This is a simple full-stack bookmark manager built using Next.js (App Router) and Supabase.

The goal of this project was to implement authentication, user-specific database access with RLS, and realtime updates using Supabase.

---

## 🔹 What it does

- Users can sign in using Google
- Add personal bookmarks
- Delete bookmarks
- See updates instantly across multiple tabs (Realtime)
- Each user only sees their own data (Row Level Security enabled)

---

## 🔹 Tech Used

- Next.js (App Router)
- Supabase (Auth, Database, Realtime)
- Google OAuth
- Tailwind CSS

---

## 🔹 Database Structure

Table: `bookmarks`

Columns:
- id (uuid, primary key)
- user_id (uuid)
- title (text)
- url (text)
- created_at (timestamp)

Row Level Security policies ensure users can only access their own records.

---

## 🔹 Running Locally

Create a `.env.local` file:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url  
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key  

Then run:

npm install  
npm run dev  

---

## 🔹 Deployment

The app is deployed on Vercel.

Live URL: https://smart-bookmark-app-six.vercel.app

---

Built as part of a technical challenge.
