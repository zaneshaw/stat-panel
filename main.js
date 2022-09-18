const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const hostname = "0.0.0.0";
const port = 3000;

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.get("/", function (req, res) {
  res.send('Hello world!');
})