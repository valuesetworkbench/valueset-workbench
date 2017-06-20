'use strict';

(function() {
	// Valuesets Controller Spec
	describe('View Valuesetdefinitions Controller Tests', function() {
		// Initialize global variables
		var ViewValuesetdefinitionsController,
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
			ViewValuesetdefinitionsController = $controller('ViewValuesetdefinitionsController', {
				$scope: scope
			});

		}));

		it('initialization should fetch the valueset', inject(function() {
			scope.id = 'http://some/vs/1';

			// Set GET response
			$httpBackend.expectGET('/proxy/' + encodeURIComponent('http://some/vs/1')).respond({ValueSetDefinitionMsg: {valueSetDefinition: {}}});
			$httpBackend.expectGET('/proxy/' + encodeURIComponent('http://some/vs/1/resolution')).respond({IteratableResolvedValueSet: {entry: []}});

			// Run controller functionality
			scope.findOne();

			$httpBackend.flush();
		}));

	});
}());