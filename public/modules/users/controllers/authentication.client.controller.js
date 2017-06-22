'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', '$stateParams', 'Authentication', 'NotificationObservable', 'dialogs',
	function($scope, $http, $location, $stateParams, Authentication, NotificationObservable, dialogs) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.adminSignin = function() {
			dialogs.create('/modules/users/views/authentication/admin-signin-modal.html', 'adminSignin-Ctrl', {}, {size: 'sm'});
		}

        $http.get('/auth_providers').success(function(response) {
        	$scope.providers = response;
        });

        $http.get('/auth_enabled').success(function(response) {
            $scope.enabled = response;
        });

		$scope.signin = function() {
			var redirect = $location.search().redirect;

			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model

				var accept = function () {
					$scope.authentication.user = response.user;
					window.user = response.user;
					NotificationObservable.refresh();

					if(redirect) {
						$location.search('redirect', null);
						$location.path(redirect);
					} else {
						$location.path('/');
					}
				};

			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]).controller('adminSignin-Ctrl', function ($log, $http, $timeout, $scope, $location, $modalInstance, Authentication, NotificationObservable, data) {

	$scope.signin = function () {
		$http.post('/auth/signin', $scope.credentials).success(function (response) {
			var redirect = $location.search().redirect;
			if(redirect) {
				$location.search('redirect', null);
				window.location = '/#!' + redirect;
			} else {
				window.location = '/';
			}
			$scope.done();

		}).error(function (response) {
			$scope.error = response.message;
		});
	}

	$scope.done = function () {
		$modalInstance.close($scope);
	}; // end done

}).controller('terms-Ctrl', function ($log, $http, $timeout, $scope, $modalInstance, data) {
	$scope.terms = data.terms

	$scope.accept = function () {
		data.accept($scope.done);
	};

	$scope.decline = function () {
		data.decline($scope.done);
	};

	///
	$scope.done = function () {
		$modalInstance.close($scope);
	}; // end done

});