// lib/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "./swaggerOptions";

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
