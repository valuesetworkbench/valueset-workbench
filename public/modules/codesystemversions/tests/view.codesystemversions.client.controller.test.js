'use strict';

(function () {
    // Codesystemversions Controller Spec
    describe('View Codesystemversions Controller Tests', function () {
        // Initialize global variables
        var ViewCodesystemversionsController,
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
            ViewCodesystemversionsController = $controller('ViewCodesystemversionsController', {
                $scope: scope
            });
        }));


        it('$scope.findOne() should create an array with one Codesystemversion object fetched from XHR using a codesystemversionId URL parameter', inject(function (Codesystemversions) {
            // Define a sample Codesystemversion object
            var sampleCodesystemversion = {
                CodeSystemVersionCatalogEntryMsg: {
                    heading: {resourceRoot: "http://test"},
                    codeSystemVersionCatalogEntry: {

                    }
                }
            };

            // Set the URL parameter
            scope.id = 'http://test/mv';

            // Set GET response

            $httpBackend.expectGET('/proxy/' + encodeURIComponent(scope.id)).respond(sampleCodesystemversion);
            $httpBackend.expectGET('/proxy/' + encodeURIComponent(scope.id + "/entities")).respond({EntityDirectory: {entry: []}});


            // Run controller functionality
            scope.findOne();
            $httpBackend.flush();

            // Test scope value
            expect(scope.codesystemversion).toEqualData(sampleCodesystemversion.CodeSystemVersionCatalogEntryMsg.codeSystemVersionCatalogEntry);
        }));

    });
}());
