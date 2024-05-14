const fs = require("fs");
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/now", (request, response) => {
    const tz = request.query.tz;

    response
        .status(200)
        .send(new Date().toLocaleString("de-Ch", { timeZone: tz }));
});

app.post("/names", (request, response) => {
    const name = request.body.name;

    const names = fs.readFileSync(__dirname + "/names.json", "utf8");
    const parsedNames = JSON.parse(names);
    parsedNames.names.push(name);

    fs.writeFileSync(__dirname + "/names.json", JSON.stringify(parsedNames));

    response.sendStatus(201);
});

app.delete("/names", (request, response) => {
    const name = request.body.name;

    const names = fs.readFileSync(__dirname + "/names.json", "utf8");
    const parsedNames = JSON.parse(names);
    parsedNames.names.splice(parsedNames.names.indexOf(name), 1);

    fs.writeFileSync(__dirname + "/names.json", JSON.stringify(parsedNames));

    response.sendStatus(204);
});
app.get("/secret2", (request, response) => {
    const authHeader = request.headers["authorization"];

    if (authHeader === "Basic aGFja2VyOjEyMzQ=") {
        return response.sendStatus(200);
    }

    response.sendStatus(403);
});

app.get("/chuck", async (request, response) => {
    const name = request.query.name;

    const randomJoke = await fetch("https://api.chucknorris.io/jokes/random");
    const randomJokeJson = await randomJoke.json();

    let finalJoke = randomJokeJson.value;

    if (name !== undefined) {
        finalJoke = finalJoke.replace("Chuck Norris", name);
    }

    response.status(200).send(finalJoke);
});

app.patch("/me", (request, response) => {
    const body = request.body;

    const baseObject = {
        vorname: "Jannis",
        nachname: "Milz",
        alter: 69,
        wohnort: "Irgendwo in der Schweiz",
        augenfarbe: "braun",
    };

    response.status(200).json({ ...baseObject, ...body });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
