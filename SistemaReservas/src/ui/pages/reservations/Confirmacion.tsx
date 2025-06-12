import { useState, useEffect } from "react"
import { useReservation } from "../../../context/ReservationContext"
import ReservationLayout from "../../components/Layout/ReservationLayout"

interface ConfirmacionPageProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ConfirmacionPage({ onNext, onBack }: ConfirmacionPageProps) {
  const { reservationData, setCurrentStep } = useReservation()
  const [isConfirmed, setIsConfirmed] = useState(false)

  useEffect(() => {
    setCurrentStep(4)
  }, [setCurrentStep])

  // Función para formatear la fecha
  const formatDate = (day: number) => {
    const days = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ]

    const date = new Date(2024, 4, day) // Mayo es mes 4 (0-indexado)
    const dayName = days[date.getDay()]
    const monthName = months[date.getMonth()]

    return `${dayName}, ${day} ${monthName}`
  }

  const handleConfirmReservation = () => {
    setIsConfirmed(true)
    // Simular proceso de confirmación
    setTimeout(() => {
      onNext()
    }, 2000)
  }

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Procesando Reserva...</h2>
          <p className="text-gray-600">Por favor espere mientras confirmamos su reserva</p>
        </div>
      </div>
    )
  }

  return (
    <ReservationLayout
      currentStep={4}
      title="Confirmación de Reserva"
      subtitle="Revise los detalles de su reserva antes de confirmar"
    >
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">RESERVA PARA</h2>
            <h3 className="text-2xl font-bold text-gray-900">{reservationData.customerName}</h3>
          </div>

          {/* Reservation Details */}
          <div className="space-y-6 mb-8">
            {/* Date */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-lg text-gray-700">{formatDate(reservationData.selectedDate!)}</span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-lg text-gray-700">{reservationData.selectedTime}</span>
            </div>

            {/* People */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <span className="text-lg text-gray-700">
                {reservationData.people} {reservationData.people === "1" ? "persona" : "personas"}
              </span>
            </div>

            {/* Restaurant */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg">🍽️</span>
              </div>
              <span className="text-lg text-gray-700 font-medium">{reservationData.restaurant}</span>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mt-1">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-lg text-gray-700">BOULEVARD KUKULKAN KM 13.5</div>
                <div className="text-sm text-gray-500">Cancún, ROO, 77500</div>
              </div>
            </div>

            {/* Room Number */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <span className="text-lg text-gray-700">Habitación {reservationData.roomNumber}</span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-lg text-gray-700">{reservationData.email}</span>
            </div>

            {/* Special Requests */}
            {reservationData.specialRequests && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Solicitudes Especiales:</div>
                  <div className="text-lg text-gray-700">{reservationData.specialRequests}</div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirmReservation}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            CONFIRMAR RESERVA
          </button>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Al confirmar, acepta nuestros términos y condiciones de reserva</p>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-6">
          <button
            onClick={onBack}
            className="text-slate-300 hover:text-white transition-colors duration-200 text-sm"
          >
            ← Volver a modificar reserva
          </button>
        </div>
      </div>
    </ReservationLayout>
  )
}