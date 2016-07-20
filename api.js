//========= REPOSITORIES ========== //
//var soundCloudRepository = require("./soundCloud.js");
var localConfig = require("./localConfig.js");
var trackRepository = require("./tracks.js");

var localConfigInstance = new localConfig();
var parseServerLocation = localConfigInstance.getServerLocation();

var express = require('express');
var app = express();
var parserServerPort = ":1337";
var Parse = require('parse/node');
Parse.initialize("myAppId", '', 'master');
Parse.serverURL = parseServerLocation + '/parse';

var urlPrefix = "https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/";
var tracksUrl = "https://api.soundcloud.com/users/<YOUR USER ID>/tracks.json?client_id=<YOUR CLIENT ID>&limit=100";
var http = require('http');
var request = require("request");

// USING CORS -- NEED TO INSTALL
var cors = require('cors');
app.use(cors());

// BODY PARSER
var bodyParser = require('body-parser');
app.use(bodyParser.json({
	limit : '50mb',
	extended : true
}));
app.use(bodyParser.urlencoded({
	limit : '50mb',
	extended : true
}));

app.use(bodyParser.urlencoded({
	extended : true
}));
// app.use(bodyParser.json()); // for parsing application/json

app.use(bodyParser({
	limit : '5mb'
}));

// --------------- GET REQUESTS

app.get('/refresh/tracks', function(req, res) {
	request({
		url : tracksUrl,
		json : true
	}, function(error, response, output) {
		if (!error && response.statusCode === 200) {
			for (var i = 0; i < output.length; i++) {
				var object = output[i];
				var trackRepoInstance = new trackRepository();
				trackRepoInstance.updateTrack(Parse, object, req, res);
			}
			res.send("Completed");
		}
	});
});

app.get('/get/tracksByTag/:tag', function(req, res) {
	var trackRepoInstance = new trackRepository();
	var tag = req.params["tag"];
	trackRepoInstance.getTracksByTag(Parse, tag, req, res);
});

app.listen(9991, function() {
	console.log('Example app listening on port 9991!');
});
