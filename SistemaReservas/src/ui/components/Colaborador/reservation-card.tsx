"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Users, MapPin, Clock, CheckCircle, AlertCircle, LogOut } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Reservation {
  id: string
  guestName: string
  roomNumber: string
  numberOfPeople: number
  restaurant: string
  date: string
  time: string
  mealBlock: "desayuno" | "comida" | "cena"
  status: "confirmada" | "cancelada" | "expirada"
  arrivalConfirmed: boolean
  mealCompleted: boolean
  arrivalTime?: string
  departureTime?: string
}

interface ReservationCardProps {
  reservation: Reservation
  onConfirmArrival: (reservationId: string) => void
  onCompleteMeal: (reservationId: string) => void
}

const statusColors = {
  confirmada: "bg-green-100 text-green-800 border-green-200",
  cancelada: "bg-red-100 text-red-800 border-red-200",
  expirada: "bg-gray-100 text-gray-800 border-gray-200",
}

export function ReservationCard({ reservation, onConfirmArrival, onCompleteMeal }: ReservationCardProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const handleConfirmArrival = async () => {
    setIsConfirming(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onConfirmArrival(reservation.id)
    setIsConfirming(false)
  }

  const handleCompleteMeal = async () => {
    setIsCompleting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onCompleteMeal(reservation.id)
    setIsCompleting(false)
  }

  const getCardStyle = () => {
    if (reservation.mealCompleted) {
      return "ring-2 ring-blue-400"
    }
    if (reservation.arrivalConfirmed) {
      return "ring-2 ring-orange-400"
    }
    return ""
  }

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-200 border-0 ${getCardStyle()}`}
      style={{ backgroundColor: "#4A5A6C" }}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium text-white">{reservation.guestName}</CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Badge className={`${statusColors[reservation.status]} font-medium`}>
              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
            </Badge>
            {reservation.arrivalConfirmed && !reservation.mealCompleted && (
              <Badge className="font-medium text-white" style={{ backgroundColor: "#FF8C00" }}>
                <CheckCircle className="h-3 w-3 mr-1" />
                En Restaurante
              </Badge>
            )}
            {reservation.mealCompleted && (
              <Badge className="bg-blue-600 text-white font-medium">
                <LogOut className="h-3 w-3 mr-1" />
                Comida Finalizada
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="h-4 w-4" style={{ color: "#FF8C00" }} />
            <span>Habitación {reservation.roomNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Users className="h-4 w-4" style={{ color: "#FF8C00" }} />
            <span>{reservation.numberOfPeople} personas</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <CalendarDays className="h-4 w-4" style={{ color: "#FF8C00" }} />
            <span>{reservation.date}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="h-4 w-4" style={{ color: "#FF8C00" }} />
            <span>{reservation.time}</span>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-600 space-y-1">
          <p className="text-sm font-medium text-gray-200">
            Restaurante: <span style={{ color: "#FF8C00" }}>{reservation.restaurant}</span>
          </p>
          <p className="text-sm text-gray-300">
            Bloque: <span className="capitalize font-medium text-white">{reservation.mealBlock}</span>
          </p>
        </div>

        {/* Tiempos de llegada y salida */}
        {(reservation.arrivalTime || reservation.departureTime) && (
          <div className="pt-2 border-t border-gray-600 space-y-1 text-xs text-gray-400">
            {reservation.arrivalTime && <p>Llegada confirmada: {reservation.arrivalTime}</p>}
            {reservation.departureTime && <p>Salida registrada: {reservation.departureTime}</p>}
          </div>
        )}

        {/* Botón de confirmación de llegada */}
        {reservation.status === "confirmada" && !reservation.arrivalConfirmed && (
          <div className="pt-3 border-t border-gray-600">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full font-medium"
                  disabled={isConfirming}
                  style={{ backgroundColor: "#FF8C00", color: "white" }}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {isConfirming ? "Confirmando..." : "Confirmar Llegada"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Llegada del Huésped</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Estás seguro de que quieres confirmar la llegada de <strong>{reservation.guestName}</strong>
                    para la reserva en <strong>{reservation.restaurant}</strong>?
                    <br />
                    <br />
                    Esta acción marcará al huésped como presente en el restaurante.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmArrival} style={{ backgroundColor: "#FF8C00" }}>
                    Confirmar Llegada
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* Botón para finalizar comida */}
        {reservation.arrivalConfirmed && !reservation.mealCompleted && (
          <div className="pt-3 border-t border-gray-600">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full font-medium"
                  disabled={isCompleting}
                  style={{ backgroundColor: "#FF8C00", color: "white" }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isCompleting ? "Finalizando..." : "Finalizar Comida"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Finalizar Comida</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Confirmas que <strong>{reservation.guestName}</strong> ha terminado su comida y se ha retirado del
                    restaurante <strong>{reservation.restaurant}</strong>?
                    <br />
                    <br />
                    Esta acción liberará la mesa y marcará la reserva como completada.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCompleteMeal} style={{ backgroundColor: "#FF8C00" }}>
                    Finalizar Comida
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* Estados de la reserva */}
        {reservation.arrivalConfirmed && !reservation.mealCompleted && (
          <div className="pt-3 border-t border-gray-600">
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#FF8C00" }}>
              <CheckCircle className="h-4 w-4" />
              Huésped presente en el restaurante
            </div>
          </div>
        )}

        {reservation.mealCompleted && (
          <div className="pt-3 border-t border-gray-600">
            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
              <LogOut className="h-4 w-4" />
              Comida finalizada - Mesa liberada
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
