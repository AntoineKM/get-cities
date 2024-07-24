const csv = require('csvtojson');
const cities = require('./frenchCities.json');
const ProgressBar = require('cli-progress');
const Papa = require('papaparse');
const fs = require('fs');

async function main() {
  const data = await csv().fromFile('./data.csv');
  const cityNames = cities
  .map(city => city.toLowerCase());

  console.log(cityNames);

  console.log(`data: ${data.length} | cities: ${cityNames.length} | total: ${data.length * cityNames.length}`);

  const bar = new ProgressBar.SingleBar({}, ProgressBar.Presets.shades_classic);
  bar.start(data.length * cityNames.length, 0);

  const result = await Promise.all(data.map(async (item) => {
    const hasCityInName = await Promise.all(cityNames.map(async cityName => {
      const keyword = item.Keyword.toLowerCase();
      const cityRegExp = new RegExp(`\\b${cityName}\\b`, 'i');
      bar.increment();
      return cityRegExp.test(keyword);
    }));
    
    return {
      "Category": hasCityInName.some(match => match) ? "City" : "",
      ...item,
    };
  }));
  
  bar.stop();

  try {
    const csv = Papa.unparse(result, { header: true });
    // Write the CSV to a file
    fs.writeFileSync('output.csv', csv);
    console.log('CSV file created successfully.');
  } catch (error) {
    console.error('Error converting to CSV:', error);
  }
}

main();
