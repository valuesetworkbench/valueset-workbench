'use strict';

// Valuesets controller
angular.module('valuesetdefinitions').controller('ListValuesetdefinitionsController', ['$scope', '$http', '$stateParams', '$location', 'dialogs', 'Authentication', 'Valuesetdefinitions', 'Notification', '$timeout', 'Utils',
	function($scope, $http, $stateParams, $location, dialogs, Authentication, Valuesetdefinitions, Notification, $timeout, Utils) {
        $scope.authentication = Authentication;

        $scope.listTour = {
            doneLabel: 'Go to Maps',
            steps: [
                {
                    element: "#valuesetdefinition-list",
                    intro: "All available Value Sets will be listed here.",
                    position: "top"
                },
                {
                    element: "#valuesetdefinition-list-filter",
                    intro: "You can filter the list by typing here."
                },
                {
                    element: "#create-valuesetdefinition-button",
                    intro: "Or you can create a new one."
                }
            ]
        };

    }]);

