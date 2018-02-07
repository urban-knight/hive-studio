const fs = require("fs");
const app = require("./app");
const http = require('http');
const https = require('https');

let http_port = process.env.APP_HTTP_PORT || 80;
let host = process.env.APP_HOST || "localhost";

var insecureServer = http.createServer(app).listen(http_port, () => {
  console.log('Insecure Website Server listening on port ' + http_port);
});
