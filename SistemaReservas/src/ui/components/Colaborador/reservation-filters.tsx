"use client"

import { useState } from "react"
import { useGlobalReservations } from "../../../context/GlobalReservationsContext";
import type { Reservation } from "../../../types";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, Search } from "lucide-react"

interface FiltersProps {
  onFilterChange: (filters: {
    restaurant: string
    date: string
    status: string
    search: string
    mealBlock: string
    arrivalStatus: string
    serviceStatus: string
  }) => void
}

export function ReservationFilters({ onFilterChange }: FiltersProps) {
  const [filters, setFilters] = useState({
    restaurant: "",
    date: "",
    status: "",
    search: "",
    mealBlock: "",
    arrivalStatus: "",
    serviceStatus: "",
  })

  const { allReservations } = useGlobalReservations();
  const uniqueRestaurants = Array.from(new Set((allReservations as Reservation[]).map(r => r.restaurant)));

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      restaurant: "",
      date: "",
      status: "",
      search: "",
      mealBlock: "",
      arrivalStatus: "",
      serviceStatus: "",
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  return (
    <div className="flex items-center gap-2 mb-4 w-full">
      <div className="flex flex-1 items-center border border-gray-300 rounded-lg bg-white shadow-sm overflow-hidden">
        <span className="pl-3 pr-2 text-gray-400 flex items-center">
          <Search className="h-5 w-5" />
        </span>
        <input
          type="text"
          placeholder="Buscar huésped..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="flex-1 py-2 pr-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
        <div className="border-l border-gray-200 h-6 mx-2" />
        <Select value={filters.restaurant} onValueChange={(value) => handleFilterChange("restaurant", value)}>
          <SelectTrigger className="bg-transparent border-0 text-gray-500 px-2 focus:ring-0 focus:border-0">
            <SelectValue placeholder="Restaurante" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            {uniqueRestaurants.length === 0
              ? <span className="text-gray-400 px-2">No hay restaurantes</span>
              : uniqueRestaurants.map((rest) => (
                  <SelectItem key={String(rest)} value={String(rest)} className="text-gray-700 hover:bg-gray-100">
                    {String(rest)}
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
        <Input
          id="date"
          type="date"
          value={filters.date}
          onChange={(e) => handleFilterChange("date", e.target.value)}
          className="bg-transparent border-0 text-gray-500 px-2 focus:ring-0 focus:border-0 min-w-[120px]"
        />
        <Select value={filters.mealBlock} onValueChange={(value) => handleFilterChange("mealBlock", value)}>
          <SelectTrigger className="bg-transparent border-0 text-gray-500 px-2 focus:ring-0 focus:border-0">
            <SelectValue placeholder="Bloque" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            <SelectItem value="desayuno" className="text-gray-700 hover:bg-gray-100">Desayuno</SelectItem>
            <SelectItem value="comida" className="text-gray-700 hover:bg-gray-100">Comida</SelectItem>
            <SelectItem value="cena" className="text-gray-700 hover:bg-gray-100">Cena</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
          <SelectTrigger className="bg-transparent border-0 text-gray-500 px-2 focus:ring-0 focus:border-0">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            <SelectItem value="confirmada" className="text-gray-700 hover:bg-gray-100">Confirmada</SelectItem>
            <SelectItem value="cancelada" className="text-gray-700 hover:bg-gray-100">Cancelada</SelectItem>
            <SelectItem value="expirada" className="text-gray-700 hover:bg-gray-100">Expirada</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.serviceStatus} onValueChange={(value) => handleFilterChange("serviceStatus", value)}>
          <SelectTrigger className="bg-transparent border-0 text-gray-500 px-2 focus:ring-0 focus:border-0">
            <SelectValue placeholder="Servicio" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            <SelectItem value="waiting" className="text-gray-700 hover:bg-gray-100">Esperando Llegada</SelectItem>
            <SelectItem value="dining" className="text-gray-700 hover:bg-gray-100">Comiendo</SelectItem>
            <SelectItem value="completed" className="text-gray-700 hover:bg-gray-100">Comida Finalizada</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="ml-2 text-indigo-500 hover:bg-indigo-50 px-3 py-2 flex items-center gap-1"
        >
          <Filter className="h-4 w-4 mr-1" />
          Filtro
        </Button>
      </div>
    </div>
  )
}
