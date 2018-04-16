const fs = require("fs");
const app = require("./app");
const http = require('http');

var insecureServer = http.createServer(app).listen(http_port, () => {
  console.log('Insecure Website Server listening on port ' + http_port);
});
