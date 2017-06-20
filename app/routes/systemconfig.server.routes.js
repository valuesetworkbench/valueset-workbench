'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var systemconfig = require('../../app/controllers/systemconfig');

	app.route('/systemconfig')
		.get(systemconfig.read)
		.put(users.requiresLogin, systemconfig.hasAuthorization, systemconfig.update);

};
