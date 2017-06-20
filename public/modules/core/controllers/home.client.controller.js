'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.onComplete = function() {
			window.location.href = '#!/valuesetdefinitions?tour=overall';
		};

		$scope.overallOptions = {
			doneLabel: 'Go to Value Sets',
			steps: [
				{
					element: "#overallTour",
					intro: "Welcome to the Value Set Workbench! First, we'll begin be exploring Value Sets."
				}
			]
		};
	}
]);
