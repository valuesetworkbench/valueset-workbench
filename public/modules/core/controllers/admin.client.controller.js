'use strict';

angular.module('core').controller('AdminController', ['$scope', '$rootScope', 'Authentication', 'Menus', 'NotificationObservable',
	function($scope, $rootScope, Authentication) {
		$scope.authentication = Authentication;
	}
]);