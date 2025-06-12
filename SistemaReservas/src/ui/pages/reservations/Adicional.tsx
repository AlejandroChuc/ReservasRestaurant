import { useState, useEffect } from "react"
import { useReservation } from "../../../context/ReservationContext"
import ReservationLayout from "../../components/Layout/ReservationLayout"

interface AdicionalPageProps {
  onNext: () => void;
  onBack: () => void;
}

export default function AdicionalPage({ onNext, onBack }: AdicionalPageProps) {
  const { reservationData, updateReservationData, setCurrentStep } = useReservation()

  const [specialRequests, setSpecialRequests] = useState(reservationData.specialRequests || "")

  useEffect(() => {
    setCurrentStep(3)
  }, [setCurrentStep])

  const handleContinue = () => {
    // Guardar datos del paso 3
    updateReservationData({
      specialRequests,
    })

    // Navegar a la confirmación
    onNext()
  }

  const handleBack = () => {
    // Guardar datos actuales antes de volver
    updateReservationData({
      specialRequests,
    })
    onBack()
  }

  return (
    <ReservationLayout
      currentStep={3}
      title="Información Adicional"
      subtitle="Agregue cualquier solicitud especial para su reserva"
    >
      <div className="w-full max-w-4xl">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
          {/* Resumen completo */}
          <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-white font-medium mb-4">Resumen de su reserva:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div>
                  <span className="text-slate-400">Restaurante:</span>
                  <p className="text-white font-medium">{reservationData.restaurant}</p>
                </div>
                <div>
                  <span className="text-slate-400">Fecha y Hora:</span>
                  <p className="text-white font-medium">
                    {reservationData.selectedDate} Mayo, {reservationData.selectedTime}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Personas:</span>
                  <p className="text-white font-medium">{reservationData.people}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-slate-400">Cliente:</span>
                  <p className="text-white font-medium">{reservationData.customerName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Email:</span>
                  <p className="text-white font-medium">{reservationData.email}</p>
                </div>
                <div>
                  <span className="text-slate-400">Habitación:</span>
                  <p className="text-white font-medium">{reservationData.roomNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-white mb-4">Solicitudes Especiales (Opcional)</label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={4}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all backdrop-blur-sm resize-none text-lg"
              placeholder="Ej: Restricciones dietéticas, celebración especial, preferencias de mesa, alergias alimentarias..."
            />
          </div>

          {/* Common Requests */}
          <div className="mb-8">
            <h4 className="text-white font-medium mb-4">Solicitudes Comunes:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Mesa junto a la ventana",
                "Celebración de cumpleaños",
                "Aniversario",
                "Mesa privada",
                "Restricciones dietéticas",
                "Silla alta para niños",
              ].map((request) => (
                <button
                  key={request}
                  type="button"
                  onClick={() => {
                    const current = specialRequests
                    const newRequest = current ? `${current}, ${request}` : request
                    setSpecialRequests(newRequest)
                  }}
                  className="text-left p-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white transition-all duration-200 text-sm"
                >
                  + {request}
                </button>
              ))}
            </div>
          </div>

          {/* Group Message */}
          <div className="mb-8">
            <div className="p-4 border-2 border-amber-500/50 text-amber-400 rounded-xl text-center">
              <p className="font-medium">Para grupos mayores de 8 personas</p>
              <p className="text-sm text-amber-300 mt-1">Se requiere confirmación especial del restaurante</p>
            </div>
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
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xl px-16 py-5 rounded-full shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105 tracking-wide"
            >
              Continuar a Confirmación
            </button>
          </div>
        </div>
      </div>
    </ReservationLayout>
  )
}