"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import BookingCard from "@/components/BookingCard"
import PasteModal from "@/components/PasteModal"
import { type Booking } from "@/lib/bookings"

interface Props {
  bookings: Booking[]
  onAdd: (b: Booking) => void
  onUpdate: (b: Booking) => void
  onDelete: (id: number) => void
}

export default function ViatorPage({ bookings, onAdd, onUpdate, onDelete }: Props) {
  const [modal, setModal] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = bookings.filter(
    (b) =>
      !search ||
      `${b.clientName} ${b.tour} ${b.hotel} ${b.confirmation}`
        .toLowerCase()
        .includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      {modal && (
        <PasteModal source="viator" onClose={() => setModal(false)} onAdd={onAdd} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wider">VIATOR</h1>
          <p className="text-sm text-neutral-400 mt-0.5">
            {bookings.length} reserva{bookings.length !== 1 ? "s" : ""} registrada{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium tracking-wider cursor-pointer hover:bg-green-600 transition-colors"
          style={{ background: "#00A680", color: "#fff", border: "none" }}
        >
          <Plus className="w-4 h-4" /> NUEVA RESERVA
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <p className="text-xs text-neutral-400 tracking-wider mb-1">TOTAL RESERVAS</p>
          <p className="text-2xl font-bold text-white font-mono">{bookings.length}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <p className="text-xs text-neutral-400 tracking-wider mb-1">PERSONAS HOY</p>
          <p className="text-2xl font-bold font-mono" style={{ color: "#00A680" }}>
            {bookings.reduce((s, b) => s + (Number(b.guests) || 0), 0)}
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <p className="text-xs text-neutral-400 tracking-wider mb-1">TOURS ACTIVOS</p>
          <p className="text-2xl font-bold text-white font-mono">
            {new Set(bookings.map((b) => b.tour)).size}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <input
          placeholder="Buscar por cliente, tour, hotel, confirmación…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-600 focus:border-green-500 outline-none"
        />
      </div>

      {/* Bookings list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-neutral-500">
          <div className="text-4xl mb-3">📋</div>
          <p className="font-medium text-white mb-1">Sin reservas de Viator</p>
          <p className="text-sm">Haz clic en "NUEVA RESERVA" para pegar una reserva.</p>
        </div>
      ) : (
        filtered.map((b) => (
          <BookingCard key={b.id} booking={b} onUpdate={onUpdate} onDelete={onDelete} />
        ))
      )}
    </div>
  )
}
