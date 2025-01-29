// src/database.ts
import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: { tableName: "migrations" },
});
db.raw("SELECT 1")
  .then(() => {
    console.log("Database connection successful!");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
/* .finally(() => {
    db.destroy();
  }); */

export default db;
