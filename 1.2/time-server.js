const net = require("net");

const portArg = Number(process.argv[2]);

const currentTimestamp = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}`;
};

const server = net.createServer((socket) => {
    socket.end(currentTimestamp() + "\n");
});
server.listen(portArg);
