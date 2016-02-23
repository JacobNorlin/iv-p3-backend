"use strict";
// Importing node modules
import express from 'express';
// Importing source files
import routes from './routes/main.routes';
import Parser from './parser.js';
import _ from 'lodash';
var pgp = require('pg-promise')();

// let parser = new Parser();
// consts
const app = express();

app.use('/', routes);

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', "*")

    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var filterByDashSplit = function(metricByCountryRow){
	return _(metricByCountryRow).omit("Date").mapKeys((value, key, obj) => {
		return key.split(" - ")[1];
	}).value();
}

let parser = new Parser();
var db = pgp("postgres://postgres:123456@localhost:1234/postgres");
console.log(db);
// parser.parse('./data/Facebook Insights Data Export - Visualization Studio VIC - 2014-02-28 - 2014-08-23.csv', (data) => {
// 	for(var date in data.date){
// 		let weeklyReachByCountry = filterByDashSplit(data.weeklyReachByCountry[date]);
// 		let weeklyReachByCity = filterByDashSplit(data.weeklyReachByCity[date]);
// 		let lifetimeLikesByCountry = filterByDashSplit(data.lifetimeLikesByCountry[date]);
// 		let lifetimeLikesByCity = filterByDashSplit(data.lifetimeLikesByCity[date]);
// 		let weeklyReachDemographics = filterByDashSplit(data.weeklyReachDemographics[date]);
// 		let lifetimeLikesByAgeAndGender = filterByDashSplit(data.lifetimeLikesByAgeAndGender[date]);

// 		let formatedDate = _.map(date.split('/'), n => {
// 			if(n.length === 1){
// 				return "0"+n;
// 			}else{
// 				return n;
// 			}
// 		}).join("-");



// 		for(var demographic in weeklyReachDemographics){
// 			let like = fixInvalidData(lifetimeLikesByAgeAndGender[demographic]);
// 			let reach = fixInvalidData(weeklyReachDemographics[demographic]);
// 			let insertData = {
// 				likes: like,
// 				reach: reach,
// 				date: formatedDate,
// 				type: demographic
// 			};
// 			insertRow(db, "facebook_data_demographic", insertData, "demographic");
// 		}


// 		for(var city in lifetimeLikesByCity){
// 			let cityLike = fixInvalidData(lifetimeLikesByCity[city]);
// 			let cityReach = fixInvalidData(weeklyReachByCity[city]);
// 			let insertData = {
// 				likes: cityLike,
// 				reach: cityReach,
// 				date: formatedDate,
// 				type: parseCity(city)
// 			};
// 			insertRow(db, "facebook_data_city", insertData, "city");

// 		}

// 		for(var country in lifetimeLikesByCountry){
// 			let countryLikes = lifetimeLikesByCountry[country] ? lifetimeLikesByCountry[country] : 0;
// 			let countryReach = weeklyReachByCountry[country] ? weeklyReachByCountry[country] : 0;
// 			let insertData = {
// 				likes: countryLikes,
// 				reach: countryReach,
// 				date: formatedDate,
// 				type: country
// 			};
// 			insertRow(db, "facebook_data_country", insertData, "country");
// 		}

// 			//db.query("INSERT into facebook_data_country")

// 		}
// 	});

function parseCity(city){
	return city.split(',')[0];
}

function fixInvalidData(data){
	return data ? data : 0;
}

function insertData(db, data, table, date){
	for(var i in data){
		let likes = fixInvalidData(data[i]);
		let reach = fixInvalidData(data[i]);
		let insertData = {
			likes: likes,
			reach: reach,
			date: date,
			type: i
		};
		insertRow(db, table, insertData);
	}
}


function insertRow(db, table, insertData, type){
	let insert = "INSERT into "+table+"(lifetime_likes, weekly_reach, "+type+", date) VALUES(${likes}, ${reach}, ${type}, ${date})";

	db.none(insert, insertData)
	.then(() => {
		console.log("success!");
	})
	.catch(error => {
		console.log(error);
	})	
}

// arrow function
const server = app.listen(3000, () => {
	// destructuring
	const {address, port} = server.address();

  // string interpolation:
  console.log(`Example app listening at http://${address}:${port}`);
});
