'use strict';

// Configuring the Articles module
angular.module('valuesetdefinitions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Value Sets', 'valuesets', 'dropdown', '/valuesetdefinitions(/create)?', true, null, 0);
		Menus.addSubMenuItem('topbar', 'valuesets', 'Browse Value Sets', 'valuesetdefinitions');

		//TODO: DO we want the create menu here?
		//Menus.addSubMenuItem('topbar', 'valuesets', 'Create a Value Set', 'valuesetdefinitions-create', null, false, ['admin', 'sme']);
	}
]);
