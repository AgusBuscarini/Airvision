import { getToken, removeToken } from "./userService";
import { handleResponseError } from "@/utils/apiUtils";

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

export interface CreatePrivateFlightRequest {
  callsign: string;
  airlineId: string;
  icao24?: string;
  originAirportId?: string;
  destinationAirportId?: string;
}

export interface PrivateFlightDto {
  icao24: string;
  callsign: string;
  originCountry: string;
  lat: number;
  lon: number;
  baroAltitude: number;
  velocity: number;
  trueTrack: number;
  verticalRate: number;
  onGround: boolean;
  lastContactTs: string;
  destination: string;
  aircraftModel: string;
}

const BASE_URL = "/api/flights";

const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export async function getFlights(): Promise<ExternalFlight[]> {
  const response = await fetch(`${BASE_URL}/realtime`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    if (response.status == 401 || response.status == 403) {
      removeToken();
      window.location.href = "/login";
      throw new Error("Sesión expirada");
    }
    await handleResponseError(response, "Error al obtener los vuelos");
  }
  return response.json();
}

export async function getPrivateFlights(): Promise<ExternalFlight[]> {
  const response = await fetch(`${BASE_URL}/privates`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      removeToken();
      window.location.href = "/login";
      throw new Error("Sesión expirada");
    }
    await handleResponseError(response, "Error al obtener los vuelos");
  }
  const data: ExternalFlight[] = await response.json();
  return data.map((flight: ExternalFlight) => ({ ...flight, isPrivate: true }));
}

export async function createPrivateFlight(
  flightData: CreatePrivateFlightRequest
): Promise<PrivateFlightDto> {
  const response = await fetch(`${BASE_URL}/privates`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(flightData),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      removeToken();
      window.location.href = "/login";
      throw new Error("Sesión expirada");
    }

    await handleResponseError(response, "Error al crear el vuelo")
  }

  return response.json();
}

export async function deletePrivateFlight(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/privates/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      removeToken();
      window.location.href = "/login";
      throw new Error("Sesión expirada");
    }

    if (response.status !== 204) {
      await handleResponseError(response, "Error al eliminar el vuelo")
    }
  }
}
