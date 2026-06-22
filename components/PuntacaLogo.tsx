"use client"

import { useState, useEffect } from "react"

interface PuntacaLogoProps {
  size?: number
  className?: string
  width?: number
  height?: number
}

export function PuntacaLogo({ size = 64, className = "", width, height }: PuntacaLogoProps) {
  const logoWidth = width || size
  const logoHeight = height || size
  const [useImage, setUseImage] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const img = new Image()
    img.onload = () => setUseImage(true)
    img.onerror = () => setUseImage(false)
    img.src = "/puntaca-logo.png"
  }, [])

  if (!mounted) {
    return <div style={{ width: logoWidth, height: logoHeight }} />
  }

  if (useImage) {
    return (
      <img
        src="/puntaca-logo.png"
        alt="Puntaca Tours Logo"
        width={logoWidth}
        height={logoHeight}
        style={{
          width: "auto",
          height: "auto",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        className={className}
      />
    )
  }

  return (
    <svg
      width={logoWidth}
      height={logoHeight}
      viewBox="0 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Background - Dark blue (#001a4d) */}
      <rect width="800" height="600" fill="#001a4d" />

      {/* Moon/Smile shape - Light gray (#d0d0d0) */}
      <path
        d="M 150 300 Q 200 200 300 150 Q 450 80 550 150 L 550 450 Q 500 500 350 520 Q 200 530 150 450 Z"
        fill="#d0d0d0"
      />

      {/* Water waves inside the smile - Dark blue (#0052a3) */}
      <g fill="#0052a3">
        {/* Wave 1 */}
        <path
          d="M 200 380 Q 250 350 300 380 Q 350 410 400 380 Q 450 350 500 380 L 500 440 Q 450 410 400 440 Q 350 470 300 440 Q 250 410 200 440 Z"
        />
        {/* Wave 2 - darker/shadowed effect */}
        <path
          d="M 200 420 Q 250 390 300 420 Q 350 450 400 420 Q 450 390 500 420 L 500 460 Q 450 430 400 460 Q 350 490 300 460 Q 250 430 200 460 Z"
          opacity="0.8"
        />
      </g>

      {/* Sun - Orange (#ff9900) */}
      <circle cx="380" cy="260" r="70" fill="#ff9900" />

      {/* Palm Tree - White (#e8e8e8) */}
      <g fill="#e8e8e8">
        {/* Trunk */}
        <rect x="535" y="340" width="35" height="120" rx="8" />

        {/* Palm fronds */}
        {/* Top left fronds */}
        <ellipse cx="480" cy="240" rx="50" ry="25" transform="rotate(-45 480 240)" />
        <ellipse cx="450" cy="200" rx="45" ry="22" transform="rotate(-60 450 200)" />
        <ellipse cx="430" cy="260" rx="40" ry="20" transform="rotate(-25 430 260)" />

        {/* Top right fronds */}
        <ellipse cx="625" cy="240" rx="50" ry="25" transform="rotate(45 625 240)" />
        <ellipse cx="655" cy="200" rx="45" ry="22" transform="rotate(60 655 200)" />
        <ellipse cx="675" cy="260" rx="40" ry="20" transform="rotate(25 675 260)" />

        {/* Bottom fronds */}
        <ellipse cx="470" cy="340" rx="45" ry="22" transform="rotate(-35 470 340)" />
        <ellipse cx="630" cy="340" rx="45" ry="22" transform="rotate(35 630 340)" />
        <ellipse cx="480" cy="380" rx="40" ry="20" transform="rotate(-20 480 380)" />
        <ellipse cx="620" cy="380" rx="40" ry="20" transform="rotate(20 620 380)" />
      </g>

      {/* Airplane - White (#e8e8e8) */}
      <g fill="#e8e8e8">
        {/* Fuselage (body) */}
        <ellipse cx="600" cy="150" rx="45" ry="20" />

        {/* Wings */}
        <rect x="480" y="140" width="240" height="20" rx="10" />

        {/* Tail/Fin */}
        <path d="M 630 160 L 680 130 L 670 180 Z" />

        {/* Cockpit */}
        <circle cx="620" cy="145" r="8" opacity="0.6" />
      </g>

      {/* Additional airplane detail - darker shading */}
      <g fill="none" stroke="#c0c0c0" strokeWidth="3" opacity="0.5">
        <path d="M 520 155 Q 560 145 600 140" />
      </g>
    </svg>
  )
}

export function PuntacaLogoText({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={className}>
      <div style={{ fontSize: `${size}px`, fontWeight: "bold", color: "#ff8c00" }}>
        PUNTACA TOURS
      </div>
      <div style={{ fontSize: `${size * 0.4}px`, color: "#888", letterSpacing: "0.1em" }}>
        Caribbean Adventures
      </div>
    </div>
  )
}
