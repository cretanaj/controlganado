
const csv = require('csv-parser')
const fs = require('fs')
const results = [];

fs.createReadStream('customer.csv')
.pipe(csv({}))
.on('data', (data) => results.push(data))
.on('end', ()=> {
    console.log(results);
});






/*
var XLSX = require("xlsx");
var workbook = XLSX.readFile("customer.xlsx")

let worksheet = workbook.Sheets[workbook.SheetNames[0]];

for (let index = 2; index < 7; index++){
    const id = worksheet[`A${index}`].v;
    const name = worksheet[`B${index}`].v;

    console.log({
        id: id, name: name
    })
}
*/

