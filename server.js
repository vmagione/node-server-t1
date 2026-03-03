

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

server.listen({
    hostname: hostname,
    port: port,
});

