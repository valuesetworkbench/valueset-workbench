'use strict';

var users = require('../../app/controllers/users');

module.exports = function(app) {
	var cedar = require('../../app/controllers/cedar');

	app.route('/cedar/templates')
		.get(users.requiresLogin, cedar.searchTemplates);


    app.route('/cedar/templates/:id')
        .get(users.requiresLogin, cedar.getTemplate);

};
