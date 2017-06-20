'use strict';

// Mapversions controller
angular.module('mapversions').controller('ViewMapversionsController', ['$scope', '$timeout', '$http', '$stateParams', '$location', 'Authentication', 'Mapversions', 'Approvals',
    function ($scope, $timeout, $http, $stateParams, $location, Authentication, Mapversions, Approvals) {
        $scope.id = decodeURIComponent($stateParams.mapversionId);

        $scope.authentication = Authentication;

        $scope.hasApprovals = function () {
            return Approvals.hasApprovals($scope.mapVersion);
        }

        $scope.findOne = function () {
            $scope.loading = true;
            Mapversions.get($scope.id, function (response) {
                var mapVersion = response.data;
                $scope.resourceRoot = mapVersion.MapVersionMsg.heading.resourceRoot;
                $scope.mapVersion = mapVersion.MapVersionMsg.mapVersion;
                $scope.loading = false;
                $scope.permissions = mapVersion.permissions;

                $http.get('/proxy/' + encodeURIComponent($scope.mapVersion.fromValueSetDefinition.valueSetDefinition.href)).
                    then(function (response) {
                        $scope.fromValueSetDefinition = response.data.ValueSetDefinitionMsg.valueSetDefinition;
                    });

                $http.get('/proxy/' + encodeURIComponent($scope.mapVersion.toValueSetDefinition.valueSetDefinition.href)).
                    then(function (response) {
                        $scope.toValueSetDefinition = response.data.ValueSetDefinitionMsg.valueSetDefinition;
                    });
                
                var entriesHref = $scope.id + "/entries?list=true";
                Mapversions.getEntries(encodeURIComponent(entriesHref), function (response) {
                    delete $scope.loading;

                    var mapEntries = response.data.MapEntryList.entry || [];

                    var fromEntities = [];
                    var toEntities = {};

                    $scope.mapEntries = mapEntries;

                    angular.forEach($scope.mapEntries, function (mapEntry) {
                        fromEntities.push(mapEntry.entry.mapFrom);
                        angular.forEach(mapEntry.entry.mapSet[0].mapTarget, function (entry) {
                            toEntities[entry.mapTo.uri] = entry.mapTo;
                        });
                    });

                    $scope.fromEntities = fromEntities;
                    $scope.toEntities = _.values(toEntities);
                });
            });
        };

        $scope.$watchCollection("filteredFromEntities", function() {
            if($scope.filteredFromEntities) {
                $timeout(function() {
                    $scope.renderConnections(true);
                },0);
            }
        });

        $scope.$watchCollection("filteredToEntities", function() {
            if($scope.filteredToEntities) {
                $timeout(function() {
                    $scope.renderConnections(true);
                },0);
            }
        });

        var instance = jsPlumb.getInstance({
            // drag options
            DragOptions: {cursor: "pointer", zIndex: 2000},
            // default to a gradient stroke from blue to green.
            PaintStyle: {
                strokeStyle: "#558822",
                lineWidth: 5
            },
            Container: "canvas"
        });

        instance.importDefaults({
            ConnectionsDetachable: false
        });

        $(window).resize(function () {
            instance.repaintEverything();
        });

        var isRendered = false;

        $scope.renderConnections = function(rendered) {
            if(rendered) {
                isRendered = true;
            }
            if(! isRendered) {
                return;
            }

            instance.deleteEveryEndpoint();

            instance.Defaults.Overlays = [
                [ "Arrow", {
                    location: 0.5,
                    id:"arrow",
                    length:14,
                    foldback:0.8
                } ]
            ];

            $timeout(function () {

                // suspend drawing and initialise.
                instance.batch(function () {

                    $(".source").each(function () {
                        instance.makeSource(this, {
                            filter: "a",
                            filterExclude: true,
                            endpoint: ["Dot", {radius: 7, cssClass: "small-blue"}],
                            anchor: "Right"
                        });
                    });

                    $(".target").each(function () {
                        instance.makeTarget(this, {
                            dropOptions: {hoverClass: "hover"},
                            anchor: "Left",
                            endpoint: ["Dot", {radius: 11, cssClass: "large-green"}]
                        });
                    });

                    if ($scope.filteredFromEntities) {
                        $scope.filteredFromEntitiesMap = $scope.filteredFromEntities.reduce(function (map, obj) {
                            map[obj.uri] = obj;
                            return map;
                        }, {});
                    }

                    if ($scope.filteredToEntities) {
                        $scope.filteredToEntitiesMap = $scope.filteredToEntities.reduce(function (map, obj) {
                            map[obj.uri] = obj;
                            return map;
                        }, {});
                    }

                    if ($scope.mapEntries) {
                        angular.forEach($scope.mapEntries, function (mapEntry) {
                            if (mapEntry.entry.mapFrom &&
                                mapEntry.entry.mapSet &&
                                mapEntry.entry.mapSet[0].mapTarget &&
                                mapEntry.entry.mapSet[0].mapTarget[0].mapTo) {
                                var sourceUri = mapEntry.entry.mapFrom.uri;

                                angular.forEach(mapEntry.entry.mapSet[0].mapTarget, function (target) {
                                    var targetUri = target.mapTo.uri;

                                    var label = "";
                                    if (target.correlation) {
                                        label = target.correlation.content;
                                    }

                                    if ($scope.filteredFromEntitiesMap[sourceUri] && $scope.filteredToEntitiesMap[targetUri]) {
                                        instance.connect({
                                            source: 'from-' + encodeURIComponent(sourceUri),
                                            target: 'to-' + encodeURIComponent(targetUri)
                                            // Maybe add the correlation as a label???
                                            //overlays:[
                                            //    [ "Label", {label: label}]
                                            //]
                                        });
                                    }

                                });

                            }
                        });

                        $(".source").each(function () {
                            instance.setSourceEnabled(this, false);
                        });
                    }
                });
            }, 0);
        };

    }]);
