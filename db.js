import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

const envPath = path.resolve(process.cwd(), ".env");

function stripWrappingQuotes(value) {
  if (!value) return value;

  const startsWithSingle = value.startsWith("'") && value.endsWith("'");
  const startsWithDouble = value.startsWith('"') && value.endsWith('"');

  if (startsWithSingle || startsWithDouble) {
    return value.slice(1, -1).trim();
  }

  return value;
}

function normalizeDatabaseUrl(url) {
  if (!url) return url;

  let normalized = stripWrappingQuotes(url.trim());

  if (normalized.startsWith("jdbc:postgresql://")) {
    normalized = normalized.replace("jdbc:postgresql://", "postgres://");
  }

  return normalized;
}

function loadEnvFromFile() {
  if (!fs.existsSync(envPath)) return;

  const envContent = fs.readFileSync(envPath, "utf8");

  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function buildDatabaseUrlFromParts() {
  const host = process.env.PGHOST || "127.0.0.1";
  const port = process.env.PGPORT || "5432";
  const database = process.env.PGDATABASE;
  const user = process.env.PGUSER;
  const password = process.env.PGPASSWORD;

  if (!database || !user || !password) return null;

  return `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}

loadEnvFromFile();

const databaseUrl = normalizeDatabaseUrl(process.env.DATABASE_URL) || buildDatabaseUrlFromParts();

if (!databaseUrl) {
  throw new Error(
    "Banco não configurado. Defina DATABASE_URL ou PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD no .env.",
  );
}

const sql = postgres(databaseUrl, {
  max: 10,
});

export default sql;
