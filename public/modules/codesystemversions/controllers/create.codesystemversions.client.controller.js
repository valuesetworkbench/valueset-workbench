'use strict';

// Codesystemversions controller
angular.module('codesystemversions').controller('CreateCodesystemversionsController', ['$scope', '$http', '$location', 'Authentication', 'Codesystemversions', 'Valuesetdefinitions', 'Notification', 'HistoryChange', 'Utils', 'Config',
    function ($scope, $http, $location, Authentication, Codesystemversions, Valuesetdefinitions, Notification, HistoryChange, Utils, Config) {

        $scope.authentication = Authentication;

        $scope.create = function () {
            var codesystemversion = {
                about: Config.getResourceUriBase() + '/codesystem/' + $scope.name + '/version/1',
                officialResourceVersionId: '1',
                codeSystemVersionName: $scope.name + '-1',
                versionOf: {
                    content: $scope.name
                }
            };

            Codesystemversions.new({Codesystemversion: codesystemversion}, function (response) {
                    var location = encodeURIComponent(Utils.removeURLParameter(response.data.headers.location, 'changesetcontext'));

                    $location.path('/codesystemversions/' + location + '/edit');

                    Notification.success('Code System Version Saved');
                });

            HistoryChange.onHistoryChange();
        };

    }]);
