"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

const AirMap = dynamic(() => import("@/components/airmap"), { ssr: false });

export default function MapPage() {
  const { isAuth, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuth) {
        router.push("/login");
      }
    }
  }, [isAuth, isLoading, router]);

  if (isLoading) {
    return <div>Verificando sesión...</div>;
  }

  if (isAuth) {
    return (
      <main className="h-screen w-screen">
        <AirMap />
      </main>
    );
  }

  return null;
}
