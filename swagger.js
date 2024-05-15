const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "Meine Bibliothek",
        description: "ÜK 295",
    },
    host: "localhost:3000",
    definitions: {
        Book: {
            id: "",
            $isbn: "",
            $title: "",
            $author: "",
            $year: 0,
        },
        Lend: {
            id: "",
            $customer_id: "",
            $isbn: "",
            $borrowed_at: "",
            $returned_at: "",
        },
    },
};

const outputFile = "./swagger.json";
const routes = ["./5/server.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
