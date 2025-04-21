// lib/swaggerOptions.ts
export const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API MyProject",
        version: "1.0.0",
        description: "Documentation de l’API Next.js",
      },
      servers: [{ url: "http://localhost:3000" }],
    },
    apis: ["./app/api/**/*.ts"], // adapte selon ton arborescence
  };
  