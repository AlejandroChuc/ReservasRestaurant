import { createContext, useContext, useState, type ReactNode } from "react"

interface ReservationData {
  restaurant?: string
  restaurantId?: number
  people?: string
  selectedDate?: number | null
  selectedTime?: string
  mealBlock?: string
  roomNumber?: string
  email?: string
  customerName?: string
  specialRequests?: string
  allergies?: string
  firstName?: string
  lastName?: string
}

interface ReservationContextType {
  reservationData: ReservationData
  updateReservationData: (data: Partial<ReservationData>) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  resetReservationData: () => void
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined)

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [reservationData, setReservationData] = useState<ReservationData>({})
  const [currentStep, setCurrentStep] = useState(1)

  const updateReservationData = (data: Partial<ReservationData>) => {
    setReservationData((prev) => ({ ...prev, ...data }))
  }

  const resetReservationData = () => setReservationData({})

  return (
    <ReservationContext.Provider value={{ reservationData, updateReservationData, currentStep, setCurrentStep, resetReservationData }}>
      {children}
    </ReservationContext.Provider>
  )
}

export function useReservation() {
  const context = useContext(ReservationContext)
  if (context === undefined) {
    throw new Error("useReservation must be used within a ReservationProvider")
  }
  return context
}