"use strict";
// Importing node modules
import express from 'express';
// Importing source files
import routes from './routes/main.routes';
import Parser from './parser.js';
import _ from 'lodash';
import DataBaseHandler from './databasehandler.js';

// let parser = new Parser();
// consts
const app = express();

app.use('/', routes);


var filterByDashSplit = function(metricByCountryRow){
	return _(metricByCountryRow).omit("Date").mapKeys((value, key, obj) => {
		return key.split(" - ")[1];
	}).value();
}

var dbHandler = new DataBaseHandler();

// dbHandler.insertFacebookCsv('./data/Facebook Insights Data Export - Visualization Studio VIC - 2014-08-24 - 2015-02-19.csv')



// arrow function
const server = app.listen(3000, () => {
	// destructuring
	const {address, port} = server.address();

  // string interpolation:
  console.log(`Example app listening at http://${address}:${port}`);
});
