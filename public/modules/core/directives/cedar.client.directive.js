'use strict';

angular.module('core')
    .filter('cedarFilter', function () {
        return function (value, type) {
            var properties = {}
            for (key in value) {
                if (value['@type' == type]) {
                    properties[key] = value;
                }
            }
            return properties;
        };
    })
    .directive('chooseCedarTemplate',['$http', function() {
        return {
            templateUrl:'modules/core/directives/cedar.client.view.html',
            restrict: 'E',
            replace: true,
            scope: {
                resource: '=resource'
            },
            controller: function($scope, $http){

                $scope.selected = {};

                $scope.workingTemplates = [];

                $scope.$watch('resource', function(newValue, oldValue) {
                    if (newValue) {

                        var templates = {};

                        _.each($scope.resource.property, function (property) {
                            if (property.propertyQualifier &&
                                property.propertyQualifier[0] &&
                                property.propertyQualifier[0].predicate.name == 'cedarTemplateId') {

                                var value = property.propertyQualifier[0].value[0].literal.value;
                                templates[value] = value;
                            }
                        });

                        for (var key in templates) {
                            $scope.getTemplate(key);
                        }
                    }
                });

                $http.get("/cedar/templates").then(function(response) {
                    $scope.templates = response.data.resources;
                });

                $scope.getTemplate = function (templateId) {
                    $http.get("/cedar/templates/" + encodeURIComponent(templateId)).then(function(response) {
                        var template = response.data;

                        $scope.workingTemplates.push(template)
                    });
                }

                $scope.remove = function (template) {
                    $scope.resource.property = _.reject($scope.resource.property, function (property) {
                        return property.propertyQualifier &&
                            property.propertyQualifier[0] &&
                            property.propertyQualifier[0].predicate.name == 'cedarTemplateId' &&
                            property.propertyQualifier[0].value[0].literal.value == template['@id'];
                    });

                    $scope.workingTemplates = _.reject($scope.workingTemplates, function (template_) {
                        return template_['@id'] == [template['@id']]
                    });

                    $scope.workingTemplatesForm.$setDirty();
                }

                $scope.save = function (template) {

                    var findProperty = function (resource, uri) {
                        return _.find(resource.property, function (property) {
                            return property.predicate.uri == uri;
                        })
                    }

                    var deleteProperty = function (resource, uri) {
                        resource.property = _.reject(resource.property, function (property) {
                            return property.predicate.uri == uri;
                        })
                    }

                    var templateFn = function (template) {
                        _.each(template.properties, function (templateProperty) {
                            var prop = getFn(templateProperty);
                            if (prop) prop(templateProperty, template)
                        });
                    }

                    var templateElementFn = function (templateElement, template) {
                        _.each(templateElement.properties, function (templateProperty) {
                            var prop = getFn(templateProperty);
                            if (prop) prop(templateProperty, template)
                        });
                    }

                    var templateFieldFn = function (templateField, template) {
                        var property = findProperty($scope.resource, templateField['@id']);

                        if (! templateField.value) {
                            if (property) {
                                deleteProperty($scope.resource, templateField['@id']);
                            }
                        } else {
                            if (!property) {
                                if (!$scope.resource.property) {
                                    $scope.resource.property = [];
                                }
                                $scope.resource.property.push(
                                    {
                                        propertyQualifier: [{
                                            predicate: {
                                                name: 'cedarTemplateId'
                                            },
                                            value: [
                                                {
                                                    literal: {
                                                        value: template['@id']
                                                    }
                                                }
                                            ]
                                        }],
                                        predicate: {
                                            uri: templateField['@id'],
                                            name: templateField["schema:name"]
                                        },
                                        value: [
                                            {
                                                literal: {
                                                    value: templateField.value
                                                }
                                            }
                                        ]
                                    }
                                )
                            } else {
                                property.value[0].literal.value = templateField.value;
                            }
                        }
                    }

                    function getFn(obj) {
                        if (obj['@type'] == 'https://schema.metadatacenter.org/core/Template') {
                            return templateFn;
                        }
                        if (obj['@type'] == 'https://schema.metadatacenter.org/core/TemplateElement') {
                            return templateElementFn;
                        }
                        if (obj['@type'] == 'https://schema.metadatacenter.org/core/TemplateField') {
                            return templateFieldFn;
                        }
                    }

                    templateFn(template);
                }

        }}}])
    .directive('cedarChooser',['$compile', function() {
        return {
            templateUrl:'modules/core/directives/cedar-chooser.client.view.html',
            restrict: 'E',
            replace: true,
            scope: {
                choice: '=choice',
                resource: '=resource',
                template: '=template',
                save: '=save'
            },
            link: function($scope, element, attrs) {
                $scope.element = element;
            },
            controller: function($scope, $compile){
                $scope.$watch('choice', function(newValue, oldValue) {
                    if ($scope.choice) {
                        var type = $scope.choice['@type'];

                        var _this = $scope.element;

                        if (type == 'https://schema.metadatacenter.org/core/TemplateElement') {
                            _this.html($compile('<cedar-template-element template-element="choice" template="template" resource="resource" save="save"></cedar-template-element>')($scope))
                        }
                        if (type == 'https://schema.metadatacenter.org/core/TemplateField') {
                            _this.html($compile('<cedar-template-field template-field="choice" template="template" resource="resource" save="save"></cedar-template-field>')($scope))
                        }
                    }
                });
            }}}])
    .directive('cedarTemplate',[function() {
        return {
            templateUrl:'modules/core/directives/cedar-template.client.view.html',
            restrict: 'E',
            replace: true,
            scope: {
                template: '=template',
                resource: '=resource',
                save: '=save',
                remove: '=remove'
            },
            controller: function($scope, $compile){

                $scope.getRandomId = function () {
                    return Math.random().toString(36).substr(2, 10);
                }

                $scope.removeTemplate = function () {
                    $scope.remove($scope.template);
                }
            }}}])
    .directive('cedarTemplateElement',[function() {
        return {
            templateUrl:'modules/core/directives/cedar-template-element.client.view.html',
            restrict: 'E',
            replace: true,
            scope: {
                templateElement: '=templateElement',
                template: '=template',
                resource: '=resource',
                save: '=save'
            },
            controller: function($scope){

        }}}])
    .directive('cedarTemplateField',[function() {
        return {
            templateUrl:'modules/core/directives/cedar-template-field.client.view.html',
            restrict: 'E',
            replace: true,
            scope: {
                templateField: '=templateField',
                template: '=template',
                resource: '=resource',
                save: '=save'
            },
            controller: function($scope){

                $scope.getTemplateFieldValue = function (uri) {
                    var property = _.find($scope.resource.property, function (property) {
                        return property.predicate.uri == uri;
                    });

                    if (property) {
                        return property.value[0].literal.value;
                    }
                }

            }}}]);

