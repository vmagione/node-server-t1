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