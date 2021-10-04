const port = 8080;
const express = require("express");

const server = express();
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.get("/", function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(__dirname + "/public/index.html");
});

server.post("/resize", function (req, res) {
  // TODO
  // save the user's config
  console.log(req.body.rows);
});

server.use(express.static("public"));
server.listen(port);
console.log(`Server is running on port ${port}`);
