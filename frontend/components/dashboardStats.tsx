"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  getDashboardStats,
  DashboardStatsResponse,
  FlightStats,
} from "@/services/statsService";

interface DashboardStatsProps {
  isPremium: boolean;
  onOpenPremium: () => void;
}

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
    <div className="h-20 bg-gray-200 rounded-xl"></div>
    <div className="h-40 bg-gray-200 rounded-xl"></div>
    <div className="h-32 bg-gray-200 rounded-xl"></div>
  </div>
);

type TabType = "global" | "public" | "private";

const DashboardStats: React.FC<DashboardStatsProps> = ({
  isPremium,
  onOpenPremium,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullData, setFullData] = useState<DashboardStatsResponse | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("global");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const stats = await getDashboardStats();
      setFullData(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isPremium) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [isOpen, isPremium]);

  const handleToggle = () => {
    if (!isPremium) {
      onOpenPremium();
      return;
    }
    setIsOpen(!isOpen);
  };

  const currentStats: FlightStats | null = fullData
    ? activeTab === "global"
      ? fullData.global
      : activeTab === "public"
      ? fullData.publicFlights
      : fullData.privateFlights
    : null;

  const getTabLabel = (type: TabType) => {
    switch (type) {
      case "global":
        return "Global";
      case "public":
        return "Públicos";
      case "private":
        return "Privados";
    }
  };

  return (
    <div
      className={`
        fixed bottom-0 left-4 z-[2000] 
        w-full max-w-md 
        transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        flex flex-col
        ${isOpen ? "translate-y-0" : "translate-y-[calc(100%-48px)]"}
      `}
    >
      <button
        onClick={handleToggle}
        className={`
          h-12 px-6 rounded-t-xl shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] 
          flex items-center justify-between gap-4 cursor-pointer border-t border-x transition-all w-fit
          ${
            isPremium
              ? "bg-white border-gray-200 text-indigo-700 hover:text-indigo-800"
              : "bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200"
          }
        `}
      >
        <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wide">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.035-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.035.84-1.875 1.875-1.875h.75c1.035 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.035.84-1.875 1.875-1.875h.75c1.035 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
          </svg>
          Estadísticas
          {!isPremium && (
            <span className="ml-2 text-[10px] bg-gradient-to-r from-gray-500 to-gray-600 text-white px-2 py-0.5 rounded-full font-medium shadow-sm">
              PREMIUM
            </span>
          )}
        </div>

        {isPremium && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        )}
      </button>

      <div className="bg-white h-[600px] border-t border-gray-100 shadow-2xl overflow-hidden flex flex-col rounded-tr-xl relative">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="p-6 overflow-y-auto h-full space-y-6 relative z-10 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Tráfico Aéreo</h2>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-gray-500">LIVE</span>
            </div>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(["global", "public", "private"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeTab === tab
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {getTabLabel(tab)}
              </button>
            ))}
          </div>

          {isLoading || !currentStats ? (
            <SkeletonLoader />
          ) : (
            <>
              <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm text-center">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">
                  Vuelos {getTabLabel(activeTab)}
                </p>
                <p className="text-4xl font-black text-gray-800">
                  {currentStats.totalCount.toLocaleString()}
                </p>
                <p className="text-xs text-indigo-400 mt-1 font-medium">
                  Activos actualmente
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-700 mb-4">
                  Top Orígenes ({getTabLabel(activeTab)})
                </h3>
                {currentStats.topCountries.length > 0 ? (
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={currentStats.topCountries}
                        layout="vertical"
                        margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                      >
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={50}
                          tick={{ fontSize: 10, fill: "#6b7280" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          cursor={{fill: 'transparent'}}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          labelStyle={{ color: '#111827', fontWeight: 'bold', marginBottom: '4px' }}
                          itemStyle={{ color: '#6366f1' }}
                        />
                        <Bar
                          dataKey="value"
                          fill="#6366f1"
                          radius={[0, 4, 4, 0]}
                          barSize={12}
                        >
                          {currentStats.topCountries.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={index === 0 ? "#4f46e5" : "#a5b4fc"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-center text-gray-400 text-sm py-10">
                    Sin datos disponibles
                  </p>
                )}
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-2">
                    Estado de Flota
                  </h3>
                  <div className="space-y-2">
                    {currentStats.fleetStatus.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: s.color }}
                        ></span>
                        <span className="text-gray-600 font-medium">
                          {s.name}
                        </span>
                        <span className="text-gray-400">({s.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-32 w-32 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={currentStats.fleetStatus}
                        innerRadius={35}
                        outerRadius={50}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {currentStats.fleetStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        wrapperStyle={{ zIndex: 100 }}
                        contentStyle={{ borderRadius: "8px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <button className="w-full py-3 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 group">
                <div className="bg-gray-700 p-1 rounded group-hover:bg-gray-600 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-3 h-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                </div>
                Descargar Reporte {getTabLabel(activeTab)}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
