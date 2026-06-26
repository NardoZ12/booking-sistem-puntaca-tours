import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Booking } from "@/lib/bookings"

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load bookings from Supabase
  const loadBookings = async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from("bookings")
        .select("*")
        .order("createdAt", { ascending: false })

      if (err) {
        console.error("Error loading bookings:", err)
        setError(err.message)
        return
      }

      setBookings((data as Booking[]) || [])
      setError(null)
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Add booking to Supabase
  const addBooking = async (booking: Booking) => {
    try {
      const { error: err } = await supabase.from("bookings").insert([booking])

      if (err) {
        console.error("Error adding booking:", err)
        setError(err.message)
        return false
      }

      // Reload bookings
      await loadBookings()
      return true
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    }
  }

  // Update booking in Supabase
  const updateBooking = async (booking: Booking) => {
    try {
      const { error: err } = await supabase
        .from("bookings")
        .update(booking)
        .eq("id", booking.id)

      if (err) {
        console.error("Error updating booking:", err)
        setError(err.message)
        return false
      }

      // Reload bookings
      await loadBookings()
      return true
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    }
  }

  // Delete booking from Supabase
  const deleteBooking = async (id: number) => {
    try {
      const { error: err } = await supabase.from("bookings").delete().eq("id", id)

      if (err) {
        console.error("Error deleting booking:", err)
        setError(err.message)
        return false
      }

      // Reload bookings
      await loadBookings()
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
