import { getToken, removeToken } from "./userService";

export interface ExternalFlight {
  icao24: string;
  callsign: string | null;
  originCountry: string;
  lon: number;
  lat: number;
  baroAltitude: number;
  velocity: number;
  trueTrack: number;
  verticalRate: number;
  onGround: boolean;
  lastContactTs: string;
  isPrivate?: boolean;
}

const BASE_URL = "http://localhost:8080/api/flights";

const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function getFlights(): Promise<ExternalFlight[]> {
  const response = await fetch(`${BASE_URL}/scheduled`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    if (response.status == 401 || response.status == 403) {
      console.error("No autorizado o token expirado")
      removeToken();
      window.location.href = '/login';
    }
    throw new Error("Error al obtener los vuelos");
  }
  return response.json();
}

export async function getPrivateFlights(): Promise<ExternalFlight[]> {
  const response = await fetch(`${BASE_URL}/privates`, {
    headers: getAuthHeaders(),
  });
  if(!response.ok) {
    if (response.status === 401 || response.status === 403) {
       console.error("No autorizado o token expirado para vuelos privados.");
       removeToken();
       window.location.href = '/login';
     }
    throw new Error("Error al obtener los vuelos");
  }
  const data: ExternalFlight[] = await response.json();
  return data.map((flight: ExternalFlight) => ({...flight, isPrivate: true}));
}