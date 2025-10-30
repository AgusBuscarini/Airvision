import { getToken } from "./userService";

const BASE_URL = "http://localhost:8080/api";

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
