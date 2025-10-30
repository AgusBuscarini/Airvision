import { getToken } from "./userService";

const BASE_URL = "http://localhost:8080/api/airports";

export interface Airport {
  id: string;
  name: string;
  iata: string;
  icao: string;
  country: {
    code: string;
    name: string;
  };
  lat: number;
  lon: number;
  createdAt: string;
}

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

export async function getAirports(): Promise<Airport[]> {
  const response = await fetch(`${BASE_URL}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Error al obtener los aeropuertos");
  }
  return response.json();
}