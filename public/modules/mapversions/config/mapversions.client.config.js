'use strict';

// Configuring the Articles module
angular.module('mapversions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Maps', 'maps', 'dropdown', '/mapversions(/create)?', true, null, 1);
		Menus.addSubMenuItem('topbar', 'maps', 'Browse Maps', 'mapversions');

		//TODO: DO we want the create menu here?
		//Menus.addSubMenuItem('topbar', 'maps', 'Create a Map', 'mapversions-create', null, false, ['admin', 'sme']);
	}
]);
