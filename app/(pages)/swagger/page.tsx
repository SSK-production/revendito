// app/swagger/page.tsx
"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

// Important : pour éviter les problèmes de SSR
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function SwaggerPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Documentation API</h1>
      <SwaggerUI url="/swagger.json" />
    </div>
  );
}
