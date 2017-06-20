'use strict';

angular.module('users').controller('TermsController', ['$scope', '$http', '$location', '$window', '$stateParams', 'Authentication', 'NotificationObservable', 'dialogs',
	function($scope, $http, $location, $window, $stateParams, Authentication, NotificationObservable, dialogs) {
		$scope.authentication = Authentication;

		$http.get("/terms").success(function (response) {
			$scope.terms = response;
		}).error(function (response) {
			//
		});

		$scope.displayButtons = !$location.search().noprompt;

		$scope.accept = function () {
			$http.put('/users/me/terms', {hasAgreedToTerms: true});
			$location.path('/');
		};

		$scope.decline = function () {
			$window.location.href = '/auth/signout';
		}
	}
]);