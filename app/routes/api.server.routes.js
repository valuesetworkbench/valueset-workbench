'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var api = require('../../app/controllers/api');

	app.route('/api/map/:mapName/:mapVersion')
		.get(users.checkToken, api.getMapVersion, users.isGroupAuthorized, api.transform, api.send);

    app.route('/api/valueset/:valueSetName/:valueSetVersion')
        .get(users.checkToken, api.getValueSetResolution, users.isGroupAuthorized, api.transform, api.send);
};
