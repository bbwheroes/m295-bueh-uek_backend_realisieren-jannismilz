let sum = 0;

const arguments = process.argv.slice(2);

for (let i = 0; i < arguments.length; i++) {
    sum += parseInt(arguments[i]);
}

console.log(sum);
