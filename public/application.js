'use strict';

//Start by defining the main module and adding the module dependencies
var module = angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

// disable caching for ajax calls
angular.module(ApplicationConfiguration.applicationModuleName).config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }
    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
}]);

angular.module(ApplicationConfiguration.applicationModuleName).config(['NotificationProvider', function(NotificationProvider) {
	NotificationProvider.setOptions({
		delay: 2000
	});
}]);

angular.module(ApplicationConfiguration.applicationModuleName).value('duScrollOffset', 100);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

angular.module(ApplicationConfiguration.applicationModuleName).run(function($rootScope,$location,$state) {});
/*
angular.module(ApplicationConfiguration.applicationModuleName).run(function($rootScope, $location, $state, Authentication) {

	$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
		if(toState.name === 'signin') {
			return;
		}
		if(! window.user) {
			e.preventDefault();
			$state.go('signin', {
				redirect: function () {
					$state.go(toState.name, toParams);
				}
			});
		}
	});
});
	*/