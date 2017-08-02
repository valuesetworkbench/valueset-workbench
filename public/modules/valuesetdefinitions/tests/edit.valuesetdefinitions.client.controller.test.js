'use strict';

(function() {
	// Valuesets Controller Spec
	describe('Edit Valuesetdefinitions Controller Tests', function() {
		// Initialize global variables
		var EditValuesetdefinitionsController,
		scope,
		modalInstance,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
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

		beforeEach(module(function($urlRouterProvider) { $urlRouterProvider.deferIntercept(); }));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			modalInstance = {};

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Valuesets controller.
			EditValuesetdefinitionsController = $controller('EditValuesetdefinitionsController', {
				$scope: scope
			});

		}));

		it('$scope.findOne() should create an array with one ValueSetDefinition object fetched from XHR using a id URL parameter', inject(function (Mapversions) {
			// Define a sample Mapversion object
			var sampleValueSetDefinition = {
				ValueSetDefinitionMsg: {
					heading: {
						resourceRoot: "http://test"
					},
					valueSetDefinition: {
						about: "test", keyword: [],
                        definedValueSet: {
							content: "test"
                        }
					}
				}
			};

			// Set the URL parameter
			scope.valuesetdefinitionId = encodeURIComponent('http://test/mv');

			// Set GET response
			$httpBackend.expectGET('/codesystemversions?maxtoreturn=-1').respond({CodeSystemVersionCatalogEntryDirectory: {entry: []}});
			$httpBackend.expectGET('/proxy/' + encodeURIComponent(scope.id)).respond(sampleValueSetDefinition);
			$httpBackend.expectGET('similarity?uri=test&forceRefresh=false').respond({similarity: []});

			// Run controller functionality
			$httpBackend.flush();

			// Test scope value
			expect(scope.valuesetdefinition).toEqualData(sampleValueSetDefinition.ValueSetDefinitionMsg.valueSetDefinition);
		}));

		it('$scope.save() should redirect if permissions no longer include "Edit" ', inject(function (Mapversions) {
			// Define a sample Mapversion object
            var sampleValueSetDefinition = {
                ValueSetDefinitionMsg: {
                    heading: {
                        resourceRoot: "http://test"
                    },
                    valueSetDefinition: {
                        about: "test", keyword: [],
                        definedValueSet: {
                            content: "test"
                        }
                    }
                }
            };

            scope.id = 'http://test/vs';

			$stateParams.valuesetdefinitionId = encodeURIComponent(scope.id);

			scope.valueSetDefinitionForm = {
				$setPristine: function(){}
			}

			// Set GET response
			$httpBackend.expectGET('/codesystemversions?maxtoreturn=-1').respond({CodeSystemVersionCatalogEntryDirectory: {entry: []}});
			$httpBackend.expectGET('/proxy/' + encodeURIComponent('http://test/vs')).respond(sampleValueSetDefinition);
			$httpBackend.expectGET('similarity?uri=test&forceRefresh=false').respond({similarity: []});

			// Run controller functionality
			$httpBackend.flush();

			$httpBackend.expectPUT('/proxy/' + encodeURIComponent('http://test/vs?changesetcontext=test')).respond([]);
			$httpBackend.expectGET('similarity?uri=test&forceRefresh=true').respond({similarity: []});

			scope.save();

			$httpBackend.flush();

			expect($location.path()).toEqual('/valuesetdefinitions/' + encodeURIComponent("http://test/vs"));
		}));

	});
}());