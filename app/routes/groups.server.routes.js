'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var groups = require('../../app/controllers/groups.server.controller');

	// Groups Routes
	app.route('/groups')
		.get(users.requiresLogin, groups.list)
		.post(users.requiresLogin, groups.create);

	app.route('/groups/:groupId')
		.get(users.requiresLogin, groups.hasViewAuthorization, groups.read)
		.put(users.requiresLogin, groups.hasEditAuthorization, groups.update)
		.delete(users.requiresLogin, groups.hasEditAuthorization, groups.delete);

	// Finish by binding the Group middleware
	app.param('groupId', groups.groupByID);
};
