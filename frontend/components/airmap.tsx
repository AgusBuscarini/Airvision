"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";
import { LatLngBoundsExpression } from "leaflet";
import "leaflet.markercluster";
import { useEffect, useState, useMemo } from "react";
import {
  getFlights,
  getPrivateFlights,
  ExternalFlight,
} from "../services/flightService";
import LogoutButton from "./logoutButton";
import AirlineManagementModal from "./airlineAdminManagement";
import { useAuth } from "@/context/authContext";
import MyAirlinesModal from "./myAirlinesModal";
import MyFlightsModal from "./myFlightsModal";
import FaqModal from "./faqModal";
import TermsModal from "./termsModal";
import HelpIcon from "./helpIcon";
import PremiumModal from "./premiumModal";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.572a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
    />
  </svg>
);

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
  [90, 180],
];

interface Filters {
  minAltitude: number | null;
  maxAltitude: number | null;
  minSpeed: number | null;
  maxSpeed: number | null;
  onGround: boolean | null;
  flightType: "all" | "public" | "private";
}

const initialFilters: Filters = {
  minAltitude: null,
  maxAltitude: null,
  minSpeed: null,
  maxSpeed: null,
  onGround: null,
  flightType: "all",
};

export default function AirMap() {
  const [flights, setFlights] = useState<ExternalFlight[]>([]);
  const [isMyFlightsModalOpen, setIsMyFlightsModalOpen] = useState(false);
  const [isMyAirlinesModalOpen, setIsMyAirlinesModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const [isPremiumModalOpen ,setIsPremiumModalOpen] = useState(false);

  const { role } = useAuth();

  const [isAirlineManagementModalOpen, setIsAirlineManagementModalOpen] =
    useState(false);

  const handleOpenAirlineManagementModal = () => {
    setIsMyFlightsModalOpen(false);
    setIsMyAirlinesModalOpen(false);
    setIsFilterMenuOpen(false);
    setIsAirlineManagementModalOpen(true);
  };

  const handleCloseAirlineManagementModal = () => {
    setIsAirlineManagementModalOpen(false);
  };

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const publicFlightsPromise = getFlights();
        const privateFlightsPromise =
          role === "ADMIN" || role === "USER_PREMIUM"
            ? getPrivateFlights()
            : Promise.resolve([]);
        const [publicFlights, privateFlights] = await Promise.all([
          publicFlightsPromise,
          privateFlightsPromise,
        ]);
        setFlights([...publicFlights, ...privateFlights]);
      } catch (error) {
        console.error("Error al obtener vuelos:", error);
      }
    };

    fetchFlights();
    const interval = setInterval(fetchFlights, 30000);
    return () => clearInterval(interval);
  }, [role]);

  const filteredFlights = useMemo(() => {
    return flights.filter((flight) => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch =
        searchTermLower === "" ||
        (flight.callsign &&
          flight.callsign.toLowerCase().includes(searchTermLower)) ||
        (flight.originCountry &&
          flight.originCountry.toLowerCase().includes(searchTermLower));

      if (!matchesSearch) return false;

      if (filters.flightType === "public" && flight.isPrivate) return false;
      if (filters.flightType === "private" && !flight.isPrivate) return false;

      if (filters.onGround !== null && flight.onGround !== filters.onGround)
        return false;

      if (
        filters.minAltitude !== null &&
        (flight.baroAltitude ?? -Infinity) < filters.minAltitude
      )
        return false;

      if (
        filters.maxAltitude !== null &&
        (flight.baroAltitude ?? Infinity) > filters.maxAltitude
      )
        return false;

      if (
        filters.minSpeed !== null &&
        (flight.velocity ?? -Infinity) < filters.minSpeed
      )
        return false;

      if (
        filters.maxSpeed !== null &&
        (flight.velocity ?? Infinity) > filters.maxSpeed
      )
        return false;

      return true;
    });
  }, [flights, searchTerm, filters]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      if (name === "onGroundToggle") {
        setFilters((prev) => ({ ...prev, onGround: checked ? true : null }));
      } else if (name === "inAirToggle") {
        setFilters((prev) => ({ ...prev, onGround: checked ? false : null }));
      }
    } else if (type === "number") {
      setFilters((prev) => ({
        ...prev,
        [name]: value === "" ? null : Number(value),
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value as any }));
    }
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div style={{ position: "relative" }}>
      <LogoutButton />
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "50px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "rgba(255, 255, 255, 0.8)",
          padding: "8px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        <input
          type="text"
          placeholder="Buscar por Callsign o País..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "250px",
            color: "#333",
          }}
        />

        <button
          onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
          style={{
            padding: "8px",
            background: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#333",
          }}
          title="Abrir filtros"
        >
          <FilterIcon />
        </button>

        {isFilterMenuOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 5px)",
              left: 0,
              background: "white",
              borderRadius: "6px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              padding: "15px",
              width: "300px",
              zIndex: 1010,
              color: "#333",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontWeight: "bold",
                borderBottom: "1px solid #eee",
                paddingBottom: "8px",
              }}
            >
              Filtros
            </h3>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                Tipo de Vuelo:
              </label>
              <select
                name="flightType"
                value={filters.flightType}
                onChange={handleFilterChange}
                style={{
                  width: "100%",
                  padding: "6px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="all">Todos</option>
                <option value="public">Públicos</option>
                <option value="private">Privados</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <label style={{ fontSize: "14px" }}>Estado:</label>
              <label style={{ fontSize: "14px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="onGround"
                  value="null"
                  checked={filters.onGround === null}
                  onChange={() =>
                    setFilters((prev) => ({ ...prev, onGround: null }))
                  }
                />{" "}
                Ambos
              </label>
              <label style={{ fontSize: "14px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="onGround"
                  value="true"
                  checked={filters.onGround === true}
                  onChange={() =>
                    setFilters((prev) => ({ ...prev, onGround: true }))
                  }
                />{" "}
                En Tierra
              </label>
              <label style={{ fontSize: "14px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="onGround"
                  value="false"
                  checked={filters.onGround === false}
                  onChange={() =>
                    setFilters((prev) => ({ ...prev, onGround: false }))
                  }
                />{" "}
                En Aire
              </label>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <div>
                <label
                  htmlFor="minAltitude"
                  style={{
                    display: "block",
                    fontSize: "14px",
                    marginBottom: "4px",
                  }}
                >
                  Alt. Mín (m):
                </label>
                <input
                  type="number"
                  id="minAltitude"
                  name="minAltitude"
                  value={filters.minAltitude ?? ""}
                  onChange={handleFilterChange}
                  placeholder="Ej: 5000"
                  style={{
                    width: "100%",
                    padding: "6px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="maxAltitude"
                  style={{
                    display: "block",
                    fontSize: "14px",
                    marginBottom: "4px",
                  }}
                >
                  Alt. Máx (m):
                </label>
                <input
                  type="number"
                  id="maxAltitude"
                  name="maxAltitude"
                  value={filters.maxAltitude ?? ""}
                  onChange={handleFilterChange}
                  placeholder="Ej: 12000"
                  style={{
                    width: "100%",
                    padding: "6px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <div>
                <label
                  htmlFor="minSpeed"
                  style={{
                    display: "block",
                    fontSize: "14px",
                    marginBottom: "4px",
                  }}
                >
                  Vel. Mín (m/s):
                </label>
                <input
                  type="number"
                  id="minSpeed"
                  name="minSpeed"
                  value={filters.minSpeed ?? ""}
                  onChange={handleFilterChange}
                  placeholder="Ej: 100"
                  style={{
                    width: "100%",
                    padding: "6px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="maxSpeed"
                  style={{
                    display: "block",
                    fontSize: "14px",
                    marginBottom: "4px",
                  }}
                >
                  Vel. Máx (m/s):
                </label>
                <input
                  type="number"
                  id="maxSpeed"
                  name="maxSpeed"
                  value={filters.maxSpeed ?? ""}
                  onChange={handleFilterChange}
                  placeholder="Ej: 300"
                  style={{
                    width: "100%",
                    padding: "6px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </div>

            <button
              onClick={resetFilters}
              style={{
                padding: "6px 10px",
                background: "#e5e7eb",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Limpiar Filtros
            </button>
          </div>
        )}
      </div>

      {role === "USER_FREE" && (
        <button
          onClick={() => setIsPremiumModalOpen(true)}
          style={{
            position: "absolute",
            top: "100px",
            right: "10px",
            zIndex: 1000,
            padding: "8px 12px",
            backgroundColor: "#10b981",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          Hacerse Premium
        </button>
      )}

      {role === "ADMIN" && (
        <button
          onClick={handleOpenAirlineManagementModal}
          style={{
            position: "absolute",
            top: "55px",
            right: "10px",
            zIndex: 1000,
            padding: "8px 12px",
            backgroundColor: "#6366f1",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          Gestión (Admin)
        </button>
      )}

      {(role === "ADMIN" || role === "USER_PREMIUM") && (
        <>
          <button
            onClick={() => setIsMyAirlinesModalOpen(true)}
            style={{
              position: "absolute",
              top: "100px",
              right: "10px",
              zIndex: 1000,
              padding: "8px 12px",
              backgroundColor: "#f59e0b",
              color: "white",
              fontWeight: "bold",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            Mis Aerolineas
          </button>

          <button
            onClick={() => setIsMyFlightsModalOpen(true)}
            style={{
              position: "absolute",
              top: "145px",
              right: "10px",
              zIndex: 1000,
              padding: "8px 12px",
              backgroundColor: "#f59e0b",
              color: "white",
              fontWeight: "bold",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            Mis Vuelos
          </button>
        </>
      )}

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        {isHelpMenuOpen && (
          <div
            style={{
              position: "absolute",
              bottom: "calc(100% + 10px)",
              right: 0,
              width: "200px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => {
                setIsFaqOpen(true);
                setIsHelpMenuOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "12px 16px",
                textAlign: "left",
                color: "#333",
                fontSize: "14px",
                border: "none",
                background: "none",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
              className="hover:bg-gray-100"
            >
              Preguntas Frecuentes
            </button>
            <button
              onClick={() => {
                setIsTermsOpen(true);
                setIsHelpMenuOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "12px 16px",
                textAlign: "left",
                color: "#333",
                fontSize: "14px",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
              className="hover:bg-gray-100"
            >
              Términos de Servicio
            </button>
          </div>
        )}

        <button
          onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
          style={{
            padding: "12px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
          }}
          title="Ayuda y Soporte"
        >
          <HelpIcon />
        </button>
      </div>

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

        <FlightClusters flights={filteredFlights} />
      </MapContainer>

      <MyAirlinesModal
        isOpen={isMyAirlinesModalOpen}
        onClose={() => setIsMyAirlinesModalOpen(false)}
      />
      <MyFlightsModal
        isOpen={isMyFlightsModalOpen}
        onClose={() => setIsMyFlightsModalOpen(false)}
      />

      <AirlineManagementModal
        isOpen={isAirlineManagementModalOpen}
        onClose={handleCloseAirlineManagementModal}
      />

      <FaqModal isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PremiumModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />
    </div>
  );
}
