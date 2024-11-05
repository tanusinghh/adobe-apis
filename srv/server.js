const cds = require("@sap/cds");
const express = require("express"); 
const cov2ap = require("@cap-js-community/odata-v2-adapter");


cds.on("bootstrap", (app) => {
    app.use(cov2ap());
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ limit: '10mb', extended: true }));
});

module.exports = cds.server;