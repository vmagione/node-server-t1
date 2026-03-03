import sql from "./db.js";

await sql`
  CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL
  )
`;

console.log("Tabela videos pronta.");
await sql.end();