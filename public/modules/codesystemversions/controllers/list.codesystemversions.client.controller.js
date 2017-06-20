'use strict';

// Codesystemversions controller
angular.module('codesystemversions').controller('ListCodesystemversionsController', ['$scope', 'dialogs', '$http', '$timeout', '$stateParams', '$location', 'Authentication', 'Codesystemversions',
    function ($scope, dialogs, $http, $timeout, $stateParams, $location, Authentication, Codesystemversions) {
        $scope.authentication = Authentication;

    }]);
