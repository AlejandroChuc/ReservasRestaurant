import React from "react"
import StepIndicator from "../StepIndicator"

interface ReservationLayoutProps {
  children: React.ReactNode
  currentStep: number
  title?: string
  subtitle?: string
}

export default function ReservationLayout({ children, currentStep, title, subtitle }: ReservationLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fillOpacity=&quot;0.02&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center py-12 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🍽️</span>
            </div>
            <h1 className="text-5xl font-light text-white tracking-wider">
              Restaurant
              <span className="block text-2xl text-amber-400 font-normal mt-1">Reservations</span>
            </h1>
            <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🍽️</span>
            </div>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Experience culinary excellence at our finest establishments
          </p>
        </div>

        {/* Steps Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Page Title */}
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-white mb-4 tracking-wide">{title}</h2>
            {subtitle && <p className="text-slate-300 text-lg">{subtitle}</p>}
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </div>
  )
}