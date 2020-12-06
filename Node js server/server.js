var path = require('path');        
const port = process.env.PORT ||3000;
const express = require('express');
const app = express();

//CORS Middleware
app.use(function (req, res, next) {
//Enabling CORS
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
res.header("Access-Control-Allow-Credentials", "true");
return next();
});

app.get('/api/search', function(request, response){
	console.log("Inside server /api/search");
	const stock = request.query.value;
	url = "https://api.tiingo.com/tiingo/utilities/search?token=b4e95182bcfae3fa31c6d095f26de94e3514a17b&query=" + stock;
	var req = require('request');
	req({json: true, uri: url}, function(error, res, body){
		if (!error && res.statusCode == 200){
			response.json(body);
		}
	});
});

app.get('/api/details', function(request, response){
	console.log("Inside server /api/detail");
	const stock = request.query.value;
	url = "https://api.tiingo.com/tiingo/daily/" + stock + "?token=b4e95182bcfae3fa31c6d095f26de94e3514a17b";
	var req = require('request');
	req({json: true, uri: url}, function(error, res, body){
		if (!error && res.statusCode == 200){
			response.json(body);
		} else {
			response.json(error);
		}
	});
});

app.get('/api/iex', function(request, response){
	console.log("Inside server /api/iex");
	const stock = request.query.value;
	url = "https://api.tiingo.com/iex?tickers=" + stock + "&token=b4e95182bcfae3fa31c6d095f26de94e3514a17b";
	var req = require('request');
	req({json: true, uri: url}, function(error, res, body){
		if (!error && res.statusCode == 200){
			response.json(body);
		}
	});
});


app.get('/api/chart', function(request, response){
	console.log("Inside server /api/chart");
	const stock = request.query.value;
	const date = request.query.date;
	url = "https://api.tiingo.com/iex/" + stock + "/prices?startDate=" + date + "&resampleFreq=4min&afterHours=false&token=b4e95182bcfae3fa31c6d095f26de94e3514a17b";
	var req = require('request');
	req({json: true, uri: url}, function(error, res, body){
		if (!error && res.statusCode == 200){
			response.json(body);
		}
	});
});

app.get('/api/news', function(request, response){
	console.log("Inside server /api/news");
	const stock = request.query.value;
	url = "https://newsapi.org/v2/everything?apiKey=f3346f1e651545cb8b4d2a1320357fd4&q=" + stock;
	var req = require('request');
	req({json: true, uri: url}, function(error, res, body){
		if (!error && res.statusCode == 200){
			response.json(body);
		}
	});
});

app.get('/api/chart1', function(request, response){
	console.log("Inside server /api/chart1");
	const stock = request.query.value;
	var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();

    var fulldate = new Date(year - 2, month, day);

    var toDate = fulldate.toISOString().slice(0, 10);
	
	//const date = request.query.stdate;
	
	url = "https://api.tiingo.com/tiingo/daily/" + stock + "/prices?startDate=" + toDate + "&columns=open,high,low,close,volume&resampleFreq=daily&token=b4e95182bcfae3fa31c6d095f26de94e3514a17b";
	console.log(url);
	var req = require('request');
	req({json: true, uri: url}, function(error, res, body){
		if (!error && res.statusCode == 200){
			response.json(body);
		}
	});
});

//Set the base path to the angular-test dist folder
app.use(express.static(path.join(__dirname, 'dist/hw8')));

//Any routes will be redirected to the angular app
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/hw8/index.html'));
});

//Starting server on port 8081
app.listen(port, () => {
    console.log('Server started!');
    console.log(port);
});