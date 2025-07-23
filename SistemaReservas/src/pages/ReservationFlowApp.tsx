import React, { useState } from 'react';
import ValidacionHuesped from '@/components/ValidacionHuesped';
import { useHuespedValidado } from '@/hooks/useHuespedValidado';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Importar también otros servicios si los necesitas
// import { validarHuesped } from '@/services/huespedService';

interface ReservationFlowAppProps {
  onExit?: () => void;
}

const ReservationFlowApp: React.FC<ReservationFlowAppProps> = ({ onExit }) => {
  const [currentStep, setCurrentStep] = useState<'validation' | 'restaurant-selection' | 'booking'>('validation');
  
  // Hook para manejar el estado del huésped validado
  const { 
    huespedData, 
    validarHuesped, 
    limpiarHuesped, 
    isValidado 
  } = useHuespedValidado();

  // Estado para restaurantes y reserva
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);

  // Al montar el componente, cargar restaurantes
  React.useEffect(() => {
    if (isValidado && currentStep === 'validation') {
      setCurrentStep('restaurant-selection');
      loadRestaurants();
    }
  }, [isValidado]);

  // Función para cargar restaurantes desde el API
  const loadRestaurants = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/restaurantes');
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error('Error cargando restaurantes:', error);
    }
  };

  // Manejar validación exitosa del huésped
  const handleHuespedValidated = (idHuesped: number, datosHuesped: any) => {
    console.log('Huésped validado:', { idHuesped, datosHuesped });
    validarHuesped(idHuesped, datosHuesped);
    setCurrentStep('restaurant-selection');
    loadRestaurants();
  };

  // Manejar errores de validación
  const handleValidationError = (mensaje: string) => {
    console.error('Error en validación:', mensaje);
    alert(mensaje); // En producción usar toast o modal elegante
  };

  // Seleccionar restaurante
  const handleSelectRestaurant = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setCurrentStep('booking');
  };

  // Volver al paso anterior
  const handleBack = () => {
    if (currentStep === 'booking') {
      setCurrentStep('restaurant-selection');
      setSelectedRestaurant(null);
    } else if (currentStep === 'restaurant-selection') {
      setCurrentStep('validation');
      limpiarHuesped();
    }
  };

  // Renderizar paso de validación
  const renderValidationStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🏨 Sistema de Reservas de Restaurante
        </h1>
        <p className="text-gray-600">
          Para realizar una reserva, primero debes validar tus datos de huésped del hotel.
        </p>
      </div>
      
      <ValidacionHuesped 
        onHuespedValidado={handleHuespedValidated}
        onError={handleValidationError}
      />
    </div>
  );

  // Renderizar paso de selección de restaurante
  const renderRestaurantSelection = () => (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🍽️ Selecciona un Restaurante
        </h2>
        <div className="bg-green-50 p-4 rounded-lg inline-block mb-4">
          <p className="text-sm text-green-700">
            ✅ <strong>{huespedData?.nombre_completo}</strong> - Habitación {huespedData?.num_habitacion}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id_restaurante} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-200 relative">
              {restaurant.logo && (
                <img 
                  src={restaurant.logo} 
                  alt={restaurant.nombre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback si la imagen no carga
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium">
                {restaurant.tipoCocina}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{restaurant.nombre}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {restaurant.descripcion}
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">
                  👥 Hasta {restaurant.capacidad_max} personas
                </span>
              </div>
              <Button 
                onClick={() => handleSelectRestaurant(restaurant)}
                className="w-full"
              >
                Seleccionar Restaurante
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" onClick={handleBack}>
          ← Cambiar Datos del Huésped
        </Button>
      </div>
    </div>
  );

  // Renderizar paso de reserva
  const renderBookingStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📅 Hacer Reserva
        </h2>
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-blue-700">
            <strong>Huésped:</strong> {huespedData?.nombre_completo} - Habitación {huespedData?.num_habitacion}
          </p>
          <p className="text-sm text-blue-700">
            <strong>Restaurante:</strong> {selectedRestaurant?.nombre} ({selectedRestaurant?.tipoCocina})
          </p>
        </div>
      </div>

      <Card className="p-6">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-4">🚧 Formulario de Reserva</h3>
          <p className="text-gray-600 mb-6">
            Aquí iría el formulario para seleccionar fecha, hora, número de personas, etc.
          </p>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              <strong>Datos listos para usar:</strong>
            </p>
            <div className="bg-gray-50 p-4 rounded text-left">
              <pre className="text-xs">
{JSON.stringify({
  id_huesped: huespedData?.id_huesped,
  id_restaurante: selectedRestaurant?.id_restaurante,
  capacidad_maxima: selectedRestaurant?.capacidad_max
}, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-4 justify-center mt-6">
        <Button variant="outline" onClick={handleBack}>
          ← Cambiar Restaurante
        </Button>
        <Button onClick={() => alert('Formulario de reserva por implementar')}>
          Continuar con Reserva
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        {/* Header con botón de salida */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Sistema de Reservas</h1>
          {onExit && (
            <Button variant="outline" onClick={onExit} className="flex items-center gap-2">
              🏠 Volver al Inicio
            </Button>
          )}
        </div>

        {/* Indicador de pasos */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${currentStep === 'validation' ? 'text-blue-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                currentStep === 'validation' ? 'bg-blue-600' : 'bg-green-600'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Validar Huésped</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center ${
              currentStep === 'restaurant-selection' ? 'text-blue-600' : 
              currentStep === 'booking' ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                currentStep === 'restaurant-selection' ? 'bg-blue-600' : 
                currentStep === 'booking' ? 'bg-green-600' : 'bg-gray-400'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Seleccionar Restaurante</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center ${currentStep === 'booking' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                currentStep === 'booking' ? 'bg-blue-600' : 'bg-gray-400'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Hacer Reserva</span>
            </div>
          </div>
        </div>

        {/* Contenido del paso actual */}
        {currentStep === 'validation' && renderValidationStep()}
        {currentStep === 'restaurant-selection' && renderRestaurantSelection()}
        {currentStep === 'booking' && renderBookingStep()}
      </div>
    </div>
  );
};

export default ReservationFlowApp;
