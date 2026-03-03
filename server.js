
// Criando server com fastify

import { fastify } from "fastify";

import { DatabasePostgres } from "./database-postgres.js";

const server = fastify();
const database = new DatabasePostgres();

const hostname = "127.0.0.1";
const port = 3000;

server.post("/videos", async (request, response) => {
    const { title, description, duration } = request.body;

    const id = await database.create({
        title,
        description,
        duration,
    });

    return response.status(201).send({ id });
});

server.get("/videos", async (request) => {
    const search = request.query.search;
    return database.list(search);
});

server.put("/videos/:id", async (request, response) => {
    const { title, description, duration } = request.body;
    const videoId = request.params.id;

    await database.update(videoId, {
        title,
        description,
        duration,
    });

    return response.status(204).send();
});

server.delete("/videos/:id", async (request, response) => {
    const videoId = request.params.id;

    await database.delete(videoId);

    return response.status(204).send();
});

server.listen({
    hostname: hostname,
    port: port,
});
