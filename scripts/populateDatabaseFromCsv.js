const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();
const path = require('path');
const { parse } = require('csv-parse');

// This script will read all the csv files in the csv_database folder and
// transform them into sql files and then insert the data into the database
csvFolderPath = path.join(__dirname, '../csv_database');

async function main() {
  try {
    const files = fs.readdirSync(csvFolderPath);
    for (const file of files) {
      const currentFilePath = path.join(csvFolderPath, file);
      console.log('Handling file ' + file);
      const sqlFile = await handleFile(currentFilePath);
      await executeSqlFile(sqlFile);
      fs.rmSync(sqlFile);
    }
  } catch (error) {
    console.log('Error reading files:', error.message);
  }
}

function handleFile(file) {

  let headerDone = false;
  const tableName = `${file.split('-')[1].split('.')[0]}`;
  const destinationFile = path.join(__dirname,`${tableName}_insert.sql`);

  //Create sql file
  fs.writeFileSync(destinationFile, '', 'utf8');

  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(file)
      .pipe(parse({ delimiter: ",", from_line: 1 }))
      .on('data', (row) => {
        try {
          // Implement logic here
          if (!headerDone) {
            let sql = `INSERT INTO ${tableName}(${row.join(',')}) VALUES\n`;
            fs.appendFileSync(destinationFile, sql, 'utf8');
            headerDone = true;
            return;
          }
          let replaced = row.map((el) => el.replace(/'/g, "''"));
          let sql = `('${replaced.join("','")}'),\n`;
          fs.appendFileSync(destinationFile, sql, 'utf8');
        } catch (error) {
          console.error(`Error parsing row ${row} in file ${file}:`, error.message);
          reject(error);
        }
      })
      .on('end', () => {
        try {
          const content = fs.readFileSync(destinationFile, 'utf8');
          const updatedContent = content.trim().slice(0, -1); // Remove the last comma
          fs.writeFileSync(destinationFile, updatedContent, 'utf8');

          // Append the closing statement
          fs.appendFileSync(destinationFile, ";", 'utf8');
          console.log('Finished reading file:', file);
          resolve(destinationFile);
        } catch (error) {
          console.error(`Error reading file ${file}:`, error.message);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error(`Error parsing file ${file}:`, error.message);
        reject(error);
      });


    // If stream ends unexpectedly, reject the promise
    readStream.on('close', () => {
      reject(new Error('Stream closed unexpectedly'));
    });
  });
}

async function executeSqlFile(file) {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
  });

  await client.connect();
  try {
    const data = fs.readFileSync(file, 'utf8');
    await client.query(data);
    console.log('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    await client.end();
  }
}

main();