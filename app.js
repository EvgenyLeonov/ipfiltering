const express = require("express");
const app = express();
const requestIp = require("request-ip");
const geoip = require("geoip-lite");

app.use((req, res, next) => {
    // Attach CORS headers
    // Required when using a detached backend (that runs on a different domain)
    //* -- means all
    res.setHeader("Access-Control-Allow-Origin", "*");
    //from this site only
    res.setHeader("Access-Control-Allow-Origin", "https://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// Middleware to extract client's IP address
app.use(requestIp.mw());

app.get("/health", (req, res, next) => {
    res.send("<h1>Service is OK</h1>");
});

app.get("/ip", (req, res, next) => {
    const clientIp = requestIp.getClientIp(req);
    // Use geoip-lite to get country information
    const geo = geoip.lookup(clientIp);
    const country = geo != null ? geo.country : "unknown";
    res.send(`<h3>Client IP:${clientIp}; Country:${country}</h3>`);
});

app.listen(3001);