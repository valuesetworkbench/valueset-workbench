'use strict';

angular.module('core')
    .directive('switchVersions',['dialogs', function() {
        return {
            templateUrl:'modules/core/directives/switchversions.client.view.html',
            restrict: 'E',
            replace: true,
            scope: {
                href: '@href',
                current: '=current',
                directory: '@directory',
                resourceName: '@resourceName'
            },
            controller: function($scope, dialogs){

                $scope.switchVersions = function () {
                    var href = $scope.href;
                    var versionsHref = href.substr(0, href.lastIndexOf('/')) + 's';

                    var openFn = function () {
                        dialogs.create('/modules/core/directives/switchversions.client.view.modal.html', 'switchVersionsCtrl',
                            {
                                versionsHref: versionsHref,
                                current: $scope.current,
                                directory: $scope.directory,
                                resourceName: $scope.resourceName
                            });
                    };
                    openFn();
                };

        }}}]).controller('switchVersionsCtrl', function ($log, $http, $timeout, $scope, $modalInstance, dialogs, $location, data) {

            $scope.current = data.current;

            $http.get("/proxy/" + encodeURIComponent(data.versionsHref)).then(function (response) {
                $scope.directory = response.data[data.directory];
            });

            $scope.switch = function (version) {
                $location.path('/' + data.resourceName + 's/' + encodeURIComponent(version.href) + '/edit');
                $scope.done();
            };

            ///
            $scope.done = function () {
                $modalInstance.close($scope);
            }; // end done

    });

