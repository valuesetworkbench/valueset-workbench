'use strict';

module.exports = function(app) {
	var databaseexplorer = require('../../app/controllers/databaseexplorer');

	app.route('/databaseexplorer/tables')
		.post(databaseexplorer.tables);

	app.route('/databaseexplorer/tables/:table/columns')
		.post(databaseexplorer.columns);

	app.route('/databaseexplorer/tables/:table')
		.post(databaseexplorer.query);

};
