'use strict';

(function() {
	// Notifications Controller Spec
	describe('Notifications Observable Tests', function() {
		// Initialize global variables
		var NotificationObservable,
			$httpBackend;

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

		beforeEach(module(function($urlRouterProvider) { $urlRouterProvider.deferIntercept(); }));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function (_NotificationObservable_, _$httpBackend_) {
			// Initialize the Notifications controller.
			NotificationObservable = _NotificationObservable_;
			$httpBackend = _$httpBackend_;
		}));

		it('NotificationObservable not null', function() {
			expect(NotificationObservable).not.toBeNull()
		});

		it('NotificationObservable test register observable', function() {
			var count = 0;

			NotificationObservable.registerObserverCallback(function(count_) {
				count = count_;
			});

			$httpBackend.expectGET('notifications?unread=true').respond([]);

			NotificationObservable.setUnreadNotifications(1);

			expect(count).toBe(1);
		});

		it('NotificationObservable test refresh', function() {
			var count = 0;

			$httpBackend.expectGET('notifications?unread=true').respond([]);
			$httpBackend.expectGET('notifications?unread=true').respond([{}]);

			NotificationObservable.registerObserverCallback(function(count_) {
				count = count_;
			});

			NotificationObservable.refresh(function() {
				expect(count).toBe(1);
			});

			$httpBackend.flush();
		});

	});
}());