'use strict';

(function () {
    // Mapversions Controller Spec
    describe('Approvals Directive Tests', function () {
        // Initialize global variables
        var ApprovalsController,
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
            ApprovalsController = $controller('ApprovalsController', {
                $scope: scope,
                Config: {
                    getApprovalPredicateUri: function () {
                        return "test";
                    }
                },
                Authentication: {
                    user: {
                        username: 'someuser'
                    }
                }
            });
        }));

        it('cant unapprove if not in group', function () {
            var canUnapprove = scope.canUnapprove({entity: {uri: "test"}});

            expect(canUnapprove).not.toBeDefined();
        });

        it('can unapprove if in group', function () {
            scope.groups = [
                {
                    _id: "test",
                    name: "test"
                }
            ]

            var canUnapprove = scope.canUnapprove({entity: {uri: "test"}});

            expect(canUnapprove).toBeTruthy();
        });

    });
}());