function verdoppeln(number, callback) {
    number *= 2;
    callback(number);
}

verdoppeln(5, function (ergebnis) {
    console.log("Das Ergebnis ist:", ergebnis);
});
