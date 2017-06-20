'use strict';

//Mapversions service used to communicate Mapversions REST endpoints
angular.module('mapversions').factory('Mapversions', ['$http', 'Utils',
	function($http,Utils) {
		var service = {};
		service.query = function(params, callback) {
			return $http.get("/mapversions", {params: params}).then(function(response) {callback(response)});
		};

		service.get = function(id, callback) {
			return $http.get("/proxy/" + encodeURIComponent(id)).then(function(response) {callback(response)});
		};

		service.new = function(mapVersion, callback) {
			return $http.post("/mapversions", mapVersion).then(function(response) {callback(response)});
		};

		service.clone = function(cloneHref, mapVersion, callback) {
			return $http.post("/proxy/" + encodeURIComponent(cloneHref), mapVersion).then(function(response) {callback(response)});
		};

		service.getEntries = function(id, callback) {
			return $http.get("/proxy/" + id).then(function(response) {callback(response)});
		};

		service.save = function(id, mapVersion, callback) {
			return $http.put("/proxy/" + encodeURIComponent(id + "?changesetcontext=foo"), mapVersion).then(function(response) {callback(response)});
		};

		service.createMapEntry = function(serverRoot, mapEntry, callback) {
			return $http.post("/proxy/" + encodeURIComponent(Utils.stripTrailingSlash(serverRoot) + "/mapentry?changesetcontext=foo"), mapEntry).then(
				function(response) {
					$http.get("/proxy/" + encodeURIComponent(response.headers('location'))).then(callback);
				});
		};

		service.createMapEntries = function(changeSet, callback) {
			return $http.post("/mapversionentries", changeSet).then(function(response) {callback(response)});
		};

		service.saveMapEntry = function(id, mapEntry, callback) {
			return $http.put("/proxy/" + encodeURIComponent(id + "?changesetcontext=foo"), mapEntry).then(function(response) {callback(response)});
		};

		service.deleteMapEntry = function(id, callback) {
			return $http.delete("/proxy/" + encodeURIComponent(id + "?changesetcontext=foo")).then(function(response) {callback(response)});
		};

		service.deleteMapVersion = function(id, callback) {
			return $http.delete("/proxy/" + encodeURIComponent(id + "?changesetcontext=foo")).then(function(response) {callback(response)});
		};

		return service;
	}
]);
