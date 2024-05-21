const express = require("express");
const app = express();
const port = 3000;

app.get("/public", (request, response) => {
    response.send("Hey stranger!");
});

// Dynamiclly set the credentials
const credentials = {};
credentials[process.env.AUTH_USER] = process.env.AUTH_PASSWORD;

app.get("/private", (request, response) => {
    if (!request.headers.authorization) {
        return response
            .status(401)
            .header({
                "WWW-Authenticate": 'Basic realm="Authenticate yourself!"',
            })
            .send();
    }

    const credentials = atob(request.headers.authorization.replace("Basic ", "")).split(":");
    if (
        credentials[0] === process.env.AUTH_USER ||
        credentials[1] === process.env.AUTH_PASSWORD
    ) {
        return response.send("Hey, you're authenticated!");
    }

    return response.sendStatus(401);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
