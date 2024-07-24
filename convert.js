const fs = require('fs');

// Read the contents of the cities.txt file
const fileContents = fs.readFileSync('frenchCities.txt', 'utf-8');

// Split the contents into an array, assuming each city is on a new line
const citiesArray = fileContents.split('\n').map(city => city.trim());

// Create a JSON object with the cities array
const citiesJSON = JSON.stringify(citiesArray, null, 2);

// Save the JSON object to a new file
fs.writeFileSync('frenchCities.json', citiesJSON);

console.log('Cities array has been converted and saved as cities.json');
