const http = require("http");

const endpoint = process.argv[2];

http.get(endpoint, function callback(res) {
    res.setEncoding("utf8");

    let completeResponse = "";

    res.on("data", (data) => {
        completeResponse += data;
    });

    res.on("end", () => {
        console.log(completeResponse.split("").length);
        console.log(completeResponse);
    });
});
