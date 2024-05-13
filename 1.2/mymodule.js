const fs = require("fs");
const path = require("path");

module.exports = function (dirName, fileExt, callback) {
    fs.readdir(dirName, function afterReaddir(err, files) {
        if (err) return callback(err);

        fileNames = files.filter((fileName) => {
            return path.extname(fileName) === `.${fileExt}`;
        });
        return callback(null, fileNames);
    });
};
