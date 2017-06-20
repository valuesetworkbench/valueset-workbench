'use strict';

//Menu service used for managing  menus
angular.module('core').service('Config', [

	function() {

		this.getResourceUriBase = function() {
			return config.resourceUriBase;
		}

		this.getCts2ServiceRoot = function() {
			return config.cts2ServiceRoot;
		}

		this.getApprovalPredicateUri = function() {
			return config.approvalPredicateUri;
		}

	}
]);