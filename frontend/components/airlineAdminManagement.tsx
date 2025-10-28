import React from 'react';

interface AirlineManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Podrías pasarle las aerolíneas o hacer que las cargue internamente
}

// Interfaz temporal para aerolínea (ajustar según tu backend)
interface PrivateAirline {
    id: string;
    name: string;
    iata?: string;
    icao?: string;
    countryCode?: string;
    ownerEmail?: string; // Para saber quién la creó
    active: boolean;
}

const AirlineManagementModal: React.FC<AirlineManagementModalProps> = ({ isOpen, onClose }) => {
  // --- Estados para cargar y mostrar aerolíneas ---
  // const [airlines, setAirlines] = useState<PrivateAirline[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState('');

  // --- useEffect para cargar aerolíneas cuando el modal se abre ---
  // useEffect(() => {
  //   if (isOpen) {
  //     // Lógica para llamar al servicio y obtener todas las aerolíneas privadas (necesita endpoint backend)
  //     // fetchAllPrivateAirlines().then(setAirlines).catch(setError).finally(() => setIsLoading(false));
  //      console.log("Modal de gestión abierto - Aquí se cargarían las aerolíneas");
  //   }
  // }, [isOpen]);


  const handleEdit = (id: string) => console.log("Editar aerolínea:", id);
  const handleDelete = (id: string) => console.log("Eliminar aerolínea:", id);
  const handleToggleActive = (id: string) => console.log("Activar/Desactivar aerolínea:", id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex justify-center items-center p-4 pointer-events-none">
      <div className="bg-white p-6 rounded-lg shadow-xl z-[1010] w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto text-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Gestionar Aerolíneas Privadas (Admin)</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        {/* Aquí iría la lógica para mostrar la lista de aerolíneas */}
        <p className="text-center text-gray-500 py-8">
            (Aquí se mostrará la lista de aerolíneas privadas para gestionar)
            <br />
            Necesitarás un endpoint en el backend para obtenerlas (ej: GET /api/admin/airlines)
            y servicios en el frontend para interactuar.
        </p>

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