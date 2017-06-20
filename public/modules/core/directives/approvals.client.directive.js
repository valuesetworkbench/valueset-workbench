'use strict';

var APPROVAL_PREDICATE_URI = "urn:approval";

angular.module('core')
    .directive('approve', ['$http', function () {
        return {
            templateUrl: 'modules/core/directives/approve.client.view.html',
            restrict: 'E',
            replace: true,
            scope: {
                href: '=href',
                resourceName: '@resourceName',
                resource: '=resource',
                service: '@service'
            },
            controller: "ApprovalsController"
        }
    }]).controller('ApprovalsController', function ($scope, $injector, $http, Groups, Users, Authentication, Config) {

        var APPROVAL_PREDICATE_URI = Config.getApprovalPredicateUri();

        $scope.selected = {};

        Groups.query({'owner': Authentication.user._id}, function (data) {
            var groups = [];

            angular.forEach(data, function (group) {
                groups.push(group);
            });

            $scope.groups = groups;
        });

        $scope.$watch('resource', function (resource) {
            if (resource) {
                $scope.approvals = $scope.findApprovals(resource);
            }
        });

        $scope.canUnapprove = function (group) {
            return _.find($scope.groups, function (g) {
                return g._id == group.entity.uri;
            });
        }

        $scope.unapprove = function (group) {
            $http.delete("/approvals/" + encodeURIComponent($scope.href) + "/" + group.entity.uri).then(function(response) {
                $scope.resource.property = _.reject($scope.resource.property, function (property) {
                    return property.predicate.uri == APPROVAL_PREDICATE_URI
                        &&
                        property.value[0].entity.uri == group.entity.uri;
                });

                $scope.approvals = $scope.findApprovals($scope.resource);
            });
        }

        $scope.allApproved = function () {
            return $scope.findApprovals().length === $scope.groups.length;
        }

        $scope.filterGroups = function (group) {
            var foundApprovals = $scope.findApprovals();

            return ! _.find(foundApprovals, function (approval) {
                return group._id == approval.entity.uri;
            });
        };

        $scope.findApprovals = function () {
            var approvals = [];

            if ($scope.resource && $scope.resource.property) {
                angular.forEach($scope.resource.property, function (property) {
                    if (property.predicate.uri === APPROVAL_PREDICATE_URI) {
                        approvals.push(property.value[0]);
                    }
                });
            }

            return approvals;
        }

        $scope.hasApproval = function(resource, approver) {
            if(!resource || !approver) {
                return false;
            }

            if ($scope.resource.property) {
                for (var i=0;i<resource.property.length;i++) {
                    var property = resource.property[i];
                    if (property.predicate.uri === APPROVAL_PREDICATE_URI &&
                        property.value[0].entity.uri === approver._id) {
                        return true;
                    }
                }
            }

            return false;
        }

        $scope.$watch('resource', function (resource) {
            if (resource) {
                $scope.resource = resource;
            }
        });

        $scope.approve = function (group) {

            var approval = {
                predicate: { uri: APPROVAL_PREDICATE_URI, "name": "approval"},
                value: [{entity: {
                    name: $scope.selected.approveAs.name,
                    namespace: "VSW",
                    uri: $scope.selected.approveAs._id,
                }}]
            }

            $http.post("/approvals/" + encodeURIComponent($scope.href), approval).then(function(response) {
                if (!$scope.resource.property) {
                    $scope.resource.property = [];
                }

                $scope.resource.property.push(
                    {
                        predicate: { uri: APPROVAL_PREDICATE_URI, "name": "approval"},
                        value: [{entity: {
                            name: $scope.selected.approveAs.name,
                            namespace: "VSW",
                            uri: $scope.selected.approveAs._id,
                        }}]
                    }
                )

                $scope.approvals = $scope.findApprovals($scope.resource);
                $scope.selected.approveAs = null;
            });
        };
    });