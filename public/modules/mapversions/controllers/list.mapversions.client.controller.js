'use strict';

// Mapversions controller
angular.module('mapversions').controller('ListMapversionsController', ['$scope', 'dialogs', '$http', '$timeout', '$stateParams', '$location', 'Authentication', 'Mapversions',
    function ($scope, dialogs, $http, $timeout, $stateParams, $location, Authentication, Mapversions) {
        $scope.authentication = Authentication;


    }]);
