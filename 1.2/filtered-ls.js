const fs = require("fs");
const path = require("path");

const filePath = process.argv[2];
const fileExtensionFilter = process.argv[3];

fs.readdir(filePath, function afterReaddir(err, files) {
    if (err) {
        console.log(err);
    } else {
        // Print each file name on a new line
        files.forEach((file) => {
            if (path.extname(file) === `.${fileExtensionFilter}`) {
                console.log(file);
            }
        });
    }
});
