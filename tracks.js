var trackRepository = function() {
	var self = this;
	self.updateTrack = function(Parse, object, req, res) {
		var Track = Parse.Object.extend("audioTrack");
		var trackObj = new Track();
		var trackQuery = new Parse.Query(Track);
		console.log("Track id in soundcloud: " + object["id"]);
		console.log("Track id in soundcloud: " + object["permalink"]);
		trackQuery.equalTo("trackId", object["id"]);
		trackQuery.find({
			success : function(trackResponse) {
				if (trackResponse.length > 0) {
					trackObj = trackResponse[0];
					console.log("Need updation");
				} else {
					trackObj.increment("sequence");
				}
				self.savetrack(trackObj, object);
			}
		});
	};

	self.savetrack = function(trackObj, object) {
		console.log("Updating: " + object['id']);
		trackObj.set("permalink", object['permalink']);
		trackObj.set("permalink_url", object['permalink_url']);
		trackObj.set("description", object['description']);
		trackObj.set("imageUrl", object['artwork_url']);
		trackObj.set("title", object['title']);
		trackObj.set("tags", object['tag_list']);
		trackObj.set("trackId", object["id"]);
		trackObj.set("created", object["created_at"]);
		trackObj.save(null, {
			success : function(trackSaveObject) {
				console.log("Content created: id===> " + trackSaveObject.id);
				tags = object['tag_list'].split(",");
			},
			error : function(userRepo, error) {
				console.log("ERROR");
			}
		});
	};

	self.getTracksByTag = function(Parse, tag, req, res) {
		var Track = Parse.Object.extend("audioTrack");
		var trackQuery = new Parse.Query(Track);
		if (tag != "all")
			trackQuery.contains("tags", tag);
		trackQuery.descending("created");
		trackQuery.find({
			success : function(trackResponse) {
				res.send(trackResponse);
			}
		});
	};
};
module.exports = trackRepository;