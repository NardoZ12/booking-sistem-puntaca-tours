"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { type Booking, parseViatorBooking, parseGYGBooking, ALL_TOURS } from "@/lib/bookings"

interface PasteModalProps {
  source: "viator" | "gyg"
  onClose: () => void
  onAdd: (b: Booking) => void
}

const CONFIG = {
  viator: { label: "Viator", color: "#00A680", parse: parseViatorBooking },
  gyg: { label: "GetYourGuide", color: "#FF5533", parse: parseGYGBooking },
}

export default function PasteModal({ source, onClose, onAdd }: PasteModalProps) {
  const [text, setText] = useState("")
  const [step, setStep] = useState<"paste" | "edit_details" | "review">("paste")
  const [fields, setFields] = useState<Partial<Booking>>({})
  const cfg = CONFIG[source]

  const parse = () => {
    const data = cfg.parse(text)
    data.meetingPoint = data.meetingPoint || "Lobby"
    setFields(data)
    setStep("edit_details")
  }

  const submit = () => {
    onAdd({
      ...(fields as Booking),
      id: Date.now(),
      source,
      rawText: text,
      createdAt: new Date().toISOString(),
    })
    onClose()
  }

  const editFields: [string, keyof Booking][] = [
    ["Tour", "tour"],
    ["Fecha", "date"],
    ["Cliente", "clientName"],
    ["Teléfono", "phone"],
    ["Hotel", "hotel"],
    ["Meeting point", "meetingPoint"],
    ["Hora de recogida", "time"],
    ["# Personas", "guests"],
  ]

  const editableFields: [string, keyof Booking][] = [
    ["Hotel", "hotel"],
    ["Punto de Recogida", "meetingPoint"],
    ["Hora de Recogida", "time"],
  ]

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-medium px-2 py-1 rounded"
              style={{ background: cfg.color + "22", color: cfg.color, border: `1px solid ${cfg.color}44` }}
            >
              {cfg.label}
            </span>
            <span className="text-sm font-medium text-white tracking-wider">
              {step === "paste" ? "PEGAR RESERVA" : step === "edit_details" ? "EDITAR DETALLES" : "REVISAR Y CONFIRMAR"}
            </span>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white bg-transparent border-0 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {step === "paste" ? (
            <>
              <p className="text-sm text-neutral-400 mb-3">
                Copia el texto completo de la reserva desde {cfg.label} y pégalo aquí.
              </p>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Pegar texto de reserva de ${cfg.label}…`}
                className="w-full min-h-48 p-3 text-sm rounded-lg bg-neutral-800 border border-neutral-600 text-white font-mono leading-relaxed resize-y outline-none focus:border-orange-500 placeholder-neutral-600"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={parse}
                  disabled={!text.trim()}
                  className="flex-1 py-2.5 text-sm rounded-lg cursor-pointer font-medium tracking-wider transition-colors disabled:opacity-40"
                  style={{ background: cfg.color, color: "#fff", border: "none" }}
                >
                  PROCESAR RESERVA
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm rounded-lg bg-transparent border border-neutral-600 text-neutral-400 cursor-pointer hover:border-neutral-400"
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : step === "edit_details" ? (
            <>
              <p className="text-sm text-neutral-400 mb-4">
                Por favor, verifica y edita estos detalles importantes:
              </p>
              <div className="space-y-4">
                {editableFields.map(([label, key]) => (
                  <div key={key}>
                    <label className="text-xs text-neutral-500 block mb-2 font-semibold">{label}</label>
                    <input
                      value={String(fields[key] || "")}
                      onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full text-sm px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-600 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep("review")}
                  className="flex-1 py-2.5 text-sm rounded-lg cursor-pointer font-medium tracking-wider"
                  style={{ background: cfg.color, color: "#fff", border: "none" }}
                >
                  CONTINUAR
                </button>
                <button
                  onClick={() => setStep("paste")}
                  className="px-4 py-2.5 text-sm rounded-lg bg-transparent border border-neutral-600 text-neutral-400 cursor-pointer hover:border-neutral-400"
                >
                  Atrás
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-neutral-400 mb-4">
                Revisa todos los datos. Puedes editar cualquier campo antes de guardar.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {editFields.map(([label, key]) => (
                  <div key={key} className={key === "tour" ? "col-span-2" : ""}>
                    <label className="text-xs text-neutral-500 block mb-1">{label}</label>
                    {key === "tour" ? (
                      <>
                        <input
                          list="modal-tour-datalist"
                          value={String(fields[key] || "")}
                          onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
                          className="w-full text-sm px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-600 text-white focus:border-orange-500 outline-none"
                        />
                        <datalist id="modal-tour-datalist">
                          {ALL_TOURS.map((t) => <option key={t} value={t} />)}
                        </datalist>
                      </>
                    ) : (
                      <input
                        value={String(fields[key] || "")}
                        onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
                        className="w-full text-sm px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-600 text-white focus:border-orange-500 outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={submit}
                  className="flex-1 py-2.5 text-sm rounded-lg cursor-pointer font-medium tracking-wider"
                  style={{ background: cfg.color, color: "#fff", border: "none" }}
                >
                  GUARDAR RESERVA
                </button>
                <button
                  onClick={() => setStep("edit_details")}
                  className="px-4 py-2.5 text-sm rounded-lg bg-transparent border border-neutral-600 text-neutral-400 cursor-pointer hover:border-neutral-400"
                >
                  Atrás
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
