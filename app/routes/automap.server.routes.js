'use strict';

module.exports = function(app) {
	var automap = require('../../app/controllers/automap');

	app.route('/automap')
		.get(automap.automap);
};
