'use strict';

// Codesystemversions controller
angular.module('codesystemversions').controller('ViewCodesystemversionsController', ['$scope', '$timeout', '$http', '$stateParams', '$location', 'Authentication', 'Codesystemversions',
    function ($scope, $timeout, $http, $stateParams, $location, Authentication, Codesystemversions) {
        $scope.id = decodeURIComponent($stateParams.codesystemversionId);

        $scope.authentication = Authentication;

        $scope.findOne = function () {
            Codesystemversions.get($scope.id, function (response) {
                var codesystemversion = response.data;
                $scope.resourceRoot = codesystemversion.CodeSystemVersionCatalogEntryMsg.heading.resourceRoot;
                $scope.codesystemversion = codesystemversion.CodeSystemVersionCatalogEntryMsg.codeSystemVersionCatalogEntry;
                $scope.loading = false;

                var entitiesHref = $scope.id + "/entities";
                Codesystemversions.getEntities(encodeURIComponent(entitiesHref), function (response) {
                    $scope.entities = response.data.EntityDirectory.entry;
                });

            });
        };


    }]);
