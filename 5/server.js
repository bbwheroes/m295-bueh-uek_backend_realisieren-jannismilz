const fs = require("fs");
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    response.status(200).json(getData().books);
});

app.get("/books/:isbn", (request, response) => {
    const isbn = request.params.isbn;
    const books = getData().books;

    const book = books.find((book) => book.isbn === isbn);

    if (book) {
        return response.status(200).json(book);
    }
    response.status(404).send();
});

app.post("/books", (request, response) => {
    const book = request.body;

    const validData = validateFields(book, ["isbn", "title", "year", "author"]);
    if (!validData) {
        return response.status(422).send();
    }

    if (setData("books", "isbn", book, false)) {
        return response.status(201).json(book);
    }

    response.status(409).send("Buch gibt es bereits");
});

app.put("/books/:isbn", (request, response) => {
    const book = request.body;
    const isbn = request.params.isbn;

    const validData = validateFields(book, ["title", "year", "author"]);
    if (!validData) {
        return response.status(422).send();
    }

    return response
        .status(200)
        .json(setData("books", "isbn", { isbn, ...book }));
});

app.delete("/books/:isbn", (request, response) => {
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
        return response.status(204).send();
    }

    response.status(404).send();
});

app.patch("/books/:isbn", (request, response) => {
    const book = request.body;
    const isbn = request.params.isbn;

    const validData = validateFields(book, ["title", "year", "author"], false);
    if (!validData) {
        return response.status(422).send();
    }

    return response
        .status(200)
        .json(setData("books", "isbn", { isbn, ...book }));
});

app.get("/lends", (request, response) => {
    response.status(200).json(getData().lends);
});

app.get("/lends/:id", (request, response) => {
    const id = request.params.id;
    const lends = getData().lends;

    const lend = lends.find((lend) => lend.id == id);

    if (lend) {
        return response.status(200).json(lend);
    }
    response.status(404).send();
});

app.post("/lends", (request, response) => {
    const lending = request.body;

    const validData = validateFields(lending, ["id", "customer_id", "isbn"]);
    if (!validData) {
        return response.status(422).send();
    }

    const books = getData().books;

    const book = books.find((book) => book.isbn === lending.isbn);

    if (!book) {
        return response.status(400).send("Buch gibt es nicht");
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

    lending.borrowed_at = new Date();

    if (setData("lends", "id", lending, false)) {
        return response.status(201).json(lending);
    }

    response.status(409).send("Ausleihe gibt es bereits");
});

app.delete("/lends/:id", (request, response) => {
    const id = request.params.id;
    const lends = getData().lends;

    const lending = lends.find((lend) => lend.id == id);

    if (!lending) {
        return response.status(404).send();
    }

    if ("returned_at" in lending) {
        return response.status(400).send("Ausleihe ist bereits zurückgebracht");
    }

    lending.returned_at = new Date();
    setData("lends", "id", lending);
    return response.status(204).send();
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
