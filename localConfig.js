var parseServerLocation = "http://localhost:1337";
var localConfig = function() {
	var self = this;
	self.getServerLocation = function() {
		return parseServerLocation;
	};
};

module.exports = localConfig;
