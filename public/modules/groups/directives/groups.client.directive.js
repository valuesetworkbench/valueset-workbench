'use strict';

angular.module('groups')
    .directive('groups',['$http', function() {
        return {
            templateUrl:'modules/groups/directives/groups.client.view.html',
            restrict: 'E',
            replace: true,
            scope: {
                resource: '=resource'
            },
            controller: function($scope, $http, Groups){
                $scope.selected = {};

                 Groups.query(function (groups) {
                     var sourceAndRoles = [];

                     angular.forEach(groups, function (group) {
                         sourceAndRoles.push({
                             source: {
                                 content: group.name
                             },
                             role: {
                                 content: 'owner'
                             }
                         })
                     });

                     $scope.groups = sourceAndRoles;
                });

                $scope.filterExisting = function () {
                    return function(item) {
                        if(! $scope.resource) {
                            return true;
                        } else {
                            var found = _.find($scope.resource.sourceAndRole, function (sourceAndRole) {
                                return sourceAndRole.source.content === item.source.content;
                            });

                            return !found;
                        }
                    };
                }

            }
        }
    }]);
