'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var valuesetdefinitions = require('../../app/controllers/valuesetdefinitions');

	// Valuesets Routes
	app.route('/valuesetdefinitions')
		.get(valuesetdefinitions.list)
		.post(users.requiresLogin, valuesetdefinitions.create);

	// Finish by binding the Valueset middleware
	app.param('valuesetdefinitionId', valuesetdefinitions.valuesetdefinitionByID);
};
