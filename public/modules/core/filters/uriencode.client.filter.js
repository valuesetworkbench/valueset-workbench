'use strict';

angular.module('core').filter('uriencode', [
	function() {
		return function(input) {
			var encodedString = escape(encodeURIComponent(input));

            return encodedString;
		};
	}
]).filter('encodeURIComponent', [
	function() {
		return function(input) {
			return encodeURIComponent(input);
		};
	}
]);
