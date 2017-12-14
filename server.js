const fs = require("fs");
const app = require("./app");
const http = require('http');
const https = require('https');

let http_port = process.env.APP_HTTP_PORT || 80;
let https_port = process.env.APP_HTTPS_PORT || 443;
let host = process.env.APP_HOST || "localhost";
// let key =  fs.readFileSync('./keys/private.key');
// let cert = fs.readFileSync('./keys/certificate.pem');

// // Route all Traffic to Secure Server
// app.all('*', function (req, res, next) {
//   if (req.secure) {
//     return next();
//   };
//   res.redirect('https://hive-studio.net:' + https_port + req.url);
//   // res.redirect('https://'+req.hostname+':'+HTTPS_PORT+req.url);
// });

// // HTTPS
// var secureServer = https.createServer({key: key, cert: cert}, app).listen(https_port, () => {
//     console.log('Secure Website Server listening on port ' + https_port);
// });

var insecureServer = http.createServer(app).listen(http_port, () => {
  console.log('Insecure Website Server listening on port ' + http_port);
});
