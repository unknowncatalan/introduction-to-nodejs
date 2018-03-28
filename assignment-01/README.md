# Assignment 1

The project uses the npm module 'csvtojson' (https://www.npmjs.com/package/csvtojson) for easy transformation from CSV files to JSON format. Additionally, it uses the core modules 'fs' and 'path' for file and paths manipulation.

The project is ad-hoc, only for this case, so taking the defaults for csvtojson works out of the box.

To build it, do the following:

```
$ git clone https://github.com/unknowncatalan/introduction-to-nodejs.git
$ cd introduction-to-nodejs/assignment-01
$ npm install
```
Now you can execute by typing:

```
$ node csv2json.js customer-data.csv
```
After that, you can test it by following the instructions in the code to uncomment one line and comment another. The test just checks that the generated file is a valid json (parses it), and that contains the same elements as the csv file. Also chekcs a couple of values match the ones in the csv file.



