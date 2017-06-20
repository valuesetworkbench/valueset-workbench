'use strict';

(function () {
    // Mapversions Controller Spec
    describe('Edit Mapversions Controller Tests', function () {
        // Initialize global variables
        var EditMapversionsController,
            scope,
            $httpBackend,
            $stateParams,
            $location;

        // The $resource service augments the response object with methods for updating and deleting the resource.
        // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
        // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
        // When the toEqualData matcher compares two objects, it takes only object properties into
        // account and ignores methods.
        beforeEach(function () {
            jasmine.addMatchers({
                toEqualData: function (util, customEqualityTesters) {
                    return {
                        compare: function (actual, expected) {
                            return {
                                pass: angular.equals(actual, expected)
                            };
                        }
                    };
                }
            });
        });

        // Then we can start by loading the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(module(function ($urlRouterProvider) {
            $urlRouterProvider.deferIntercept();
        }));

        // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
        // This allows us to inject a service but then attach it to a variable
        // with the same name as the service.
        beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
            // Set a new global scope
            scope = $rootScope.$new();

            // Point global variables to injected services
            $stateParams = _$stateParams_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;

            // Initialize the Mapversions controller.
            EditMapversionsController = $controller('EditMapversionsController', {
                $scope: scope
            });
        }));

        it('$scope.findOne() should create an array with one Mapversion object fetched from XHR using a mapversionId URL parameter', inject(function () {
            // Define a sample Mapversion object
            var sampleMapversion = {
                MapVersionMsg: {
                    heading: {
                        resourceRoot: "http://test"
                    },
                    mapVersion: {
                        fromValueSetDefinition: {
                            valueSetDefinition: {
                                href: "http://from"
                            }
                        },
                        toValueSetDefinition: {
                            valueSetDefinition: {
                                href: "http://to"
                            }
                        }
                    }
                }
            };

            // Set the URL parameter
            scope.id = 'http://test/mv';

            // Set GET response
            //$httpBackend.expectGET('/valuesetdefinitions').respond({ValueSetDefinitionDirectory: {entry: []}});
            $httpBackend.expectGET('/proxy/' + encodeURIComponent(scope.id)).respond(sampleMapversion);
            $httpBackend.expectGET('/proxy/' + encodeURIComponent(scope.id + "/entries?list=true")).respond({MapEntryList: {entry: []}});

            $httpBackend.expectGET('proxy/' + encodeURIComponent(sampleMapversion.MapVersionMsg.mapVersion.fromValueSetDefinition.valueSetDefinition.href + "/entities")).respond({EntityDirectory: {}});
            $httpBackend.expectGET('proxy/' + encodeURIComponent(sampleMapversion.MapVersionMsg.mapVersion.toValueSetDefinition.valueSetDefinition.href + "/entities")).respond({EntityDirectory: {}});


            // Run controller functionality
            scope.findOne();
            $httpBackend.flush();

            // Test scope value
            expect(scope.mapVersion).toEqualData(sampleMapversion.MapVersionMsg.mapVersion);
        }));

        it('$scope.save() should redirect if permissions no longer include "Edit"', inject(function () {
            // Define a sample Mapversion object
            var sampleMapversion = {
                MapVersionMsg: {
                    heading: {
                        resourceRoot: "http://test"
                    },
                    mapVersion: {
                        fromValueSetDefinition: {
                            valueSetDefinition: {
                                href: "http://from"
                            }
                        },
                        toValueSetDefinition: {
                            valueSetDefinition: {
                                href: "http://to"
                            }
                        }
                    }
                }
            };

            // Set the URL parameter
            $stateParams.mapversionid = encodeURIComponent('http://test/mv');

            scope.mapVersionForm = {
                $setPristine: function(){}
            }

            // Set GET response
            //$httpBackend.expectGET('/valuesetdefinitions').respond({ValueSetDefinitionDirectory: {entry: []}});
            $httpBackend.expectGET('/proxy/' + encodeURIComponent(scope.id)).respond(sampleMapversion);
            $httpBackend.expectGET('/proxy/' + encodeURIComponent(scope.id + "/entries?list=true")).respond({MapEntryList: {entry: []}});

            $httpBackend.expectGET('proxy/' + encodeURIComponent(sampleMapversion.MapVersionMsg.mapVersion.fromValueSetDefinition.valueSetDefinition.href + "/entities")).respond({EntityDirectory: {}});
            $httpBackend.expectGET('proxy/' + encodeURIComponent(sampleMapversion.MapVersionMsg.mapVersion.toValueSetDefinition.valueSetDefinition.href + "/entities")).respond({EntityDirectory: {}});


            // Run controller functionality
            scope.findOne();
            $httpBackend.flush();

            $httpBackend.expectPUT('/proxy/' + encodeURIComponent(scope.id + '?changesetcontext=foo')).respond([]);

            scope.saveMapVersion();

            $httpBackend.flush();

            expect($location.path()).toEqual('/mapversions/' + encodeURIComponent("http://test/mv"));
        }));

    });
}());
