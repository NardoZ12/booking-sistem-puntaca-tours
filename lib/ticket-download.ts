import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import { type Booking } from "./bookings"

export async function downloadTicketPDF(element: HTMLElement, booking: Booking) {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })

    const imgData = canvas.toDataURL("image/jpeg", 0.95)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = imgWidth / imgHeight

    const newHeight = pdfWidth / ratio
    let heightLeft = newHeight
    let position = 0

    pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, newHeight)
    heightLeft -= pdfHeight

    while (heightLeft > 0) {
      position = heightLeft - newHeight
      pdf.addPage()
      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, newHeight)
      heightLeft -= pdfHeight
    }

    pdf.save(`ticket-${booking.confirmation || booking.id}.pdf`)
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}

export async function downloadTicketJPG(element: HTMLElement, booking: Booking) {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    })

    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/jpeg", 0.95)
    link.download = `ticket-${booking.confirmation || booking.id}.jpg`
    link.click()
  } catch (error) {
    console.error("Error generating JPG:", error)
    throw error
  }
}
