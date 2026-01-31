const http = require("http");
const fs = require("fs");
const url = require("url");

function myHandler(req, res) {
  const log = `${Date.now()}: ${req.method}:${req.url} :new req received\n`;
  const myUrl = url.parse(req.url, true);
  // req.url gives a string and url.parse parses that string into object
  // true tells to parse the query string into object

  fs.appendFile("log.txt", log, (err, data) => {
    if (err) {
      console.error("LOG ERROR:", err);
      res.end("internal error");
      return;
    } else {
      switch (myUrl.pathname) {
        case "/":
          if (req.method === "GET") res.end("home page");
          break;
        case "/about":
          const search = myUrl.query.search_query;
          res.end("here are your results for " + search);
          break;
        case "/login":
          res.end("you need to login in first");
          break;
        default:
          res.end("404 not found");
          break;
      }
    }
  });
}

const server = http.createServer(myHandler);

server.listen(8000, () => console.log("server started"));
