import React, { useState, useEffect } from 'react';
import { 
  getAllAirlines, 
  deleteAirline, 
  AirlineResponse,
} from '@/services/airlineService';

interface AirlineManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AirlineManagementModal: React.FC<AirlineManagementModalProps> = ({ isOpen, onClose }) => {
  const [airlines, setAirlines] = useState<AirlineResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchAirlines();
    }
  }, [isOpen]);

  const fetchAirlines = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAllAirlines();
      setAirlines(data.filter(a => a.type === "PRIVATE")); 
    } catch (err: any) {
      setError(err.message || "Error al cargar aerolíneas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (airline: AirlineResponse) => {
    // Aquí abrirías otro modal (un modal de edición)
    // pasando 'airline' como prop.
    // Este modal usaría el servicio 'updateAirline'
    console.log("Editar aerolínea:", airline);
    alert("Funcionalidad de edición no implementada en este ejemplo.");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta aerolínea? Esta acción no se puede deshacer.")) {
      return;
    }
    
    try {
      await deleteAirline(id);
      fetchAirlines(); 
    } catch (err: any) {
      setError(err.message || "Error al eliminar");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex justify-center items-center p-4 pointer-events-none">
      <div className="bg-white p-6 rounded-lg shadow-xl z-[1010] w-full max-w-3xl max-h-[90vh] flex flex-col pointer-events-auto text-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Gestionar Aerolíneas Privadas (Admin)</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        {isLoading && <p>Cargando aerolíneas...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="flex-grow overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">País</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IATA/ICAO</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {airlines.map((airline) => (
                <tr key={airline.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{airline.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{airline.country?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{airline.iata || 'N/A'} / {airline.icao || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {airline.active ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Activa</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inactiva</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => handleEdit(airline)} className="text-indigo-600 hover:text-indigo-900">Editar</button>
                    <button onClick={() => handleDelete(airline.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {airlines.length === 0 && !isLoading && (
             <p className="text-center text-gray-500 py-8">No se encontraron aerolíneas privadas.</p>
          )}
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AirlineManagementModal;