"use client"

import { useState } from "react"
import { ChevronRight, Bell, RefreshCw, LogOut, Menu, X } from "lucide-react"
import ViatorPage from "./viator/page"
import GYGPage from "./getyourguide/page"
import VentaDirectaPage from "./venta-directa/page"
import HistorialPage from "./historial/page"
import { useAuth } from "@/hooks/useAuth"
import { useBookings } from "@/hooks/useBookings"
import { PuntacaLogo } from "@/components/PuntacaLogo"

export default function PuntacaToursDashboard() {
  const { operator, loading, logout } = useAuth()
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { bookings, addBooking, updateBooking, deleteBooking } = useBookings()

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

  const selectSection = (id: string) => {
    setActiveSection(id)
    setMobileOpen(false)
  }

  return (
    <div className="flex h-screen">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-neutral-900 border-r border-neutral-700 transition-transform duration-300 fixed md:relative z-50 h-full w-72 ${sidebarCollapsed ? "md:w-16" : "md:w-72"} ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-6">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <PuntacaLogo size={50} />
                <div>
                  <h1 className="text-orange-500 font-bold text-sm tracking-wider">PUNTACA</h1>
                  <p className="text-neutral-500 text-xs">Sistema de Reservas</p>
                </div>
              </div>
            )}
            {sidebarCollapsed && <PuntacaLogo size={40} />}
            {/* Desktop collapse toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:block text-neutral-400 hover:text-orange-500 bg-transparent border-0 cursor-pointer p-1"
            >
              <ChevronRight
                className={`w-5 h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
              />
            </button>
            {/* Mobile close toggle */}
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-neutral-400 hover:text-orange-500 bg-transparent border-0 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => selectSection(item.id)}
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
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <div className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-4 md:px-6 flex-shrink-0 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-neutral-400 hover:text-orange-500 bg-transparent border-0 cursor-pointer p-1 flex-shrink-0"
              title="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs md:text-sm text-neutral-400 tracking-wider truncate">
              <span className="hidden sm:inline">PUNTACA TOURS /{" "}</span>
              <span className="text-orange-500">
                {navItems.find((n) => n.id === activeSection)?.label || "OVERVIEW"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            <div className="hidden md:block text-xs text-neutral-500">{todayStr.toUpperCase()}</div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400 md:border-l border-neutral-700 md:pl-4">
              <span className="truncate max-w-[120px]">{operator?.name}</span>
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
