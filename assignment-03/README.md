# Assignment 3

My interpretation of the problem statement is that data were already in a Mongodb database, in different collections, so  the assumption of this solutio is that we have a database called 'edx-course-db' and two collections: 'm3-customer-data' and 'm3-customer-address-data' already in place. I provide a script to create these two colletions. To execute it, do the following (provided that you are in a bash-capable system):

```
$ git clone https://github.com/unknowncatalan/introduction-to-nodejs.git
$ cd introduction-to-nodejs/assignment-03
$ ./import-data.sh
```

As stated, I've used the "async" module to split the process in different execution tasks with the same number of documents to be processed per task. I read the data from the collections and then I consolidate those data in a new collection.

I've tested it visually, using mongoui tool.

Then install the modules with
```
$ npm install
```
Now you can execute the migration script by typing:

```
$ node migrate-data.js <put_here_the_number_of_documents_to_process_in_each_async_task>
```

At the end of the process you should have a new collection called 'm3-customer-data-final' with the data already consolidated.



