'use strict';

module.exports = function(app) {
	var standardizer = require('../../app/controllers/standardizer');

	app.route('/standardize/:id')
		.get(standardizer.standardize);
};
