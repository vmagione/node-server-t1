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

const hostname = '127.0.0.1';
const port = 3000;

server.post("/videos", () => {
    return "Server created!";
});

server.get("/videos", () => {
    return "Route hello created!";
});

server.put("/videos:id", () => {
    return "Server created!";
});

server.delete("/videos:id", () => {
    return "Server created!";
});

server.listen({
    hostname: hostname,
    port: port,
});

