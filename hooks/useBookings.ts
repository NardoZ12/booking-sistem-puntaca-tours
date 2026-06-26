import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { SAMPLE_BOOKINGS, type Booking } from "@/lib/bookings"

const BOOKINGS_STORAGE_KEY = "puntaca_bookings"

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load bookings from Supabase
  const loadBookings = async () => {
    if (!supabase) {
      console.log("Supabase not configured")
      loadFromLocalStorage()
      return
    }

    try {
      setLoading(true)
      console.log("Loading bookings from Supabase...")
      const { data, error: err } = await supabase
        .from("bookings")
        .select("*")
        .order("createdAt", { ascending: false })

      if (err) {
        console.error("Supabase load error:", err)
        setError(err.message)
        return false
      }

      console.log("Loaded from Supabase:", data?.length || 0, "bookings")
      setBookings((data as Booking[]) || [])
      setError(null)
      return true
    } catch (err) {
      console.error("Error loading from Supabase:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    } finally {
      setLoading(false)
    }
  }

  const loadFromLocalStorage = () => {
    try {
      if (typeof window === "undefined") {
        setBookings(SAMPLE_BOOKINGS)
        return
      }
      const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY)
      setBookings(stored ? JSON.parse(stored) : SAMPLE_BOOKINGS)
      setError(null)
    } catch (err) {
      console.error("Error loading from localStorage:", err)
      setBookings(SAMPLE_BOOKINGS)
    }
  }

  const saveToLocalStorage = (data: Booking[]) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(data))
      }
    } catch (err) {
      console.error("Error saving to localStorage:", err)
    }
  }

  // Add booking to Supabase
  const addBooking = async (booking: Booking) => {
    if (!supabase) {
      console.log("Supabase not configured, saving to localStorage")
      const newBookings = [booking, ...bookings]
      setBookings(newBookings)
      saveToLocalStorage(newBookings)
      return true
    }

    try {
      console.log("Adding booking to Supabase:", booking.id)
      const { error: err } = await supabase.from("bookings").insert([booking])
      if (err) {
        console.error("Supabase insert error:", err)
        setError(err.message)
        return false
      }

      console.log("Booking added to Supabase successfully")
      await loadBookings()
      return true
    } catch (err) {
      console.error("Error adding booking:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    }
  }

  // Update booking in Supabase
  const updateBooking = async (booking: Booking) => {
    if (!supabase) {
      console.log("Supabase not configured, updating localStorage")
      const newBookings = bookings.map((b) => (b.id === booking.id ? booking : b))
      setBookings(newBookings)
      saveToLocalStorage(newBookings)
      return true
    }

    try {
      console.log("Updating booking in Supabase:", booking.id)
      const { error: err } = await supabase
        .from("bookings")
        .update(booking)
        .eq("id", booking.id)

      if (err) {
        console.error("Supabase update error:", err)
        setError(err.message)
        return false
      }

      console.log("Booking updated successfully")
      await loadBookings()
      return true
    } catch (err) {
      console.error("Error updating booking:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    }
  }

  // Delete booking from Supabase
  const deleteBooking = async (id: number) => {
    if (!supabase) {
      console.log("Supabase not configured, deleting from localStorage")
      const newBookings = bookings.filter((b) => b.id !== id)
      setBookings(newBookings)
      saveToLocalStorage(newBookings)
      return true
    }

    try {
      console.log("Deleting booking from Supabase:", id)
      const { error: err } = await supabase.from("bookings").delete().eq("id", id)

      if (err) {
        console.error("Supabase delete error:", err)
        setError(err.message)
        return false
      }

      console.log("Booking deleted successfully")
      await loadBookings()
      return true
    } catch (err) {
      console.error("Error deleting booking:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    }
  }

  // Set up real-time subscription and initial load
  useEffect(() => {
    loadBookings()

    // Set up real-time subscription if Supabase is configured
    if (!supabase) return

    console.log("Setting up real-time subscription...")
    const subscription = supabase
      .channel("bookings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          console.log("Real-time update received:", payload.eventType)
          loadBookings()
        }
      )
      .subscribe()

    return () => {
      console.log("Unsubscribing from real-time updates")
      subscription.unsubscribe()
    }
  }, [])

  return {
    bookings,
    loading,
    error,
    addBooking,
    updateBooking,
    deleteBooking,
    loadBookings,
  }
}
