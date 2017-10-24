'use strict';

// Codesystemversions controller
angular.module('codesystemversions').controller('EditCodesystemversionsController', ['$scope', 'dialogs', '$http', '$timeout', '$stateParams', '$location', 'Authentication', 'Codesystemversions', 'Valuesetdefinitions', 'Notification', 'HistoryChange', 'Utils',
	function($scope, dialogs, $http, $timeout, $stateParams, $location, Authentication, Codesystemversions, Valuesetdefinitions, Notification, HistoryChange, Utils)  {
        this.tab = 1;

        $scope.id = decodeURIComponent($stateParams.codesystemversionId);

        $scope.open = $scope.isNew = !($scope.id && $scope.id != 'undefined');

        $scope.authentication = Authentication;

        $scope.expanded = false;
        $scope.showText = true;
        $scope.toggle = function() {
            $scope.expanded = !$scope.expanded;
            $scope.showText = !$scope.showText;
        };

        $scope.switchVersions = function (entries) {
            var href = $scope.id;
            var versionsHref = href.substr(0, href.lastIndexOf('/')) + 's';

            var openFn = function () {
                dialogs.create('/modules/codesystemversions/views/versions-modal.html', 'codesystemversion-versionsCtrl',
                    {
                        versionsHref: versionsHref,
                        currentCodesystemversion: $scope.codesystemversion
                    });
            };
            openFn();
        };

        $scope.saveCodesystemversion = function () {
            Codesystemversions.save($scope.id, {CodeSystemVersionCatalogEntry: $scope.codesystemversion}, function (response) {
                Notification.success('Code System Saved');
            });
        };

        $scope.findOne = function() {
            Codesystemversions.get($scope.id, function (response) {
                var codeSystemVersion = response.data;
                $scope.resourceRoot = codeSystemVersion.CodeSystemVersionCatalogEntryMsg.heading.resourceRoot;
                $scope.codesystemversion = codeSystemVersion.CodeSystemVersionCatalogEntryMsg.codeSystemVersionCatalogEntry;
                $scope.loading = false;

                var entitiesHref = $scope.id + "/entities";
                Codesystemversions.getEntities(encodeURIComponent(entitiesHref), function (response) {
                    $scope.entities = response.data.EntityDirectory.entry;
                });
            });

        };

        $scope.editEntity = function (entity) {
                dialogs.create('/modules/codesystemversions/views/edit-entity-modal.html', 'codesystemversion-editEntityCtrl',
                    {
                        entity: entity
                    });
        };

        var filterTextTimeout;
        $scope.$watch('query', function () {
            if ($scope.query !== undefined) {
                if (filterTextTimeout) {
                    $timeout.cancel(filterTextTimeout);
                }

                filterTextTimeout = $timeout(function () {
                    $scope.searching = true;
                    $scope.searchResults = [];

                    var query = $scope.query !== '' ? ('?q=' + $scope.query) : '';
                    $http.get('/proxy/' + encodeURIComponent($scope.id + "/entities" + query)).
                        then(function (result) {
                            delete $scope.searching;

                            $scope.entities = result.data.EntityDirectory.entry;
                        })
                }, 250); // delay 250 ms

            }
        });

    }
]).controller('codesystemversion-searchCtrl',function($log,$http,$timeout,$scope,$modalInstance,data){
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

    var filterTextTimeout;
    $scope.searchTextChange = function(q, href) {
        if(! href || ! q) {
            return;
        }

        if(filterTextTimeout) {
            $timeout.cancel(filterTextTimeout);
        }

        filterTextTimeout = $timeout(function() {
            $scope.searching = true;
            $scope.searchResults = [];
            $http.get('proxy/' + encodeURIComponent(href + '/resolution' + '?q=' + q)).
                then(function(data) {
                    delete $scope.searching;

                    $scope.tracker = {};
                    $scope.searchResults = data.body;
                })
        }, 1000); // delay 250 ms

    };

    $scope.open = function($event){
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    }; // end open

    $scope.done = function(){
        $modalInstance.close($scope.data);
    }; // end done

}).controller('codesystemversion-importCtrl',function($log,$http,$timeout,$scope,$modalInstance,data){
    $scope.pasted = "";

    var codesystemversion = data.codesystemversion;

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

            if(foundEntry) {
                foundEntry.entry.mapSet[0].mapTarget.push({mapTo: targetEntity});
            } else {
                var entry = {
                    processingRule: "ALL_MATCHES",
                    assertedBy: {
                        map: codesystemversion.versionOf,
                        codesystemversion: {
                            content: codesystemversion.codesystemversionName,
                            map: codesystemversion.versionOf
                        }
                    },
                    mapFrom: sourceEntity,
                    mapSet: [{processingRule: "ALL_MATCHES", entryOrder: 1, mapTarget: [{entryOrder: 1, mapTo: targetEntity}]}]
                };

                foundEntry = {entry: entry};
                mapEntries.push(foundEntry);
            }

        });

        data.done();

        $scope.done();
    };

    ///
    $scope.done = function(){
        $modalInstance.close($scope);
    }; // end done

}).controller('codesystemversion-versionsCtrl', function ($log, $http, $timeout, $scope, $modalInstance, dialogs, $location, data) {

    $scope.currentCodesystemversion = data.currentCodesystemversion;

    $http.get("/proxy/" + encodeURIComponent(data.versionsHref)).then(function (response) {
        $scope.codesystemversions = response.data.CodesystemversionDirectory;
    });

    $scope.switch = function (version) {
        $location.path('/codesystemversions/' + encodeURIComponent(version.href) + '/edit');
        $scope.done();
    };

    ///
    $scope.done = function () {
        $modalInstance.close($scope);
    }; // end done

}).controller('codesystemversion-saveAsCtrl', function ($scope, $modalInstance, data) {

    $scope.cancel = function () {
        $modalInstance.dismiss('canceled');
    }; // end cancel

    $scope.save = function () {
        $modalInstance.close({version: $scope.version, description: $scope.description});
    }; // end save

}).controller('codesystemversion-editEntityCtrl', function ($scope, $http, $modalInstance, data) {

    $http.get("/proxy/" + encodeURIComponent(data.entity.href)).then(function (response) {
        $scope.entity = response.data.EntityDescriptionMsg.entityDescription.namedEntity;

        if ($scope.entity &&
            $scope.entity.changeableElementGroup &&
            $scope.entity.changeableElementGroup.changeDescription &&
            $scope.entity.changeableElementGroup.changeDescription.changeDate) {
            delete $scope.entity.changeableElementGroup.changeDescription.changeDate
        }

        if(! $scope.entity.designation) {
            $scope.entity.designation = [];
        }

        if(! $scope.entity.property) {
            $scope.entity.property = [];
        }

        var entityUrl = data.entity.href.substr("/codesystem/" + 1);

        $scope.api = [
            {name: "Retrieve an Entity (CTS2 format)", method: "GET", type: "cts2", url: entityUrl, description: "Fetch the entity in CTS2 format."}
        ];

    });

    $scope.cancel = function () {
        $modalInstance.dismiss('canceled');
    }; // end cancel

    $scope.addDesignation = function (designations) {
        designations.push({
            value: "",
            designationRole: "ALTERNATIVE"
        })
    };

    $scope.addProperty = function (properties) {
        properties.push({
            predicate: "",
            value: [{
                literal: {}
            }]
        })
    };

    $scope.updatePredicateUri = function (predicate, name) {
        predicate.uri = name;
    }

    $scope.removeDesignation = function (designations, index) {
        designations.splice(index, 1);
    };

    $scope.removeProperty = function (properties, index) {
        properties.splice(index, 1);
    };

    $scope.save = function () {
        $scope.entity.changeableElementGroup = {
            changeDescription: {
                changeType: "UPDATE",
                containingChangeSet: "foo"
            }
        }

        $http.put("/proxy/" + encodeURIComponent(data.entity.href + "?changesetcontext=foo"), {EntityDescription: {namedEntity: $scope.entity}}).then(function (response) {
            $modalInstance.close({version: $scope.version, description: $scope.description});
        });

    }; // end save

});
