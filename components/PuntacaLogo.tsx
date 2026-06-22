export function PuntacaLogo({ size = 64, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background - Dark blue */}
      <rect width="240" height="240" fill="#001a4d" />

      {/* Shirt/Flag shape - White background */}
      <g>
        {/* Main shirt body */}
        <path
          d="M 60 40 L 180 40 L 180 150 Q 180 170 160 170 L 100 170 Q 80 170 80 150 L 80 40 Z"
          fill="white"
        />
        {/* Shirt sleeves */}
        <rect x="35" y="70" width="30" height="45" rx="8" fill="white" />
        <rect x="175" y="70" width="30" height="45" rx="8" fill="white" />
      </g>

      {/* Sun - Orange/Yellow */}
      <circle cx="85" cy="65" r="20" fill="#ff8c00" />

      {/* Water waves - Blue */}
      <g fill="none" stroke="#0066cc" strokeWidth="6" strokeLinecap="round">
        <path d="M 70 115 Q 80 105 90 115 T 110 115 T 130 115" />
        <path d="M 60 130 Q 70 120 80 130 T 100 130 T 120 130" />
      </g>

      {/* Palm tree - White lines */}
      <g stroke="white" strokeWidth="5" strokeLinecap="round" fill="none">
        {/* Trunk */}
        <line x1="155" y1="100" x2="155" y2="145" />

        {/* Fronds - top left */}
        <path d="M 155 105 Q 135 75 125 65" />
        <path d="M 155 105 Q 140 85 130 75" />

        {/* Fronds - top right */}
        <path d="M 155 105 Q 175 75 185 65" />
        <path d="M 155 105 Q 170 85 180 75" />

        {/* Fronds - middle */}
        <path d="M 155 115 Q 135 105 125 100" />
        <path d="M 155 115 Q 175 105 185 100" />

        {/* Fronds - bottom */}
        <path d="M 155 130 Q 135 135 125 145" />
        <path d="M 155 130 Q 175 135 185 145" />
      </g>

      {/* Airplane - White */}
      <g fill="white" opacity="0.95">
        {/* Airplane body */}
        <ellipse cx="155" cy="40" rx="10" ry="6" />

        {/* Wings */}
        <rect x="130" y="37" width="50" height="5" rx="2" />

        {/* Tail fin */}
        <polygon points="163,35 172,28 172,42" />
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
