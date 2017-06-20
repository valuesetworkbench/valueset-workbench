'use strict';

//Codesystemversions service used to communicate Codesystemversions REST endpoints
angular.module('codesystemversions').factory('Codesystemversions', ['$http',
	function($http) {
		var service = {};
		service.query = function(params, callback) {
			return $http.get("/codesystemversions", {params: params}).then(function(response) {callback(response)});
		};

		service.get = function(id, callback) {
			return $http.get("/proxy/" + encodeURIComponent(id)).then(function(response) {callback(response)});
		};

		service.new = function(codesystemversion, callback) {
			return $http.post("/codesystemversions", codesystemversion).then(function(response) {callback(response)});
		};

		service.clone = function(cloneHref, codesystemversion, callback) {
			return $http.post("/proxy/" + encodeURIComponent(cloneHref), codesystemversion).then(function(response) {callback(response)});
		};

		service.getEntities = function(id, callback) {
			return $http.get("/proxy/" + id).then(function(response) {callback(response)});
		};

		service.save = function(id, codesystemversion, callback) {
			return $http.put("/proxy/" + encodeURIComponent(id + "?changesetcontext=foo"), codesystemversion).then(function(response) {callback(response)});
		};

		return service;
	}
]);
