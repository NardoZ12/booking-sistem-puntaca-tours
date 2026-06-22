import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getStoredOperator, clearStoredOperator } from "@/lib/auth"

export function useAuth() {
  const router = useRouter()
  const [operator, setOperator] = useState<ReturnType<typeof getStoredOperator>>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = getStoredOperator()
    if (!stored) {
      router.replace("/login")
    } else {
      setOperator(stored)
    }
    setLoading(false)
  }, [router])

  const logout = () => {
    clearStoredOperator()
    router.replace("/login")
  }

  return { operator, loading, logout }
}
