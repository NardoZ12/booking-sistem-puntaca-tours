import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getStoredOperator, clearStoredOperator } from "@/lib/auth"

export function useAuth() {
  const router = useRouter()
  const [operator, setOperator] = useState<ReturnType<typeof getStoredOperator>>(null)
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Only run on client side
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    try {
      const stored = getStoredOperator()
      if (!stored) {
        router.replace("/login")
      } else {
        setOperator(stored)
      }
    } catch (error) {
      console.error("Auth error:", error)
      router.replace("/login")
    } finally {
      setLoading(false)
    }
  }, [isMounted, router])

  const logout = () => {
    clearStoredOperator()
    router.replace("/login")
  }

  return { operator, loading, logout }
}
