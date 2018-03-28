const express = require('express');
const logger = require('morgan');
const errorhandler = require('errorhandler');
const bodyParser = require('body-parser');
const routes = require('./routes')

let app = express();
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(errorhandler());

app.use('/', routes);

app.listen(3000);