'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var svs = require('../../app/controllers/svs');

	app.route('/svs/*')
		.get(users.checkToken, svs.get);
};
