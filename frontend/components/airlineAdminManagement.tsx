import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getAllAirlines,
  deleteAirline,
  AirlineResponse,
} from "@/services/airlineService";
import {
  getAllUsers,
  updateUserRole,
  User,
  Role,
} from "@/services/userService";
import AirlineModal from "./airlineModal";

interface AirlineManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PencilIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);

type AdminTab = "airlines" | "users";

const AirlineManagementModal: React.FC<AirlineManagementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("airlines");

  const [airlines, setAirlines] = useState<AirlineResponse[]>([]);
  const [isLoadingAirlines, setIsLoadingAirlines] = useState(false);
  const [errorAirlines, setErrorAirlines] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState("");
  const [isUpdatingRole, setIsUpdatingRole] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [airlineToEdit, setAirlineToEdit] = useState<AirlineResponse | null>(
    null
  );

  const handleEdit = (airline: AirlineResponse) => {
    setAirlineToEdit(airline);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setAirlineToEdit(null);
    fetchAirlines();
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setAirlineToEdit(null);
  };

  useEffect(() => {
    if (isOpen) {
      setErrorAirlines("");
      setErrorUsers("");

      fetchAirlines();
      fetchUsers();
    }
  }, [isOpen]);

  const getOwnerName = (ownerId?: string) => {
    if (!ownerId) return "Sistema (Global)";
    const user = users.find((u) => u.id === ownerId);
    return user ? user.name : "Usuario desconocido";
  };

  const fetchAirlines = async () => {
    setIsLoadingAirlines(true);
    setErrorAirlines("");
    try {
      const data = await getAllAirlines();
      setAirlines(data.filter((a) => a.type === "PRIVATE"));
    } catch (err: any) {
      setErrorAirlines(err.message || "Error al cargar aerolíneas");
    } finally {
      setIsLoadingAirlines(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    setErrorUsers("");
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
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Eliminarás esta aerolínea permanentemente (acción de administrador).",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;
    
    try {
      await deleteAirline(id);
      Swal.fire("¡Eliminada!", "La aerolínea ha sido eliminada.", "success");
      fetchAirlines(); 
    } catch (err: any) {
      Swal.fire("Error", err.message || "Error al eliminar la aerolínea", "error");
    }
  };

  const handleRoleChange = async (userId: string, newRole: Role) => {
    if (isUpdatingRole) return;

    const originalUsers = [...users];

    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    setIsUpdatingRole(userId);

    try {
      await updateUserRole(userId, { role: newRole });
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      Toast.fire({ icon: 'success', title: 'Rol actualizado' });
    } catch (err: any) {
      setErrorUsers(err.message || "Error al actualizar el rol");
      setUsers(originalUsers);
      Swal.fire("Error", "No se pudo actualizar el rol.", "error");
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
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Propietario
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                País
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                IATA/ICAO
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Estado
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {airlines.map((airline) => (
              <tr key={airline.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {airline.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {getOwnerName(airline.ownerId)}
                  {airline.ownerId && (
                    <span className="block text-xs text-gray-400">
                      {users.find((u) => u.id === airline.ownerId)?.email}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {airline.country?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {airline.iata || "N/A"} / {airline.icao || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {airline.active ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Activa
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Inactiva
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(airline)}
                    className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-full transition-colors"
                    title="Editar aerolínea"
                  >
                    <PencilIcon />
                  </button>
                  <button
                    onClick={() => handleDelete(airline.id)}
                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                    title="Eliminar aerolínea"
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {airlines.length === 0 && !isLoadingAirlines && (
          <p className="text-center text-gray-500 py-8">
            No se encontraron aerolíneas privadas.
          </p>
        )}
      </div>

      <AirlineModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
        airlineToEdit={airlineToEdit}
      />
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
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nombre
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Rol
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value as Role)
                    }
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
          <p className="text-center text-gray-500 py-8">
            No se encontraron usuarios.
          </p>
        )}
      </div>
    </>
  );

  return (
    <div
      className="fixed inset-0 z-[1000] flex justify-center items-center bg-black/30 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl z-[1010] w-full max-w-4xl max-h-[90vh] flex flex-col pointer-events-auto text-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Gestión (Admin)</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab("airlines")}
            className={`py-2 px-6 ${
              activeTab === "airlines"
                ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Aerolíneas
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`py-2 px-6 ${
              activeTab === "users"
                ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Usuarios
          </button>
        </div>

        <div className="flex-grow overflow-hidden flex flex-col">
          {activeTab === "airlines" ? renderAirlinesTab() : renderUsersTab()}
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AirlineManagementModal;
