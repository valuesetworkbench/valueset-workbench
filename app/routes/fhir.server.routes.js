'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var fhir = require('../../app/controllers/fhir');

	app.route('/fhir/*')
		.get(users.checkToken, fhir.get, fhir.send);
};
