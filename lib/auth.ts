// Simple authentication helper
export const OPERATORS = [
  { email: "operador@puntacatours.com", password: "puntaca123", name: "Operador Principal" },
  { email: "admin@puntacatours.com", password: "admin123", name: "Administrador" },
]

export function validateOperator(email: string, password: string) {
  return OPERATORS.find((op) => op.email === email && op.password === password)
}

export function getStoredOperator(): typeof OPERATORS[0] | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem("current_operator")
  return stored ? JSON.parse(stored) : null
}

export function setStoredOperator(operator: typeof OPERATORS[0]) {
  localStorage.setItem("current_operator", JSON.stringify(operator))
}

export function clearStoredOperator() {
  localStorage.removeItem("current_operator")
}
