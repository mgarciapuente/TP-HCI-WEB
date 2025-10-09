import { DataSource } from "typeorm";
import path from "path";

export default new DataSource({
  type: "sqlite",
  database: path.join(__dirname, "db/init.sqlite"),
  synchronize: true, // Cambiado a true para crear tablas automáticamente
  logging: false,
//   logging: ["error"] // Solo errores
// logging: ["query", "error"] // Queries y errores
// logging: ["schema", "error"] // Esquemas y errores
  entities: [path.join(__dirname, "entities/**/*.ts")],
  migrations: [path.join(__dirname, "migrations/**/*.ts")]
});