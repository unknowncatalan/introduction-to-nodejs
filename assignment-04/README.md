# Assignment 4

I've just picked the same structure that I we used in the assignment 2, but instead of the in-memory storage, I used mongodb via mongoose ODM to persist the data. As a side note, I used the module mongoose-unique-validator to validate account name cannot be duplicated.

To test it I uploaded also a Postman collection you can use by just importing it into your Postman. Please, just take into account that you'll have to change the IDs of the documents in the url for both the PUT and DELETE requests (update and remove);

To get it, please o the following

```
$ git clone https://github.com/unknowncatalan/introduction-to-nodejs.git
$ cd introduction-to-nodejs/assignment-04
$ npm install
$ node server.js
```



