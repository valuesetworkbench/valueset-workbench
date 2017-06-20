'use strict';

angular.module('users').controller('AcceptTermsAndPrivacyController', ['$scope', '$http', '$location', '$window', '$stateParams', 'Authentication', 'NotificationObservable', 'dialogs',
	function($scope, $http, $location, $window, $stateParams, Authentication, NotificationObservable, dialogs) {
		$scope.authentication = Authentication;

		$http.get("/terms").success(function (response) {
			$scope.terms = response;
		}).error(function (response) {
			//
		});

		$http.get("/privacy").success(function (response) {
			$scope.privacy = response;
		}).error(function (response) {
			//
		});

		$scope.displayButtons = !$location.search().noprompt;

		$scope.accept = function () {
			$http.put('/users/me/agreed', {hasAgreedToTerms: true, hasAgreedToPrivacyPolicy: true});
			$location.path('/');
		};

		$scope.decline = function () {
			$window.location.href = '/auth/signout';
		}
	}
]);