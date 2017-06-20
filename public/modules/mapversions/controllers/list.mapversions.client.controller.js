'use strict';

// Mapversions controller
angular.module('mapversions').controller('ListMapversionsController', ['$scope', 'dialogs', '$http', '$timeout', '$stateParams', '$location', 'Authentication', 'Mapversions',
    function ($scope, dialogs, $http, $timeout, $stateParams, $location, Authentication, Mapversions) {
        $scope.authentication = Authentication;

        $scope.listTour = {
            steps: [
                {
                    element: "#map-version-list",
                    intro: "All available Maps will be listed here.",
                    position: "top"
                },
                {
                    element: "#map-version-list-filter",
                    intro: "You can filter the list by typing here."
                },
                {
                    element: "#create-map-version-button",
                    intro: "Or you can create a new one."
                }
            ]
        };

    }]);
