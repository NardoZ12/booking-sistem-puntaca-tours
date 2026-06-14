"use client"

import { useState } from "react"
import { Plus, Search, X } from "lucide-react"
import BookingCard from "@/components/BookingCard"
import { type Booking, ALL_TOURS } from "@/lib/bookings"

interface Props {
  bookings: Booking[]
  onAdd: (b: Booking) => void
  onUpdate: (b: Booking) => void
  onDelete: (id: number) => void
}

const emptyForm = {
  tour: "", date: "", clientName: "", phone: "",
  hotel: "", meetingPoint: "Lobby", time: "", guests: "",
  amount: "", notes: "",
}

function DirectForm({ onAdd, onClose }: { onAdd: (b: Booking) => void; onClose: () => void }) {
  const [fields, setFields] = useState<typeof emptyForm>(emptyForm)

  const submit = () => {
    if (!fields.clientName || !fields.date) return
    onAdd({
      ...(fields as unknown as Booking),
      id: Date.now(),
      source: "direct",
      guests: Number(fields.guests) || fields.guests,
      confirmation: `DIR-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    })
    onClose()
  }

  const formFields: [string, keyof typeof emptyForm, string, boolean][] = [
    ["Fecha *", "date", "date", false],
    ["Cliente *", "clientName", "text", false],
    ["Teléfono", "phone", "tel", false],
    ["Hotel", "hotel", "text", false],
    ["Meeting point", "meetingPoint", "text", false],
    ["Hora de recogida", "time", "text", false],
    ["# Personas", "guests", "number", false],
    ["Importe (USD)", "amount", "text", false],
  ]

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium px-2 py-1 rounded bg-purple-500/20 text-purple-400 border border-purple-500/40">
              Directa
            </span>
            <span className="text-sm font-medium text-white tracking-wider">NUEVA VENTA DIRECTA</span>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white bg-transparent border-0 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Tour selector */}
          <div>
            <label className="text-xs text-neutral-500 block mb-1">Tour *</label>
            <input
              list="direct-tours"
              value={fields.tour}
              onChange={(e) => setFields((f) => ({ ...f, tour: e.target.value }))}
              placeholder="Selecciona o escribe el nombre del tour"
              className="w-full text-sm px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-600 text-white focus:border-purple-500 outline-none placeholder-neutral-600"
            />
            <datalist id="direct-tours">
              {ALL_TOURS.map((t) => <option key={t} value={t} />)}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {formFields.map(([label, key, type]) => (
              <div key={key}>
                <label className="text-xs text-neutral-500 block mb-1">{label}</label>
                <input
                  type={type}
                  value={fields[key]}
                  onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full text-sm px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-600 text-white focus:border-purple-500 outline-none"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="text-xs text-neutral-500 block mb-1">Notas</label>
            <textarea
              value={fields.notes}
              onChange={(e) => setFields((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="w-full text-sm px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-600 text-white focus:border-purple-500 outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={submit}
              disabled={!fields.clientName || !fields.date}
              className="flex-1 py-2.5 text-sm rounded-lg font-medium tracking-wider cursor-pointer disabled:opacity-40 bg-purple-600 text-white border-0 hover:bg-purple-700 transition-colors"
            >
              GUARDAR RESERVA
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm rounded-lg bg-transparent border border-neutral-600 text-neutral-400 cursor-pointer hover:border-neutral-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VentaDirectaPage({ bookings, onAdd, onUpdate, onDelete }: Props) {
  const [showForm, setShowForm] = useState(false)
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
      {showForm && <DirectForm onAdd={onAdd} onClose={() => setShowForm(false)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wider">VENTA DIRECTA</h1>
          <p className="text-sm text-neutral-400 mt-0.5">
            {bookings.length} reserva{bookings.length !== 1 ? "s" : ""} directa{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium tracking-wider cursor-pointer bg-purple-600 text-white border-0 hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> NUEVA RESERVA
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <p className="text-xs text-neutral-400 tracking-wider mb-1">TOTAL RESERVAS</p>
          <p className="text-2xl font-bold text-white font-mono">{bookings.length}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <p className="text-xs text-neutral-400 tracking-wider mb-1">PERSONAS</p>
          <p className="text-2xl font-bold text-purple-400 font-mono">
            {bookings.reduce((s, b) => s + (Number(b.guests) || 0), 0)}
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <p className="text-xs text-neutral-400 tracking-wider mb-1">TOTAL USD</p>
          <p className="text-2xl font-bold text-white font-mono">
            ${bookings
              .reduce((s, b) => s + parseFloat(String(b.amount || "0").replace(/[^0-9.]/g, "")), 0)
              .toFixed(0)}
          </p>
        </div>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <input
          placeholder="Buscar por cliente, tour, hotel…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-600 focus:border-purple-500 outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-neutral-500">
          <div className="text-4xl mb-3">💼</div>
          <p className="font-medium text-white mb-1">Sin ventas directas registradas</p>
          <p className="text-sm">Haz clic en "NUEVA RESERVA" para registrar una venta directa.</p>
        </div>
      ) : (
        filtered.map((b) => (
          <BookingCard key={b.id} booking={b} onUpdate={onUpdate} onDelete={onDelete} />
        ))
      )}
    </div>
  )
}
