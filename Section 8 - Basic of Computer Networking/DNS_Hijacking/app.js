const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end('{"message": "Hello, your server has hijacked!!!"}');
});

server.listen(4000, () => {
  console.log("HTTP server is running on http://localhost:4000");
});