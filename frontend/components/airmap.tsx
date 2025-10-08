"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { getFlights, ExternalFlight } from "../services/flightService";

// 🧭 Corrección de íconos (para que Leaflet funcione bien en Next.js)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

export default function AirMap() {
  const [flights, setFlights] = useState<ExternalFlight[]>([]);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const data = await getFlights();
        setFlights(data);
      } catch (error) {
        console.error("Error al obtener vuelos:", error);
      }
    };

    fetchFlights();
  }, []);

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
          OpenStreetMap</a> contributors'
      />


      {flights
        .filter((f) => f.lat && f.lon)
        .map((f) => (
          <Marker key={f.icao24} position={[f.lat, f.lon]}>
            <Popup>
              <strong>{f.callsign || "Vuelo sin ID"}</strong>
              <br />
              País: {f.originCountry}
              <br />
              Altitud: {Math.round(f.baroAltitude || 0)} m
              <br />
              Velocidad: {Math.round(f.velocity || 0)} m/s
              <br />
              Rumbo: {Math.round(f.trueTrack || 0)}°
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
