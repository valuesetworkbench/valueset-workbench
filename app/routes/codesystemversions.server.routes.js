'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var codesystemversions = require('../../app/controllers/codesystemversions');

	// Valuesets Routes
	app.route('/codesystemversions')
		.get(codesystemversions.list)
		.post(users.requiresLogin, codesystemversions.hasAuthorization, codesystemversions.create);

    app.route('/entities')
        .post(users.requiresLogin, codesystemversions.hasAuthorization, codesystemversions.createEntity);

	app.route('/codesystemversions/:codesystemversionId')
		.get(codesystemversions.read)
		.put(users.requiresLogin, codesystemversions.hasAuthorization, codesystemversions.update)
		.delete(users.requiresLogin, codesystemversions.hasAuthorization, codesystemversions.delete);

	// Finish by binding the Valueset middleware
	app.param('codesystemversionId', codesystemversions.codesystemversionByID);
};
