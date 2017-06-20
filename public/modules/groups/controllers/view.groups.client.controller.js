'use strict';

// Groups controller
angular.module('groups').controller('ViewGroupsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Groups', 'Users',
	function($scope, $stateParams, $location, Authentication, Groups, Users) {
		$scope.authentication = Authentication;

		$scope.getUserInfo = function (id) {
			return _.find($scope.allUsers, function (u) {
				return u._id === id;
			});
		}

		Users.query(function(result) {
			$scope.allUsers = result;

			$scope.group = Groups.get({
				groupId: $stateParams.groupId
			});
		});
	}
]);