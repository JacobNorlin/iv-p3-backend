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
	db.manyOrNone("select * from facebook_data_country where country ilike \'"+req.params.country+"\'")
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


router.get('/getCityDatas', (req, res) => {
	var db = pgp("postgres://postgres:123456@localhost:1234/postgres");
	db.manyOrNone("select * from facebook_data_city")
	.then(data => {
		console.log("finished fetching city data")
		res.jsonp(data);
	})
	.catch(error => {
		console.log(error);
		res.send(error);
	});
});

router.get('/getCityData/:city', (req, res) => {
	var db = pgp("postgres://postgres:123456@localhost:1234/postgres");
	db.manyOrNone("select * from facebook_data_city where city ilike \'"+req.params.city+"\'")
	.then(data => {
		res.jsonp(data);
	})
	.catch(error => {
		console.log(error);
		res.send(error);
	});
});

router.get('/getCities', (req, res) => {
	var db = pgp("postgres://postgres:123456@localhost:1234/postgres");
	db.manyOrNone("select distinct city from facebook_data_city")
	.then(data => {
		let cities = _.map(data, obj => {
			return obj.city;
		});
		res.jsonp(cities);
	})
	.catch(error => {
		console.log(error);
		res.send(error);
	});
});



router.get('/getDemographics', (req, res) => {
	var db = pgp("postgres://postgres:123456@localhost:1234/postgres");
	console.log("fetching country data");
	db.manyOrNone("select distinct demographic from facebook_data_demographic")
	.then(data => {
		let cities = _.map(data, obj => {
			return obj.demographic;
		});
		res.jsonp(data);
	})
	.catch(error => {
		console.log(error);
		res.send(error);
	});

});

router.get('/getDemographic/:demographic', (req, res) => {
	var db = pgp("postgres://postgres:123456@localhost:1234/postgres");
	console.log("fetching country data");
	db.manyOrNone("select * from facebook_data_demographic ilike \'"+req.params.demographic+"\'")
	.then(data => {
		res.jsonp(data);
	})
	.catch(error => {
		console.log(error);
		res.send(error);
	});

});

router.get('/getDemographicDatas', (req, res) => {
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
