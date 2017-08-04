'use strict';

angular.module('core')
    .directive('history',['$http', 'HistoryChange', 'Users', 'dialogs', function() {
        return {
            templateUrl:'modules/core/directives/history.client.view.html',
            restrict: 'E',
            replace: true,
            scope: {
                resource: '@resource',
                toStringFn: '&'
            },
            controller: function($scope, $http, HistoryChange, Users, dialogs){
                $scope.getHistory = function() {
                    $http.get("/proxy/" + encodeURIComponent($scope.resource + "/changehistory")).then(function(response) {
                        $scope.changeHistory = response.data[Object.keys(response.data)[0]].entry;
                    });
                };

                HistoryChange.registerObserverCallback(function() {
                    $scope.getHistory();
                });

                $scope.getHistory();

                $scope.diff = function(change) {
                    dialogs.create('/modules/core/directives/diff.client.modal.html', 'DiffController',
                        {
                            "from": $scope.toStringFn()(change),
                            "to": $scope.toStringFn()()
                        });
                }

                $scope.getUserDetails = function(change) {
                    if (change.changeDescription && change.changeDescription.changeSource && change.changeDescription.changeSource.content) {
                        Users.query({email: change.changeDescription.changeSource.content}, function (result) {
                            result = result[0];
                            change.changeDescription.changeSourceExtra = {
                                photo: result.photoUrl,
                                displayName: result.displayName
                            };
                        });
                    }
                };
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