import React, { useState, useEffect } from 'react';
import { 
  getAllAirlines, 
  deleteAirline, 
  AirlineResponse,
} from '@/services/airlineService';
import {
  getAllUsers,
  updateUserRole,
  User,
  Role,
} from '@/services/userService';


interface AirlineManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'airlines' | 'users';

const AirlineManagementModal: React.FC<AirlineManagementModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('airlines');
  
  const [airlines, setAirlines] = useState<AirlineResponse[]>([]);
  const [isLoadingAirlines, setIsLoadingAirlines] = useState(false);
  const [errorAirlines, setErrorAirlines] = useState('');

  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState('');
  const [isUpdatingRole, setIsUpdatingRole] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('airlines');
      setAirlines([]);
      setUsers([]);
      setErrorAirlines('');
      setErrorUsers('');
      fetchAirlines();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeTab === 'airlines') {
      fetchAirlines();
    }
    if (isOpen && activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, isOpen]);

  const fetchAirlines = async () => {
    setIsLoadingAirlines(true);
    setErrorAirlines('');
    try {
      const data = await getAllAirlines();
      setAirlines(data.filter(a => a.type === "PRIVATE")); 
    } catch (err: any) {
      setErrorAirlines(err.message || "Error al cargar aerolíneas");
    } finally {
      setIsLoadingAirlines(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    setErrorUsers('');
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setErrorUsers(err.message || "Error al cargar usuarios");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta aerolínea? Esta acción no se puede deshacer.")) {
      return;
    }
    
    try {
      await deleteAirline(id);
      fetchAirlines(); 
    } catch (err: any) {
      setErrorAirlines(err.message || "Error al eliminar");
    }
  };

  const handleRoleChange = async (userId: string, newRole: Role) => {
    if (isUpdatingRole) return;

    const originalUsers = [...users];
    
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setIsUpdatingRole(userId);

    try {
      await updateUserRole(userId, { role: newRole });
    } catch (err: any) {
      setErrorUsers(err.message || "Error al actualizar el rol");
      setUsers(originalUsers);
    } finally {
      setIsUpdatingRole(null);
    }
  };

  if (!isOpen) return null;

const renderAirlinesTab = () => (
    <>
      {isLoadingAirlines && <p>Cargando aerolíneas...</p>}
      {errorAirlines && <p className="text-red-500">{errorAirlines}</p>}
      
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
                  <button onClick={() => handleDelete(airline.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {airlines.length === 0 && !isLoadingAirlines && (
           <p className="text-center text-gray-500 py-8">No se encontraron aerolíneas privadas.</p>
        )}
      </div>
    </>
  );

  const renderUsersTab = () => (
    <>
      {isLoadingUsers && <p>Cargando usuarios...</p>}
      {errorUsers && <p className="text-red-500">{errorUsers}</p>}
      
      <div className="flex-grow overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                    disabled={isUpdatingRole === user.id}
                    className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100"
                  >
                    <option value={Role.USER_FREE}>USER_FREE</option>
                    <option value={Role.USER_PREMIUM}>USER_PREMIUM</option>
                    <option value={Role.ADMIN}>ADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && !isLoadingUsers && (
           <p className="text-center text-gray-500 py-8">No se encontraron usuarios.</p>
        )}
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-[1000] flex justify-center items-center p-4 pointer-events-none">
      <div className="bg-white p-6 rounded-lg shadow-xl z-[1010] w-full max-w-4xl max-h-[90vh] flex flex-col pointer-events-auto text-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Gestión (Admin)</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab('airlines')}
            className={`py-2 px-6 ${
              activeTab === 'airlines'
                ? 'border-b-2 border-blue-600 font-semibold text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Aerolíneas
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-6 ${
              activeTab === 'users'
                ? 'border-b-2 border-blue-600 font-semibold text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Usuarios
          </button>
        </div>

        <div className="flex-grow overflow-hidden flex flex-col">
          {activeTab === 'airlines' ? renderAirlinesTab() : renderUsersTab()}
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