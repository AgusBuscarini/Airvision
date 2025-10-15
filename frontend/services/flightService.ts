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

export async function getFlights(): Promise<ExternalFlight[]> {
  const response = await fetch(`${BASE_URL}/scheduled`);
  if (!response.ok) {
    throw new Error("Error al obtener los vuelos");
  }
  return response.json();
}

export async function getPrivateFlights(): Promise<ExternalFlight[]> {
  const response = await fetch(`${BASE_URL}/privates`);
  if(!response.ok) {
    throw new Error("Error al obtener los vuelos");
  }
  const data: ExternalFlight[] = await response.json();
  return data.map((flight: ExternalFlight) => ({...flight, isPrivate: true}));
}