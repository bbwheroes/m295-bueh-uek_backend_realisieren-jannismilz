const express = require("express");
const app = express();
const port = 3000;

const buildApiUrl = (plz) => {
    return `https://app-prod-ws.meteoswiss-app.ch/v1/plzDetail?plz=${plz}00`;
};

app.get("/weather/:plz", async (request, response) => {
    const plz = request.params.plz;

    try {
        const data = await fetch(buildApiUrl(plz));
        const json = await data.json();
        response.status(200).send(json);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
