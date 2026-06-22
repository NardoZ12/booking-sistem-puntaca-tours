"use client"

import Image from "next/image"
import { useState } from "react"

interface PuntacaLogoProps {
  size?: number
  className?: string
  width?: number
  height?: number
}

export function PuntacaLogo({ size = 64, className = "", width, height }: PuntacaLogoProps) {
  const logoWidth = width || size
  const logoHeight = height || size
  const [imageError, setImageError] = useState(false)

  // Fallback SVG if PNG not available
  if (imageError) {
    return (
      <svg
        width={logoWidth}
        height={logoHeight}
        viewBox="0 0 800 600"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        preserveAspectRatio="xMidYMid meet"
      >
        <rect width="800" height="600" fill="#001a4d" />
        <path d="M 150 300 Q 200 200 300 150 Q 450 80 550 150 L 550 450 Q 500 500 350 520 Q 200 530 150 450 Z" fill="#d0d0d0" />
        <circle cx="380" cy="260" r="70" fill="#ff9900" />
        <g fill="#0052a3">
          <path d="M 200 380 Q 250 350 300 380 Q 350 410 400 380 Q 450 350 500 380 L 500 440 Q 450 410 400 440 Q 350 470 300 440 Q 250 410 200 440 Z" />
        </g>
        <g fill="#e8e8e8">
          <rect x="535" y="340" width="35" height="120" rx="8" />
          <ellipse cx="480" cy="240" rx="50" ry="25" transform="rotate(-45 480 240)" />
          <ellipse cx="625" cy="240" rx="50" ry="25" transform="rotate(45 625 240)" />
        </g>
        <g fill="#e8e8e8">
          <ellipse cx="600" cy="150" rx="45" ry="20" />
          <rect x="480" y="140" width="240" height="20" rx="10" />
        </g>
      </svg>
    )
  }

  return (
    <div className={className}>
      <Image
        src="/logo.jpg?v=2"
        alt="Puntaca Tours Logo"
        width={logoWidth}
        height={logoHeight}
        priority
        quality={95}
        onError={() => setImageError(true)}
        style={{
          width: "auto",
          height: "auto",
          maxWidth: "100%",
        }}
      />
    </div>
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
