'use strict';

//Valuesets service used to communicate Valuesets REST endpoints
angular.module('valuesetdefinitions').factory('DatabaseExplorer', ['$http',
	function($http) {
		var service = {};
		service.tables = function(connection, callback) {
			return $http.post("/databaseexplorer/tables", connection)
				.then(
					function(response) {
						callback(response.data)
					},
					function(response) {
						return callback(response.data, response.data.message);
					}
			);
		};

		service.columns = function(table, connection, callback) {
			return $http.post("/databaseexplorer/tables/" + table + "/columns", connection)
				.then(
					function(response) {
						callback(response.data)
					},
					function(response) {
						return callback(response.data, response.data.message);
					}
			);
		};

		service.query = function(table, columns, connection, callback) {
			return $http.post("/databaseexplorer/tables/" + table, {connection: connection, columns: columns})
				.then(
					function(response) {
						callback(response.data)
					},
					function(response) {
						return callback(response.data, response.data.message);
					}
			);
		};

		return service;
	}
]);
