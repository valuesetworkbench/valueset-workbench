'use strict';

// Mapversions controller
angular.module('mapversions').controller('EditMapversionsController', ['$scope', 'dialogs', '$http', '$timeout', '$stateParams', '$location', 'Authentication', 'Mapversions', 'Valuesetdefinitions', 'Notification', 'HistoryChange', 'Utils', 'Change',
	function($scope, dialogs, $http, $timeout, $stateParams, $location, Authentication, Mapversions, Valuesetdefinitions, Notification, HistoryChange, Utils, Change)  {
        var changeHolder = Change.newChangeHolder();

        changeHolder.observe(function (dirty) {
            $timeout(function () {
                $scope.dirty = dirty;
            });
        });

        this.tab = 1;

        $scope.id = decodeURIComponent($stateParams.mapversionId);

        $scope.api = [
            {name: "Retrieve a Map", method: "GET", url: $scope.id, description: "Fetch the Map metadata (such as name and description)."},
            {name: "Retrieve Map Entries", method: "GET", url: $scope.id + '/entries?list=true', description: "Fetch the Concept -> Concept mappings."}
        ];

        $scope.open = $scope.isNew = !($scope.id && $scope.id != 'undefined');

        $scope.authentication = Authentication;

        $scope.expanded = false;
        $scope.showText = true;
        $scope.toggle = function() {
            $scope.expanded = !$scope.expanded;
            $scope.showText = !$scope.showText;
        };

        $scope.mapEntries = [];
        $scope.mapEntriesMap = {};

        function toUriEntityName(entity) {
            return {
                uri: entity.about,
                name: entity.name.name,
                namespace: entity.name.namespace,
                href: entity.href,
                designation: entity.knownEntityDescription[0].designation
            };
        }

        function loadFromEntities(q) {
            var query = ""
            if (q) {
                query = ('?q=' + q);
            }

            $scope.fromEntitiesLoading = true;
            var href = $scope.mapVersion.fromValueSetDefinition.valueSetDefinition.href;
            $http.get('proxy/' + encodeURIComponent(href + '/entities' + query)).
                then(function (data) {
                    delete $scope.fromEntitiesLoading;

                    $scope.tracker = {};
                    var fromEntities = [];
                    angular.forEach(data.data.EntityDirectory.entry, function (entity) {
                        fromEntities.push(toUriEntityName(entity));
                    });

                    $scope.filteredFromEntities = fromEntities

                    $scope.fromEntities = $scope.filteredFromEntities;
                    if ($scope.fromEntities) {
                        $scope.fromEntitiesMap = $scope.fromEntities.reduce(function (map, obj) {
                            map[obj.uri] = obj;
                            return map;
                        }, {});
                    }

                });
        }

        function loadToEntities(q) {
            var query = ""
            if (q) {
                query = ('?q=' + q);
            }

            $scope.toEntitiesLoading = true;
            var href = $scope.mapVersion.toValueSetDefinition.valueSetDefinition.href;
            $http.get('proxy/' + encodeURIComponent(href + '/entities' + query)).
                then(function (data) {
                    delete $scope.toEntitiesLoading;

                    $scope.tracker = {};
                    var toEntities = [];
                    angular.forEach(data.data.EntityDirectory.entry, function(entity) {
                        toEntities.push(toUriEntityName(entity));
                    });

                    $scope.filteredToEntities = toEntities

                    $scope.toEntities = $scope.filteredToEntities;
                    if ($scope.toEntities) {
                        $scope.toEntitiesMap = $scope.toEntities.reduce(function (map, obj) {
                            map[obj.uri] = obj;
                            return map;
                        }, {});
                    }
                });
        }

        $scope.$watch('fromQuery', function (q) {
            if ($scope.mapVersion) {
                loadFromEntities(q);
            }
        });

        $scope.$watch('toQuery', function (q) {
            if ($scope.mapVersion) {
                loadToEntities(q);
            }
        });

        $scope.hasChanges = function () {
            return $scope.dirty || $scope.mapVersionForm.$dirty;
        }

        $scope.cancel = function () {
            var dlg = dialogs.confirm("Cancel?", "Are you sure you want to cancel your pending changes?", { size: "sm" });
            dlg.result.then(function(btn){
                changeHolder.reset();
                $scope.mapVersionForm.$setPristine();
                $scope.findOne();
            },function(btn){
                //
            });
        };

        $scope.delete = function () {
            var dlg = dialogs.confirm("Delete?", "Are you sure you want to delete this Map?", { size: "sm" });
            dlg.result.then(function(btn){
                Mapversions.deleteMapVersion($scope.id, function () {
                    $location.path('/mapversions');
                })
            },function(btn){
                //
            });
        }

        $scope.processChanges = function (changeHolder) {
            var promises = [];

            angular.forEach(changeHolder.getChanges(), function (change) {
                var mapEntry = change.resource;

                if (change.isDelete) {
                    if (mapEntry.href) {
                        Mapversions.deleteMapEntry(mapEntry.href, function () {
                            Notification.error('MapEntry Deleted');
                            resolve();
                        });
                    }
                } else {
                    if (!mapEntry.href) {
                        promises.push(new Promise(function (resolve, reject) {
                            Mapversions.createMapEntry($scope.resourceRoot, {MapEntry: mapEntry.entry}, function (response) {
                                var newMapEntry = response.data.MapEntryMsg;
                                newMapEntry.href = newMapEntry.heading.resourceRoot + newMapEntry.heading.resourceURI;
                                delete newMapEntry.heading;

                                for (var i = 0; i < $scope.mapEntries.length; i++) {
                                    if (newMapEntry.entry.mapFrom.uri === $scope.mapEntries[i].entry.mapFrom.uri) {
                                        $scope.mapEntries[i] = newMapEntry;
                                        break;
                                    }
                                }
                                $scope.buildMapEntriesMap();
                                resolve(1);
                            })
                        }));
                    } else {
                        delete mapEntry.entry.changeDescription;
                        promises.push(new Promise(function (resolve, reject) {
                            Mapversions.saveMapEntry(mapEntry.href, {MapEntry: mapEntry.entry}, function () {
                                resolve(1);
                            })
                        }));
                    }
                }
            });

            Promise.all(promises).then(function (values) {
                var saved = values.length;
                Notification.success(saved + " MapEntr" + (saved > 1 ? "ies" : "y") + " Saved");
            });

            changeHolder.reset();

            $scope.mapVersionForm.$setPristine();
        }


        $scope.saveMapVersion = function() {
            $scope.mapVersion.changeDescription = {
                changeType: "UPDATE",
                containingChangeSet: "foo"
            };
            Mapversions.save($scope.id, {MapVersion: $scope.mapVersion}, function (response) {
                Notification.success('Map Version Saved');

                $scope.permissions = response.data;

                if ($scope.permissions.indexOf("Edit") == -1) {
                    $location.path("/mapversions/" + $stateParams.mapversionid)
                }
            });

            $scope.processChanges(changeHolder);

            HistoryChange.onHistoryChange();
        };

        $scope.saveMapVersionAs = function () {
            if ($scope.mapVersion.about.startsWith(config.resourceUriBase)) {
                var dlg = dialogs.create('/modules/core/views/saveas-modal.html', 'mapversion-saveAsCtrl', {});
                dlg.result.then(function (data) {
                    var version = data.version,
                        description = data.description;

                    var newMapVersion = JSON.parse(JSON.stringify($scope.mapVersion));
                    newMapVersion.officialResourceVersionId = version;
                    newMapVersion.resourceSynopsis = {value: description};

                    var about = newMapVersion.about;
                    var name = newMapVersion.mapVersionName;

                    newMapVersion.about = about.substr(0, about.lastIndexOf('/')) + '/' + version;
                    newMapVersion.mapVersionName = name.substr(0, name.lastIndexOf('-')) + '-' + version;

                    Mapversions.clone($scope.id, {MapVersion: newMapVersion}, function (response) {
                        Notification.success('New Map Version Created');

                        var location = encodeURIComponent(Utils.removeURLParameter(response.headers('location'), 'changesetcontext'));

                        $location.path('/mapversions/' + location + '/edit');
                    });

                });

            }

        };

        $scope.saveMapEntry = function(mapEntry) {
            changeHolder.addChange(mapEntry.entry.mapFrom.uri, mapEntry);
        };

        function adjustEntryOrder(mapTargetArray) {
            if(mapTargetArray) {
                for (var i = 0; i < mapTargetArray.length; i++) {
                    mapTargetArray[i].entryOrder = i + 1;
                }
            }
        }

        $scope.removeMapTarget = function(mapEntry, mapSetIindex, mapTargetIndex) {
            mapEntry.entry.mapSet[mapSetIindex].mapTarget.splice(mapTargetIndex, 1);

            adjustEntryOrder(mapEntry.entry.mapSet[mapSetIindex].mapTarget);
        };

        $scope.deleteMapEntry = function(mapEntry) {
            changeHolder.addChange(mapEntry.entry.mapFrom.uri, mapEntry, true);

            $scope.mapEntries = _.reject($scope.mapEntries, function(el) {
                return el.entry.mapFrom.uri === mapEntry.entry.mapFrom.uri;
            });

            $scope.buildMapEntriesMap();
        };

        $scope.buildMapEntriesMap = function() {
            if($scope.mapEntries) {
                $scope.mapEntriesMap = $scope.mapEntries.reduce(function (map, obj) {
                    map[obj.entry.mapFrom.uri] = obj;
                    return map;
                }, {});
            }
        };

        $scope.export = function() {
            var data = "";

            angular.forEach($scope.mapEntries, function(mapEntry) {
                var line = "";
                var mapFrom = mapEntry.entry.mapFrom.name;

                line += (mapFrom);

                if(mapEntry.entry.mapSet[0].mapTarget) {
                    angular.forEach(mapEntry.entry.mapSet[0].mapTarget, function(mapTarget) {
                        var mapTo = mapTarget.mapTo.name;

                        line += (',' + mapTo);
                    });
                }

                data += line;
                data += '\n';
            });

            var link = document.createElement('a');
            var csvData = 'data:attachment/csv;charset=utf-8,' + encodeURIComponent(data);
            link.setAttribute('href', csvData);
            link.setAttribute('download', "test.csv");
            link.click();
        };

        $scope.automap = function() {
            $http.get("/automap?mapversion=" + encodeURIComponent($scope.id) + "&distance=0").then(
                function(response) {
                    $scope.mapEntries = response.data.MapEntryList.entry || [];
                    $scope.buildMapEntriesMap();
                    $scope.renderConnections();
                    $scope.dirty = true;
                }).catch(function(response) {
                    Notification.error({title: 'Error Auto Mapping', message: response.data.message});
                });
        };

        $scope.findOne = function() {
            Mapversions.get($scope.id, function (response) {
                var mapVersion = response.data;
                $scope.resourceRoot = mapVersion.MapVersionMsg.heading.resourceRoot;
                $scope.mapVersion = mapVersion.MapVersionMsg.mapVersion;
                $scope.permissions = mapVersion.permissions;
                $scope.loading = false;

                var entriesHref = $scope.id + "/entries?list=true";
                Mapversions.getEntries(encodeURIComponent(entriesHref), function (response) {
                    var mapEntries = response.data.MapEntryList.entry || [];

                    $scope.mapEntries = mapEntries;
                    $scope.buildMapEntriesMap();
                    $scope.renderConnections();
                    loadFromEntities();
                    loadToEntities();
                });
            });
        };

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

        $(window).resize(function(){
            instance.repaintEverything();
        });

        function getUriFromId(id) {
            var str = decodeURIComponent(id);

            var regex = /(from|to)-(.*)/g;
            var match = regex.exec(str);

            return match[2];
        }

        function removeTarget(sourceId, targetId) {
            var mapEntry = $scope.mapEntriesMap[sourceId];

            var idx = -1;
            angular.forEach(mapEntry.entry.mapSet[0].mapTarget, function(target, index) {
                var targetUri = target.mapTo.uri;
                if(targetUri == targetId) {
                    idx = index;
                }
            });

            $scope.removeMapTarget(mapEntry, 0, idx);

            if(mapEntry.entry.mapSet[0].mapTarget.length == 0) {
                $scope.deleteMapEntry(mapEntry);
            } else {
                $scope.saveMapEntry(mapEntry);
            }
        }

        instance.bind('beforeDrop', function(info){ // Before new connection is created
            var sourceId = getUriFromId(info.sourceId);
            var targetId = getUriFromId(info.targetId);

            var source = $scope.mapEntriesMap[sourceId];

            if(! source) {
                return true;
            }

            var ok = true;
            angular.forEach(source.entry.mapSet[0].mapTarget, function(target) {
                var targetUri = target.mapTo.uri;
                if(targetUri == targetId) {
                    ok = false;
                }
            });

            return ok;
        });

        instance.bind("connectionDetached", function (info, originalEvent) {
            if (originalEvent) {
                var sourceId = getUriFromId(info.sourceId);
                var targetId = getUriFromId(info.targetId);

                removeTarget(sourceId, targetId);
            }
        });

        instance.bind("connectionMoved", function (info, originalEvent) {
            if (originalEvent) {
                var originalSourceId = getUriFromId(info.originalSourceId);

                var originalTargetId = getUriFromId(info.originalTargetId);

                removeTarget(originalSourceId, originalTargetId);
            }
        });

        instance.bind("connection", function (info, originalEvent) {
            if(originalEvent) {
                var sourceId = getUriFromId(info.sourceId);
                var targetId = getUriFromId(info.targetId);

                var foundEntry = $scope.mapEntriesMap[sourceId];

                if(foundEntry) {
                    foundEntry.entry.mapSet[0].mapTarget.push({mapTo: $scope.toEntitiesMap[targetId]});
                } else {
                    var entry = {
                        processingRule: "ALL_MATCHES",
                        assertedBy: {
                            map: $scope.mapVersion.versionOf,
                            mapVersion: {
                                content: $scope.mapVersion.mapVersionName,
                                map: $scope.mapVersion.versionOf
                            }
                        },
                        mapFrom: $scope.fromEntitiesMap[sourceId],
                        mapSet: [{processingRule: "ALL_MATCHES", entryOrder: 1, mapTarget: [{entryOrder: 1, mapTo: $scope.toEntitiesMap[targetId]}]}]
                    };

                    foundEntry = {entry: entry};
                    $scope.mapEntries.push(foundEntry);
                    $scope.buildMapEntriesMap();
                }

                $scope.saveMapEntry(foundEntry);
            }
        });

        var isRendered = false;

        $scope.renderConnections = function(rendered) {

            $timeout(function () {
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

                // suspend drawing and initialise.
                instance.batch(function () {

                    $(".source:not(.jsplumb-droppable)").each(function() {
                        instance.makeSource(this, {
                            filter: "a",
                            //detachable: false,
                            filterExclude: true,
                            maxConnections: -1,
                            endpoint: ["Dot", {radius: 7, cssClass: "small-blue"}],
                            anchor: 'Right'
                        });
                    });

                    $(".target:not(.jsplumb-droppable)").each(function() {
                        instance.makeTarget(this, {
                            dropOptions: {hoverClass: "hover"},
                            //detachable: true,
                            anchor: ["Continuous", {faces:["left"]}],
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

                    if ($scope.mapEntries && $scope.filteredFromEntitiesMap) {
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
                    }
                });

                instance.repaintEverything();
            }, 0);
        };

        $scope.$watchCollection("filteredFromEntities", function() {
            if($scope.filteredFromEntities) {
                $timeout(function() {
                    $scope.renderConnections();
                },0);

            }
        });

        $scope.$watchCollection("filteredToEntities", function() {
            if($scope.filteredToEntities) {
                $timeout(function() {
                    $scope.renderConnections();
                },0);
            }
        });

        $scope.import = function() {
            var openFn = function() {

                dialogs.create('/modules/mapversions/views/import-modal.html', 'mapversion-importCtrl',
                    {
                        mapVersion: $scope.mapVersion,
                        fromEntities: $scope.fromEntities,
                        toEntities: $scope.toEntities,
                        mapEntries: $scope.mapEntries,
                        mapEntriesMap: $scope.mapEntriesMap,
                        done: function(imported) {
                            $scope.renderConnections();
                            angular.forEach(imported, function(mapEntry) {
                               $scope.saveMapEntry(mapEntry)
                            });
                        }
                    });
            };
            openFn();
        };

    }
]).controller('mapversion-searchCtrl',function($log,$http,$timeout,$scope,$modalInstance,data){
    $scope.opened = false;
    $scope.q = '';

    $scope.updateQ = function(q){
        $scope.q = q;
        $scope.searchTextChange($scope.q, data.entitiesHref);
    };

    $scope.addEntityFromSearch = function(entity) {
        var holder = data.holder;

        holder.uri = entity.uri;
        holder.name = entity.name;
        holder.namespace = entity.namespace;
        holder.designation = entity.designation;

        $scope.done();
    };

    $scope.searchTextChange = function(q, href) {
        if(! href || ! q) {
            return;
        }

        $scope.searching = true;
        $scope.searchResults = [];
        $http.get('proxy/' + encodeURIComponent(href + '/resolution' + '?q=' + q)).
            then(function(data) {
                delete $scope.searching;

                $scope.tracker = {};
                $scope.searchResults = data.body;
            })
    };

    $scope.open = function($event){
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    }; // end open

    $scope.done = function(){
        $modalInstance.close($scope.data);
    }; // end done

}).controller('mapversion-importCtrl',function($log,$http,$timeout,$scope,$modalInstance,data){
    $scope.pasted = "";

    var mapVersion = data.mapVersion;

    var fromEntities = data.fromEntities;
    var toEntities = data.toEntities;

    var mapEntries = data.mapEntries;
    var mapEntriesMap = data.mapEntriesMap;

    $scope.headers = ["Source URI", "Source Code", "Target URI", "Target Code"];

    $scope.parse = function(text) {
        var x = text.split('\n');
        for (var i=0; i<x.length; i++) {
            var y = x[i].split('\t');
            x[i] = y;
        }

        $scope.parsed = x;
    };

    $scope.generate = function() {
        var indexes = {
            "Source URI": -1,
            "Source Code": -1,
            "Target URI": -1,
            "Target Code": -1
        };

        $('.parsed-data-table-header-row').each(function(e) {
            var idx = $(this).attr('data-idx');
            $(this).find(".header-label").each(function() {
                var label = $(this).text();
                indexes[label] = idx;
            })
        });

        var getValue = function(index, line) {
            if(index != -1) {
                return line[index];
            } else {
                return null;
            }
        };

        var imported = {};

        angular.forEach($scope.parsed, function(line) {
            var sourceCode = getValue(indexes["Source Code"], line);
            var targetCode = getValue(indexes["Target Code"], line);

            var sourceEntity;
            var targetEntity;
            angular.forEach(fromEntities, function(entity) {
                if(entity.name === sourceCode) {
                    sourceEntity = entity;
                }
            });

            if(! sourceEntity) {
                return;
            }

            angular.forEach(toEntities, function(entity) {
                if(entity.name === targetCode) {
                    targetEntity = entity;
                }
            });

            var foundEntry = mapEntriesMap[sourceEntity.uri];

            function adjustEntryOrder(mapTargetArray) {
                if(mapTargetArray) {
                    for (var i = 0; i < mapTargetArray.length; i++) {
                        mapTargetArray[i].entryOrder = i + 1;
                    }
                }
            }

            if(foundEntry) {
                foundEntry.entry.mapSet[0].mapTarget.push({mapTo: targetEntity});
                adjustEntryOrder(foundEntry.entry.mapSet[0].mapTarget);
            } else {
                var entry = {
                    processingRule: "ALL_MATCHES",
                    assertedBy: {
                        map: mapVersion.versionOf,
                        mapVersion: {
                            content: mapVersion.mapVersionName,
                            map: mapVersion.versionOf
                        }
                    },
                    mapFrom: sourceEntity,
                    mapSet: [{processingRule: "ALL_MATCHES", entryOrder: 1, mapTarget: [{entryOrder: 1, mapTo: targetEntity}]}]
                };

                foundEntry = {entry: entry};
                mapEntriesMap[sourceEntity.uri] = foundEntry;
                mapEntries.push(foundEntry);
            }

            imported[sourceEntity.uri] = foundEntry;
        });

        data.done(imported);

        $scope.done();
    };

    ///
    $scope.done = function(){
        $modalInstance.close($scope);
    }; // end done

}).controller('mapversion-saveAsCtrl', function ($scope, $modalInstance, data) {

    $scope.cancel = function () {
        $modalInstance.dismiss('canceled');
    }; // end cancel

    $scope.save = function () {
        $modalInstance.close({version: $scope.version, description: $scope.description});
    }; // end save

});