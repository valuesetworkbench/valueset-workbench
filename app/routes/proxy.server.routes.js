'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var proxy = require('../../app/controllers/proxy');
	var approvals = require('../../app/controllers/approvals');

	app.route('/proxy/:url')
		.get(users.requiresLogin, users.isGroupAuthorized, proxy.proxyGet, proxy.fulfill)
		.put(users.requiresLogin, users.isGroupAuthorized, approvals.isAlreadyApproved, proxy.proxyPut, proxy.fulfill)
		.post(users.requiresLogin, users.isGroupAuthorized, proxy.proxyPost)
		.delete(users.requiresLogin, users.isGroupAuthorized, proxy.proxyDelete, proxy.fulfill);

	// Finish by binding the Service middleware
	app.param('url', proxy.resolveResource);
};
