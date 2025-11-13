import { getToken } from "./userService";

const BASE_URL = "/api";

export interface Country {
  code: string;
  name: string;
}

export interface AirlineRequest {
  name: string;
  iata: string;
  icao: string;
  country: Country;
}

export interface AirlineResponse {
  id: string;
  name: string;
  iata: string;
  icao: string;
  country: Country;
  active: boolean;
  type: string;
}

export async function createPrivateAirline(
  request: AirlineRequest
): Promise<AirlineResponse> {
  const token = getToken();

  const response = await fetch(`${BASE_URL}/airlines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error al crear la aerolínea");
  }

  return response.json();
}

export async function getMyPrivateAirlines(): Promise<AirlineResponse[]> {
  const token = getToken();
  if (!token) {
    throw new Error("Usuario no autenticado");
  }

  const response = await fetch(`${BASE_URL}/airlines/my-private`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener mis aerolíneas privadas");
  }
  return response.json();
}

export async function deleteMyPrivateAirline(id: string): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("Usuario no autenticado");

  const response = await fetch(`${BASE_URL}/airlines/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      window.location.href = "/login";
    }
    if (response.status !== 204) {
      const errorText = await response.text();
      throw new Error(errorText || "Error al eliminar la aerolínea");
    }
  }
}

export async function getAllAirlines(): Promise<AirlineResponse[]> {
  const token = getToken();
  if (!token) throw new Error("Administrador no autenticado");

  const response = await fetch("http://localhost:8080/api/admin/airlines", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener todas las aerolíneas");
  }
  return response.json();
}

export async function updateAirline(
  id: string,
  airlineData: AirlineRequest
): Promise<AirlineResponse> {
  const token = getToken();
  if (!token) throw new Error("Administrador no autenticado");

  const response = await fetch(`http://localhost:8080/api/admin/airlines/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(airlineData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error al actualizar la aerolínea");
  }
  return response.json();
}

export async function deleteAirline(id: string): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("Administrador no autenticado");

  const response = await fetch(`http://localhost:8080/api/admin/airlines/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status !== 204) {
      const errorText = await response.text();
      throw new Error(errorText || "Error al eliminar la aerolínea");
    }
  }
}