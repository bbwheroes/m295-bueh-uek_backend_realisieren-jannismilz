const fs = require("fs");

const filePath = process.argv[2];

const fileContent = fs.readFile(
    filePath,
    "utf8",
    function afterRead(err, fileContents) {
        if (err) {
            console.log(err);
        } else {
            const count = fileContents.split("\n").length - 1;
            console.log(count);
        }
    }
);
