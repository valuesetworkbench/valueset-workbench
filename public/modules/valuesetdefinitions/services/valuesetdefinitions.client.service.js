'use strict';

//Valuesets service used to communicate Valuesets REST endpoints
angular.module('valuesetdefinitions').factory('Valuesetdefinitions', ['$http',
	function($http) {
		var service = {};
		service.query = function(params, callback) {
			return $http.get("/valuesetdefinitions", {params: params}).then(function(response) {callback(response)});
		};

		service.get = function(id, callback) {
			return $http.get("/proxy/" + encodeURIComponent(id)).then(function(response) {callback(response)});
		};

		service.getResolution = function(id, callback) {
			return $http.get("/proxy/" + encodeURIComponent(id + '/resolution')).then(function(response) {callback(response)});
		};

		service.new = function(valueSetDefinition, callback) {
			return $http.post("/valuesetdefinitions", valueSetDefinition).then(function(response) {callback(response)});
		};

		service.save = function(id, valueSetDefinition, callback) {
			return $http.put("/proxy/" + encodeURIComponent(id + "?changesetcontext=test"), valueSetDefinition).then(function(response) {callback(response)});
		};

		service.delete = function(id, callback) {
			return $http.delete("/proxy/" + encodeURIComponent(id + "?changesetcontext=test")).then(function(response) {callback(response)});
		};

		return service;
	}
]);
