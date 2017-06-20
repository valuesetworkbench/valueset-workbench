'use strict';

(function() {
	// Notifications Controller Spec
	describe('Notifications Controller Tests', function() {
		// Initialize global variables
		var NotificationsController,
		scope,
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

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Notifications controller.
			NotificationsController = $controller('NotificationsController', {
				$scope: scope
			});
		}));

		/* TODO
		it('$scope.find() should create an array with at least one Notification object fetched from XHR', inject(function(Notifications) {
			// Create sample Notification using the Notifications service
			var sampleNotification = new Notifications({
				name: 'New Notification'
			});

			// Create a sample Notifications array that includes the new Notification
			var sampleNotifications = [sampleNotification];

			// Set GET response
			$httpBackend.expectGET('notifications').respond(sampleNotifications);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.notifications).toEqualData(sampleNotifications);
		}));

		it('$scope.findOne() should create an array with one Notification object fetched from XHR using a notificationId URL parameter', inject(function(Notifications) {
			// Define a sample Notification object
			var sampleNotification = new Notifications({
				name: 'New Notification'
			});

			// Set the URL parameter
			$stateParams.notificationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/notifications\/([0-9a-fA-F]{24})$/).respond(sampleNotification);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.notification).toEqualData(sampleNotification);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Notifications) {
			// Create a sample Notification object
			var sampleNotificationPostData = new Notifications({
				name: 'New Notification'
			});

			// Create a sample Notification response
			var sampleNotificationResponse = new Notifications({
				_id: '525cf20451979dea2c000001',
				name: 'New Notification'
			});

			// Fixture mock form input values
			scope.name = 'New Notification';

			// Set POST response
			$httpBackend.expectPOST('notifications', sampleNotificationPostData).respond(sampleNotificationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Notification was created
			expect($location.path()).toBe('/notifications/' + sampleNotificationResponse._id);
		}));

		it('$scope.update() should update a valid Notification', inject(function(Notifications) {
			// Define a sample Notification put data
			var sampleNotificationPutData = new Notifications({
				_id: '525cf20451979dea2c000001',
				name: 'New Notification'
			});

			// Mock Notification in scope
			scope.notification = sampleNotificationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/notifications\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/notifications/' + sampleNotificationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid notificationId and remove the Notification from the scope', inject(function(Notifications) {
			// Create new Notification object
			var sampleNotification = new Notifications({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Notifications array and include the Notification
			scope.notifications = [sampleNotification];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/notifications\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleNotification);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.notifications.length).toBe(0);
		}));
		*/
	});
}());