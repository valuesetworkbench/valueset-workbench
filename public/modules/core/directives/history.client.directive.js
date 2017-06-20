'use strict';

angular.module('core')
    .directive('history',['$http', 'HistoryChange', function() {
        return {
            templateUrl:'modules/core/directives/history.client.view.html',
            restrict: 'E',
            replace: true,
            scope: {
                resource: '@resource'
            },
            controller: function($scope, $http, HistoryChange){
                $scope.getHistory = function() {
                    $http.get("/proxy/" + encodeURIComponent($scope.resource + "/changehistory")).then(function(response) {
                        $scope.changeHistory = response.data.MapVersionList.entry;
                    });
                };

                HistoryChange.registerObserverCallback(function() {
                    $scope.getHistory();
                });

                $scope.getHistory();
            }
        }
    }]);

angular.module('core')
    .factory('HistoryChange', function() {
        var observerCallbacks = [];

        return {
            registerObserverCallback: function(callback) {
                observerCallbacks.push(callback);
            },

            onHistoryChange: function(resource) {
                angular.forEach(observerCallbacks, function(callback){
                    callback(resource);
                });
            }
        }
    });