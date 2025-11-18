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

interface DashboardStatsProps {
  isPremium: boolean;
  onOpenPremium: () => void;
}


const FilterButton = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
      active
        ? "bg-indigo-100 text-indigo-700 shadow-sm"
        : "text-gray-500 hover:bg-gray-100"
    }`}
  >
    {label}
  </button>
);

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-20 bg-gray-200 rounded-xl"></div>
    <div className="h-40 bg-gray-200 rounded-xl"></div>
    <div className="h-32 bg-gray-200 rounded-xl"></div>
  </div>
);

const MOCK_DATA = {
  "24h": {
    total: 1245,
    private: 8,
    countries: [
      { name: "USA", value: 400 },
      { name: "CHN", value: 300 },
      { name: "GBR", value: 200 },
      { name: "DEU", value: 150 },
      { name: "ARG", value: 100 },
    ],
    status: [
      { name: "En Aire", value: 65, color: "#10b981" },
      { name: "En Tierra", value: 35, color: "#f59e0b" },
    ],
  },
  "7d": {
    total: 8540,
    private: 42,
    countries: [
      { name: "USA", value: 2500 },
      { name: "CHN", value: 1800 },
      { name: "BRA", value: 1200 },
      { name: "ESP", value: 900 },
      { name: "ARG", value: 850 },
    ],
    status: [
      { name: "En Aire", value: 45, color: "#10b981" },
      { name: "En Tierra", value: 55, color: "#f59e0b" },
    ],
  },
};

type TimeRange = "24h" | "7d" | "30d";

const DashboardStats: React.FC<DashboardStatsProps> = ({ isPremium, onOpenPremium }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(MOCK_DATA["24h"]);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setData(MOCK_DATA[timeRange as keyof typeof MOCK_DATA] || MOCK_DATA["24h"]);
        setIsLoading(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [timeRange, isOpen]);

  const handleToggle = () => {
    if (!isPremium) {
      onOpenPremium();
      return;
    }
    setIsOpen(!isOpen);
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
          h-12 px-6 
          rounded-t-xl 
          shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] 
          flex items-center justify-between gap-4 
          cursor-pointer 
          border-t border-x
          transition-all w-fit
          ${
            isPremium
              ? "bg-white border-gray-200 text-indigo-700 hover:text-indigo-800"
              : "bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200"
          }
        `}
      >
        <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wide">
          {isPremium ? (
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
               <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.035-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.035.84-1.875 1.875-1.875h.75c1.035 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.035.84-1.875 1.875-1.875h.75c1.035 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
             </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
            </svg>
          )}
          
          Estadisticas
          
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        )}
      </button>

      <div className="bg-white h-[550px] border-t border-gray-100 shadow-2xl overflow-hidden flex flex-col rounded-tr-xl relative">
        
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="p-6 overflow-y-auto h-full space-y-6 relative z-10 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Tráfico Aéreo</h2>
            <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
              <FilterButton active={timeRange === "24h"} label="24H" onClick={() => setTimeRange("24h")} />
              <FilterButton active={timeRange === "7d"} label="7D" onClick={() => setTimeRange("7d")} />
              <FilterButton active={timeRange === "30d"} label="30D" onClick={() => setTimeRange("30d")} />
            </div>
          </div>

          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1.5 bg-indigo-100 rounded-md text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                        <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <p className="text-xs text-gray-500 font-bold uppercase">Vuelos</p>
                  </div>
                  <p className="text-3xl font-black text-gray-800">{data.total.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1 font-medium flex items-center">
                    <span className="text-lg leading-none mr-0.5">↑</span> 12% vs ayer
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                   <div className="flex items-center gap-2 mb-1">
                    <span className="p-1.5 bg-emerald-100 rounded-md text-emerald-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <p className="text-xs text-gray-500 font-bold uppercase">Privados</p>
                  </div>
                  <p className="text-3xl font-black text-gray-800">{data.private}</p>
                  <p className="text-xs text-gray-400 mt-1 font-medium">
                    Activos ahora
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-700 mb-4">Origen de Vuelos</h3>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.countries} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={30} tick={{fontSize: 11, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                      <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        labelStyle={{ color: '#111827', fontWeight: 'bold', marginBottom: '4px' }}
                        itemStyle={{ color: '#4b5563' }}
                      />
                      <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={12}>
                        {data.countries.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#a5b4fc'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                 <div>
                   <h3 className="text-sm font-bold text-gray-700 mb-1">Estado de Flota</h3>
                   <p className="text-xs text-gray-400 mb-4">En tiempo real</p>
                   <div className="space-y-2">
                     {data.status.map((s, i) => (
                       <div key={i} className="flex items-center gap-2 text-xs">
                         <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></span>
                         <span className="text-gray-600 font-medium">{s.name}</span>
                         <span className="text-gray-400">({s.value}%)</span>
                       </div>
                     ))}
                   </div>
                 </div>
                 <div className="h-32 w-32 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.status}
                          innerRadius={35}
                          outerRadius={50}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {data.status.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          wrapperStyle={{ zIndex: 100 }}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-xs font-bold text-gray-400">LIVE</span>
                    </div>
                 </div>
              </div>

              <button className="w-full py-3 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 group">
                <div className="bg-gray-700 p-1 rounded group-hover:bg-gray-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </div>
                Descargar Reporte CSV
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default DashboardStats;