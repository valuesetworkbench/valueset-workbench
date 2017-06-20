'use strict';

// Valuesets controller
angular.module('valuesetdefinitions').controller('EditValuesetdefinitionsController', ['$scope', '$http', '$document', '$stateParams', '$location', 'dialogs', 'Authentication', 'Valuesetdefinitions', 'Mapversions', 'Notification', '$timeout', 'Utils',
    function ($scope, $http, $document, $stateParams, $location, dialogs, Authentication, Valuesetdefinitions, Mapversions, Notification, $timeout, Utils) {

        $scope.id = decodeURIComponent($stateParams.valuesetdefinitionId);

        $scope.authentication = Authentication;

        $scope.warnings = [];

        $scope.loadingCodeSystemVersions = true;
        $http.get('/codesystemversions?maxtoreturn=-1').
            then(function (response) {
                $scope.codeSystemVersions = response.data.CodeSystemVersionCatalogEntryDirectory.entry;
                $scope.loadingCodeSystemVersions = false;

                $scope.csvSummaryMap = {};
                angular.forEach($scope.codeSystemVersions, function (csv) {
                    $scope.csvSummaryMap[csv.about] = csv;
                });

                var csvReferences = [];
                angular.forEach($scope.codeSystemVersions, function (csv) {
                    csvReferences.push({
                        version: {
                            content: csv.codeSystemVersionName,
                            uri: csv.about,
                            href: csv.href
                        },
                        codeSystem: csv.versionOf
                    });
                });

                $scope.csvReferences = csvReferences;

                $scope.findOne();
            });

        $scope.completeCodeSystemEntries = {};

        $scope.completeCodeSystemVersionInit = function (entry) {
            var summary = $scope.csvSummaryMap[entry.codeSystemVersion.version.uri]
            entry.summary = summary;
        }

        $scope.showWarnings = function () {
            dialogs.create('/modules/valuesetdefinitions/views/warnings-modal.html', 'vsd-warningsCtrl',
                {
                    warnings: $scope.warnings
                });
        }

        $scope.calculateWarnings = function (forceRefresh) {
            if ($scope.valuesetdefinition) {
                $http.get('similarity?uri=' + encodeURIComponent($scope.valuesetdefinition.about) + "&forceRefresh=" + (forceRefresh ? 'true' : 'false')).
                    then(function (data) {
                        var newWarnings = [];
                        var similarity = data.data;

                        if (similarity.similarity.length > 0) {
                            for (var i = 0; i < similarity.similarity.length; i++) {
                                newWarnings.push(
                                    {
                                        type: 'similarity',
                                        score: similarity.similarity[i],
                                        similarTo: similarity.indexMap[i]
                                    });
                            }
                        }

                        $scope.warnings = newWarnings;
                    });
            }
        };

        $scope.onComplete = function () {
            window.location.href = '#!/mapversions?tour=overall';
        };

        // Find existing Valueset
        $scope.findOne = function () {
            $scope.loading = true;
            Valuesetdefinitions.get($scope.id, function (response) {
                $scope.valuesetdefinition = response.data.ValueSetDefinitionMsg.valueSetDefinition;
                $scope.loading = false;

                $scope.permissions = response.data.permissions;

                if ($scope.valuesetdefinition.keyword) {
                    $scope.tags = $scope.valuesetdefinition.keyword.map(function (input) {
                        return {text: input};
                    });
                } else {
                    $scope.tags = [];
                }

                $scope.calculateWarnings();
            });
        };

        $scope.hasChanges = function () {
            return $scope.dirty || $scope.valueSetDefinitionForm.$dirty;
        }

        $scope.setDirty = function () {
            $scope.dirty = true;
        }

        $scope.cancel = function () {
            var dlg = dialogs.confirm("Cancel?", "Are you sure you want to cancel your pending changes?", { size: "sm" });
            dlg.result.then(function(btn){
                $scope.valueSetDefinitionForm.$setPristine();
                $scope.dirty = false;
                $scope.findOne();
            },function(btn){
                //
            });
        };

        $scope.delete = function () {
            var dlg = dialogs.confirm("Delete?", "Are you sure you want to delete this Value Set?", { size: "sm" });
            dlg.result.then(function(btn){
                Valuesetdefinitions.delete($scope.id, function (response) {
                    $location.path('/valuesetdefinitions');
                    Notification.success('ValueSetDefinition Deleted');
                });
            },function(btn){
                //
            });
        }

        function clearNewMarker(entries) {
            angular.forEach(entries, function(entry) {
                delete entry.new;

                if (entry.entity) {
                    angular.forEach(entry.entity.referencedEntity, function (entity) {
                        delete entity.new;
                    })
                }
            });
        }

        $scope.save = function () {
            $scope.valuesetdefinition.changeDescription = {
                changeType: "UPDATE",
                containingChangeSet: "foo"
            };
            Valuesetdefinitions.save($scope.id, {ValueSetDefinition: $scope.valuesetdefinition}, function (response) {
                Notification.success('ValueSetDefinition Saved');

                $scope.calculateWarnings(true);

                $scope.valueSetDefinitionForm.$setPristine();
                $scope.dirty = false;

                $scope.permissions = response.data;

                if ($scope.permissions.indexOf("Edit") == -1) {
                    $location.path("/valuesetdefinitions/" + $stateParams.valuesetdefinitionId)
                }

                clearNewMarker($scope.valuesetdefinition.entry);
            });
        };

        $scope.saveAs = function () {
            if ($scope.valuesetdefinition.about.startsWith(config.resourceUriBase)) {
                var dlg = dialogs.create('/modules/core/views/saveas-modal.html', 'vsd-saveAsCtrl', {});
                dlg.result.then(function (data) {
                    var version = data.version,
                        description = data.description;

                    $scope.valuesetdefinition.officialResourceVersionId = version;

                    if (description) {
                        $scope.valuesetdefinition.resourceSynopsis = {value: description};
                    }

                    var about = $scope.valuesetdefinition.about;
                    var newAbout = about.substr(0, about.lastIndexOf('/')) + '/' + version;

                    angular.forEach($scope.valuesetdefinition.entry, function (entry) {
                        if (entry.entity) {
                            angular.forEach(entry.entity.referencedEntity, function (entity) {
                                if ($scope.isCustomCode(entity)) {
                                    entity.uri = entity.uri.replace(about, newAbout);
                                }
                            })
                        }
                    });

                    $scope.valuesetdefinition.about = newAbout;

                    Valuesetdefinitions.new({ValueSetDefinition: $scope.valuesetdefinition}, function (response) {
                        Notification.success('New ValueSetDefinition Created');

                        var location = encodeURIComponent(Utils.removeURLParameter(response.data.headers.location, 'changesetcontext'));

                        $location.path('/valuesetdefinitions/' + location + '/edit');
                    });

                });

            }

        };

        $scope.$watchCollection("tags", function () {
            if ($scope.tags) {
                $scope.valuesetdefinition.keyword = $scope.tags.map(function (input) {
                    return input.text;
                });
            }
        });

        $scope.searchOne = function (holder) {
            var addOneFunction = function (entity, codeSystemVersion) {
                var associatedEntity = {
                    uri: entity.about,
                    name: entity.name.name,
                    namespace: entity.name.namespace,
                    designation: entity.knownEntityDescription[0].designation,
                    href: entity.href
                };

                holder.referencedEntity = associatedEntity;
                holder.codeSystem = codeSystemVersion.versionOf,
                    holder.codeSystemVersion = {
                        version: {
                            content: codeSystemVersion.codeSystemVersionName,
                            uri: codeSystemVersion.about,
                            href: codeSystemVersion.href
                        }
                    };

            };

            var openFn = function () {
                dialogs.create('/modules/valuesetdefinitions/views/search-modal.html', 'vsd-searchCtrl',
                    {
                        callback: addOneFunction,
                        codeSystemVersions: $scope.codeSystemVersions,
                        setDirty: $scope.setDirty
                    });
            };
            openFn();
        };

        $scope.searchMultiple = function (holder) {
            var alreadyAdded = holder.reduce(function (map, obj) {
                map[obj.uri] = true;
                return map;
            }, {});

            var addMultipleFunction = function (entity) {
                holder.push({
                    uri: entity.about,
                    name: entity.name.name,
                    namespace: entity.name.namespace,
                    designation: entity.knownEntityDescription[0].designation,
                    href: entity.href
                });
            };

            var openFn = function () {
                dialogs.create('/modules/valuesetdefinitions/views/search-modal.html', 'vsd-searchCtrl',
                    {
                        callback: addMultipleFunction,
                        codeSystemVersions: $scope.codeSystemVersions,
                        multiple: true,
                        alreadyAdded: alreadyAdded,
                        setDirty: $scope.setDirty
                    });
            };
            openFn();
        };

        $scope.isCustomCode = function (entity) {
            return entity.uri.startsWith($scope.valuesetdefinition.about);
        }

        $scope.addCustomCode = function (entries) {
            var openFn = function () {
                dialogs.create('/modules/valuesetdefinitions/views/custom-code-modal.html', 'vsd-customCodeCtrl',
                    {
                        entries: entries,
                        vsdUri: $scope.valuesetdefinition.about,
                        isCreate: true,
                        setDirty: $scope.setDirty
                    });
            };
            openFn();
        };

        $scope.editCustomCode = function (entries, index) {
            var openFn = function () {
                dialogs.create('/modules/valuesetdefinitions/views/custom-code-modal.html', 'vsd-customCodeCtrl',
                    {
                        entries: entries,
                        concept: entries[index],
                        index: index,
                        vsdUri: $scope.valuesetdefinition.about,
                        isCreate: false,
                        setDirty: $scope.setDirty
                    });
            };
            openFn();
        };

        $scope.removeEntry = function (index) {
            $scope.valuesetdefinition.entry.splice(index, 1);
            $scope.setDirty();
        };

        $scope.importFromSpreadsheet = function (entry) {
            var openFn = function (entry) {
                var pushEntities = function (entities) {
                    var holder;
                    if (! entry) {
                        holder = createSpecificEntity().entity.referencedEntity;
                    } else {
                        holder = entry.entity.referencedEntity;
                    }
                    angular.forEach(entities, function (entity) {
                        holder.push(entity);
                        entity.new = true;
                    });
                };

                dialogs.create('/modules/valuesetdefinitions/views/spreadsheet-import-modal.html', 'vsd-spreadsheetImportCtrl',
                    {
                        vsName: $scope.valuesetdefinition.definedValueSet.content,
                        vsdUri: $scope.valuesetdefinition.about,
                        pushEntities: pushEntities,
                        setDirty: $scope.setDirty
                    });
            };
            openFn(entry);
        };

        $scope.importFromDatabase = function () {
            var openFn = function () {
                var pushEntities = function (entities) {
                    var holder = createSpecificEntity().entity.referencedEntity;
                    angular.forEach(entities, function (entity) {
                        holder.push(entity);
                    });
                };

                dialogs.create('/modules/valuesetdefinitions/views/database-import-modal.html', 'vsd-databaseImportCtrl',
                    {
                        vsName: $scope.valuesetdefinition.definedValueSet.content,
                        vsdUri: $scope.valuesetdefinition.about,
                        pushEntities: pushEntities,
                        setDirty: $scope.setDirty
                    });
            };
            openFn();
        };

        $scope.standardize = function () {
            var openFn = function () {

                dialogs.create('/modules/valuesetdefinitions/views/standardize-modal.html', 'vsd-standardizeCtrl',
                    {
                        vsdHref: $scope.id,
                        vsdUri: $scope.valuesetdefinition.about,
                        vs: $scope.valuesetdefinition.definedValueSet,
                        vsName: $scope.valuesetdefinition.definedValueSet.content,
                        vsdSourceAndRole: $scope.valuesetdefinition.sourceAndRole
                    });
            };

            openFn();
        };

        $scope.resolve = function () {
            var openFn = function () {

                dialogs.create('/modules/valuesetdefinitions/views/resolution-modal.html', 'vsd-resolutionCtrl',
                    {
                        vsdHref: $scope.id
                    });
            };

            openFn();
        };

        $scope.getMetrics = function () {
            var openFn = function () {

                dialogs.create('/modules/valuesetdefinitions/views/metrics-modal.html', 'vsd-metricsCtrl',
                    {
                        vsdHref: $scope.id,
                        vsdUri: $scope.valuesetdefinition.about
                    });
            };

            openFn();
        };

        $scope.removeSpecificEntity = function (entries, index) {
            entries.splice(index, 1);
            $scope.setDirty();
        };

        $scope.$watchCollection('valuesetdefinition.entry', function (newNames, oldNames) {
            if ($scope.valuesetdefinition && $scope.valuesetdefinition.entry) {
                for (var i = 0; i < $scope.valuesetdefinition.entry.length; i++) {
                    $scope.valuesetdefinition.entry[i].entryOrder = i + 1;
                }
            }
        });

        $scope.newAssociatedEntity = function () {
            if (!$scope.valuesetdefinition.entry) {
                $scope.valuesetdefinition.entry = [];
            }

            $scope.valuesetdefinition.entry.push(
                {
                    new: true,
                    operator: "UNION",
                    associatedEntities: {
                        referencedEntity: {},
                        direction: "SOURCE_TO_TARGET",
                        leafOnly: "LEAF_ONLY",
                        transitivity: "TRANSITIVE_CLOSURE",
                        predicate: {
                            name: 'subClassOf',
                            namespace: 'rdfs',
                            uri: 'http://www.w3.org/2000/01/rdf-schema#subClassOf'
                        }
                    }
                }
            );

            $scope.setDirty();
        };

        $scope.newCompleteCodeSystem = function () {
            if (!$scope.valuesetdefinition.entry) {
                $scope.valuesetdefinition.entry = [];
            }

            var entry = {
                new: true,
                operator: "UNION",
                completeCodeSystem: {
                    codeSystemVersion: {
                        version: {}
                    }
                }
            };

            $scope.valuesetdefinition.entry.push(entry);

            $timeout(function() {
                var someElement = $('#entry-' + ($scope.valuesetdefinition.entry.length - 1));
                $document.scrollToElementAnimated(someElement);
            }, 0);

            $scope.setDirty();
        }

        $scope.newSpecificEntity = function () {
            createSpecificEntity();
            $scope.setDirty();
        };

        function createSpecificEntity() {
            if (!$scope.valuesetdefinition.entry) {
                $scope.valuesetdefinition.entry = [];
            }

            var entry = {
                new: true,
                operator: "UNION",
                entity: {
                    referencedEntity: []
                }
            };

            $scope.valuesetdefinition.entry.push(entry);

            $timeout(function() {
                var someElement = $('#entry-' + ($scope.valuesetdefinition.entry.length - 1));
                $document.scrollToElementAnimated(someElement);
            }, 0);

            return entry;
        }
    }

]).controller('vsd-searchCtrl', function ($log, $http, $timeout, $scope, $modalInstance, data) {
    $scope.codeSystemVersions = data.codeSystemVersions;
    $scope.alreadyAdded = data.alreadyAdded;
    $scope.opened = false;
    $scope.q = '';

    $scope.selectedSearchSpecification = {};

    $scope.updateQ = function (q) {
        $scope.q = q;
        $scope.searchTextChange($scope.q, $scope.selectedSearchSpecification.selected.href);
    };

    $scope.$watch("selectedSearchSpecification.selected", function (newValue) {
        if (newValue) {
            $scope.searchTextChange($scope.q, newValue.name);
        }
    });

    var color = d3.scale.category20()
    $scope.options = {
        chart: {
            type: 'forceDirectedGraph',
            height: 450,
            radius: 10,
            linkDist: 200,
            width: 768,
            margin: {top: 20, right: 20, bottom: 20, left: 20},
            tooltip: {
                contentGenerator: function (d) {
                    return '<h4>&nbsp;' + d.name + '&nbsp;</h4><em>&nbsp;' + d.designation + '&nbsp;</em';
                }
            },
            color: function (d) {
                return color(d.group)
            },
            nodeExtras: function (node) {
                node && node
                    .append("text")
                    .attr("dx", 14)
                    .attr("dy", ".35em")
                    .text(function (d) {
                        return d.name + " (" + d.designation + ")"
                    })
                    .style('font-size', '10px');
            }
        }
    };

    $scope.dataChildren = {};
    $scope.showChildren = {};

    $scope.toggleChildren = function (entity, idx) {
        $scope.showChildren[idx] = !$scope.showChildren[idx];

        if ($scope.showChildren[idx]) {
            $scope.getChildren(entity, idx);
        }
    };

    $scope.canShowChildren = function (idx) {
        return $scope.showChildren[idx];
    };

    var childrenCache = {};

    $scope.getChildren = function (entity, idx) {
        function setDataChildren(children, idx) {
            var nodes = [{name: entity.name.name, designation: entity.knownEntityDescription[0].designation, group: 1}];
            var links = [];

            angular.forEach(children, function (child, idx) {
                nodes.push({name: child.name.name, designation: child.knownEntityDescription[0].designation, group: 2})
                links.push({source: 0, target: idx + 1, value: 1});
            });

            $scope.dataChildren[idx] = {
                "nodes": nodes,
                "links": links
            };
        }

        if (childrenCache[idx]) {
            setDataChildren(childrenCache[idx], idx);
        } else {
            $http.get('proxy/' + encodeURIComponent(entity.knownEntityDescription[0].href + '/children')).
                then(function (data) {

                    var children = data.data.EntityDirectory.entry;
                    childrenCache[idx] = children;
                    setDataChildren(children, idx);
                })
        }
    };

    $scope.addEntityFromSearch = function (entity) {
        var multiple = data.multiple;
        var callback = data.callback;

        if (multiple) {
            callback(entity, $scope.selectedSearchSpecification.selected);
            $scope.alreadyAdded[entity.about] = true;
        } else {
            callback(entity, $scope.selectedSearchSpecification.selected);
            $scope.done();
        }
    };

    $scope.searchTextChange = function (q, href) {
        if (!href || !q) {
            return;
        }

        $scope.searching = true;
        $scope.searchResults = [];
        $http.get('proxy/' + encodeURIComponent(href + '/entities' + '?q=' + q)).
            then(function (data) {
                delete $scope.searching;

                $scope.tracker = {};
                $scope.searchResults = data.data;
            })
    };

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    }; // end open

    $scope.done = function () {
        $modalInstance.close($scope.data);
    }; // end done

}).controller('vsd-customCodeCtrl', function ($log, $http, $timeout, $scope, Notification, $modalInstance, data) {
    $scope.isCreate = data.isCreate;

    function createLocalConcept() {
        return {namespace: 'local'};
    }

    if($scope.isCreate) {
        $scope.concept = createLocalConcept();
        data.index = data.entries.length;
    } else {
        $scope.concept = angular.copy(data.concept);
    }

    $scope.saveCustomCode = function () {
        $scope.concept.uri = data.vsdUri + '/' + $scope.concept.name;
        data.entries[data.index] = $scope.concept;

        if (! $scope.saveAndAddClick) {
            $modalInstance.close($scope);
        } else {
            $scope.concept = createLocalConcept();
            $scope.customCodeForm.$setPristine();
            $scope.saveAndAddClick = false;
            data.index = data.entries.length;
        }

        $scope.concept.new = true;

        data.setDirty();

        Notification.success('Custom Concept Added.');
    };

    ///
    $scope.done = function () {
        $modalInstance.close($scope);
    }; // end done
}).controller('vsd-spreadsheetImportCtrl', function ($log, $http, $timeout, $scope, $modalInstance, data) {
    $scope.pasted = "";

    $scope.headers = ["Code", "Designation"];

    $scope.showRowsLimit = 5;

    $scope.parse = function (text) {
        var x = text.split('\n');
        for (var i = 0; i < x.length; i++) {
            var y = x[i].split('\t');
            x[i] = y;
        }

        $scope.parsed = x;
    };

    $scope.generate = function () {
        var indexes = {
            //URI: -1,
            Code: -1,
            //Namespace: -1,
            Designation: -1
        };

        $('.parsed-data-table-header-row').each(function (e) {
            var idx = $(this).attr('data-idx');
            $(this).find(".header-label").each(function () {
                var label = $(this).text();
                indexes[label] = idx;
            })
        });

        var getValue = function (index, line) {
            if (index != -1) {
                return line[index];
            } else {
                return null;
            }
        };

        var entities = [];

        var vsdUri = data.vsdUri;
        //var vsName = data.vsName;

        angular.forEach($scope.parsed, function (line) {
            var code = getValue(indexes.Code, line);

            var uri = vsdUri + "/" + code;

            entities.push({
                uri: uri,
                name: code,
                namespace: 'local',
                designation: getValue(indexes.Designation, line)
            });
        });

        data.pushEntities(entities);

        data.setDirty();

        $scope.done();
    };

    ///
    $scope.done = function () {
        $modalInstance.close($scope);
    }; // end done

}).controller('vsd-databaseImportCtrl', function ($log, $http, $timeout, $scope, $modalInstance, Connections, DatabaseExplorer, data) {

    $scope.connections = Connections.query();

    $scope.selected = {};

    $scope.connected = false;

    $scope.headers = ["Code", "Designation"];

    $scope.connect = function () {
        $scope.connectionError = null;

        var connectionCopy = angular.copy($scope.selected.connection);
        connectionCopy.username = $scope.selected.username;
        connectionCopy.password = $scope.selected.password;

        DatabaseExplorer.tables(connectionCopy, function (response, error) {
            if (!error) {
                $scope.tables = response;
                $scope.connected = true;
            } else {
                $scope.connectionError = error;
            }
        });
    };

    $scope.disconnect = function () {
        $scope.connected = false;
        $scope.selected = {};
        $scope.result = [];
        $scope.columns = [];
        $scope.tables = [];
    };

    $scope.$on('header-bag.dragend', function (e, el) {
        $scope.query();
    });

    $scope.import = function () {
        var entities = [];

        var vsdUri = data.vsdUri;
        var vsName = data.vsName;

        angular.forEach($scope.result, function (line) {
            var code = line[1];

            var uri;
            if (!line[0]) {
                uri = vsdUri + "/" + code;
            } else {
                uri = line[0];
            }

            entities.push({
                uri: uri,
                name: code,
                namespace: line[2] || vsName,
                designation: line[23]
            });
        });

        data.pushEntities(entities);

        data.setDirty();
    };

    $scope.query = function () {
        var indexes = [];
        var columns = [];

        $('.parsed-data-table-header-row').each(function (e) {
            var idx = $(this).attr('data-idx');
            $(this).find(".column-from-db").each(function () {
                var label = $(this).text();
                indexes.push(idx);
                columns.push(label);
            })
        });

        if (columns.length == 0) {
            $scope.result = [];
            $scope.$apply();
        } else {
            indexes.sort();

            var connectionCopy = angular.copy($scope.selected.connection);
            connectionCopy.username = $scope.selected.username;
            connectionCopy.password = $scope.selected.password;

            DatabaseExplorer.query($scope.selected.table, columns, connectionCopy, function (response) {
                var result = [];

                angular.forEach(response, function (item) {
                    var row = new Array($scope.headers.length);
                    angular.forEach(indexes, function (idx, i) {
                        row[idx] = item[i];
                    });

                    result.push(row);
                });

                $scope.result = result;
            });
        }
    };

    $scope.$watch("selected.table", function (newValue) {
        if (newValue) {
            var connectionCopy = angular.copy($scope.selected.connection);
            connectionCopy.username = $scope.selected.username;
            connectionCopy.password = $scope.selected.password;

            DatabaseExplorer.columns($scope.selected.table, connectionCopy, function (response) {
                $scope.columns = response;
            });
        }
    });

    ///
    $scope.done = function () {
        $modalInstance.close($scope);
    }; // end done

}).config(function (dialogsProvider) {
    // this provider is only available in the 4.0.0+ versions of angular-dialog-service
    dialogsProvider.useBackdrop(true);
    dialogsProvider.useEscClose(true);
    dialogsProvider.useCopy(false);
    dialogsProvider.setSize('lg');
}).controller('vsd-standardizeCtrl', function ($log, $http, $timeout, $scope, $modalInstance, Mapversions, Connections, Utils, Notification, dialogs, Config, data) {

    $scope.loading = true;
    $http.get('/standardize/' + encodeURIComponent(data.vsdHref)).
        then(function (data) {
            $scope.loading = false;

            data = data.data;
            $scope.results = data.results;
            $scope.vsd = data.vsd;
            $scope.stats = $.map(data.stats, function (stat, sab) {
                return {sab: sab, value: stat};
            });

            var max = 0;
            angular.forEach($scope.stats, function (stat) {
                if (stat.value.avg > max) {
                    max = stat.value.avg;
                }
            });

            $scope.max = max;

            var maxScoresForUri = {};

            for (var sab in $scope.results) {
                var scoresForUri = $scope.results[sab].reduce(function (result, item) {
                    result[item.from.uri] = item.result.score;
                    return result;
                }, {});

                for (var uri in scoresForUri) {
                    if (!maxScoresForUri[uri]) {
                        maxScoresForUri[uri] = scoresForUri[uri];
                    } else {
                        if (maxScoresForUri[uri] < scoresForUri[uri]) {
                            maxScoresForUri[uri] = scoresForUri[uri];
                        }
                    }
                }
            }

            $scope.maxScoresForUri = maxScoresForUri;
        }, function errorCallback(response) {
            $scope.loading = false;

            Notification.error('Internal Error. Standardizer not available.');
            $scope.done();
        }
    );

    $scope.createMap = function (sab) {
        var map = $scope.results[sab];

        var mapName = data.vsName + "-to-" + sab;

        var mapVersion = {
            about: Config.getResourceUriBase() + '/map/' + mapName + '/version/1',
            officialResourceVersionId: '1',
            mapVersionName: mapName + '-1',
            versionOf: {
                content: mapName
            },
            fromValueSetDefinition: {
                valueSetDefinition: {
                    uri: data.vsdUri,
                    href: data.vsdHref
                },
                valueSet: data.vs
            },
            toValueSetDefinition: {
                valueSetDefinition: {
                    uri: sab
                },
                valueSet: {
                    content: sab
                }
            },
            sourceAndRole: data.vsdSourceAndRole
        };

        var members = [];
        var changeSet = {
            ChangeSet: {
                member: members
            }
        };

        angular.forEach(map, function (result) {
            var sourceEntity = result.from;

            var targetEntity = {
                uri: "http://umls.nlm.nih.gov/sab/" + sab + "/" + result.result.name,
                namespace: result.result.namespace,
                name: result.result.name,
                designation: result.result.designations[0]
            };

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

            members.push({mapEntry: entry});
        });

        Mapversions.new({MapVersion: mapVersion}, function (response) {

            Mapversions.createMapEntries(changeSet, function (mapEntriesResponse) {
                var location = encodeURIComponent(Utils.removeURLParameter(response.data.headers.location, 'changesetcontext'));

                $location.path('/mapversions/' + location + '/edit');

                Notification.success('Map Version Created');
            })
        });
    };

    $scope.preview = function (sab) {
        var openFn = function () {
            var map = $scope.results[sab];

            var foundUris = map.reduce(function (result, item) {
                result[item.from.uri] = true; //a, b, c
                return result;
            }, {});


            var missing = [];

            angular.forEach($scope.vsd, function (entry) {
                if (!foundUris[entry.uri]) {
                    missing.push(entry);
                }
            });

            dialogs.create('/modules/valuesetdefinitions/views/standardize-preview-modal.html', 'vsd-standardizePreviewCtrl',
                {
                    map: map,
                    missing: missing,
                    maxScoresForUri: $scope.maxScoresForUri
                });
        };

        openFn();
    }

    ///
    $scope.done = function () {
        $modalInstance.close($scope);
    }; // end done

}).controller('vsd-standardizePreviewCtrl', function ($log, $http, $timeout, $scope, $modalInstance, Connections, DatabaseExplorer, data) {
    $scope.results = data.map;
    $scope.missing = data.missing;

    $scope.getMaxScoreForUri = function (uri) {
        return data.maxScoresForUri[uri];
    };

    ///
    $scope.done = function () {
        $modalInstance.close($scope);
    }; // end done

}).controller('vsd-resolutionCtrl', function ($log, $http, $timeout, $scope, $modalInstance, dialogs, data) {

    $http.get('proxy/' + encodeURIComponent(data.vsdHref + '/resolution')).
        then(function (data) {
            $scope.resolution = data.data.IteratableResolvedValueSet;
        })

    ///
    $scope.done = function () {
        $modalInstance.close($scope);
    }; // end done

}).controller('vsd-metricsCtrl', function ($log, $http, $timeout, $scope, $modalInstance, Notification, dialogs, $q, data) {

    $scope.missingLevelColors = ["#a9d70b", "#f9c802", "#ff0000"].reverse();
    $scope.vsdHref = data.vsdHref;


    var metricsPromise = $http.get('metrics/' + encodeURIComponent(data.vsdHref));
    var similarityPromise = $http.get('similarity?uri=' + encodeURIComponent(data.vsdUri));

    $q.all([metricsPromise, similarityPromise]).
        then(function (data) {
            $scope.similarity = data[1].data;

            $scope.metrics = data[0].data;

            var totalPathLength = 0;
            var roots = 0;
            for (var root in $scope.metrics.rootPathToLca) {
                roots++;
                totalPathLength += ($scope.metrics.rootPathToLca[root].length - 1)
            }

            $scope.avgPathLengthToLca = totalPathLength / roots
        }, function errorCallback(response) {
            Notification.error('Internal Error. Metrics not available.');

            $scope.done();
        });


    ///
    $scope.done = function () {
        $modalInstance.close($scope);
    }; // end done

}).controller('vsd-warningsCtrl', function ($log, $http, $timeout, $scope, $modalInstance, dialogs, data) {

    $scope.warnings = data.warnings;

    $scope.getWarningTemplate = function (warning) {
        return '/modules/valuesetdefinitions/views/warning-' + warning.type + '.html';
    };

    ///
    $scope.done = function () {
        $modalInstance.close($scope);
    }; // end done

}).controller('vsd-saveAsCtrl', function ($scope, $modalInstance, data) {

    $scope.cancel = function () {
        $modalInstance.dismiss('canceled');
    }; // end cancel

    $scope.save = function () {
        $modalInstance.close({version: $scope.version, description: $scope.description});
    }; // end save

}).config(function (dialogsProvider) {
    // this provider is only available in the 4.0.0+ versions of angular-dialog-service
    dialogsProvider.useBackdrop(true);
    dialogsProvider.useEscClose(true);
    dialogsProvider.useCopy(false);
    dialogsProvider.setSize('lg');
});
