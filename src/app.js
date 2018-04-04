const http = require('http');
const request = require('request');
const readline = require('readline');
const fs = require('fs');

const apiKey = "Yg4GO54ZNv7lvfqqgAXRALHs5XcdLfKI";
const filename = generateFileName();
console.log(filename);

const categories = [
	{ name: "Ambient", path: "music/ambient" },
	{ name: "Chill", path: "music/ambient/chill" },
	{ name: "Atmospheres, Soundscapes", path: "music/ambient/atmospheres-soundscapes" },
	{ name: "Lounge", path: "music/ambient/lounge" },
	{ name: "Electronic", path: "music/ambient/electronic" },
	{ name: "New Age", path: "music/ambient/new-age" },
	{ name: "Children's", path: "music/children-s" },
	{ name: "Cinematic", path: "music/cinematic" },
	{ name: "Dramatic, Action, Adventure", path: "music/cinematic/dramatic-action-adventure" },
	{ name: "Romantic, Sentimental", path: "music/cinematic/romantic-sentimental" },
	{ name: "Suspense, Dark", path: "music/cinematic/suspense-dark" },
	{ name: "Sci-Fi, Fantasy", path: "music/cinematic/sci-fi-fantasy" },
	{ name: "Corporate", path: "music/corporate" },
	{ name: "Motivational", path: "music/corporate/motivational" },
	{ name: "News", path: "music/corporate/news" },
	{ name: "Drum & Bass, Breakbeat", path: "music/drum-bass-breakbeat" },
	{ name: "Electronica", path: "music/electronica" },
	{ name: "Dance", path: "music/electronica/dance" },
	{ name: "Dubstep", path: "music/electronica/dubstep" },
	{ name: "Trance", path: "music/electronica/trance" },
	{ name: "Downtempo", path: "music/electronica/downtempo" },
	{ name: "IDM, Glitch", path: "music/electronica/idm-glitch" },
	{ name: "Experimental, Abstract", path: "music/experimental-abstract" },
	{ name: "Folk, Acoustic", path: "music/folk-acoustic" },
	{ name: "Hip-Hop", path: "music/hip-hop" },
	{ name: "House", path: "music/house" },
	{ name: "Percussion", path: "music/percussion" },
	{ name: "Pop", path: "music/pop" },
	{ name: "Rock", path: "music/rock" },
	{ name: "Indie Rock", path: "music/rock/indie-rock" },
	{ name: "Hard Rock, Metal", path: "music/rock/hard-rock-metal" },
	{ name: "Lite Rock", path: "music/rock/lite-rock" },
	{ name: "Grunge, Garage, Punk", path: "music/rock/grunge-garage-punk" }
];

// API requests counter
let counter = 0;

// Timeout between categories = 1 minute
const timeoutVar = 60000;

console.log("Proceed...");
console.log("Categories total count:" + categories.length);
writeFile("Categories total count:" + categories.length);

// Get info about each category every minute
var refreshId = setInterval(function(){
	var category = categories.shift();
	console.log(category);
	console.log(category == undefined);
	if(category == undefined) {
		console.log('Finished');
		clearInterval(refreshId);
	} else {
		appendFile("-----------------");
		appendFile("Receiving information about: " + category.name);
		appendFile("Receiving path: " + category.path);

		GetInfoByCategory(category);
	}
}, timeoutVar); 

function GetInfoByCategory(category) {
	console.log("Receiving information about " + category.name);
	console.log("Receiving path " + category.path);
	console.log("------------------------------");
	
	let pageCount = 1;
	let page = "&page=1";
	const topSongsUrl = `https://api.envato.com/v1/discovery/search/search/item?site=audiojungle.net&category=${category.path}&date=this-month&sort_by=sales&sort_direction=desc&page_size=100`;	
	
	let totalNumberOfItems = 0;
	let totalNumberOfSales = 0;
	let salesRatio = 0;
	
	
	makeRequest(topSongsUrl + page, function() {
		salesRatio = totalNumberOfSales / totalNumberOfItems;

		appendFile("Statistics for " + category.name + ":");
		appendFile("Total number of items: " + totalNumberOfItems);
		appendFile("Total number of sales: " + totalNumberOfSales);
		appendFile("Sales ration: " + salesRatio);
		appendFile("Calculation for: " + category.name + " completed");
		appendFile("------------------------------------------------------------------");
		appendFile("------------------------------------------------------------------");
		appendFile("------------------------------------------------------------------");
		
	});

	function makeRequest(songsUrl, callback) {
		request({
		url: songsUrl + page,
		auth: {
			'bearer': apiKey
		}},
		function(err, res) {
			console.log("API call: " + category.name);

			if(err !== null) {
				console.log(err);
			}
		
			let responce = JSON.parse(res.body);
			let songs = responce.matches;
			// if there are item on next page, make request to another page
			// if there is no items - it's last page, make calculations 
			if(songs.length > 0) {
				totalNumberOfItems += songs.length;
				numberOfSales = songs.map(_ => _.number_of_sales);
				totalNumberOfSales += numberOfSales.reduce((total, num) => total + num);	

				appendFile("Number of items: " + totalNumberOfItems);
				appendFile("Number of sales: " + totalNumberOfSales);

				// make call to another page
				pageCount++;
				makeRequest(topSongsUrl + `&page=${pageCount}`, callback);
			} else {
				callback();
			}	
		});	
	}
}

function writeFile(text) {
	text = '\r\n' + text;
	fs.writeFile(filename, text, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	});
}

function appendFile(text) {
	text = '\r\n' + text;
	fs.appendFileSync(filename, text, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	});	
}

function generateFileName() {
	var currentDate = new Date().toString().replace(/\s/g, "-");
	return 'text.txt';
	return `${currentDate}.txt`;
}

function checkApiCounter() {
	if(counter > 90) {
		return false;
	} else {
		return true;
	}
}