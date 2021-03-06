'use strict';

(function () {
    // Codesystemversions Controller Spec
    describe('Create Codesystemversions Controller Tests', function () {
        // Initialize global variables
        var CreateCodesystemversionsController,
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

            // Initialize the Codesystemversions controller.
            CreateCodesystemversionsController = $controller('CreateCodesystemversionsController', {
                $scope: scope,
                Config: {
                    getResourceUriBase: function() { return "test";}
                }
            });
        }));

        it('$scope.create() should POST the Map Version to CTS2', inject(function (Codesystemversions) {
            // Create a sample Codesystemversions array that includes the new Codesystemversion
            var sampleCodesystemversions = {CodesystemversionDirectory: {entry: []}};

            // Set GET response
            $httpBackend.expectGET('/valuesetdefinitions').respond({ValueSetDefinitionDirectory: {entry: []}});
            $httpBackend.expectPOST('/codesystemversions').respond({
                headers: {location: "http://my/test/map"}
            });

            scope.valuesets.fromValueSetDefinition = {
                about: "test1"
            };

            scope.valuesets.toValueSetDefinition = {
                about: "test2"
            };

            scope.create();
            $httpBackend.flush();
        }));

        it('$scope.create() redirect to the edit page of the new resource', inject(function (Codesystemversions) {
            // Create a sample Codesystemversions array that includes the new Codesystemversion
            var sampleCodesystemversions = {CodesystemversionDirectory: {entry: []}};

            // Set GET response
            $httpBackend.expectGET('/valuesetdefinitions').respond({ValueSetDefinitionDirectory: {entry: []}});
            $httpBackend.expectPOST('/codesystemversions').respond({
                headers: {location: "http://my/test/map"}
            });

            scope.valuesets.fromValueSetDefinition = {
                about: "test1"
            };

            scope.valuesets.toValueSetDefinition = {
                about: "test2"
            };

            // Run controller functionality
            scope.create();
            $httpBackend.flush();

            // Test scope value
            expect($location.path()).toEqual('/codesystemversions/' + encodeURIComponent("http://my/test/map") + '/edit');
        }));

    });
}());
