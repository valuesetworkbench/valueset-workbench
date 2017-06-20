'use strict';

angular.module('core')
    .directive('list',['$http', '$location', '$injector', '$timeout', 'Authentication', 'Valuesetdefinitions', function() {
        return {
            templateUrl:'modules/core/directives/list.client.view.html',
            restrict: 'E',
            replace: true,
            scope: {
                directory: '@directory',
                version: '@version',
                service: '@service',
                resourceName: '@resourceName',
                display: '@display'
            },
            controller: function($scope, $http, $location, $injector, $timeout, Authentication, Groups){
                $scope.authentication = Authentication;

                var service = $injector.get($scope.service);

                // Find a list of Valuesets
                $scope.find = function () {
                    $scope.loading = true;
                    service.query({}, function (response) {
                        $scope.loading = false;
                        $scope.entries = $scope.groupVersions(response.data[$scope.directory].entry);

                        var tour = $location.search().tour;
                        $timeout(function () {
                            if (tour) {
                                $scope.startListTour();
                            }
                        }, 0);
                    });
                };

                Groups.query(function (groups) {
                    //allow self-group creates
                    //$scope.canCreate = $scope.authentication.canAccess(['admin']) ||
                    //    (groups.length && Groups.hasAnyCreatePermission(groups));

                    $scope.canCreate = true;
                })

                $scope.$watch('query', function () {
                    if ($scope.query !== undefined) {

                        $scope.searching = true;
                        $scope.searchResults = [];

                        var query = $scope.query !== '' ? $scope.query : '';
                        service.query({q: query}, function (result) {
                            delete $scope.searching;

                            $scope.entries = $scope.groupVersions(result.data[$scope.directory].entry);
                        });
                    }
                });

                $scope.isProduction = function (entry) {
                    return _.find(entry.versionTag, function (versionTag) {
                        return versionTag.content === 'PRODUCTION';
                    });
                };

                $scope.groupVersions = function (entries) {
                    var versions = {};

                    angular.forEach(entries, function (entry) {
                        var version = entry[$scope.version].content;
                        if (! versions[version]) {
                            versions[version] = [];
                        }

                        versions[version].push(entry);
                    });

                    return versions;
                }
        }}}]);

