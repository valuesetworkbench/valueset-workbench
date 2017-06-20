'use strict';

//Exports service used to communicate Exports REST endpoints
angular.module('exports').factory('Exports', ['$resource',
	function($resource) {
		return $resource('exports/:exportId', { exportId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);