'use strict';

angular.module('valuesetdefinitions')
    .directive('missingTree',[function() {
        return {
            templateUrl:'modules/valuesetdefinitions/directives/missingtree.client.view.html',
            restrict: 'E',
            replace: true,
            scope: {
                metrics: '=metrics',
            },
            controller: function($scope, $q, $http) {
                $scope.$watch('metrics', function() {
                    if($scope.metrics) {
                        drawTree();
                    }
                });

                function drawTree() {
                    var margin = {top: 20, right: 120, bottom: 20, left: 120},
                        width = 960 - margin.right - margin.left,
                        height = 800 - margin.top - margin.bottom;

                    var i = 0,
                        duration = 750,
                        root;

                    width = width + 1000;

                    var missing;

                    var tree = d3.layout.tree()
                        .size([height, width]);

                    var diagonal = d3.svg.diagonal()
                        .projection(function (d) {
                            return [d.y, d.x];
                        });

                    var svg = d3.select("#missing-tree").append("svg")
                        .attr("width", width + margin.right + margin.left)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    missing = $scope.metrics.missing;

                    var lca = {
                        entity: $scope.metrics.lca,
                        children: [],
                        isLca: true
                    };

                    root = lca;
                    root.x0 = height / 2;
                    root.y0 = 0;

                    function graphToTree(root, graph) {
                        var targets = _.filter(graph, function(node) {
                            return node.subject.uri == root.uri;
                        });
                        var children = _.map(targets, function(node) {
                            return node.target.entity;
                        });

                        var childrenGraph = _.map(children, function(child) {
                           return graphToTree(child, graph);
                        });

                        return {
                            entity: root,
                            children: childrenGraph
                        }
                    }

                    function getMaxTreeDepth(root) {
                        if(root.children.length == 0) {
                            return 1;
                        } else {
                            var paths = _.map(root.children, function(child) {
                                return getMaxTreeDepth(child);
                            });

                            return 1 + paths.sort().reverse()[0];
                        }
                    }


                    var promises = _.map($scope.metrics.roots, function(root) {
                        var d = $q.defer();
                        $http.get('/proxy/' + encodeURIComponent(root.href + '/graph?direction=FORWARD&depth=-1')).
                            then(function(response) {
                                    d.resolve({root: root, graph: response})
                                });
                        return d.promise;
                    });

                    $q.all(promises).then(function(ret) {
                        angular.forEach(ret, function (response) {
                            var tree = graphToTree(response.root, response.graph.data.AssociationGraph.entry);



                            lca.children.push(tree);
                        });

                        var depth = getMaxTreeDepth(root)

                        d3.select("svg")
                            .style("width", depth * 200);

                        //root.children.forEach(collapse);
                        update(root);
                    });

                    function collapse(d) {
                        if (d.children) {
                            d._children = d.children;
                            d._children.forEach(collapse);
                            d.children = null;
                        }
                    }

                    d3.select(self.frameElement).style("height", "800px");

                    var isMissing = function(d) {
                        return missing.indexOf(d.entity.uri) != -1;
                    };

                    var hasMissingDescendants = function(d){
                        var children = (d.children)?d.children:d._children;

                        var missing = false;
                        if(children) {
                            children.forEach(function(item) {
                                missing = (missing || isMissing(item));
                            });

                            children.forEach(function(item) {
                                missing = (missing || hasMissingDescendants(item));
                            });

                        }

                        return missing;
                    };

                    function update(source) {

                        // Compute the new tree layout.
                        var nodes = tree.nodes(root).reverse(),
                            links = tree.links(nodes);

                        // Normalize for fixed-depth.
                        nodes.forEach(function (d) {
                            d.y = d.depth * 180;
                        });

                        // Update the nodes…
                        var node = svg.selectAll("g.node")
                            .data(nodes, function (d) {
                                return d.id || (d.id = ++i);
                            });

                        // Enter any new nodes at the parent's previous position.
                        var nodeEnter = node.enter().append("g")
                            .attr("class", "node")
                            .attr("transform", function (d) {
                                return "translate(" + source.y0 + "," + source.x0 + ")";
                            })
                            .on("click", click);

                        var fill = function(d) {
                            if(d._children) {
                                var missingDescendants = hasMissingDescendants(d);
                                if(! missingDescendants) {
                                    return "lightsteelblue"
                                } else {
                                    return "red"
                                }
                            } else {
                                return "#fff";
                            }
                        };

                        var circle = function(d) {
                            var missing = isMissing(d);
                            if(! missing) {
                                return "lightsteelblue"
                            } else {
                                return "red"
                            }
                        };

                        nodeEnter.append("circle")
                            .attr("r", 1e-6)
                            .style("stroke", circle)
                            .style("fill", fill);

                        nodeEnter.append("text")
                            .attr("x", function (d) {
                                return d.children || d._children ? -10 : 10;
                            })
                            .attr("dy", ".35em")
                            .attr("text-anchor", function (d) {
                                return d.children || d._children ? "end" : "start";
                            })
                            .text(function (d) {
                                return d.entity.name;
                            })
                            .style("fill-opacity", 1e-6);

                        // Transition nodes to their new position.
                        var nodeUpdate = node.transition()
                            .duration(duration)
                            .attr("transform", function (d) {
                                return "translate(" + d.y + "," + d.x + ")";
                            });

                        nodeUpdate.select("circle")
                            .attr("r", 4.5)
                            .style("stroke", circle)
                            .style("fill", fill);

                        nodeUpdate.select("text")
                            .style("fill-opacity", 1);

                        // Transition exiting nodes to the parent's new position.
                        var nodeExit = node.exit().transition()
                            .duration(duration)
                            .attr("transform", function (d) {
                                return "translate(" + source.y + "," + source.x + ")";
                            })
                            .remove();

                        nodeExit.select("circle")
                            .attr("r", 1e-6);

                        nodeExit.select("text")
                            .style("fill-opacity", 1e-6);

                        // Update the links…
                        var link = svg.selectAll("path.link")
                            .data(links, function (d) {
                                return d.target.id;
                            });

                        // Enter any new links at the parent's previous position.
                        link.enter().insert("path", "g")
                            //.attr("class", "link")
                            .attr("class", function(d) {
                                return "link" + (d.source.isLca ? " dashed" : "");
                            })
                            .attr("d", function (d) {
                                var o = {x: source.x0, y: source.y0};
                                return diagonal({source: o, target: o});
                            });

                        // Transition links to their new position.
                        link.transition()
                            .duration(duration)
                            .attr("d", diagonal);

                        // Transition exiting nodes to the parent's new position.
                        link.exit().transition()
                            .duration(duration)
                            .attr("d", function (d) {
                                var o = {x: source.x, y: source.y};
                                return diagonal({source: o, target: o});
                            })
                            .remove();

                        // Stash the old positions for transition.
                        nodes.forEach(function (d) {
                            d.x0 = d.x;
                            d.y0 = d.y;
                        });
                    }

                    // Toggle children on click.
                    function click(d) {
                        if (d.children) {
                            d._children = d.children;
                            d.children = null;
                        } else {
                            d.children = d._children;
                            d._children = null;
                        }
                        update(d);
                    }
                }
            }
        }
    }]);
