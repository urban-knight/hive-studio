module.exports = {
    apply(app) {
        const fs = require('fs');
        const express = require('express');

        app.use('/static', express.static(appRoot + "/public"));
        app.use('/', express.static(appRoot + "/files"));
    }
};