// Criando server com fastify

import { fastify } from "fastify";
import { randomUUID } from "node:crypto";
import sql from "./db.js";

const server = fastify();

const hostname = "127.0.0.1";
const port = 3000;

server.post("/videos", async (request, response) => {
  const { title, description, duration } = request.body;
  const id = randomUUID();

  await sql`
    INSERT INTO videos (id, title, description, duration)
    VALUES (${id}, ${title}, ${description}, ${duration})
  `;

  return response.status(201).send({ id });
});

server.get("/videos", async (request) => {
  const search = request.query.search;

  if (search) {
    const videos = await sql`
      SELECT id, title, description, duration
      FROM videos
      WHERE title ILIKE ${`%${search}%`}
      ORDER BY title
    `;

    return videos;
  }

  const videos = await sql`
    SELECT id, title, description, duration
    FROM videos
    ORDER BY title
  `;

  return videos;
});

server.put("/videos/:id", async (request, response) => {
  const { title, description, duration } = request.body;
  const videoId = request.params.id;

  await sql`
    UPDATE videos
    SET title = ${title},
        description = ${description},
        duration = ${duration}
    WHERE id = ${videoId}
  `;

  return response.status(204).send();
});

server.delete("/videos/:id", async (request, response) => {
  const videoId = request.params.id;

  await sql`
    DELETE FROM videos
    WHERE id = ${videoId}
  `;

  return response.status(204).send();
});

async function startServer() {
  try {
    await sql`SELECT 1`;

    await server.listen({
      hostname,
      port,
    });

    console.log(`API rodando em http://${hostname}:${port}`);
  } catch (error) {
    if (error?.code === "28P01") {
      console.error(
        "Falha na autenticação do PostgreSQL (28P01). Verifique usuário/senha e, se estiver usando docker-compose, reinicie os volumes com 'docker compose down -v && docker compose up -d'.",
      );
    }

    console.error(error);
    process.exit(1);
  }
}

startServer();
