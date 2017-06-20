'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [

	function() {
		var _this = this;

		_this._data = {
			user: window.user,
            canAccess: function(neededRoles) {
                var intersection = (_.intersection(user.roles, neededRoles).length);

                return intersection > 0;
            },
			hasPermission: function(neededRole, permissions) {
				if (permissions) {
					return permissions.indexOf(neededRole) > -1;
				} else {
					return false;
				}
			},
			isLoggedIn: function () {
				return !!window.user;
			}
		};

		return _this._data;
	}
]);