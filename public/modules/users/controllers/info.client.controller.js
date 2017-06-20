'use strict';

angular.module('users').controller('InfoController', ['$scope', '$stateParams', 'Users', 'Authentication',
	function($scope, $stateParams, Users, Authentication) {
		Users.get({id: $stateParams.id}, function(response) {
			$scope.user = response;
		});
	}
]);
