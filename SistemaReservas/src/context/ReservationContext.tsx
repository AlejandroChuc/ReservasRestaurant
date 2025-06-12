import { createContext, useContext, useState, type ReactNode } from "react"

interface ReservationData {
  restaurant?: string
  people?: string
  selectedDate?: number
  selectedTime?: string
  roomNumber?: string
  email?: string
  customerName?: string
  specialRequests?: string
}

interface ReservationContextType {
  reservationData: ReservationData
  updateReservationData: (data: Partial<ReservationData>) => void
  currentStep: number
  setCurrentStep: (step: number) => void
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined)

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [reservationData, setReservationData] = useState<ReservationData>({})
  const [currentStep, setCurrentStep] = useState(1)

  const updateReservationData = (data: Partial<ReservationData>) => {
    setReservationData((prev) => ({ ...prev, ...data }))
  }

  return (
    <ReservationContext.Provider value={{ reservationData, updateReservationData, currentStep, setCurrentStep }}>
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