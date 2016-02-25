"use strict";
// Import node module
import express from 'express';
import Parser from '../parser.js';
import _ from 'lodash';
import DataBaseHandler from '../databasehandler.js';
var pgp = require('pg-promise')();//necessary because it need options or it gets very angry

const router = express.Router();

const db = new DataBaseHandler();

router.get('/getDemographicDatas/:date', (req, res) => {
	db.manyOrNone("select * from facebook_data_demographic where date=\'"+req.params.date+"\'")
	.then(data => {
		res.jsonp(data);
	})
	.catch(error => {
		console.log(error);
		res.send(error);
	});

});

router.get('/getCountryDatas/:date', (req, res) => {
	db.manyOrNone("select * from facebook_data_country where date=\'"+req.params.date+"\'")
	.then(data => {
		res.jsonp(data);
	})
	.catch(error => {
		console.log(error);
		res.send(error);
	});

});

router.get('/getCityDatas/:date', (req, res) => {
	db.manyOrNone("select * from facebook_data_city where date=\'"+req.params.date+"\'")
	.then(data => {
		res.jsonp(data);
	})
	.catch(error => {
		console.log(error);
		res.send(error);
	});

});


router.get('/getCountryData/:country', (req, res) => {
	db.manyOrNone("select * from facebook_data_country where country ilike \'"+req.params.country+"\'")
	.then(data => {
		res.jsonp(data);
	})
	.catch(error => {
		console.log(error);
		res.send(error);
	});

});

router.get('/getCountries', (req, res) => {
	db.manyOrNone("select distinct country from facebook_data_country")
	.then(data => {
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
	db.manyOrNone("select * from facebook_data_country")
	.then(data => {
		res.jsonp(data);
	})
	.catch(error => {
		console.log(error);
		res.send(error);
	});

});


router.get('/getCityDatas', (req, res) => {
	db.manyOrNone("select * from facebook_data_city")
	.then(data => {
		res.jsonp(data);
	})
	.catch(error => {
		console.log(error);
		res.send(error);
	});
});

router.get('/getCityData/:city', (req, res) => {
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

router.get('/getDemographicData/:demographic', (req, res) => {
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
	db.manyOrNone("select * from facebook_data_demographic")
	.then(data => {
		res.jsonp(data);
	})
	.catch(error => {
		console.log(error);
		res.send(error);
	});

});

// Exporting an object as the default import for this module
export default router;
