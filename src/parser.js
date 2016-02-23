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
		}).mapValues(this.splitOnDash).value();
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
					return this.indexByDate(this.filterData(data, filter));
				});



				callback(dataIndexedByDate);
			}
		});
	}
}