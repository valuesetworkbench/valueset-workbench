'use strict';

module.exports = function(app) {
	var photo = require('../../app/controllers/photo');

	app.route('/photos/:id')
		.get(photo.getPhoto);
};
