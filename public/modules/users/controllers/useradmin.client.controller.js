'use strict';

angular.module('users').controller('UserAdminController', ['$scope', '$http', '$location', 'Notification', 'Users', 'Authentication',
	function($scope, $http, $location, Notification, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

        // Find a list of Users
        $scope.find = function() {
            $scope.users = Users.query();
        };

        $scope.getRoles = function() {
            $http.get('/userroles').success(function(response) {
                // If successful show success message and clear form
                $scope.roles = response;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        // Update a user profile
        $scope.updateUserRoles = function(updatedUser) {
            $scope.success = $scope.error = null;
            var user = new Users(updatedUser);

            user.$update(function(response) {
                $scope.success = true;
                if(Authentication.user.username === response.username) {
                    Authentication.user = response;
                }
                Notification.success('User ' + response.displayName + ' (' + response.username + ') has been updated.');
                //dialogs.notify("User Permission Change", 'User ' + response.displayName + ' (' + response.username + ') has been updated.', {size:'sm'});
            }, function(response) {
                $scope.error = response.data.message;
            });
        };

        $scope.getRoles();
	}
]);
