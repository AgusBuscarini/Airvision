"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";
import { LatLngBoundsExpression } from "leaflet";
import "leaflet.markercluster";
import { useEffect, useState } from "react";
import { getFlights, getPrivateFlights, ExternalFlight } from "../services/flightService";
import LogoutButton from "./logoutButton";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

function FlightClusters({ flights }: { flights: ExternalFlight[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const markers = L.markerClusterGroup({
      chunkedLoading: true,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `
            <div style="
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 48px;
              height: 48px;
              border-radius: 50%;
              background: radial-gradient(circle at center, #2563eb 40%, #1e3a8a 100%);
              box-shadow: 0 0 10px rgba(0,0,0,0.4);
            ">
              <div style="
                position: absolute;
                width: 70%;
                height: 70%;
                border: 2px solid rgba(255,255,255,0.6);
                border-radius: 50%;
                animation: radarPulse 2s infinite ease-out;
              "></div>
              <span style="
                color: white;
                font-weight: bold;
                font-size: 13px;
                text-shadow: 0 0 3px #000;
              ">
                ${count}
              </span>
            </div>
          `,
          className: "cluster-icon",
          iconSize: [48, 48],
        });
      },
    });

    flights
      .filter((f) => f.lat && f.lon)
      .forEach((f) => {
        const rotation = ((f.trueTrack ?? 0) - 90 + 360) % 360;
        const color = f.isPrivate ? "#22c55e" : "#3b82f6";

        const icon = L.divIcon({
          html: `
            <div style="
              transform: rotate(${rotation}deg);
              color: ${color};
              font-size: 26px;
              text-shadow: 0 0 2px #000, 0 0 4px #000;
            ">
              ✈
            </div>
          `,
          className: "aircraft-marker",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([f.lat, f.lon], { icon }).bindPopup(`
          <strong>${f.callsign || "Vuelo sin ID"}</strong><br/>
          País: ${f.originCountry}<br/>
          Altitud: ${Math.round(f.baroAltitude || 0)} m<br/>
          Velocidad: ${Math.round(f.velocity || 0)} m/s<br/>
          Rumbo: ${Math.round(f.trueTrack || 0)}°
        `);

        markers.addLayer(marker);
      });

    map.addLayer(markers);

    return () => {
      map.removeLayer(markers);
    };
  }, [flights, map]);

  return null;
}

const worldBounds: LatLngBoundsExpression = [
  [-90, -180],
  [90, 180]
];

export default function AirMap() {
  const [flights, setFlights] = useState<ExternalFlight[]>([]);
  const [showRealFlights, setShowRealFlights] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const [publicFlights, privateFlights] = await Promise.all([
          getFlights(),
          getPrivateFlights(),
        ]);
        setFlights([...publicFlights, ...privateFlights]);
      } catch (error) {
        console.error("Error al obtener vuelos:", error);
      }
    };

    fetchFlights();
    const interval = setInterval(fetchFlights, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <LogoutButton />
      <button
        onClick={() => setShowRealFlights(!showRealFlights)}
        style={{
          position: "absolute",
          top: "55px",
          right: "10px",
          zIndex: 1000,
          padding: "8px 12px",
          backgroundColor: showRealFlights ? "#22c55e" : "#3b82f6",
          color: "white",
          fontWeight: "bold",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          transition: "all 0.3s ease",
        }}
      >
        {showRealFlights ? "Ocultar vuelos reales" : "Mostrar vuelos reales"}
      </button>

      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        style={{ height: "100vh", width: "100%" }}
        maxBounds={worldBounds}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
            OpenStreetMap</a> contributors'
        />

        <FlightClusters
          flights={showRealFlights ? flights : flights.filter((f) => f.isPrivate)}
        />
      </MapContainer>
    </div>
  );
}