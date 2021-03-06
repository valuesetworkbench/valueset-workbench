'use strict';

//Menu service used for managing  menus
angular.module('core').service('Utils', [

	function() {

		// http://stackoverflow.com/a/1634841/656853
		this.removeURLParameter = function (url, parameter) {
			//prefer to use l.search if you have a location/link object
			var urlparts= url.split('?');
			if (urlparts.length>=2) {

				var prefix= encodeURIComponent(parameter)+'=';
				var pars= urlparts[1].split(/[&;]/g);

				//reverse iteration as may be destructive
				for (var i= pars.length; i-- > 0;) {
					//idiom for string.startsWith
					if (pars[i].lastIndexOf(prefix, 0) !== -1) {
						pars.splice(i, 1);
					}
				}

				url= urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
				return url;
			} else {
				return url;
			}
		}

		this.stripTrailingSlash = function (url) {
			return url.replace(/\/+$/, "");
		}

		this.detectCsvOrTsv = function (text) {
            var x = text.split('\n');

            var voteCsv = 0;
            var voteTsv = 0;
            for (var i=0; i<x.length; i++) {
                var tsv = x[i].split('\t').length;
                var csv = x[i].split(',').length;
                if(tsv > csv) {
                    voteTsv++;
                } else {
                    voteCsv++;
                }
            }

            var delimiter;
            if(tsv > csv) {
                delimiter = '\t';
            } else {
                delimiter = ',';
            }

            return delimiter;
		}

	}
]);
