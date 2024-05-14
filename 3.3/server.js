const express = require("express");
const app = express();
const port = 3000;

const buildApiUrl = (plz) => {
    return `https://app-prod-ws.meteoswiss-app.ch/v1/plzDetail?plz=${plz}00`;
};

app.get("/now", (request, response) => {
    response.status(200).send(new Date());
});

app.get("/zli", (request, response) => {
    response.status(302).redirect("https://www.zli.ch");
});

app.get("/name", (request, response) => {
    const randomNames = [
        "Daniel",
        "Christoph",
        "Simon",
        "Fabian",
        "Alexander",
        "Lucas",
        "Timo",
        "Matthias",
        "Florian",
        "Manuel",
        "Kevin",
        "Markus",
        "Stefan",
        "Lukas",
        "Oliver",
        "Benjamin",
        "Leon",
        "Patrick",
        "Daniela",
        "Anna",
    ];

    response
        .status(200)
        .send(randomNames[Math.floor(Math.random() * randomNames.length)]);
});

app.get("/html", (request, response) => {
    response.status(200).sendFile(__dirname + "/index.html");
});

app.get("/image", (request, response) => {
    response.status(200).sendFile(__dirname + "/image.png");
});

app.get("/teapot", (request, response) => {
    response.status(418).send("I'm a teapot");
});

app.get("/user-agent", (request, response) => {
    response.status(200).send(request.headers["user-agent"]);
});

app.get("/secret", (request, response) => {
    response.status(403).send("Forbidden");
});

app.get("/xml", (request, response) => {
    response.status(200).sendFile(__dirname + "/example.xml");
});

app.get("/me", (request, response) => {
    response.status(200).json({
        vorname: "Jannis",
        nachname: "Milz",
        alter: 69,
        wohnort: "Irgendwo in der Schweiz",
        augenfarbe: "braun",
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
