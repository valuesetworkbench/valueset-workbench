'use strict';

// Configuring the Articles module
angular.module('services').run(['Menus',
	function(Menus) {
		// Set top bar menu items

		// for now, disable this...
		//Menus.addMenuItem('topbar', 'Services', 'services', 'dropdown', '/services(/create)?', null, null, 10);
		//Menus.addSubMenuItem('topbar', 'services', 'Show Services', 'services');
	}
]);
