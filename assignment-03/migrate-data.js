/**
 * Restores data from two existing collections (m3-customer-data and m3-customer-address-data)
 * to a new collection (m3-customer-data-final)
 */
const mongodb = require('mongodb');
const async = require('async');
const totalRecords = 1000;
const url = 'mongodb://localhost:27017/edx-course-db';
const dbName = 'edx-course-db';

// check arguments
if (process.argv.length != 3){
    console.error("\nUsage:\n\t", process.argv[0], process.argv[1], "number_of_objects_per_query\n");
    process.exit(1);
}

// the third parameter has to be numeric and > 1
let numDocs = Number(process.argv[2]);
if (isNaN(numDocs) || numDocs <= 0 || totalRecords % numDocs != 0){
    console.error("The argument has to be a positive integer which is divisor of " + totalRecords);
    process.exit(1);
}

// start the timer
let initialDate = new Date();

/**
 * Gets the addresses backup data from mongodb and launches the next step
 * @param {*} client The mongodb client
 * @param {*} segmentNumber The number of the segment to migrate
 * @param {*} docsPerPage How many documents contains each bucket
 * @param {*} callback Callback function to call once it's finished
 */
const getComplementaryData = function (client, segmentNumber, docsPerPage, callback) {
    let db = client.db(dbName);
    var sourceCollection = db.collection('m3-customer-address-data');
    
    console.log('Segment', segmentNumber, '- Getting restoration data for documents from', docsPerPage * segmentNumber, 'to', docsPerPage * (segmentNumber + 1) - 1);
    var sourceCursor = sourceCollection.find({}).skip(docsPerPage * segmentNumber).limit(docsPerPage);
    var docs = [];
    sourceCursor.toArray(
        function(err, docs) {
            if (err) {
                console.error('Sorry, got an error:', JSON.stringify(err));
                process.exit(1);
            }
            console.log('Lost documents found:', docs.length);
            getMainData(client, segmentNumber, docsPerPage, docs, callback);
        }
    );
}

/**
 * Reads the main data from mongodb and launches the actual restoration process
 * @param {Object} client The mongodb client
 * @param {Number} segmentNumber The number of the segment to migrate
 * @param {Number} docsPerPage How many documents contains each bucket
 * @param {Array} docs Array containing customer address data for that segment
 * @param {Function} callback Callback function to call once it's finished
 */
const getMainData = function (client, segmentNumber, docsPerPage, docs, callback) {
    let db = client.db(dbName);
    var destinationCollection = db.collection('m3-customer-data');
    
    console.log('Segment', segmentNumber, '- Getting data from', docsPerPage * segmentNumber, 'to', docsPerPage * (segmentNumber + 1) - 1);
    //callback();
    var destinationCursor = destinationCollection.find({}).skip(docsPerPage * segmentNumber).limit(docsPerPage);

    destinationCursor.toArray(
        function(err, mainDocs) {
            if (err) {
                console.error('Sorry, got an error:', JSON.stringify(err));
                process.exit(1);
            }
            console.log('Main documents found:', mainDocs.length);
            restoreData(client, segmentNumber, mainDocs, docs, callback);
            client.close(); // this go inside the actual update
        }
    );
}

/**
 * Restores the data to a new collection from two equal-length json arrays
 * @param {Object} client The mongodb client
 * @param {Number} segmentNumber The number of the segment to migrate
 * @param {Array} mainDocs Array containing the customer data for that segment
 * @param {Array} lostInfoDocs Array containing customer address data for that segment
 * @param {Function} callback Callback function to call once it's finished
 */
const restoreData = function (client, segmentNumber, mainDocs, lostInfoDocs, callback) {
    let db = client.db(dbName);

    let newCollection = db.collection('m3-customer-data-final');

    let bulkOp = newCollection.initializeOrderedBulkOp();

    // naive check
    if (mainDocs.length != lostInfoDocs.length){
        console.error('Not same number of documents in both sides');
        process.exit(1);
    }

    // merge the data
    for (let i=0; i<mainDocs.length; ++i) {
        Object.assign(mainDocs[i], lostInfoDocs[i]);
        bulkOp.find({id: mainDocs[i].id}).upsert().replaceOne(mainDocs[i]);
    }

    bulkOp.execute(function(err, result) {
        console.log('Segment', segmentNumber, 'migrated.')
        client.close();
        callback();
    });
}

/**
 * Create the callback functions (trick to pass parameters to the callback)
 * @param {Number} segmentNumber The number of the segment to migrate
 * @param {Function} callback Callback function to call once it's finished
 */
function createMigrationFunction(segmentNumber, callback) {
    console.log("Creating migration callback for segment", segmentNumber);
    return function(callback) {
        let start = numDocs * segmentNumber;
        let end = numDocs * (segmentNumber + 1) - 1;
        console.log('Migrating from', start, 'to', end);

        // do the actual migration
        mongodb.MongoClient.connect(url, function (error, client) {
            if (error) return process.exit(1)
            getComplementaryData(client, segmentNumber, numDocs, callback);
        })
    }
}

let tasks = [];

for (var i=0; i<totalRecords/numDocs; ++i){
    tasks.push(createMigrationFunction(i));
}

async.parallel(
    tasks, 
    function(err, results) {
        let timeInSeconds = ((new Date()).getTime() - initialDate.getTime()) / 1000;
        console.log('**** Finished in', timeInSeconds, 'seconds ****');
    }
);