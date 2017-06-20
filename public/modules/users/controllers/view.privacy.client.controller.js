'use strict';

angular.module('users').controller('ViewPrivacyController', ['$scope', '$http', '$location', '$window', '$stateParams', 'Authentication', 'NotificationObservable', 'dialogs',
	function($scope, $http, $location, $window, $stateParams, Authentication, NotificationObservable, dialogs) {
		$scope.authentication = Authentication;

		$http.get("/privacy").success(function (response) {
			$scope.privacy = response;
		}).error(function (response) {
			//
		});
	}
]);