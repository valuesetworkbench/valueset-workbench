'use strict';

// Codesystemversions controller
angular.module('codesystemversions').controller('CreateCodesystemversionsController', ['$scope', '$http', '$location', 'Authentication', 'Codesystemversions', 'Valuesetdefinitions', 'Notification', 'HistoryChange', 'Utils', 'Config',
    function ($scope, $http, $location, Authentication, Codesystemversions, Valuesetdefinitions, Notification, HistoryChange, Utils, Config) {

        $scope.authentication = Authentication;

        $scope.valuesets = {};

        Valuesetdefinitions.query({}, function (response) {
            $scope.valueSetDefinitions = response.data.ValueSetDefinitionDirectory.entry;
        });

        $scope.create = function () {
            var codesystemversion = {
                about: Config.getResourceUriBase() + '/map/' + $scope.name + '/version/1',
                officialResourceVersionId: '1',
                codesystemversionName: $scope.name + '-1',
                versionOf: {
                    content: $scope.name
                },
                fromValueSetDefinition: {
                    valueSetDefinition: {
                        uri: $scope.valuesets.fromValueSetDefinition.about
                    },
                    valueSet: $scope.valuesets.fromValueSetDefinition.definedValueSet
                },
                toValueSetDefinition: {
                    valueSetDefinition: {
                        uri: $scope.valuesets.toValueSetDefinition.about
                    },
                    valueSet: $scope.valuesets.toValueSetDefinition.definedValueSet
                }
            };

            Codesystemversions.new({Codesystemversion: codesystemversion}, function (response) {
                    var location = encodeURIComponent(Utils.removeURLParameter(response.data.headers.location, 'changesetcontext'));

                    $location.path('/codesystemversions/' + location + '/edit');

                    Notification.success('Map Version Saved');
                });

            HistoryChange.onHistoryChange();
        };

    }]);
