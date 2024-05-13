const fs = require("fs");

function leseDateiInhalt(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, "utf8", (err, inhalt) => {
            if (err) return reject(err);

            resolve(inhalt);
        });
    });
}

leseDateiInhalt("2.1/verdoppeln.js")
    .then((inhalt) => {
        console.log("Die Länge des Dateiinhalts beträgt:", inhalt.length);
    })
    .catch((err) => {
        console.error("Fehler beim Lesen der Datei:", err);
    });
