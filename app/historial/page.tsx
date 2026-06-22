"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import BookingCard from "@/components/BookingCard"
import { type Booking } from "@/lib/bookings"

interface Props {
  bookings?: Booking[]
  onUpdate?: (b: Booking) => void
  onDelete?: (id: number) => void
}

const SOURCE_LABELS: Record<string, string> = {
  viator: "Viator",
  gyg: "GetYourGuide",
  direct: "Venta Directa",
}
const SOURCE_COLORS: Record<string, string> = {
  viator: "#00A680",
  gyg: "#FF5533",
  direct: "#8B5CF6",
}

export default function HistorialPage({ bookings = [], onUpdate = () => {}, onDelete = () => {} }: Props) {
  const [search, setSearch] = useState("")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState("")

  const filtered = bookings.filter((b) => {
    const src = sourceFilter === "all" || b.source === sourceFilter
    const srch =
      !search ||
      `${b.clientName} ${b.tour} ${b.hotel} ${b.confirmation}`
        .toLowerCase()
        .includes(search.toLowerCase())
    const dt = !dateFilter || (b.date || "").includes(dateFilter)
    return src && srch && dt
  })

  const totalGuests = bookings.reduce((s, b) => s + (Number(b.guests) || 0), 0)
  const viatorCount = bookings.filter((b) => b.source === "viator").length
  const gygCount = bookings.filter((b) => b.source === "gyg").length
  const directCount = bookings.filter((b) => b.source === "direct").length

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white tracking-wider">HISTORIAL DE RESERVAS</h1>
        <p className="text-sm text-neutral-400 mt-0.5">
          {bookings.length} reservas en total — todas las fuentes
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <p className="text-xs text-neutral-400 tracking-wider mb-1">TOTAL RESERVAS</p>
          <p className="text-2xl font-bold text-orange-500 font-mono">{bookings.length}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <p className="text-xs text-neutral-400 tracking-wider mb-1">TOTAL PERSONAS</p>
          <p className="text-2xl font-bold text-white font-mono">{totalGuests}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <p className="text-xs text-neutral-400 tracking-wider mb-1">VIATOR</p>
          <p className="text-2xl font-bold font-mono" style={{ color: "#00A680" }}>{viatorCount}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <p className="text-xs text-neutral-400 tracking-wider mb-1">GET YOUR GUIDE</p>
          <p className="text-2xl font-bold font-mono" style={{ color: "#FF5533" }}>{gygCount}</p>
        </div>
      </div>

      {/* Activity overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {(["viator", "gyg", "direct"] as const).map((src) => {
          const srcBookings = bookings.filter((b) => b.source === src)
          return (
            <div
              key={src}
              className="bg-neutral-900 border border-neutral-700 rounded-lg p-4"
              style={{ borderLeftColor: SOURCE_COLORS[src], borderLeftWidth: 3 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded"
                  style={{
                    background: SOURCE_COLORS[src] + "22",
                    color: SOURCE_COLORS[src],
                    border: `1px solid ${SOURCE_COLORS[src]}44`,
                  }}
                >
                  {SOURCE_LABELS[src]}
                </span>
                <span className="text-lg font-bold text-white font-mono">{srcBookings.length}</span>
              </div>
              <div className="space-y-1">
                {srcBookings.slice(0, 3).map((b) => (
                  <div key={b.id} className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400 truncate max-w-[60%]">
                      {b.clientName || "Sin nombre"}
                    </span>
                    <span className="text-xs text-neutral-600">{b.time || "—"}</span>
                  </div>
                ))}
                {srcBookings.length > 3 && (
                  <p className="text-xs text-neutral-600">+{srcBookings.length - 3} más</p>
                )}
                {srcBookings.length === 0 && (
                  <p className="text-xs text-neutral-600">Sin reservas</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            placeholder="Buscar reservas…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-600 focus:border-orange-500 outline-none"
          />
        </div>
        <input
          placeholder="Filtrar por fecha"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="py-2.5 px-3 text-sm rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-600 focus:border-orange-500 outline-none w-36"
        />
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="py-2.5 px-3 text-sm rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:border-orange-500 outline-none cursor-pointer"
        >
          <option value="all">Todas las fuentes</option>
          <option value="viator">Viator</option>
          <option value="gyg">GetYourGuide</option>
          <option value="direct">Venta Directa</option>
        </select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-neutral-500">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-medium text-white mb-1">No se encontraron reservas</p>
          <p className="text-sm">Intenta cambiar los filtros de búsqueda.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-neutral-500 mb-4 tracking-wider">
            MOSTRANDO {filtered.length} DE {bookings.length} RESERVAS
          </p>
          {filtered.map((b) => (
            <BookingCard key={b.id} booking={b} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </>
      )}
    </div>
  )
}
