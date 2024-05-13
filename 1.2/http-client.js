const http = require("http");

const endpoint = process.argv[2];

http.get(endpoint, function callback(res) {
    res.setEncoding("utf8");
    res.on("data", (data) => {
        console.log(data);
    });
});
