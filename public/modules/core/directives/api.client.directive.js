'use strict';

angular.module('core')
    .directive('api',['$http', 'Authentication', 'dialogs', function() {
        return {
            templateUrl:'modules/core/directives/api.client.view.html',
            restrict: 'E',
            replace: true,
            scope: {
                api: '=api'
            },
            controller: function($scope, dialogs){
                var openFn = function () {

                    dialogs.create('modules/core/directives/api.client.modal.html', 'api-modalCtrl',{api: $scope.api});
                };

                $scope.open = function() {
                    openFn();
                }
            }
        }
    }]).controller('api-modalCtrl', function ($scope, $modalInstance, Config, Authentication, data) {

        $scope.user = Authentication.user;

        $scope.getUrl = function(entry) {
            var url = entry.url;
            if (entry.type == "local") {
                return window.location.origin + "/" + url;
            }

            if (entry.type == "cts2") {
                return url.replace(Config.getCts2ServiceRoot(), window.location.origin + "/cts2/");
            }
        }

        // http://stackoverflow.com/a/6021027/656853
        $scope.addJsonParam = function(uri) {
            var key = 'format';
            var value = 'json';

            var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
            var separator = uri.indexOf('?') !== -1 ? "&" : "?";
            if (uri.match(re)) {
                return uri.replace(re, '$1' + key + "=" + value + '$2');
            }
            else {
                return uri + separator + key + "=" + value;
            }
        }

        $scope.api = data.api;

        $scope.done = function () {
            $modalInstance.dismiss('canceled');
        }; // end cancel

    });