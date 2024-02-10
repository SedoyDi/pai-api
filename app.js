let fs = require("fs");

let inputFileContent = fs.readFileSync("./input/чеки.txt", "utf8");
let outputFileContent = "./output/чеки_по_папкам.txt";

const paid = {};
let months = [];
let cheques = [];
let services = [];
let outCheques = [];

function writeToOutFile(text) {
    try {
        fs.appendFileSync(outputFileContent, text);
    } catch (e) {
        console.log(e);
    }
}

cheques = inputFileContent.replaceAll(".pdf", "").split("\r\n");

outCheques = cheques.map((c) => {
    let newCheque = ''

    const cheque = c.split("_");
    const service = c.replace(/\_.*/, '')

    services = [...services, service];

    paid[cheque[1]] = paid[cheque[1]]
        ? [...paid[cheque[1]], cheque[0]]
        : [cheque[0]];

    months.push(cheque[1]);

    newCheque = `/ ${cheque[1]} / ${cheque[0]}_${cheque[1]}.pdf`

    return newCheque;

}).sort((a, b) => a.localeCompare(b));

months = Array.from(new Set(months));

services = Array.from(new Set(services));

outCheques.forEach((c) => writeToOutFile(`${c}\n`));

writeToOutFile("Не оплачены:");

months.forEach((month) => {
    const s = new Set(paid[month]);
    const filredServices = services.filter((e) => !s.has(e));

    if (filredServices.length !== 0) {
        writeToOutFile(`\n${month}: \n`);
        writeToOutFile(filredServices.join("\n"));
    }
});
