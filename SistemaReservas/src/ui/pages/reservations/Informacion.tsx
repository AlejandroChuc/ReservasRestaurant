import { useState, useEffect } from "react"
import { useReservation } from "../../../context/ReservationContext"
import ReservationLayout from "../../components/Layout/ReservationLayout"

interface InformacionPageProps {
  onNext: () => void;
  onBack: () => void;
}

export default function InformacionPage({ onNext, onBack }: InformacionPageProps) {
  const { reservationData, updateReservationData, setCurrentStep } = useReservation()

  const [customerName, setCustomerName] = useState(reservationData.customerName || "")
  const [email, setEmail] = useState(reservationData.email || "")
  const [roomNumber, setRoomNumber] = useState(reservationData.roomNumber || "")

  useEffect(() => {
    setCurrentStep(2)
  }, [setCurrentStep])

  const handleContinue = () => {
    if (!customerName || !email || !roomNumber) {
      alert("Por favor complete todos los campos requeridos")
      return
    }

    // Guardar datos del paso 2
    updateReservationData({
      customerName,
      email,
      roomNumber,
    })

    // Navegar al siguiente paso
    onNext()
  }

  const handleBack = () => {
    // Guardar datos actuales antes de volver
    updateReservationData({
      customerName,
      email,
      roomNumber,
    })
    onBack()
  }

  const isComplete = customerName && email && roomNumber

  return (
    <ReservationLayout
      currentStep={2}
      title="Información del Cliente"
      subtitle="Complete sus datos personales para la reserva"
    >
      <div className="w-full max-w-4xl">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
          {/* Resumen de selección anterior */}
          <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-white font-medium mb-4">Resumen de su selección:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Restaurante:</span>
                <p className="text-white font-medium">{reservationData.restaurant}</p>
              </div>
              <div>
                <span className="text-slate-400">Personas:</span>
                <p className="text-white font-medium">{reservationData.people}</p>
              </div>
              <div>
                <span className="text-slate-400">Fecha:</span>
                <p className="text-white font-medium">{reservationData.selectedDate} Mayo</p>
              </div>
              <div>
                <span className="text-slate-400">Hora:</span>
                <p className="text-white font-medium">{reservationData.selectedTime}</p>
              </div>
            </div>
          </div>

          {/* Customer Name */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-white mb-4">
              Nombre Completo *{customerName && <span className="ml-2 text-green-400">✓</span>}
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ingrese su nombre completo"
              className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all backdrop-blur-sm text-lg"
              required
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-lg font-medium text-white mb-4">
                Correo Electrónico *{email && <span className="ml-2 text-green-400">✓</span>}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="su.email@ejemplo.com"
                className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all backdrop-blur-sm text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-white mb-4">
                Número de Habitación *{roomNumber && <span className="ml-2 text-green-400">✓</span>}
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="Ej: 205"
                className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all backdrop-blur-sm text-lg"
                required
              />
            </div>
          </div>

          {/* Information Note */}
          <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p className="text-amber-200 text-sm">
              <span className="font-medium">Nota:</span> Utilizaremos esta información para confirmar su reserva y
              enviarle los detalles por correo electrónico.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              className="text-slate-300 hover:text-white transition-colors duration-200 text-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>

            <button
              onClick={handleContinue}
              disabled={!isComplete}
              className={`font-bold text-xl px-16 py-5 rounded-full shadow-2xl transition-all duration-300 transform tracking-wide ${
                isComplete
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white hover:shadow-amber-500/25 hover:scale-105"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continuar a Adicional
            </button>
          </div>
        </div>
      </div>
    </ReservationLayout>
  )
}