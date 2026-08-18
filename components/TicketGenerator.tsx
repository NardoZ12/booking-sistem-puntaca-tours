"use client"

import { forwardRef } from "react"
import type { Booking } from "@/lib/bookings"
import { PuntacaLogo } from "./PuntacaLogo"

interface TicketGeneratorProps {
  booking: Booking
}

export const TicketGenerator = forwardRef<HTMLDivElement, TicketGeneratorProps>(
  ({ booking }, ref) => {
    return (
      <div
        ref={ref}
        className="w-full bg-white p-0"
        style={{
          width: "400px",
          padding: "0",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Ticket Container */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="flex justify-center mb-3">
              <div style={{ background: "#001a4d", padding: "6px", borderRadius: "6px" }}>
                <PuntacaLogo size={60} />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-1">PUNTACA TOURS</h1>
            <p className="text-orange-100 text-sm">Sistema de Reservas</p>
            <div className="border-b-2 border-white/30 my-3"></div>
          </div>

          {/* Confirmation Number */}
          <div className="text-center mb-4">
            <p className="text-orange-100 text-xs mb-1">NÚMERO DE CONFIRMACIÓN</p>
            <p className="text-xl font-bold tracking-widest">{booking.confirmation || "N/A"}</p>
          </div>

          {/* Main Info Grid */}
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
            {/* Tour */}
            <div className="mb-4">
              <p className="text-orange-100 text-xs font-semibold mb-1">TOUR</p>
              <p className="text-sm font-bold text-white leading-tight">{booking.tour || "Sin especificar"}</p>
            </div>

            {/* Row 1: Date and Time */}
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <p className="text-orange-100 text-xs font-semibold mb-1">📅 FECHA</p>
                <p className="text-sm font-semibold text-white">{booking.date || "N/A"}</p>
              </div>
              <div>
                <p className="text-orange-100 text-xs font-semibold mb-1">🕐 HORA DE RECOGIDA</p>
                <p className="text-sm font-semibold text-white">{booking.time || "N/A"}</p>
              </div>
            </div>

            {/* Row 2: Client Info */}
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <p className="text-orange-100 text-xs font-semibold mb-1">👤 CLIENTE</p>
                <p className="text-sm font-semibold text-white">{booking.clientName || "N/A"}</p>
              </div>
              <div>
                <p className="text-orange-100 text-xs font-semibold mb-1">👥 PERSONAS</p>
                <p className="text-sm font-semibold text-white">{booking.guests || "N/A"}</p>
              </div>
            </div>

            {/* Row 3: Hotel and Phone */}
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <p className="text-orange-100 text-xs font-semibold mb-1">🏨 HOTEL</p>
                <p className="text-sm font-semibold text-white">{booking.hotel || "N/A"}</p>
              </div>
              <div>
                <p className="text-orange-100 text-xs font-semibold mb-1">📞 TELÉFONO</p>
                <p className="text-sm font-semibold text-white">{booking.phone || "N/A"}</p>
              </div>
            </div>

            {/* Row 4: Meeting Point */}
            <div>
              <p className="text-orange-100 text-xs font-semibold mb-1">📍 PUNTO DE ENCUENTRO</p>
              <p className="text-sm font-semibold text-white">{booking.meetingPoint || "Lobby"}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-4 pt-3 border-t border-white/30">
            <p className="text-orange-100 text-xs mb-1">¡Gracias por elegir Puntaca Tours!</p>
            <p className="text-white/70 text-xs">Para consultas, contacte a nuestro equipo.</p>
          </div>
        </div>
      </div>
    )
  }
)

TicketGenerator.displayName = "TicketGenerator"
