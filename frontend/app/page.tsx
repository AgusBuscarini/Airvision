"use client";

import dynamic from "next/dynamic";

const AirMap = dynamic(() => import("@/components/airmap"), { ssr: false });

export default function HomePage() {
  return (
    <main className="h-screen w-screen">
      <AirMap />
    </main>
  );
}
