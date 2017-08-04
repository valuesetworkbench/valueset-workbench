'use strict';

// Configuring the Articles module
angular.module('codesystemversions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		/*
		Menus.addMenuItem('topbar', 'Code Systems', 'codesystems', 'dropdown', '/codesystemversions(/create)?', true, null, 2);
		Menus.addSubMenuItem('topbar', 'codesystems', 'Browse Code Systems', 'codesystemversions');
		Menus.addSubMenuItem('topbar', 'codesystems', 'Create a Code System', 'codesystemversions-create', null, false, ['admin', 'sme']);
		*/
	}
]);
