'use strict';

//Setting up route
angular.module('mapversions').config(['$stateProvider',
	function($stateProvider) {
		// Mapversions state routing
		$stateProvider.
		state('listMapversions', {
			url: '/mapversions',
			templateUrl: 'modules/mapversions/views/list-mapversions.client.view.html'
		}).
		state('createMapversion', {
			url: '/mapversions-create',
			templateUrl: 'modules/mapversions/views/create-mapversion.client.view.html'
		}).
		state('viewMapversion', {
			url: '/mapversions/:mapversionId',
			templateUrl: 'modules/mapversions/views/view-mapversion.client.view.html'
		}).
		state('editMapversion', {
			url: '/mapversions/:mapversionId/edit?comment',
			reloadOnSearch:false,
			templateUrl: 'modules/mapversions/views/edit-mapversion.client.view.html'
		});
	}
]);
