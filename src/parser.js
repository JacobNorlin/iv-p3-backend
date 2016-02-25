"use strict";
import _ from 'lodash';
import Papa from 'papaparse';
import fs from 'fs';

export default class Parser{

	constructor(){
		this.geoFilters = {
			lifetimeLikesByCountry: "Lifetime Likes by Country",
			lifetimeLikesByCity: 	"Lifetime Likes by City",
			lifetimeLikesByAgeAndGender: "Lifetime Likes by Gender and Age",
			weeklyReachDemographics: "Weekly Reach Demographics",
			weeklyReachByCountry: 	"Weekly Reach by Country",
			weeklyReachByCity: 		"Weekly Reach by City",
			// weeklyTotalImpressions: "Weekly Total Impressions", 
			date: 					"Date",
		};

		this.genericFilters = {
			lifetimeTotalLikes: "Lifetime Total Likes",
			dailyNewLikes: "Daily New Likes",
			dailyPageEngagedUsers: "Daily Page Engaged Users",
			dailyTotalReach: "Daily Total Reach",
			dailyOrganicReach: "Daily Organic Reach",
			dailyTotalImpressions: "Daily Total Impressions",
			dailyOrganicImpressions: "Daily Organic impressions",
			dailyPageConsumptions: "Daily Page consumptions",
			dailyLinkClicks: "Daily People who interacted with your Page content by content type - link clicks",
			dailyOtherClicks: "Daily People who interacted with your Page content by content type - other clicks",
			dailyPhotoClicks: "Daily People who interacted with your Page content by content type - photo view",
			dailyVideoClicks: "Daily People who interacted with your Page content by content type - video play",
			date: "Date"
		};

		this.postFilters = {
			postId: "Post ID",
			permalink: "Permalink",
			postMessage: "Post Message",
			type: "Type",
			date: "Posted",
			lifetimeTotalReach: "Lifetime Post Total Reach",
			lifetimeTotalImpressions: "Lifetime Post Total Impressions",
			lifetimeEngagedUsers: "Lifetime Engaged Users",
			lifetimePostConsumers: "Lifetime Post Consumers",
			lifetimePostConsumptions: "Lifetime Post Consumptions",
			lifetimeTaklingAboutThis: "Lifetime Talking About This (Post)"
		}
		
	}

	splitOnDash(metricByCountryRow){

		return _(metricByCountryRow).omit("Date").mapKeys((value, key, obj) => {
			return key.split(" - ")[1].toLowerCase();
		}).value();
	}

	formatDate(date){
		return _.map(date.split('/'), n => {
			if(n.length === 1){
				return "0"+n;
			}else{
				return n;
			}
		}).join("-");
	}

	parseCity(city){
		return city.split(',')[0];
	}

	fixInvalidData(data){
		return data ? data : 0;
	}

	useFilter(filter){
		return (value, key) => {
			return key.indexOf(filter) > -1 || key === this.geoFilters.date;
		};
	}

	filterData(data, filter){
		return _.map(data, obj => {
			return _.pickBy(obj, this.useFilter(filter));
		});
	}

	indexByDate(data){
		return _(data).mapKeys((value, key) => {
			return this.formatDate(value.Date);
		});
	}

	indexByCountry(dataIndexedByMetric){
		
	}


	parse(path, callback){
		var csv = fs.readFileSync(path);
		Papa.parse(csv.toString(),{
			header:true,
			complete: (result) => {

				let data = result.data;

				let dataIndexedByDate = _.mapValues(this.geoFilters, (filter, key, obj) => {
					return this.indexByDate(this.filterData(data, filter)).mapValues(this.splitOnDash).value();
				});



				callback(dataIndexedByDate);
			}
		});
	}
	//Generic data = non country/city/demographic data etc.. Just regular data about the page.
	parseGenericData(path, callback){
		var csv = fs.readFileSync(path);
		Papa.parse(csv.toString(), {
			header: true,
			complete: result => {
				let data = result.data;
				let dataIndexedByDate = _.mapValues(this.genericFilters, (filter, key, obj) => {
					return this.indexByDate(this.filterData(data, filter)).value();
				});

				callback(dataIndexedByDate);
			}
		});
	}

	parsePostData(path, callback){
		var csv = fs.readFileSync(path);
		Papa.parse(csv.toString(), {
			header: true,
			complete: result => {
				let data = result.data;
				let filteredData = _.mapValues(this.postFilters, (filter, key, obj) => {
					return this.filterData(data, filter)
				});


				// let dateIndexed = _.groupBy(filteredData, val => {
				// 	console.log(val)
				// })
				for(var i in filteredData.date){
					console.log(filteredData.date[i]);
				}

				callback(filteredData);
			}
		});
	}
}