"use client"

import { useState } from "react"
import { Copy, Check, Edit2, Trash2, X, Save, Ticket } from "lucide-react"
import { type Booking, generateDriverMessage, generateClientMessage, ALL_TOURS } from "@/lib/bookings"
import TicketModal from "./TicketModal"

const SOURCE_COLORS: Record<string, string> = {
  viator: "#00A680",
  gyg: "#FF5533",
  direct: "#8B5CF6",
}
const SOURCE_LABELS: Record<string, string> = {
  viator: "Viator",
  gyg: "GetYourGuide",
  direct: "Venta Directa",
}

interface BookingCardProps {
  booking: Booking
  onUpdate: (b: Booking) => void
  onDelete: (id: number) => void
}

export default function BookingCard({ booking, onUpdate, onDelete }: BookingCardProps) {
  const [editing, setEditing] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [showTicket, setShowTicket] = useState(false)
  const [copied, setCopied] = useState<"driver" | "client" | "">("")
  const [fields, setFields] = useState<Booking>({ ...booking })

  const srcColor = SOURCE_COLORS[booking.source] || "#888"
  const srcLabel = SOURCE_LABELS[booking.source] || booking.source

  const driverMsg = generateDriverMessage(fields)
  const clientMsg = generateClientMessage(fields)

  const copyText = (text: string, label: "driver" | "client") => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(label)
    setTimeout(() => setCopied(""), 2200)
  }

  const save = () => {
    onUpdate(fields)
    setEditing(false)
  }

  const editFields: [string, keyof Booking, string][] = [
    ["Tour", "tour", "text"],
    ["Fecha", "date", "text"],
    ["Cliente", "clientName", "text"],
    ["Teléfono", "phone", "tel"],
    ["Hotel", "hotel", "text"],
    ["Meeting point", "meetingPoint", "text"],
    ["Hora de recogida", "time", "text"],
    ["# Personas", "guests", "number"],
  ]

  const infoRows: [string, string | undefined][] = [
    ["📅 Fecha", fields.date],
    ["👤 Cliente", fields.clientName],
    ["📞 Teléfono", fields.phone],
    ["🏨 Hotel", fields.hotel],
    ["📍 Meeting point", fields.meetingPoint],
    ["🕐 Hora", fields.time],
    ["👥 Personas", String(fields.guests || "")],
    ["🔖 Confirmación", booking.confirmation],
    ["💰 Importe", booking.amount],
  ]

  return (
    <>
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg mb-4 overflow-hidden hover:border-orange-500/40 transition-colors">
        {/* Header */}
        <div className="px-4 py-3 border-b border-neutral-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded flex-shrink-0"
              style={{ background: srcColor + "22", color: srcColor, border: `1px solid ${srcColor}44` }}
            >
              {srcLabel}
            </span>
            <span className="text-sm font-medium text-white truncate">
              {fields.tour || "Sin tour asignado"}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowTicket(true)}
              className="text-neutral-400 hover:text-yellow-500 bg-transparent border-0 cursor-pointer p-1"
              title="Descargar ticket"
            >
              <Ticket className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setShowMessages(!showMessages); setEditing(false) }}
              className={`text-xs px-3 py-1 rounded border cursor-pointer transition-colors ${
                showMessages
                  ? "border-orange-500 text-orange-500 bg-orange-500/10"
                  : "border-neutral-600 text-neutral-400 hover:border-neutral-400 bg-transparent"
              }`}
            >
              Mensajes
            </button>
            <button
              onClick={() => { setEditing(!editing); setShowMessages(false) }}
              className="text-neutral-400 hover:text-orange-500 bg-transparent border-0 cursor-pointer p-1"
            >
              {editing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onDelete(booking.id!)}
              className="text-neutral-600 hover:text-red-500 bg-transparent border-0 cursor-pointer p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

      {/* Body */}
      <div className="p-4">
        {editing ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {editFields.map(([label, key, type]) => (
                <div key={key} className={key === "tour" ? "col-span-2" : ""}>
                  <label className="text-xs text-neutral-500 block mb-1">{label}</label>
                  {key === "tour" ? (
                    <>
                      <input
                        list="tour-datalist"
                        value={String(fields[key] || "")}
                        onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
                        className="w-full text-sm px-3 py-2 rounded bg-neutral-800 border border-neutral-600 text-white focus:border-orange-500 outline-none"
                      />
                      <datalist id="tour-datalist">
                        {ALL_TOURS.map((t) => <option key={t} value={t} />)}
                      </datalist>
                    </>
                  ) : (
                    <input
                      type={type}
                      value={String(fields[key] || "")}
                      onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full text-sm px-3 py-2 rounded bg-neutral-800 border border-neutral-600 text-white focus:border-orange-500 outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={save}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded bg-orange-500 text-white border-0 cursor-pointer hover:bg-orange-600"
              >
                <Save className="w-3.5 h-3.5" /> Guardar
              </button>
              <button
                onClick={() => { setFields({ ...booking }); setEditing(false) }}
                className="px-4 py-2 text-sm rounded bg-transparent border border-neutral-600 text-neutral-400 cursor-pointer hover:border-neutral-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            {infoRows.map(([label, value]) =>
              value ? (
                <div key={label} className="min-w-0">
                  <div className="text-xs text-neutral-500">{label}</div>
                  <div className="text-sm font-medium text-white truncate" title={value}>
                    {value}
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Messages panel */}
        {showMessages && !editing && (
          <div className="mt-4 space-y-3">
            {/* Driver */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-400 tracking-wider">MENSAJE CHOFER</span>
                <button
                  onClick={() => copyText(driverMsg, "driver")}
                  className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded border cursor-pointer transition-colors ${
                    copied === "driver"
                      ? "border-green-500 text-green-500 bg-green-500/10"
                      : "border-neutral-600 text-neutral-400 hover:border-neutral-400 bg-transparent"
                  }`}
                >
                  {copied === "driver" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied === "driver" ? "Copiado!" : "Copiar"}
                </button>
              </div>
              <pre className="text-sm text-white whitespace-pre-wrap leading-relaxed font-mono">
                {driverMsg}
              </pre>
            </div>

            {/* Client */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-400 tracking-wider">MENSAJE CLIENTE</span>
                <button
                  onClick={() => copyText(clientMsg, "client")}
                  className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded border cursor-pointer transition-colors ${
                    copied === "client"
                      ? "border-green-500 text-green-500 bg-green-500/10"
                      : "border-neutral-600 text-neutral-400 hover:border-neutral-400 bg-transparent"
                  }`}
                >
                  {copied === "client" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied === "client" ? "Copiado!" : "Copiar"}
                </button>
              </div>
              <pre className="text-sm text-white whitespace-pre-wrap leading-relaxed font-mono">
                {clientMsg}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>

      {showTicket && <TicketModal booking={booking} onClose={() => setShowTicket(false)} />}
    </>
  )
}
