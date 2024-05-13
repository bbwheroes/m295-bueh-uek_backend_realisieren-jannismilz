const http = require("http");

const endpoints = [process.argv[2], process.argv[3], process.argv[4]];

let results = [];

endpoints.forEach((endpoint, index) => {
    http.get(endpoint, function callback(res) {
        res.setEncoding("utf8");

        let completeResponse = "";

        res.on("data", (data) => {
            completeResponse += data;
        });

        res.on("end", () => {
            results[index] = completeResponse;
            if (results.length === 3) {
                printResults();
            }
        });
    });
});

function printResults() {
    results.forEach((result) => {
        console.log(result);
    });
}
