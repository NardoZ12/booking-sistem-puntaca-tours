"use client"

import { useRef, useState } from "react"
import { X, Download, Loader } from "lucide-react"
import { type Booking } from "@/lib/bookings"
import { TicketGenerator } from "./TicketGenerator"

interface TicketModalProps {
  booking: Booking
  onClose: () => void
}

export default function TicketModal({ booking, onClose }: TicketModalProps) {
  const ticketRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState<"pdf" | "jpg" | "png" | "">("")

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return
    setDownloading("pdf")
    try {
      // Dynamic import to avoid SSR issues
      const { downloadTicketPDF: downloadPDF } = await import("@/lib/ticket-download")
      await downloadPDF(ticketRef.current, booking)
    } catch (error) {
      console.error("Failed to download PDF:", error)
      alert("Error al descargar PDF")
    } finally {
      setDownloading("")
    }
  }

  const handleDownloadJPG = async () => {
    if (!ticketRef.current) return
    setDownloading("jpg")
    try {
      // Dynamic import to avoid SSR issues
      const { downloadTicketJPG: downloadJPG } = await import("@/lib/ticket-download")
      await downloadJPG(ticketRef.current, booking)
    } catch (error) {
      console.error("Failed to download JPG:", error)
      alert("Error al descargar JPG")
    } finally {
      setDownloading("")
    }
  }

  const handleDownloadPNG = async () => {
    if (!ticketRef.current) return
    setDownloading("png" as any)
    try {
      // Dynamic import to avoid SSR issues
      const { downloadTicketPNG: downloadPNG } = await import("@/lib/ticket-download")
      await downloadPNG(ticketRef.current, booking)
    } catch (error) {
      console.error("Failed to download PNG:", error)
      alert("Error al descargar PNG")
    } finally {
      setDownloading("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-700 sticky top-0 bg-neutral-900">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wider">TICKET DE RESERVA</h2>
            <p className="text-sm text-neutral-400 mt-0.5">{booking.confirmation}</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white bg-transparent border-0 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5">
          {/* Download Buttons */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading !== ""}
              className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {downloading === "pdf" ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Descargar PDF
            </button>
            <button
              onClick={handleDownloadJPG}
              disabled={downloading !== ""}
              className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {downloading === "jpg" ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Descargar JPG
            </button>
            <button
              onClick={handleDownloadPNG}
              disabled={downloading !== ""}
              className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {downloading === "png" ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Descargar PNG
            </button>
            <button
              onClick={onClose}
              className="ml-auto px-4 py-2.5 text-sm rounded-lg bg-neutral-700 text-white font-medium hover:bg-neutral-600 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>

          {/* Ticket Preview */}
          <div className="bg-neutral-800 rounded-lg p-4 overflow-auto" style={{ maxHeight: "calc(90vh - 200px)" }}>
            <div className="flex justify-center">
              <TicketGenerator ref={ticketRef} booking={booking} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
