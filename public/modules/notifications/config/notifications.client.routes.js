'use strict';

//Setting up route
angular.module('notifications').config(['$stateProvider',
	function($stateProvider) {
		// Notifications state routing
		$stateProvider.
		state('listNotifications', {
			url: '/notifications',
			templateUrl: 'modules/notifications/views/list-notifications.client.view.html'
		}).
		state('createNotification', {
			url: '/notifications/create',
			templateUrl: 'modules/notifications/views/create-notification.client.view.html'
		}).
		state('viewNotification', {
			url: '/notifications/:notificationId',
			templateUrl: 'modules/notifications/views/view-notification.client.view.html'
		}).
		state('editNotification', {
			url: '/notifications/:notificationId/edit',
			templateUrl: 'modules/notifications/views/edit-notification.client.view.html'
		});
	}
]);