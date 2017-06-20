'use strict';

//Notifications service used to communicate Notifications REST endpoints
angular.module('notifications').service('Notifications', ['$resource',
	function($resource) {

		return $resource('notifications/:notificationId', { notificationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
            deleteAll: {'method': 'DELETE'},
			markAllAsRead: { method: 'DELETE', url: 'unreadnotifications'}
		});
	}
]);