"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";
import "leaflet.markercluster";
import { useEffect, useState } from "react";
import { getFlights, ExternalFlight } from "../services/flightService";

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

    const markers = L.markerClusterGroup({chunkedLoading: true, iconCreateFunction: (cluster:any) => {
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
        const color = "#3b82f6";

        const icon = L.divIcon({
          html: `
            <div style="
              transform: rotate(${rotation}deg);
              color: ${color};
              font-size: 20px;
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
    return () => {map.removeLayer(markers)
    };
  }, [flights, map]);

  return null;
}


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
    const interval = setInterval(fetchFlights, 30000);
    return () => clearInterval(interval);
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

      <FlightClusters flights={flights} />
    </MapContainer>
  );
}
