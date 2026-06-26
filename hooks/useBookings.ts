import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { SAMPLE_BOOKINGS, type Booking } from "@/lib/bookings"

const BOOKINGS_STORAGE_KEY = "puntaca_bookings"

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load bookings from Supabase or localStorage
  const loadBookings = async () => {
    try {
      setLoading(true)

      if (supabase) {
        // Try Supabase first
        const { data, error: err } = await supabase
          .from("bookings")
          .select("*")
          .order("createdAt", { ascending: false })

        if (err) {
          console.warn("Supabase error, falling back to localStorage:", err)
          loadFromLocalStorage()
          return
        }

        if (data) {
          setBookings((data as Booking[]) || [])
          setError(null)
          return
        }
      }

      loadFromLocalStorage()
    } catch (err) {
      console.warn("Error loading from Supabase, falling back to localStorage:", err)
      loadFromLocalStorage()
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

  // Add booking
  const addBooking = async (booking: Booking) => {
    try {
      if (supabase) {
        const { error: err } = await supabase.from("bookings").insert([booking])
        if (!err) {
          await loadBookings()
          return true
        }
      }

      // Fallback to localStorage
      const newBookings = [booking, ...bookings]
      setBookings(newBookings)
      saveToLocalStorage(newBookings)
      return true
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    }
  }

  // Update booking
  const updateBooking = async (booking: Booking) => {
    try {
      if (supabase) {
        const { error: err } = await supabase
          .from("bookings")
          .update(booking)
          .eq("id", booking.id)
        if (!err) {
          await loadBookings()
          return true
        }
      }

      // Fallback to localStorage
      const newBookings = bookings.map((b) => (b.id === booking.id ? booking : b))
      setBookings(newBookings)
      saveToLocalStorage(newBookings)
      return true
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    }
  }

  // Delete booking
  const deleteBooking = async (id: number) => {
    try {
      if (supabase) {
        const { error: err } = await supabase.from("bookings").delete().eq("id", id)
        if (!err) {
          await loadBookings()
          return true
        }
      }

      // Fallback to localStorage
      const newBookings = bookings.filter((b) => b.id !== id)
      setBookings(newBookings)
      saveToLocalStorage(newBookings)
      return true
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    }
  }

  // Load bookings on mount
  useEffect(() => {
    loadBookings()
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
