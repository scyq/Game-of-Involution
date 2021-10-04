let http = require("http");
const path = require("path");
const fs = require("fs");
const port = 8080;

let initialGameServer = function (req, res) {
  // What did we request?
  let pathname = req.url;

  // If blank let's ask for index.html
  if (pathname === "/") {
    pathname = "/index.html";
  }

  // Ok what's our file extension
  let ext = path.extname(pathname);

  // Map extension to file type
  const typeExt = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
  };

  // What is it?  Default to plain text
  let contentType = typeExt[ext] || "text/plain";

  fs.readFile(__dirname + pathname, (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading index.html");
    }
    res.writeHead(200, {
      "Content-Type": contentType,
    });
    res.end(data);
  });
};

let server = http.createServer(initialGameServer);
server.listen(port);
console.log(`Server is running on port ${port}`);
