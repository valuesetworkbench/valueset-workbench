'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var notifications = require('../../app/controllers/notifications');

	// Notifications Routes
	app.route('/notifications')
		.get(notifications.list)
		.post(users.requiresLogin, notifications.create)
        .delete(users.requiresLogin, notifications.deleteAll);

	// Notifications Routes
	app.route('/unreadnotifications')
		.delete(users.requiresLogin, notifications.markAllAsRead);

	app.route('/notifications/:notificationId')
		.get(notifications.read)
		.put(users.requiresLogin, notifications.hasAuthorization, notifications.update)
		.delete(users.requiresLogin, notifications.hasAuthorization, notifications.delete);

	// Finish by binding the Notification middleware
	app.param('notificationId', notifications.notificationByID);
};