const express = require("express");
const basicAuth = require("express-basic-auth");
const app = express();
const port = 3000;

app.get("/public", (request, response) => {
    response.send("Hey stranger!");
});

// Dynamiclly set the credentials
const credentials = {};
credentials[process.env.AUTH_USER] = process.env.AUTH_PASSWORD;

app.get(
    "/private",
    basicAuth({ 
        users: credentials,
        challenge: true,
        realm: "Imb4T3st4pp",
    }),
    (request, response) => {
        response.send("Hey, you're authenticated!");
    }
);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
