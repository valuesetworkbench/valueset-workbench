'use strict';

//Setting up route
angular.module('codesystemversions').config(['$stateProvider',
	function($stateProvider) {
		// Codesystemversions state routing
		$stateProvider.
		state('listCodesystemversions', {
			url: '/codesystemversions',
			templateUrl: 'modules/codesystemversions/views/list-codesystemversions.client.view.html'
		}).
		state('createCodesystemversion', {
			url: '/codesystemversions-create',
			templateUrl: 'modules/codesystemversions/views/create-codesystemversion.client.view.html'
		}).
		state('viewCodesystemversion', {
			url: '/codesystemversions/:codesystemversionId',
			templateUrl: 'modules/codesystemversions/views/view-codesystemversion.client.view.html'
		}).
		state('editCodesystemversion', {
			url: '/codesystemversions/:codesystemversionId/edit?comment',
			reloadOnSearch:false,
			templateUrl: 'modules/codesystemversions/views/edit-codesystemversion.client.view.html'
		});
	}
]);
