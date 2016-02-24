"use strict";

import Parser from './parser.js';
import fs from 'fs';
import _ from 'lodash';

var pgp = require('pg-promise')();

export default class DataBaseHandler{
	
	constructor(){
		this.db = pgp("postgres://postgres:123456@localhost:1234/postgres");
		this.parser = new Parser();
	}

	insertAllFilesInDir(dir){
		let files = fs.readdirSync(dir);
		for(var file in files){
			let path = dir+files[file];
			console.log(path);
			this.insertFacebookCsv(path);
			this.insertGeneric(path)
		}
	}

	insertGeneric(csvPath){
		this.parser.parseGenericData(csvPath, data => {
			for(let date in data.date){
				let insertData = {}
				for(let prop in data){
					let row = data[prop][date];
					for(let value in row){
						insertData[value] = row[value];
					}
				}
				insertData = _(insertData).pickBy((value, key) => {
					return key.indexOf("consumptions by type")<0 && key.indexOf("post") <0;
				}).map((value, key) => {	
					return value;
				}).value();
				console.log(insertData)

				this.insertGenericData(insertData);
			}
		})
	}

	insertFacebookCsv(csvPath){
		this.parser.parse(csvPath, (data) => {
			for(let date in data.date){
				let demoLikeDate = data.lifetimeLikesByAgeAndGender[date];
				let demoReachDate = data.weeklyReachDemographics[date];
				let countryLikeDate = data.lifetimeLikesByCountry[date];
				let countryReachDate = data.weeklyReachByCountry[date];
				let cityLikeDate = data.lifetimeLikesByCity[date];
				let cityReachDate = data.weeklyReachByCity[date];

				for(var demo in data.weeklyReachDemographics[date]){
					let like = this.parser.fixInvalidData(demoLikeDate[demo]);
					let reach = this.parser.fixInvalidData(demoReachDate[demo]);
					let insertData = {
						likes: like,
						reach: reach,
						date: date,
						type: demo
					};
					this.insertRow("facebook_data_demographic", insertData, "demographic");
				}

				for(var country in data.lifetimeLikesByCountry[date]){
					let like = this.parser.fixInvalidData(countryLikeDate[country]);
					let reach = this.parser.fixInvalidData(countryReachDate[country]);
					let insertData = {
						likes: like,
						reach: reach,
						date: date,
						type: country
					};
					this.insertRow("facebook_data_country", insertData, "country");

				}

				for(var city in data.lifetimeLikesByCity[date]){
					let like = this.parser.fixInvalidData(cityLikeDate[country]);
					let reach = this.parser.fixInvalidData(cityReachDate[country]);
					let insertData = {
						likes: like,
						reach: reach,
						date: date,
						type: this.parser.parseCity(city)	
					};
					this.insertRow("facebook_data_city", insertData, "city");

				}
			}
		});


	}


	insertGenericData(insertData){
		let insert = "INSERT into facebook_data_generic (date, lifetime_total_likes , daily_new_likes, daily_engaged_users, daily_total_reach, daily_organic_reach, daily_total_impressions, daily_organic_impressions, daily_page_consumptions, daily_link_clicks, daily_other_clicks, daily_photo_clicks, daily_video_clicks) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)";
		this.db.none(insert, insertData)
		.then(() => {
			console.log("success!");
		})
		.catch(error => {
			console.log(error);
		});
	}

	insertCountryData(countryDatas){
		for(var cd in countryDatas){
			var insertData = {

			}
			// insertRow("facebook_data_country", )
		}		
	}




	insertRow(table, insertData, type){
		let insert = "INSERT into "+table+"(lifetime_likes, weekly_reach, "+type+", date) VALUES(${likes}, ${reach}, ${type}, ${date})";

		this.db.none(insert, insertData)
		.then(() => {
			console.log("success!");
		})
		.catch(error => {
			console.log(error);
		})	
	}


}