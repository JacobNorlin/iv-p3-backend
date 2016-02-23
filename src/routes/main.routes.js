"use strict";
// Import node module
import express from 'express';
import Parser from '../parser.js';
import _ from 'lodash';
var pgp = require('pg-promise')();//necessary because it need options or it gets very angry

const router = express.Router();



router.get('/getCountryData/:country', (req, res) => {
	var db = pgp("postgres://postgres:123456@localhost:1234/postgres");
	console.log("fetching country data");
	db.manyOrNone("select * from facebook_data_country where country="+req.params.country)
	.then(data => {
		console.log("finished fetching country data")
		res.jsonp(data);
	})
	.catch(error => {
		console.log(error);
		res.send(error);
	});

});

router.get('/getCountries', (req, res) => {
	var db = pgp("postgres://postgres:123456@localhost:1234/postgres");
	console.log("fetching country data");
	db.manyOrNone("select distinct country from facebook_data_country")
	.then(data => {
		console.log("finished fetching country data")
		let countries = _.map(data, obj => {
			return obj.country;
		});
		res.jsonp(countries);
	})
	.catch(error => {
		console.log(error);
		res.send(error);
	});

});


router.get('/getCountryDatas', (req, res) => {
	var db = pgp("postgres://postgres:123456@localhost:1234/postgres");
	console.log("fetching country data");
	db.manyOrNone("select * from facebook_data_country")
	.then(data => {
		console.log("finished fetching country data")
		res.jsonp(data);
	})
	.catch(error => {
		console.log(error);
		res.send(error);
	});

});


router.get('/getCityData', (req, res) => {
	var db = pgp("postgres://postgres:123456@localhost:1234/postgres");
	console.log("fetching country data");
	db.manyOrNone("select * from facebook_data_city")
	.then(data => {
		console.log("finished fetching country data")
		res.jsonp(data);
	})
	.catch(error => {
		console.log(error);
		res.send(error);
	});
});

router.get('/getDemographicData', (req, res) => {
	var db = pgp("postgres://postgres:123456@localhost:1234/postgres");
	console.log("fetching country data");
	db.manyOrNone("select * from facebook_data_demographic")
	.then(data => {
		console.log("finished fetching country data")
		res.jsonp(data);
	})
	.catch(error => {
		console.log(error);
		res.send(error);
	});

});

// Exporting an object as the default import for this module
export default router;
