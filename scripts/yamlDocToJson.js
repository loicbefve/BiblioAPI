const yaml = require('js-yaml');
const fs = require('fs');

//Read the Yaml file
const data = fs.readFileSync('./docs/biblio-api.yaml', 'utf8');

//Convert Yml object to JSON
const yamlData = yaml.load(data);

//Write JSON to Yml
const jsonData = JSON.stringify(yamlData);
fs.writeFileSync('./docs/biblio-api.json', jsonData, 'utf8');