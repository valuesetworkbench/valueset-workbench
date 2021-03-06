'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$rootScope', 'Authentication', 'Menus', 'NotificationObservable', 'Config',
	function($scope, $rootScope, Authentication, Menus, NotificationObservable, Config) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
        $scope.authentication = Authentication;

        NotificationObservable.registerObserverCallback(function(count) {
            $scope.unreadNotifications = count;
        });

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		var header = Config.getHeader();
        $scope.headerOn = header.headerOn;
		$scope.headerLabelType = header.headerType;
        $scope.headerLabelMsg = header.headerMsg;

		/* Maybe resize this on scroll? Not sure...
		$(window).scroll(function() {
			if ($(document).scrollTop() > 25) {
				$('#header-logo').addClass('header-logo-small');
				$('#header-logo').removeClass('header-logo-large');
			} else {
				$('#header-logo').addClass('header-logo-large');
				$('#header-logo').removeClass('header-logo-small');
			}
		});
		*/

	}
]);