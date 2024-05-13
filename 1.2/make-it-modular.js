const mymodule = require("./mymodule");

mymodule(process.argv[2], process.argv[3], function (err, fileNames) {
    if (err) return console.log(err);

    fileNames.forEach((file) => {
        console.log(file);
    });
});
