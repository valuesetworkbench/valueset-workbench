'use strict';

// Groups controller
angular.module('groups').controller('EditGroupsController', ['$scope', '$stateParams', 'dialogs', '$location', 'Authentication', 'Groups', 'Users', 'Notification',
	function($scope, $stateParams, dialogs, $location, Authentication, Groups, Users, Notification) {
		$scope.authentication = Authentication;

		// Remove existing Group
		$scope.remove = function(group) {
			if ( group ) { 
				group.$remove();

				for (var i in $scope.groups) {
					if ($scope.groups [i] === group) {
						$scope.groups.splice(i, 1);
					}
				}
			} else {
				$scope.group.$remove(function() {
					$location.path('groups');
				});
			}
		};

		$scope.makeOwner = function (newOwner) {
			$scope.group.owner = newOwner.user;
			$scope.update();
		};

		$scope.changeLogo = function () {
			var dlg = dialogs.create('/modules/groups/views/change-logo-modal.html', 'groups-changeLogoCtrl', {logo: $scope.group.logo});
			dlg.result.then(function (data) {
				$scope.group.logo = data.logo;
			});
		}

		// Update existing Group
		$scope.update = function() {
			var group = $scope.group;

			group.$update(function() {
				Notification.success('Group Saved');

				if(!$scope.authentication.canAccess(['admin']) && $scope.group.owner != $scope.authentication.user._id) {
					$location.path('/groups/' + $stateParams.groupId)
				}
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.current = {};

		$scope.addUser = function () {
			$scope.group.members.push({user: $scope.current.selected._id, permissions: ['View']});
			$scope.current.selected = null;
		}

		$scope.getUserInfo = function (id) {
			return _.find($scope.allUsers, function (u) {
				return u._id === id;
			});
		}

		$scope.removeUser = function (user) {
			var filtered = _.filter($scope.group.members, function (member) {
				return member.user != user.user;
			});

			$scope.group.members = filtered;
		}

		Users.query(function(result) {
			$scope.allUsers = result;
			$scope.availableUsers = result;

			$scope.group = Groups.get({
				groupId: $stateParams.groupId
			});
		});

		$scope.$watchCollection('group.members', function () {
			if (! $scope.group) {
				return;
			}
			var users = $scope.allUsers;
			angular.forEach($scope.group.members, function (membership) {
				users = _.reject(users, function (user) {
					return membership.user === user._id;
				});
			});

			$scope.availableUsers = users;
		});
	}
]).controller('groups-changeLogoCtrl', function ($scope, $modalInstance, data) {
	$scope.logo = data.logo

	$scope.cancel = function () {
		$modalInstance.dismiss('canceled');
	}; // end cancel

	$scope.done = function () {
		$modalInstance.close({logo: $scope.logo});
	}; // end save

});