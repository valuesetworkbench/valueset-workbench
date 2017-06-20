'use strict';

// Notifications controller
angular.module('notifications').controller('NotificationsController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Notifications', 'NotificationObservable',
	function($scope, $rootScope, $stateParams, $location, Authentication, Notifications, NotificationObservable) {
		$scope.authentication = Authentication;

        $scope.notifications = [];

		$scope.onlyUnread = false;

        $scope.markRead = function(notification) {
            if(notification.unread) {
                notification.unread = false;
                doUpdate(notification);
            }
        };

        $scope.markUnread = function(notification) {
            if(! notification.unread) {
                notification.unread = true;
                doUpdate(notification);
            }
        };

        $scope.$watch('notifications', function() {
            var unread = $.grep($scope.notifications, function(e){ return e.unread === true; }).length;
            NotificationObservable.setUnreadNotifications(unread);
        }, true);

		$scope.$watch('onlyUnread', function(newValue, oldValue) {
			if (newValue !== oldValue) {
				$scope.notifications = Notifications.query({unread: $scope.onlyUnread || null});
			}
		});

		// Create new Notification
		$scope.create = function() {
			// Create new Notification object
			var notification = new Notifications ({
				name: this.name
			});

			// Redirect after save
			notification.$save(function(response) {
				$location.path('notifications/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Notification
		$scope.remove = function( notification ) {
			if ( notification ) { notification.$remove();

				for (var i in $scope.notifications ) {
					if ($scope.notifications [i] === notification ) {
						$scope.notifications.splice(i, 1);
					}
				}
			} else {
				$scope.notification.$remove(function() {
					$location.path('notifications');
				});
			}
		};

		// Update existing Notification
		$scope.update = function() {
			var notification = $scope.notification ;

            doUpdate(notification);
		};

        var doUpdate = function(notification) {
            notification.$update(function() {
                //$location.path('notifications/' + notification._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

		// Find a list of Notifications
		$scope.find = function() {
            $scope.notifications = Notifications.query();
		};

		// Find existing Notification
		$scope.findOne = function() {
			$scope.notification = Notifications.get({
				notificationId: $stateParams.notificationId
			});
		};

        $scope.deleteAll = function() {
            Notifications.deleteAll(function(response) {
                $scope.notifications = Notifications.query();
            });
        };

		$scope.markAllAsRead = function() {
			Notifications.markAllAsRead(function(response) {
				$scope.notifications = Notifications.query();
			});
		};

        $scope.find();
	}
]);
