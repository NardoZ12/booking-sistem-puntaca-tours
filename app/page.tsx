"use client"

import { useState } from "react"
import { ChevronRight, Bell, RefreshCw, LogOut } from "lucide-react"
import ViatorPage from "./viator/page"
import GYGPage from "./getyourguide/page"
import VentaDirectaPage from "./venta-directa/page"
import HistorialPage from "./historial/page"
import { SAMPLE_BOOKINGS, type Booking } from "@/lib/bookings"
import { useAuth } from "@/hooks/useAuth"
import { PuntacaLogo } from "@/components/PuntacaLogo"

export default function PuntacaToursDashboard() {
  const { operator, loading, logout } = useAuth()
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>(SAMPLE_BOOKINGS)

  const addBooking = (b: Booking) => setBookings((prev) => [b, ...prev])
  const updateBooking = (updated: Booking) =>
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
  const deleteBooking = (id: number) =>
    setBookings((prev) => prev.filter((b) => b.id !== id))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <div className="text-center">
          <div className="text-4xl mb-4">🌴</div>
          <p className="text-white">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!operator) {
    return null // useAuth redirige al login
  }

  const viatorBookings = bookings.filter((b) => b.source === "viator")
  const gygBookings = bookings.filter((b) => b.source === "gyg")
  const directBookings = bookings.filter((b) => b.source === "direct")
  const todayStr = new Date().toLocaleDateString("es-DO", { weekday: "short", day: "numeric", month: "short" })

  const navItems = [
    { id: "overview", label: "HISTORIAL DE RESERVAS", icon: "📋" },
    { id: "gyg", label: "GET YOUR GUIDE", icon: "🟠" },
    { id: "viator", label: "VIATOR", icon: "🟢" },
    { id: "direct", label: "VENTA DIRECTA", icon: "🟣" },
  ]

  const recentBookings = [...bookings].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 5)

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-72"} bg-neutral-900 border-r border-neutral-700 transition-all duration-300 fixed md:relative z-50 md:z-auto h-full`}
      >
        <div className="p-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-6">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <PuntacaLogo size={24} />
                <div>
                  <h1 className="text-orange-500 font-bold text-sm tracking-wider">PUNTACA</h1>
                  <p className="text-neutral-500 text-xs">Sistema de Reservas</p>
                </div>
              </div>
            )}
            {sidebarCollapsed && <PuntacaLogo size={20} />}
            <button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-neutral-400 hover:text-orange-500 bg-transparent border-0 cursor-pointer p-1"
            >
              <ChevronRight
                className={`w-5 h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
              />
            </button>
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded transition-colors text-left ${
                  activeSection === item.id
                    ? "bg-orange-500 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium tracking-wider">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Status panel */}
          {!sidebarCollapsed && (
            <div className="mt-8 p-4 bg-neutral-800 border border-neutral-700 rounded">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-white">SISTEMA ACTIVO</span>
              </div>
              <div className="text-xs text-neutral-500 space-y-1">
                <div>VIATOR: {viatorBookings.length} reservas</div>
                <div>GYG: {gygBookings.length} reservas</div>
                <div>DIRECTAS: {directBookings.length} reservas</div>
                <div className="pt-1 text-orange-500">TOTAL: {bookings.length} reservas</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-6 flex-shrink-0">
          <div className="text-sm text-neutral-400 tracking-wider">
            PUNTACA TOURS /{" "}
            <span className="text-orange-500">
              {navItems.find((n) => n.id === activeSection)?.label || "OVERVIEW"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-neutral-500">{todayStr.toUpperCase()}</div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 border-l border-neutral-700 pl-4">
              <span>{operator?.name}</span>
            </div>
            <button className="text-neutral-400 hover:text-orange-500 bg-transparent border-0 cursor-pointer">
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.location.reload()}
              className="text-neutral-400 hover:text-orange-500 bg-transparent border-0 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={logout}
              className="text-neutral-400 hover:text-red-500 bg-transparent border-0 cursor-pointer p-1"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-auto">
          {activeSection === "overview" && (
            <HistorialPage
              bookings={bookings}
              onUpdate={updateBooking}
              onDelete={deleteBooking}
            />
          )}
          {activeSection === "viator" && (
            <ViatorPage
              bookings={viatorBookings}
              onAdd={addBooking}
              onUpdate={updateBooking}
              onDelete={deleteBooking}
            />
          )}
          {activeSection === "gyg" && (
            <GYGPage
              bookings={gygBookings}
              onAdd={addBooking}
              onUpdate={updateBooking}
              onDelete={deleteBooking}
            />
          )}
          {activeSection === "direct" && (
            <VentaDirectaPage
              bookings={directBookings}
              onAdd={addBooking}
              onUpdate={updateBooking}
              onDelete={deleteBooking}
            />
          )}
        </div>
      </div>
    </div>
  )
}
