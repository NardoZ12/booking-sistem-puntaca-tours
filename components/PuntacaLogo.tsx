export function PuntacaLogo({ size = 64, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background - Dark blue */}
      <rect width="200" height="200" fill="#001a4d" />

      {/* Moon curve - Light gray */}
      <path
        d="M 40 50 Q 50 100 40 150 Q 80 160 120 150 Q 110 100 120 50 Q 80 40 40 50"
        fill="#e8e8e8"
      />

      {/* Sun - Orange */}
      <circle cx="85" cy="70" r="18" fill="#ff8c00" />

      {/* Palm tree - White */}
      <g fill="#e8e8e8">
        {/* Trunk */}
        <rect x="130" y="90" width="8" height="40" rx="4" />
        {/* Fronds */}
        <path d="M 134 90 Q 110 70 120 50" stroke="#e8e8e8" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M 134 90 Q 145 65 160 55" stroke="#e8e8e8" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M 134 90 Q 120 75 105 65" stroke="#e8e8e8" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M 134 90 Q 150 80 165 75" stroke="#e8e8e8" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M 134 90 Q 125 105 110 110" stroke="#e8e8e8" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M 134 90 Q 150 95 165 100" stroke="#e8e8e8" strokeWidth="8" strokeLinecap="round" fill="none" />
      </g>

      {/* Water waves - Dark blue */}
      <g fill="#0052cc" opacity="0.8">
        <path d="M 50 120 Q 60 110 70 120 T 90 120 T 110 120" stroke="#0052cc" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M 45 135 Q 55 125 65 135 T 85 135 T 105 135" stroke="#0052cc" strokeWidth="12" fill="none" strokeLinecap="round" />
      </g>

      {/* Airplane - White */}
      <g fill="#e8e8e8">
        {/* Body */}
        <ellipse cx="150" cy="45" rx="12" ry="6" />
        {/* Wings */}
        <rect x="125" y="42" width="50" height="6" rx="3" />
        {/* Tail */}
        <polygon points="158,40 165,35 165,50" />
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
