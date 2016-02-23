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
		
	}

	useFilter(filter){
		return (value, key) => {
			return key.indexOf(filter) > -1 || key === this.geoFilters.date;
		};
	}

	filterData(data, filter){
		return _.map(data, obj => {
			return _.pickBy(obj,this.useFilter(filter));
		});
	}

	indexByDate(data){
		return _.mapKeys(data, (value, key) => {
			return value.Date;
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

				let filteredData = _.mapValues(this.geoFilters, (filter, key, obj) => {
					return this.indexByDate(this.filterData(data, filter));
				});
				callback(filteredData);
			}
		});
	}
}