"use strict";
// Import node module
import express from 'express';
import Parser from '../parser.js';
import _ from 'lodash';
var pgp = require('pg-promise')();//necessary because it need options or it gets very angry

const router = express.Router();

// Arrow functions
router.get('/', (req, res) => {
	let parser = new Parser();
	var db = pgp("postgres://postgres:123456@localhost:1234/facebook_data_country");
	parser.parse('./data/Facebook Insights Data Export - Visualization Studio VIC - 2014-01-01 - 2014-02-27.csv', (data) => {
		for(var date in data.Date){
			console.log(date);
		}
	});
});


router.get('/insertData', (req, res) => {
	console.log("Hej2");

});
// Exporting an object as the default import for this module
export default router;
