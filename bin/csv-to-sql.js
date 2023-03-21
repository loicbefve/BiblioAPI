const fs = require('fs');
const csvParser = require('csv-parser');

// Access command-line arguments
const args = process.argv.slice(2);

// Print the arguments
console.log('Arguments:', args);

const inputCsvFile = 'input.csv';
const outputSqlFile = 'output.sql';

const readStream = fs.createReadStream(inputCsvFile);
const writeStream = fs.createWriteStream(outputSqlFile);

readStream
  .pipe(csvParser())
  .on('data', (row) => {
    const columns = Object.keys(row)
      .map((key) => `\`${key}\``)
      .join(', ');
    const values = Object.values(row)
      .map((value) => `'${value}'`)
      .join(', ');
    const sql = `INSERT INTO your_table_name (${columns}) VALUES (${values});\n`;
    writeStream.write(sql);
  })
  .on('end', () => {
    console.log('CSV to SQL conversion completed.');
  });
