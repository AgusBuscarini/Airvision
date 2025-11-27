import { getToken } from "./userService";

const BASE_URL = "/api/statistics";

export interface StatItem {
  name: string;
  value: number;
  color?: string;
  [key: string]: any;
}

export interface FlightStats {
  totalCount: number;
  fleetStatus: StatItem[];
  topCountries: StatItem[];
}

export interface DashboardStatsResponse {
  global: FlightStats;
  publicFlights: FlightStats;
  privateFlights: FlightStats;
  myFlights: FlightStats;
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

export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  const response = await fetch(`${BASE_URL}/dashboard`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error al obtener estadísticas del dashboard");
  }
  return response.json();
}

export async function getFullExportStats(): Promise<DashboardStatsResponse> {
  const response = await fetch(`${BASE_URL}/export`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error al obtener estadísticas completas para exportación");
  }
  return response.json();
}