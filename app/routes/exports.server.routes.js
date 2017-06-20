'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var exports = require('../../app/controllers/exports');

	// Exports Routes
	app.route('/exports')
		.get(exports.list)
		.post(users.requiresLogin, exports.create);

	app.route('/exports/:exportId')
		.get(exports.read)
		.put(users.requiresLogin, exports.hasAuthorization, exports.update)
		.delete(users.requiresLogin, exports.hasAuthorization, exports.delete);

	// Finish by binding the Export middleware
	app.param('exportId', exports.exportByID);
};