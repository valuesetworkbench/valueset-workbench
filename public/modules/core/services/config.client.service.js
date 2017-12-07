'use strict';

//Menu service used for managing  menus
angular.module('core').service('Config', [ 'Authentication',

	function(Authentication) {

		this.getResourceUriBase = function() {
			return config.resourceUriBase;
		}

		this.getCts2ServiceRoot = function() {
			return config.cts2ServiceRoot;
		}

		this.getApprovalPredicateUri = function() {
			return config.approvalPredicateUri;
		}

        this.getHeader = function() {
            return config.header;
        }

        this.isCedarEnabled = function() {
            return Authentication.user.cedarKey;
        }

	}
]);
