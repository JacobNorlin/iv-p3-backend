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
var parser = new Parser();
// parser.parseGenericData('./data/generic/Facebook Insights Data Export - Visualization Studio VIC - 2015-08-19 - 2016-02-15.csv', () => {})
// dbHandler.insertAllFilesInDir('./data/generic/');
// dbHandler.insertGeneric('./data/generic/Facebook Insights Data Export - Visualization Studio VIC - 2015-08-19 - 2016-02-15.csv')



// arrow function
const server = app.listen(3000, () => {
	// destructuring
	const {address, port} = server.address();

  // string interpolation:
  console.log(`Example app listening at http://${address}:${port}`);
});
