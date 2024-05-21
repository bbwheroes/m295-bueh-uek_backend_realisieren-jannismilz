const express = require("express");
const session = require('express-session')
const app = express();
const port = 3000;

app.use(session({
    "secret": "secret",
    "resave": false,
    "saveUninitialized": false,
    "cookie": {
        "maxAge": 1000 * 60 * 60 * 24 * 30
    }
  })
)

app.use(express.json());

app.get("/name", (request, response) => {
    if (request.session.name) {
        response.status(200).send(request.session.name);
    } else {
        response.status(404).send('Kein Name in der Session gespeichert');
    }
});

app.post("/name", (request, response) => {
    const {name} = request.body;

    if(!name) {
        return response.status(400).send("Name is required");
    }

    request.session.name = name;
    response.send("Name saved!");
});

app.delete("/name", (request, response) => {
    delete request.session.name;
    response.status(200).send('Name gelöscht');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
