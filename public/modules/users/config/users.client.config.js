'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								var requestedPath = $location.path();

								// Redirect to signin page
								$location.path('signin').search({redirect: requestedPath});
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]).run(['Menus',
        function(Menus) {
            // Set top bar menu items
            //Menus.addMenuItem('topbar', 'User Admin', 'users', 'link', '/users', false, ['admin'], 11);
        }
    ]);