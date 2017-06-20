'use strict';

(function() {
	describe('Change', function() {
		//Initialize global variables
		var change;

		// Load the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		beforeEach(inject(function(Change) {
			change = Change;
		}));

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

		it('Change service should initialize', function() {
			expect(change).toBeTruthy();
		});

		it('Change service initial ChangeHolder initialize', function() {
			expect(change.newChangeHolder()).toBeTruthy();
		});

		it('Change service initially should be non-dirty', function() {
			expect(change.newChangeHolder().isDirty()).toBe(false);
		});

		it('Change service after change should be dirty', function() {
			var changeHolder = change.newChangeHolder()
			changeHolder.addChange(function () {
				//
			});
			expect(changeHolder.isDirty()).toBe(true);
		});

		it('Change service dirty observer', function(done) {
			var changeHolder = change.newChangeHolder()

			changeHolder.observe(function (isDirty) {
				expect(isDirty).toBe(true);
				expect(changeHolder.isDirty()).toBe(true);
				done()
			});

			changeHolder.addChange(function () {
				//
			});

		});


	});

})();