// Criando server sem fastify

/*
const { createServer } = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
    console.log("Log: Server created!");

   
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    res.write("Response: writed");
    return res.end('Server created!');
  
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

*/


// Criando server com fastify

import { fastify } from "fastify";
import { DatabaseMemory } from "./database-memory.js";

const server = fastify();

const database = new DatabaseMemory();

const hostname = '127.0.0.1';
const port = 3000;

server.post("/videos", (request, response) => {
    
    const { title, description, duration} = request.body;

    database.create({
        title: title,
        description: description,
        duration: duration,
    });
    
    return response.status(201).send();

});

server.get("/videos", (request) => {
    
    const search = request.query.search;
    
    const videos = database.list(search);

    return videos;

});

server.put("/videos/:id", (request, response) => {

    const { title, description, duration} = request.body;

    const videoId = request.params.id;

    database.update(videoId, {
        title,
        description,
        duration
    });

    return response.status(204).send();

});

server.delete("/videos/:id", (request, response) => {
    const videoId = request.params.id;

    database.delete(videoId);

    return response.status(204).send();
});

server.listen({
    hostname: hostname,
    port: port,
});

