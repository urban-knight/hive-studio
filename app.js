const dotenv = require('dotenv').config({ path: './config/.env' });
const path = require('path');
const app = require('express')();
const db = require('./utils/db.js');

let http_port = process.env.APP_HTTP_PORT || 80;
let host = process.env.APP_HOST || "localhost";

global.appRoot = path.resolve(__dirname);

const { apply: applyMiddlewares } = require('./middleware');

applyMiddlewares(app).then(() => {
    app.listen(http_port, () => {
        console.log("Application is listening on: http://" + host + ":" + http_port);
    });
});

module.exports = app;