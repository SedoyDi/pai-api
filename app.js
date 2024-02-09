let fs = require("fs");

let inputFileContent = fs.readFileSync("./input/чеки.txt", "utf8");
let outputFileContent = "./output/чеки_по_папкам.txt";
let cheques = inputFileContent.replaceAll(".pdf", "").split("\r\n");

const paid = {};
const moths = [];
const services = Array.from(new Set(cheques.map((c) => {
    return c.replace(/\_.*/, '')
})));

function writeToOutFile(text) {
    try {
        fs.appendFileSync(outputFileContent, text);
    } catch (e) {
        console.log(e);
    }
}

const outCheques = cheques.map((c) => {
    let newCheque = ''
    const ch = c.split("_");
    paid[ch[1]] = paid[ch[1]] ? [...paid[ch[1]], ch[0]] : [ch[0]];
    moths.push(ch[1]);
    newCheque = `/ ${ch[1]} / ${ch[0]}_${ch[1]}.pdf`
    return newCheque
}).sort((a, b) => a.localeCompare(b));


outCheques.forEach((c) => writeToOutFile(`${c}\n`));

writeToOutFile("Не оплачены:");

for (const moth of new Set(moths)) {
    const s = new Set(paid[moth]);

    const filredServices = services.filter((e) => !s.has(e));

    if (filredServices.length === 0) {
        continue;
    }

    writeToOutFile(`\n${moth}:\n`);
    writeToOutFile(filredServices.join("\n"));
};

