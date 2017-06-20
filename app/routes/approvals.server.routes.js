'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var approvals = require('../../app/controllers/approvals');

	app.route('/approvals/:approvalUrl')
		.post(users.requiresLogin, approvals.approve)

	app.route('/approvals/:approvalUrl/:id')
		.delete(users.requiresLogin, approvals.unapprove)

	// Finish by binding the Service middleware
	app.param('approvalUrl', approvals.resolveApprovedResource);
};
