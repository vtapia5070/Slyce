// server logic, utilizes request-handler.js for routing
var http = require("http");
var fs = require('fs');
var path = require('path');

var handleRequest = require('./request-handler');
var url = require('url');

var port = 8080;

var ip = "127.0.0.1";

var server = http.createServer(function (request, response) {
  // serve static files
  if (request.url === "/") {
    var url = '../client/qa-worktest.html';
    var pathName = path.join(__dirname, url);
    fs.readFile(pathName, function(err, data) {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(data);
      response.end();
    });
  } else {
    handleRequest(request, response);
  }
});

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);


