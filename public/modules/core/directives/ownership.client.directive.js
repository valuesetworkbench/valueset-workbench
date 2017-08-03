'use strict';

angular.module('core')
    .directive('ownership', ['$http', function () {
        return {
            templateUrl: 'modules/core/directives/ownership.client.view.html',
            restrict: 'E',
            replace: true,
            scope: {
                resource: '=resource'
            },
            controller: function ($scope, $http, Groups, Users, Authentication) {

                $scope.selected = {};

                $scope.$watch('resource', function (resource) {
                    if (resource) {
                        $scope.selected.sourceAndRole = $scope.findOwner(resource);
                    }
                });

                $scope.findOwner = function (resource) {
                    if (resource.sourceAndRole) {
                        return _.find(resource.sourceAndRole, function (item) {
                            if (item.role && item.role.content === 'owner') {
                                return item;
                            }
                        });
                    }
                };

                $scope.replaceOwner = function (resource, replacement) {
                    if (resource && resource.sourceAndRole && replacement) {
                        var i = 0;
                        for (;i < resource.sourceAndRole.length;i++) {
                            var item = resource.sourceAndRole[i];
                            if (item.role && item.role.content === 'owner') {
                                break;
                            }
                        }

                        resource.sourceAndRole[i] = replacement;
                    }
                };

                $scope.$watch('selected.sourceAndRole', function (selected) {
                    if ($scope.resource) {
                        $scope.replaceOwner($scope.resource, selected);
                    }
                });

                Groups.query({'members.user': Authentication.user._id}, function (groups) {
                    var sourceAndRoles = [];

                    angular.forEach(groups, function (group) {
                        if (Groups.hasCreatePermission(group)) {
                            sourceAndRoles.push({
                                source: {
                                    content: group.name
                                },
                                role: {
                                    content: 'owner'
                                }
                            });
                        }
                    });

                    sourceAndRoles.push({
                        source: {
                            content: Authentication.user.email
                        },
                        role: {
                            content: 'owner'
                        }
                    });

                    $scope.groups = sourceAndRoles;

                    if ($scope.groups.length == 1) {
                        $scope.selected.sourceAndRole = $scope.groups[0];
                    }
                });

                $scope.filterExisting = function () {
                    return function (item) {
                        if (!$scope.resource) {
                            return true;
                        }
                        var found = _.find($scope.resource.sourceAndRole, function (sourceAndRole) {
                            return sourceAndRole.source.content === item.source.content;
                        });

                        return !found;
                    };
                };

            }
        };
    }]);
