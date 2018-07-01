'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
//Set up mongoose connection
var db = require('./db'); 
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var UserController = require('./routes/webhook');
app.use('/', UserController);
const server = app.listen(process.env.PORT ||22222, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
