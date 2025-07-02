"use client"

import { useState } from "react"
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
    <Card className="border-0" style={{ backgroundColor: "#4A5A6C" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Filter className="h-5 w-5" style={{ color: "#FF8C00" }} />
          Filtros de Reservas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search" className="text-gray-200">
              Buscar Huésped
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Nombre del huésped..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurant" className="text-gray-200">
              Restaurante
            </Label>
            <Select value={filters.restaurant} onValueChange={(value) => handleFilterChange("restaurant", value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Seleccionar restaurante" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="eden-roc" className="text-white hover:bg-gray-600">
                  Eden Roc
                </SelectItem>
                <SelectItem value="nobu" className="text-white hover:bg-gray-600">
                  Nobu Hotel
                </SelectItem>
                <SelectItem value="unico" className="text-white hover:bg-gray-600">
                  Unico
                </SelectItem>
                <SelectItem value="hard-rock" className="text-white hover:bg-gray-600">
                  Hard Rock
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-gray-200">
              Fecha
            </Label>
            <Input
              id="date"
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="bg-gray-700 border-gray-600 text-white focus:border-orange-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mealBlock" className="text-gray-200">
              Bloque de Comida
            </Label>
            <Select value={filters.mealBlock} onValueChange={(value) => handleFilterChange("mealBlock", value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Seleccionar bloque" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="desayuno" className="text-white hover:bg-gray-600">
                  Desayuno
                </SelectItem>
                <SelectItem value="comida" className="text-white hover:bg-gray-600">
                  Comida
                </SelectItem>
                <SelectItem value="cena" className="text-white hover:bg-gray-600">
                  Cena
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-gray-200">
              Estado
            </Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="confirmada" className="text-white hover:bg-gray-600">
                  Confirmada
                </SelectItem>
                <SelectItem value="cancelada" className="text-white hover:bg-gray-600">
                  Cancelada
                </SelectItem>
                <SelectItem value="expirada" className="text-white hover:bg-gray-600">
                  Expirada
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceStatus" className="text-gray-200">
              Estado del Servicio
            </Label>
            <Select value={filters.serviceStatus} onValueChange={(value) => handleFilterChange("serviceStatus", value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Estado del servicio" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="waiting" className="text-white hover:bg-gray-600">
                  Esperando Llegada
                </SelectItem>
                <SelectItem value="dining" className="text-white hover:bg-gray-600">
                  Comiendo
                </SelectItem>
                <SelectItem value="completed" className="text-white hover:bg-gray-600">
                  Comida Finalizada
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={clearFilters} className="border-gray-600 text-gray-200 hover:bg-gray-700">
            Limpiar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
