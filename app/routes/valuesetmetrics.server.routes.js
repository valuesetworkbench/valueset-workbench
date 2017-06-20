'use strict';

module.exports = function(app) {
	var valueSetMetrics = require('../../app/controllers/valuesetmetrics');

	app.route('/metrics/:id')
		.get(valueSetMetrics.metrics);

	app.route('/similarity')
		.get(valueSetMetrics.similarity);
};
