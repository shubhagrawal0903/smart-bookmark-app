"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [bookmarks, setBookmarks] = useState<any[]>([])

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUser(data.user)
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    if (!user) return

    fetchBookmarks()

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchBookmarks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false })

    setBookmarks(data || [])
  }

  const addBookmark = async () => {
    if (!title || !url || !user) return

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id
    })

    setTitle("")
    setUrl("")
  }

  const deleteBookmark = async (id: string) => {
    await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setBookmarks([])
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <button
          onClick={() =>
            supabase.auth.signInWithOAuth({ provider: "google" })
          }
          className="bg-black text-white px-6 py-3 rounded"
        >
          Sign in with Google
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">
      <h1 className="text-xl font-bold">Welcome {user.email}</h1>

      <div className="space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border p-2"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          className="w-full border p-2"
        />
        <button
          onClick={addBookmark}
          className="bg-black text-white px-4 py-2"
        >
          Add Bookmark
        </button>
      </div>

      <div className="space-y-2">
        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="border p-3 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{b.title}</p>
              <a
                href={b.url}
                target="_blank"
                className="text-blue-500"
              >
                {b.url}
              </a>
            </div>

            <button
              onClick={() => deleteBookmark(b.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2"
      >
        Logout
      </button>
    </div>
  )
}
