'use strict';

//Setting up route
angular.module('exports').config(['$stateProvider',
	function($stateProvider) {
		// Exports state routing
		$stateProvider.
		state('listExports', {
			url: '/exports',
			templateUrl: 'modules/exports/views/list-exports.client.view.html'
		}).
		state('createExport', {
			url: '/exports/create',
			templateUrl: 'modules/exports/views/create-export.client.view.html'
		}).
		state('viewExport', {
			url: '/exports/:exportId',
			templateUrl: 'modules/exports/views/view-export.client.view.html'
		}).
		state('editExport', {
			url: '/exports/:exportId/edit',
			templateUrl: 'modules/exports/views/edit-export.client.view.html'
		});
	}
]);