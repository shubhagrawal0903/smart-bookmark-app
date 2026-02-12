# Smart Bookmark App

This project was built as part of a technical challenge.

The goal was to create a simple bookmark manager where:
- Users log in using Google (OAuth only)
- Each user can add and delete their own bookmarks
- Bookmarks are private per user
- Updates reflect in real-time across tabs
- App is deployed on Vercel

Live URL: https://smart-bookmark-app-six.vercel.app  
GitHub Repo: https://github.com/shubhagrawal0903/smart-bookmark-app 

---

## Tech Stack

- Next.js (App Router)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS
- Vercel

---

## How it works

After signing in with Google, a user can:

- Add a bookmark (title + URL)
- See only their own bookmarks
- Delete their bookmarks
- See changes update instantly across multiple tabs (Realtime)

Row Level Security (RLS) is enabled to ensure users can only access their own data.

---

## Database

Table: `bookmarks`

- id (uuid, primary key)
- user_id (uuid)
- title (text)
- url (text)
- created_at (timestamp)

RLS policies ensure:
- Users can SELECT only their own bookmarks
- Users can INSERT only with their own `user_id`
- Users can DELETE only their own bookmarks

Realtime delete required:

```sql
ALTER TABLE public.bookmarks REPLICA IDENTITY FULL;
```

---

## Challenges I Faced

### 1. OAuth failed after deployment

It worked locally but not on production.

**Fix:**  
Added the Vercel production URL in:
- Supabase → Redirect URLs  
- Google Cloud Console → Authorized Origins  

After updating both, login worked correctly.

---

### 2. RLS returned empty results

After enabling RLS, no data was visible.

**Reason:** No policies were defined.

**Fix:**  
Created SELECT, INSERT, and DELETE policies using:
```
auth.uid() = user_id
```

---

### 3. Delete not updating in real-time

Insert worked in realtime, but delete did not reflect in other tabs.

**Fix:**  
Enabled full replica identity:

```sql
ALTER TABLE public.bookmarks REPLICA IDENTITY FULL;
```

This fixed realtime delete syncing.

---

## Run Locally

1. Clone repo
2. Install dependencies
3. Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

4. Run:

```
npm run dev
```

---

That’s it.
