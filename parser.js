var fs = require('fs');

fs.readFile('programming-task-example-data.log', 'utf8', function(err, data) {
	if (err) {
		return console.log(err);
	}

	parseLogfile(data);
});



function parseLogfile(logText) {
	var lines = logText.split("\n");
	var n = lines.length;
	var mapUniqIps = {};
	var mapIps = {};
	var mapUrls = {};
	var countUniqueIps = 0;

	for (var i = 0; i < n; i++) {
		var line = lines[i];
		// match IP using regex
		var ip = ((line.match(/^\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g)) || []).join('');

		if (ip) {
			console.log('IP address extracted form the log in row#', i + 1, ':', ip);
		}

		if (ip && typeof mapIps[ip] === 'undefined') {
			mapIps[ip] = 0;
		}

		if (ip)
			mapIps[ip]++;

		// var urlRegEx = (line.match(/"GET\s+.*$/g) || []).join('');
		// Look for any requests as per the log file to extract URLs
		var urlRegEx = (line.match(/"[GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS].*$/g) || []).join('');

		var url = urlRegEx.split('HTTP')[0].split('GET')[1];

		if (url) {
			console.log('URL extracted form the log in row#', i + 1, ':', url, '\n\n');
		}

		if (url && typeof mapUrls[url] === 'undefined') {
			mapUrls[url] = 0;
		}
		if (url)
			mapUrls[url]++;
	}

	var sortedIps = sortByKey(mapIps);
	var sortedUrls = sortByKey(mapUrls);
	var uniqueIps = [];

	for (var key in mapIps) {
		if (mapIps[key] === 1) {
			countUniqueIps++;
			uniqueIps.push(key);
		}
	}

	console.log('\n\nThe number of unique IPs are:', countUniqueIps, '\nList of those IPs are', uniqueIps);
	var topUrls = sortedUrls.slice(0, 3);
	var topIps = sortedIps.slice(0, 3);
	var top3Ips = [],
		top3Urls = [];

	for (var p = 0; p < topUrls.length; p++) {
		if (topUrls.length < 3 && topUrls[p][1].length > 2)
			top3Urls.push({
				url: topUrls[p][1][1],
				frequency: topUrls[p][0]
			});
		top3Urls.push({
			url: topUrls[p][1][0],
			frequency: topUrls[p][0]
		});
	}

	for (var q = 0; q < topIps.length; q++) {
		top3Ips.push({
			ip: topIps[q][1][0],
			frequency: topIps[q][0]
		});
	}

	console.log('\nThe top 3 most visited URLs are:', top3Urls);
	console.log('\nThe top 3 most active IPs are:', top3Ips);
}

/* This function retains the order of occurrance of URLs and IPs as per the log file and 
yet returns the sorted list by IPs and URLs */
function sortByKey(obj) {
	var array = [],
		map = {};

	for (var key in obj) {
		if (typeof map[obj[key]] === 'undefined') {
			map[obj[key]] = [];
		}
		map[obj[key]].push(key);
	}

	for (a in map) {
		array.push([a, map[a]])
	}

	array.sort((a, b) => (b[0]) - (a[0]));

	return array;
}