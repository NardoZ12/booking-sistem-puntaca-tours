# Puntaca Tours — Sistema de Reservas

## Cómo integrar en el repositorio existente

Reemplaza estos archivos en tu repositorio de GitHub con los archivos de esta carpeta:

### Archivos a REEMPLAZAR:
| Archivo del repo | Reemplazar con |
|---|---|
| `app/layout.tsx` | `app/layout.tsx` |
| `app/globals.css` | `app/globals.css` (sin cambios) |
| `app/page.tsx` | `app/page.tsx` (nuevo dashboard) |

### Archivos NUEVOS a agregar:
| Archivo nuevo | Ubicación en repo |
|---|---|
| `lib/bookings.ts` | `/lib/bookings.ts` |
| `components/BookingCard.tsx` | `/components/BookingCard.tsx` |
| `components/PasteModal.tsx` | `/components/PasteModal.tsx` |
| `app/viator/page.tsx` | `/app/viator/page.tsx` |
| `app/getyourguide/page.tsx` | `/app/getyourguide/page.tsx` |
| `app/venta-directa/page.tsx` | `/app/venta-directa/page.tsx` |
| `app/historial/page.tsx` | `/app/historial/page.tsx` |

### Archivos a ELIMINAR del repo (ya no se usan):
- `app/command-center/page.tsx`
- `app/agent-network/page.tsx`
- `app/operations/page.tsx`
- `app/intelligence/page.tsx`
- `app/systems/page.tsx`

### package.json — sin cambios necesarios
Todas las dependencias existentes son suficientes.

---

## Funcionalidades

- **Viator**: Pega el texto de reservas → se extraen automáticamente todos los datos
- **GetYourGuide**: Igual que Viator, con parser específico para su formato
- **Venta Directa**: Formulario manual con selector de tours
- **Historial**: Vista global con filtros por fuente, fecha y búsqueda
- **Mensajes**: Genera mensajes para choferes y clientes con un solo clic
- **Edición**: Todos los campos son editables (hotel, meeting point, hora, etc.)
