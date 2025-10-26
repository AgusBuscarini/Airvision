import React, { useState, useEffect } from 'react';
// Asume que tendrás un servicio para obtener tus aerolíneas privadas
// import { getMyPrivateAirlines, Airline } from '@/services/airlineService'; // Descomentar cuando exista

// Define una interfaz temporal para Airline si aún no la tienes en el frontend
interface Airline {
  id: string; // O el tipo de ID que uses (UUID se maneja como string en TS/JS)
  name: string;
}

interface FlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FlightFormData) => void;
}

// Interfaz para los datos del formulario de Vuelo
export interface FlightFormData {
  callsign: string;
  airlineId: string; // ID de la aerolínea privada seleccionada
  originCountry: string; // O podrías usar IDs de Aeropuertos si los gestionas
  destination: string; // Ídem
  aircraftModel: string; // Puede que necesites añadir esto al backend si es relevante
  // Campos de estado inicial (opcional, podrías calcularlos o definirlos en backend)
  lat?: number;
  lon?: number;
  baroAltitude?: number;
  velocity?: number;
  trueTrack?: number;
  verticalRate?: number;
  onGround?: boolean;
  // ICAO24 podría generarse en backend o ser opcional en el form
  icao24?: string;
}

const FlightModal: React.FC<FlightModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<FlightFormData>({
    callsign: '',
    airlineId: '',
    originCountry: '',
    destination: '',
    aircraftModel: '',
    // Valores iniciales opcionales
    lat: undefined,
    lon: undefined,
    baroAltitude: undefined,
    velocity: undefined,
    trueTrack: undefined,
    verticalRate: 0, // Por defecto 0
    onGround: true,   // Por defecto en tierra al crear?
  });

  // Estado para guardar las aerolíneas privadas del usuario
  const [privateAirlines, setPrivateAirlines] = useState<Airline[]>([]);
  const [isLoadingAirlines, setIsLoadingAirlines] = useState(false);
  const [errorAirlines, setErrorAirlines] = useState('');

  // Efecto para cargar las aerolíneas privadas cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      const fetchAirlines = async () => {
        setIsLoadingAirlines(true);
        setErrorAirlines('');
        try {
          // --- DESCOMENTAR Y AJUSTAR CUANDO TENGAS EL SERVICIO ---
          // const airlines = await getMyPrivateAirlines(); // Llama a tu servicio
          // setPrivateAirlines(airlines);

          // --- DATOS DE EJEMPLO MIENTRAS TANTO ---
          await new Promise(resolve => setTimeout(resolve, 500)); // Simula carga
          setPrivateAirlines([
            { id: 'uuid-ejemplo-1', name: 'Mi Aerolínea 1' },
            { id: 'uuid-ejemplo-2', name: 'Otra Aerolínea Privada' },
          ]);
          // --- FIN DATOS DE EJEMPLO ---

        } catch (error) {
          console.error("Error fetching private airlines:", error);
          setErrorAirlines('No se pudieron cargar las aerolíneas.');
        } finally {
          setIsLoadingAirlines(false);
        }
      };
      fetchAirlines();
    }
  }, [isOpen]); // Se ejecuta cada vez que 'isOpen' cambia


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;

     // Manejo especial para checkboxes
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    }
    // Manejo para campos numéricos opcionales
    else if (['lat', 'lon', 'baroAltitude', 'velocity', 'trueTrack', 'verticalRate'].includes(name)) {
        setFormData(prev => ({ ...prev, [name]: value === '' ? undefined : Number(value) }));
    }
     else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.airlineId) {
        alert("Por favor, selecciona una aerolínea.");
        return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex justify-center items-center p-4 pointer-events-none">
      <div className="bg-white p-6 rounded-lg shadow-xl z-[1010] w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto">
          <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Crear Vuelo Privado</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selector de Aerolínea */}
          <div>
            <label htmlFor="airlineId" className="block text-sm font-medium text-gray-700 mb-1">Aerolínea*</label>
            {isLoadingAirlines && <p className="text-sm text-gray-500">Cargando aerolíneas...</p>}
            {errorAirlines && <p className="text-sm text-red-500">{errorAirlines}</p>}
            <select
              id="airlineId"
              name="airlineId"
              value={formData.airlineId}
              onChange={handleChange}
              className={`w-full border rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${!formData.airlineId ? 'border-red-500' : 'border-gray-300'}`}
              required
              disabled={isLoadingAirlines || !!errorAirlines || privateAirlines.length === 0}
            >
              <option value="" disabled>-- Selecciona tu aerolínea --</option>
              {privateAirlines.map(airline => (
                <option key={airline.id} value={airline.id}>{airline.name}</option>
              ))}
            </select>
            {privateAirlines.length === 0 && !isLoadingAirlines && !errorAirlines && (
                <p className="text-xs text-gray-500 mt-1">No tienes aerolíneas privadas. <a href="#" onClick={() => {/* Lógica para abrir modal aerolínea? */}} className="text-blue-600 hover:underline">Crea una</a>.</p>
            )}
          </div>

          {/* Callsign */}
          <div>
            <label htmlFor="callsign" className="block text-sm font-medium text-gray-700 mb-1">Identificador (Callsign)*</label>
            <input type="text" id="callsign" name="callsign" value={formData.callsign} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: PRV001"/>
          </div>

           {/* ICAO24 (Opcional?) */}
          <div>
            <label htmlFor="icao24" className="block text-sm font-medium text-gray-700 mb-1">ICAO24 (Opcional)</label>
            <input type="text" id="icao24" name="icao24" value={formData.icao24 || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: a1b2c3 (Hex)"/>
          </div>

          {/* Origen y Destino */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label htmlFor="originCountry" className="block text-sm font-medium text-gray-700 mb-1">País/Lugar Origen*</label>
               <input type="text" id="originCountry" name="originCountry" value={formData.originCountry} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Córdoba"/>
             </div>
             <div>
               <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">Destino*</label>
               <input type="text" id="destination" name="destination" value={formData.destination} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Mendoza"/>
             </div>
          </div>

          {/* Modelo Aeronave */}
          <div>
            <label htmlFor="aircraftModel" className="block text-sm font-medium text-gray-700 mb-1">Modelo Aeronave*</label>
            <input type="text" id="aircraftModel" name="aircraftModel" value={formData.aircraftModel} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Learjet 45"/>
          </div>
          
          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-3 border-t mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Crear Vuelo</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlightModal;