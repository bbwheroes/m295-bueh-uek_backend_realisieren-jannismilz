const fs = require("fs");
const crypto = require("crypto");
const express = require("express");
const app = express();
const port = 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

function getData() {
    const data = fs.readFileSync(__dirname + "/data.json", "utf8");
    const parsedData = JSON.parse(data);
    return parsedData;
}

// e.g. setData("books", "isbn", { "isbn": "1234567890", title: "The Great Gatsby", year: 1925, author: "F. Scott Fitzgerald" });
// then create or patch the book with the given isbn
function setData(category, primary, newData, overwrite = true) {
    const data = getData()[category];

    const resources = data.find(
        (resource) => resource[primary] === newData[primary]
    );

    if (resources) {
        if (!overwrite) {
            return false;
        }

        Object.assign(data[data.indexOf(resources)], newData);
    } else {
        data.push(newData);
    }

    fs.writeFileSync(
        __dirname + "/data.json",
        JSON.stringify({
            ...getData(),
            [category]: data,
        })
    );

    return resources ? data[data.indexOf(resources)] : newData;
}

function validateFields(data, fields, allOfThem = true) {
    // Check if data has more fields than the ones we want to validate
    // Because we don't want extra fields to be in the object
    if (Object.keys(data).length > fields.length) {
        return false;
    }

    if (allOfThem) {
        return fields.every((field) => data[field] !== undefined);
    }

    return fields.some((field) => data[field] !== undefined);
}

app.get("/books", (request, response) => {
    // #swagger.tags = ['Book']
    // #swagger.summary = 'Get all books'
    // #swagger.description = 'Get all books currently in the library'
    response.status(200).json(getData().books);
});

app.get("/books/:isbn", (request, response) => {
    // #swagger.tags = ['Book']
    // #swagger.summary = 'Get a book by isbn'
    // #swagger.description = 'Get a book by isbn from the library'
    const isbn = request.params.isbn;
    const books = getData().books;

    const book = books.find((book) => book.isbn === isbn);

    if (book) {
        return response.status(200).json(book);
    }
    response.sendStatus(404);
});

app.post("/books", (request, response) => {
    // #swagger.tags = ['Book']
    // #swagger.summary = 'Create a new book'
    // #swagger.description = 'Create a new book in the library'
    const book = request.body;

    const validData = validateFields(book, ["isbn", "title", "year", "author"]);
    if (!validData) {
        return response.sendStatus(422);
    }

    if (setData("books", "isbn", book, false)) {
        return response.status(201).json(book);
    }

    response.status(409).send("Buch gibt es bereits");
});

app.put("/books/:isbn", (request, response) => {
    // #swagger.tags = ['Book']
    // #swagger.summary = 'Update a book'
    // #swagger.description = 'Update a book in the library'
    const book = request.body;
    const isbn = request.params.isbn;

    const validData = validateFields(book, ["title", "year", "author"]);
    if (!validData) {
        return response.sendStatus(422);
    }

    return response
        .status(200)
        .json(setData("books", "isbn", { isbn, ...book }));
});

app.delete("/books/:isbn", (request, response) => {
    // #swagger.tags = ['Book']
    // #swagger.summary = 'Delete a book'
    // #swagger.description = 'Delete a book from the library'
    const isbn = request.params.isbn;

    const data = fs.readFileSync(__dirname + "/data.json", "utf8");
    const parsedBooks = JSON.parse(data).books;

    const book = parsedBooks.find((book) => book.isbn === isbn);

    if (book) {
        parsedBooks.splice(parsedBooks.indexOf(book), 1);
        fs.writeFileSync(
            __dirname + "/data.json",
            JSON.stringify({
                ...getData(),
                books: parsedBooks,
            })
        );
        return response.sendStatus(204);
    }

    response.sendStatus(404);
});

app.patch("/books/:isbn", (request, response) => {
    // #swagger.tags = ['Book']
    // #swagger.summary = 'Update properties of a book'
    // #swagger.description = 'Update properties of a book in the library'
    const book = request.body;
    const isbn = request.params.isbn;

    const validData = validateFields(book, ["title", "year", "author"], false);
    if (!validData) {
        return response.sendStatus(422);
    }

    return response
        .status(200)
        .json(setData("books", "isbn", { isbn, ...book }));
});

app.get("/lends", (request, response) => {
    // #swagger.tags = ['Lend']
    // #swagger.summary = 'Get all lends'
    // #swagger.description = 'Get all lends currently in the library'
    response.status(200).json(getData().lends);
});

app.get("/lends/:id", (request, response) => {
    // #swagger.tags = ['Lend']
    // #swagger.summary = 'Get a lend by id'
    // #swagger.description = 'Get a lend by id from the library'
    const id = request.params.id;
    const lends = getData().lends;

    const lend = lends.find((lend) => lend.id == id);

    if (lend) {
        return response.status(200).json(lend);
    }
    response.sendStatus(404);
});

app.post("/lends", (request, response) => {
    // #swagger.tags = ['Lend']
    // #swagger.summary = 'Create a new lend'
    // #swagger.description = 'Create a new lend in the library'
    const lending = request.body;

    const validData = validateFields(lending, ["customer_id", "isbn"]);
    if (!validData) {
        return response.sendStatus(422);
    }

    const books = getData().books;

    const book = books.find((book) => book.isbn === lending.isbn);

    if (!book) {
        return response.status(404).send("Buch gibt es nicht");
    }

    const lends = getData().lends;

    const bookAlreadyBorrowed = lends.find(
        (lend) => lend.isbn === lending.isbn && !lend.returned_at
    );

    if (bookAlreadyBorrowed) {
        return response.status(400).send("Buch ist bereits ausgeliehen");
    }

    const customerLends = lends.filter(
        (lend) => lend.customer_id === lending.customer_id && !lend.returned_at
    );

    if (customerLends.length >= 3) {
        return response.status(400).send("Kunde hat bereits 3 Ausleihen");
    }

    lending.id = crypto.randomBytes(16).toString("hex");
    lending.borrowed_at = new Date();

    if (setData("lends", "id", lending, false)) {
        return response.status(201).json(lending);
    }

    response.status(409).send("Ausleihe gibt es bereits");
});

app.delete("/lends/:id", (request, response) => {
    // #swagger.tags = ['Lend']
    // #swagger.summary = 'Return a lend'
    // #swagger.description = 'Return a lend to the library'
    const id = request.params.id;
    const lends = getData().lends;

    const lending = lends.find((lend) => lend.id == id);

    if (!lending) {
        return response.sendStatus(404);
    }

    if ("returned_at" in lending) {
        return response.status(400).send("Ausleihe ist bereits zurückgebracht");
    }

    lending.returned_at = new Date();
    setData("lends", "id", lending);
    return response.sendStatus(204);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
