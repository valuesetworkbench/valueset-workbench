'use strict';

//Menu service used for managing  menus
angular.module('core').service('Approvals', [

	function () {

		var this_ = this;

		this.hasApprovals = function (resource) {
			return this_.findApprovals(resource).length > 0;
		}

		this.findApprovals = function (resource) {
			var approvals = [];

			if (resource && resource.property) {
				angular.forEach(resource.property, function (property) {
					if (property.predicate.uri === APPROVAL_PREDICATE_URI) {
						approvals.push(property.value[0]);
					}
				});
			}

			return approvals;
		}

	}
]);
