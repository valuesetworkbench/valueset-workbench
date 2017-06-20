'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var mapversions = require('../../app/controllers/mapversions');

	// Conceptmaps Routes
	app.route('/mapversions')
		.get(mapversions.list)
		.post(users.requiresLogin, mapversions.create);

	app.route('/mapversionentries')
		.post(users.requiresLogin, mapversions.createMapEntries);

};
