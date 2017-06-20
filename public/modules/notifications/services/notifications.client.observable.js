'use strict';

//Notifications service used to communicate Notifications REST endpoints
angular.module('notifications').service('NotificationObservable', ['Notifications',
	function(Notifications) {

        var observerCallbacks = [];

        this.setUnreadNotifications = function(count) {
            angular.forEach(observerCallbacks, function(callback){
                callback(count);
            });
        };

        this.registerObserverCallback = function(callback) {
            observerCallbacks.push(callback);

            var $parentThis = this;

            Notifications.query({unread: true}, function(notifications) {
                $parentThis.setUnreadNotifications(notifications.length);
            });
        };

        this.refresh = function(callback) {
            var this_ = this;
            Notifications.query({unread: true},
                function(data) {
                    this_.setUnreadNotifications(data.length);
                    callback && callback();
            });

        };

	}]
);
