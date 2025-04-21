// app/api-docs/route.ts
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "@/lib/swagger";
import { createServer,  } from "http";
import express from "express";

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export const GET = async () => {
  const server = createServer(app);
  server.listen(); // Swagger se sert de ça en interne
    
  return new Response(JSON.stringify({ msg: "Swagger running" }), {
    status: 200,
  });
};
