'use strict';

// Valuesets controller
angular.module('valuesetdefinitions').controller('ViewValuesetdefinitionsController', ['$scope', '$http', '$stateParams', '$location', 'dialogs', 'Authentication', 'Valuesetdefinitions', 'Approvals',
	function($scope, $http, $stateParams, $location, dialogs, Authentication, Valuesetdefinitions, Approvals) {

        $scope.id = decodeURIComponent($stateParams.valuesetdefinitionId);

        $scope.authentication = Authentication;

        $scope.hasApprovals = function () {
            return Approvals.hasApprovals($scope.valuesetdefinition);
        }

        // Find existing Valueset
        $scope.findOne = function () {
            $scope.definitionLoading = true;
            Valuesetdefinitions.get($scope.id, function (response) {
                $scope.valuesetdefinition = response.data.ValueSetDefinitionMsg.valueSetDefinition;
                $scope.definitionLoading = false;
                $scope.permissions = response.data.permissions;
            });

            $scope.resolutionLoading = true;
            Valuesetdefinitions.getResolution($scope.id, function (response) {
                $scope.resolution = response.data.IteratableResolvedValueSet;
                $scope.resolutionLoading = false;
            });
        };

    }]);