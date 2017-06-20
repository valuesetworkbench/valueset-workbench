'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var discussions = require('../../app/controllers/discussions');

	app.route('/discussions/:discussionId')
		.get(discussions.read)
		.post(users.requiresLogin, discussions.createComment);

	app.route('/comments/:commentId')
		.delete(users.requiresLogin, discussions.hasAuthorization, discussions.deleteComment);

	// Finish by binding the Notification middleware
	app.param('discussionId', discussions.getDiscussion);
};
