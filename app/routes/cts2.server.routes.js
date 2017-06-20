'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var cts2 = require('../../app/controllers/cts2');

	app.route('/cts2/*')
		.get(users.checkToken, cts2.get, users.isGroupAuthorized, cts2.send);
};
