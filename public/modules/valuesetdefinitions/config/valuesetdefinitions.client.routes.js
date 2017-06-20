'use strict';

//Setting up route
angular.module('valuesetdefinitions').config(['$stateProvider',
	function($stateProvider) {
		// Valuesets state routing
		$stateProvider.
		state('listValuesetdefinitions', {
			url: '/valuesetdefinitions',
			templateUrl: 'modules/valuesetdefinitions/views/list-valuesetdefinitions.client.view.html'
		}).
		state('createValuesetdefinition', {
			url: '/valuesetdefinitions-create',
			templateUrl: 'modules/valuesetdefinitions/views/create-valuesetdefinition.client.view.html'
		}).
		state('viewValuesetdefinition', {
			url: '/valuesetdefinitions/:valuesetdefinitionId',
			templateUrl: 'modules/valuesetdefinitions/views/view-valuesetdefinition.client.view.html'
		}).
		state('editValuesetdefinition', {
			url: '/valuesetdefinitions/:valuesetdefinitionId/edit?comment',
			reloadOnSearch:false,
			templateUrl: 'modules/valuesetdefinitions/views/edit-valuesetdefinition.client.view.html'
		});
	}
]);
