'use strict';

// Mapversions controller
angular.module('mapversions').controller('CreateMapversionsController', ['$scope', '$http', '$location', 'Authentication', 'Mapversions', 'Valuesetdefinitions', 'Notification', 'HistoryChange', 'Utils', 'Config',
    function ($scope, $http, $location, Authentication, Mapversions, Valuesetdefinitions, Notification, HistoryChange, Utils, Config) {

        $scope.authentication = Authentication;

        $scope.valuesets = {};

        $scope.fromValueSetDefinitions = [];
        $scope.toValueSetDefinitions = [];

        $scope.mapVersion = {
            sourceAndRole: []
        };

        $scope.getDefinitions = function (q, collection) {
            Valuesetdefinitions.query({q: q}, function (response) {
                $scope[collection] = response.data.ValueSetDefinitionDirectory.entry;
            });
        }

        $scope.groupByValueSet = function (vs) {
            return vs.definedValueSet.content;
        }

        $scope.create = function () {
            var mapVersion = {
                about: Config.getResourceUriBase() + '/map/' + $scope.name + '/version/1',
                officialResourceVersionId: '1',
                mapVersionName: $scope.name + '-1',
                versionOf: {
                    content: $scope.name
                },
                fromValueSetDefinition: {
                    valueSetDefinition: {
                        uri: $scope.valuesets.fromValueSetDefinition.about,
                        href: $scope.valuesets.fromValueSetDefinition.href
                    },
                    valueSet: $scope.valuesets.fromValueSetDefinition.definedValueSet
                },
                toValueSetDefinition: {
                    valueSetDefinition: {
                        uri: $scope.valuesets.toValueSetDefinition.about,
                        href: $scope.valuesets.toValueSetDefinition.href
                    },
                    valueSet: $scope.valuesets.toValueSetDefinition.definedValueSet
                },
                sourceAndRole: $scope.mapVersion.sourceAndRole,
                changeDescription: {
                    changeType: "CREATE",
                    committed: "PENDING",
                    containingChangeSet: "change",
                    changeDate: new Date()
                }
            };

            Mapversions.new({MapVersion: mapVersion}, function (response) {
                    var statusCode = response.data.statusCode;
                    if (statusCode === 409) {
                        Notification.error('Map with name `' + $scope.name + '` already exists.');
                    } else {
                        var location = encodeURIComponent(Utils.removeURLParameter(response.data.headers.location, 'changesetcontext'));

                        $location.path('/mapversions/' + location + '/edit');

                        Notification.success('Map Version Saved');
                    }
                });

            HistoryChange.onHistoryChange();
        };

    }]);
