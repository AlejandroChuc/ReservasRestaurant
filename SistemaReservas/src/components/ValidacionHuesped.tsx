import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface HuespedData {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  num_habitacion: string;
  numero_personas: number;
  correo: string;
}

interface ValidacionHuespedProps {
  onHuespedValidado: (idHuesped: number, datosHuesped: any) => void;
  onError: (mensaje: string) => void;
}

const ValidacionHuesped: React.FC<ValidacionHuespedProps> = ({ 
  onHuespedValidado, 
  onError 
}) => {
  const [formData, setFormData] = useState<HuespedData>({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    num_habitacion: '',
    numero_personas: 1,
    correo: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Validar campos del formulario
  const validarCampos = (): boolean => {
    const nuevosErrores: {[key: string]: string} = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }

    if (!formData.apellido_paterno.trim()) {
      nuevosErrores.apellido_paterno = 'El apellido paterno es obligatorio';
    }

    if (!formData.apellido_materno.trim()) {
      nuevosErrores.apellido_materno = 'El apellido materno es obligatorio';
    }

    if (!formData.num_habitacion.trim()) {
      nuevosErrores.num_habitacion = 'El número de habitación es obligatorio';
    }

    if (formData.numero_personas < 1) {
      nuevosErrores.numero_personas = 'El número de personas debe ser mayor a 0';
    }

    if (!formData.correo.trim()) {
      nuevosErrores.correo = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      nuevosErrores.correo = 'El formato del correo electrónico no es válido';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleInputChange = (field: keyof HuespedData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarCampos()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/huespedes/validar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Huésped válido - llamar callback con los datos
        onHuespedValidado(data.id_huesped, {
          nombre_completo: data.nombre_completo,
          num_habitacion: data.num_habitacion,
          fecha_llegada: data.fecha_llegada,
          fecha_salida: data.fecha_salida
        });
      } else {
        onError(data.error || 'Error al validar los datos del huésped');
      }
    } catch (error) {
      console.error('Error al validar huésped:', error);
      onError('Error de conexión al validar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Datos del Huésped
        </h2>
        <p className="text-gray-600">
          Por favor, ingresa tus datos exactos como aparecen en tu reserva de hotel
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              type="text"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Tu nombre"
              className={errors.nombre ? 'border-red-500' : ''}
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <Label htmlFor="apellido_paterno">Apellido Paterno *</Label>
            <Input
              id="apellido_paterno"
              type="text"
              value={formData.apellido_paterno}
              onChange={(e) => handleInputChange('apellido_paterno', e.target.value)}
              placeholder="Apellido paterno"
              className={errors.apellido_paterno ? 'border-red-500' : ''}
            />
            {errors.apellido_paterno && <p className="text-red-500 text-sm mt-1">{errors.apellido_paterno}</p>}
          </div>

          <div>
            <Label htmlFor="apellido_materno">Apellido Materno *</Label>
            <Input
              id="apellido_materno"
              type="text"
              value={formData.apellido_materno}
              onChange={(e) => handleInputChange('apellido_materno', e.target.value)}
              placeholder="Apellido materno"
              className={errors.apellido_materno ? 'border-red-500' : ''}
            />
            {errors.apellido_materno && <p className="text-red-500 text-sm mt-1">{errors.apellido_materno}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="num_habitacion">Número de Habitación *</Label>
            <Input
              id="num_habitacion"
              type="text"
              value={formData.num_habitacion}
              onChange={(e) => handleInputChange('num_habitacion', e.target.value)}
              placeholder="Ej: 101, A-205"
              className={errors.num_habitacion ? 'border-red-500' : ''}
            />
            {errors.num_habitacion && <p className="text-red-500 text-sm mt-1">{errors.num_habitacion}</p>}
          </div>

          <div>
            <Label htmlFor="numero_personas">Número de Personas *</Label>
            <Input
              id="numero_personas"
              type="number"
              min="1"
              value={formData.numero_personas}
              onChange={(e) => handleInputChange('numero_personas', parseInt(e.target.value) || 1)}
              className={errors.numero_personas ? 'border-red-500' : ''}
            />
            {errors.numero_personas && <p className="text-red-500 text-sm mt-1">{errors.numero_personas}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="correo">Correo Electrónico *</Label>
          <Input
            id="correo"
            type="email"
            value={formData.correo}
            onChange={(e) => handleInputChange('correo', e.target.value)}
            placeholder="tu@email.com"
            className={errors.correo ? 'border-red-500' : ''}
          />
          {errors.correo && <p className="text-red-500 text-sm mt-1">{errors.correo}</p>}
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Validando...' : 'Validar Datos y Continuar'}
          </Button>
        </div>
      </form>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Importante:</strong> Los datos deben coincidir exactamente con tu reserva de hotel. 
          Solo puedes hacer reservas durante tu estancia en el hotel.
        </p>
      </div>
    </Card>
  );
};

export default ValidacionHuesped;
