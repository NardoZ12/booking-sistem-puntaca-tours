"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogIn } from "lucide-react"
import { validateOperator, setStoredOperator, OPERATORS } from "@/lib/auth"
import { PuntacaLogo } from "@/components/PuntacaLogo"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const operator = validateOperator(email, password)
      if (!operator) {
        setError("Email o contraseña incorrectos")
        setLoading(false)
        return
      }

      setStoredOperator(operator)
      router.push("/")
    } catch (err) {
      setError("Error al iniciar sesión")
      setLoading(false)
    }
  }

  const handleDemo = (op: typeof OPERATORS[0]) => {
    setStoredOperator(op)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-black flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <PuntacaLogo size={120} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-wider">PUNTACA TOURS</h1>
          <p className="text-orange-500 font-semibold">Sistema de Reservas</p>
        </div>

        {/* Login Card */}
        <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm text-neutral-400 block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operador@puntacatours.com"
                className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-400 block mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-orange-500 text-white font-semibold py-2.5 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* Demo Section */}
          <div className="mt-6 pt-6 border-t border-neutral-700">
            <p className="text-xs text-neutral-500 mb-3 text-center">O usa una cuenta de demostración:</p>
            <div className="space-y-2">
              {OPERATORS.map((op) => (
                <button
                  key={op.email}
                  onClick={() => handleDemo(op)}
                  className="w-full px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-lg text-sm text-neutral-300 transition-colors text-left"
                >
                  <div className="font-medium text-white">{op.name}</div>
                  <div className="text-xs text-neutral-500">{op.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-neutral-500 text-sm">
          <p>© 2026 Puntaca Tours. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}
