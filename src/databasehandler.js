"use strict";

import Parser from './parser.js';
import fs from 'fs';
import _ from 'lodash';
import {cfg} from './db.cfg';

var pgp = require('pg-promise')();

export default class DataBaseHandler{
	
	constructor(){
		this.db = pgp(cfg);
		this.parser = new Parser();
	}

	manyOrNone(query){
		return this.db.manyOrNone(query);
	}

	insertAllFilesInDir(dir){
		let files = fs.readdirSync(dir);
		for(var file in files){
			let path = dir+files[file];
			console.log(path);
			this.insertFacebookCsv(path);
			this.insertGeneric(path);

		}
	}

	insertPostFiles(){
		let dir = './data/postlevel/';
		let files = fs.readdirSync(dir);
		for(var file in files){
			let path = dir+files[file];
			console.log(path);
			this.insertPostCsv(path);
		}	
	}

	insertGeneric(csvPath,transaction){
		this.parser.parseGenericData(csvPath, data => {
			for(let date in data.date){
				let insertData = {};
				for(let prop in data){
					let row = data[prop][date];
					for(let value in row){
						insertData[value] = this.parser.fixInvalidData(row[value]);
					}
				}
				insertData = _(insertData).pickBy((value, key) => {
					return key.indexOf("consumptions by type")<0 && key.indexOf("post") <0;
				}).map((value, key) => {	
					return value;
				}).value();
				// console.log(insertData)

				this.insertGenericData(insertData);
			}
		});
	}

	insertFacebookCsv(csvPath){
		this.parser.parse(csvPath, (data) => {
			
			let query = "BEGIN; ";
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
					query+=(this.insertRow("facebook_data_demographic", insertData, "demographic"));
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
					query+=(this.insertRow("facebook_data_country", insertData, "country"));

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
					query+=(this.insertRow("facebook_data_city", insertData, "city"));
				}
				
			}
			query+="COMMIT;";
			this.db.none(query)
			.then(() => {
				console.log("yay");
			}).catch((error) => {
				console.log(error);
			});

			});


	}

	insertPostCsv(csv){
		this.parser.parsePostData(csv, (data) => {
			for(let i in data.date){
				// let date = data.date[i].Posted;
					let insertData = {};
				for(let prop in data){
					let row = data[prop][i];
					for(let value in row){
						insertData[value] = this.parser.fixInvalidData(row[value]);
					}
				}

				insertData = _(insertData).pickBy((value, key) => {
					return key.indexOf("Negative")<0;
				}).map((value, key) => {	
					return value;
				}).value();
				// console.log(insertData.length);
				this.insertPostData(insertData);
			}
		})
	}

	insertPostData(insertData){
		let insert = "INSERT into facebook_data_post (post_id, permalink, post_message, type, posted, total_reach, total_impressions, engaged_users, post_consumers, post_consumptions, post_consumptions_link, post_consumption_other, post_consumption_photo, post_consumption_video, talking_about_action_comment, talking_about_action_like, talking_about_action_other, talking_about_action_share) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18);"
		this.db.none(insert, insertData)
		.then(() => {
			console.log("success");
		})
		.catch(error => {
			console.log(error);
		});
	}

	insertGenericData(insertData){
		let insert = "INSERT into facebook_data_generic (date, lifetime_total_likes , daily_new_likes, daily_engaged_users, daily_total_reach, daily_organic_reach, daily_total_impressions, daily_organic_impressions, daily_page_consumptions, daily_link_clicks, daily_other_clicks, daily_photo_clicks, daily_video_clicks) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13); ";

		this.db.none(insert, insertData)
		.then(() => {
			console.log("success!");
		})
		.catch(error => {
			console.log(error);
		});
	}

	insertRow(table, insertData, type, transaction){
		return "INSERT into "+table+"(lifetime_likes, weekly_reach, "+type+", date) VALUES("+insertData.likes+", "+insertData.reach+", \'"+insertData.type+"\', \'"+insertData.date+"\'); ";	
	}


}