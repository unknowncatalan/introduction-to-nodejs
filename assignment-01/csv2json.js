const fs = require("fs");
const path = require("path");
const assert = require("assert")
const csvtojson = require('csvtojson');

/**
 * Main function to convert a CSV file to JSON
 *
 * @param {string} csvFile csv filename
 */
const convertCSVoJSON = (csvFile) => {

    // get the contents of the file. Put the file in the current working directory
    let csvFilePath = path.join(__dirname, csvFile);

    // the output file will be the csvFile with added '.json' extension (i.e. customer-data.csv.json)
    // and will be stored in the working directory
    let outputFile = path.join(__dirname, csvFile + '.json');

    console.log('Converting file', csvFilePath);
    csvtojson()
        .fromFile(csvFilePath)
        .on('end_parsed', (jsonArray) => {
            fs.writeFileSync(outputFile, JSON.stringify(jsonArray, null, 4));
        })
        .on('end', () => {
            console.log("Finished. Output saved to file", outputFile);
        })
        .on('error', (error) => {
            console.error(error);
        })  
}

/**
 * To test the file is a correct json and has the right content
 * 
 * @param {string} jsonFile the file path
 */
const test = (jsonFile) => {

    const jsonString = fs.readFileSync(jsonFile, 'utf8');
    
    const jsonArray = JSON.parse(jsonString);
    assert.equal(jsonArray.length, 1000, "Test failed, 1000 objects expected");
    assert.equal(jsonArray[0].id, "1", "Expected id for first record is '1'");
    assert.equal(jsonArray[999].first_name, "Gisele", "Expected first_name for last record is 'Gisele'");
    console.log ("All tests passed");

}

if (process.argv.length != 3){
    console.error("\nUsage:\n\t", process.argv[0], process.argv[1], "CSV_File_To_Convert\n");
} else {
    convertCSVoJSON(process.argv[2]);
    // with the json file already created, comment line above and uncomment line below to test it
    //test(process.argv[2] + ".json"); 
}
