const express = require("express");
const app = express();
const port = 3000;

const buildApiUrl = (plz) => {
    return `https://app-prod-ws.meteoswiss-app.ch/v1/plzDetail?plz=${plz}00`;
};

app.get("/weather/:plz", (request, response) => {
    const plz = request.params.plz;

    fetch(buildApiUrl(plz))
        .then((response) => response.json())
        .then((data) => {
            response.status(200).send(data);
        })
        .catch((error) => {
            response.status(500).send(error);
        });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
