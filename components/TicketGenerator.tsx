"use client"

import { forwardRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import type { Booking } from "@/lib/bookings"
import { PuntacaLogo } from "./PuntacaLogo"

interface TicketGeneratorProps {
  booking: Booking
}

export const TicketGenerator = forwardRef<HTMLDivElement, TicketGeneratorProps>(
  ({ booking }, ref) => {
    const qrValue = JSON.stringify({
      id: booking.id,
      confirmation: booking.confirmation,
      tour: booking.tour,
      date: booking.date,
      time: booking.time,
    })

    return (
      <div
        ref={ref}
        className="w-full bg-white p-0"
        style={{
          width: "800px",
          padding: "0",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Ticket Container */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-8" style={{ minHeight: "1000px" }}>
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div style={{ background: "#001a4d", padding: "8px", borderRadius: "8px" }}>
                <PuntacaLogo size={80} />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">PUNTACA TOURS</h1>
            <p className="text-orange-100 text-lg">Sistema de Reservas</p>
            <div className="border-b-2 border-white/30 my-4"></div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-8">
            <div
              className="bg-white p-4 rounded-lg shadow-lg"
              style={{
                width: "200px",
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <QRCodeSVG value={qrValue} size={180} level="H" includeMargin={false} />
            </div>
          </div>

          {/* Confirmation Number */}
          <div className="text-center mb-8">
            <p className="text-orange-100 text-sm mb-1">NÚMERO DE CONFIRMACIÓN</p>
            <p className="text-3xl font-bold tracking-widest">{booking.confirmation || "N/A"}</p>
          </div>

          {/* Main Info Grid */}
          <div className="bg-white/10 backdrop-blur rounded-lg p-8 mb-6">
            {/* Tour */}
            <div className="mb-6">
              <p className="text-orange-100 text-sm font-semibold mb-1">TOUR</p>
              <p className="text-xl font-bold text-white">{booking.tour || "Sin especificar"}</p>
            </div>

            {/* Row 1: Date and Time */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-orange-100 text-sm font-semibold mb-1">📅 FECHA</p>
                <p className="text-lg font-semibold text-white">{booking.date || "N/A"}</p>
              </div>
              <div>
                <p className="text-orange-100 text-sm font-semibold mb-1">🕐 HORA DE RECOGIDA</p>
                <p className="text-lg font-semibold text-white">{booking.time || "N/A"}</p>
              </div>
            </div>

            {/* Row 2: Client Info */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-orange-100 text-sm font-semibold mb-1">👤 CLIENTE</p>
                <p className="text-lg font-semibold text-white">{booking.clientName || "N/A"}</p>
              </div>
              <div>
                <p className="text-orange-100 text-sm font-semibold mb-1">👥 PERSONAS</p>
                <p className="text-lg font-semibold text-white">{booking.guests || "N/A"}</p>
              </div>
            </div>

            {/* Row 3: Hotel and Phone */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-orange-100 text-sm font-semibold mb-1">🏨 HOTEL</p>
                <p className="text-lg font-semibold text-white">{booking.hotel || "N/A"}</p>
              </div>
              <div>
                <p className="text-orange-100 text-sm font-semibold mb-1">📞 TELÉFONO</p>
                <p className="text-lg font-semibold text-white">{booking.phone || "N/A"}</p>
              </div>
            </div>

            {/* Row 4: Meeting Point */}
            <div>
              <p className="text-orange-100 text-sm font-semibold mb-1">📍 PUNTO DE ENCUENTRO</p>
              <p className="text-lg font-semibold text-white">{booking.meetingPoint || "Lobby"}</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <div className="grid grid-cols-2 gap-6 text-sm">
              {booking.amount && (
                <div>
                  <p className="text-orange-100 font-semibold mb-1">💰 MONTO</p>
                  <p className="text-white font-semibold">{booking.amount}</p>
                </div>
              )}
              {booking.source && (
                <div>
                  <p className="text-orange-100 font-semibold mb-1">📌 FUENTE</p>
                  <p className="text-white font-semibold uppercase">
                    {booking.source === "viator"
                      ? "Viator"
                      : booking.source === "gyg"
                        ? "GetYourGuide"
                        : "Venta Directa"}
                  </p>
                </div>
              )}
              {booking.language && (
                <div>
                  <p className="text-orange-100 font-semibold mb-1">🗣️ IDIOMA</p>
                  <p className="text-white font-semibold">{booking.language}</p>
                </div>
              )}
              {booking.commission && (
                <div>
                  <p className="text-orange-100 font-semibold mb-1">📊 COMISIÓN</p>
                  <p className="text-white font-semibold">{booking.commission}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-white/30">
            <p className="text-orange-100 text-sm mb-2">¡Gracias por elegir Puntaca Tours!</p>
            <p className="text-white/70 text-xs">Para consultas o cambios, contacte a nuestro equipo.</p>
          </div>
        </div>
      </div>
    )
  }
)

TicketGenerator.displayName = "TicketGenerator"
