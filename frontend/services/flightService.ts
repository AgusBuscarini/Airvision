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
}

const BASE_URL = "http://localhost:8080/api/flights/limit?limit=500";

export async function getFlights(): Promise<ExternalFlight[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error("Error al obtener los vuelos");
  }
  return response.json();
}
