'use strict';

// Valuesets controller
angular.module('valuesetdefinitions').controller('CreateValuesetdefinitionsController', ['$scope', '$location', 'Valuesetdefinitions', 'Notification', 'Utils', 'Config',
    function ($scope, $location, Valuesetdefinitions, Notification, Utils, Config) {

        $scope.valueSetDefinition = {
            sourceAndRole: []
        };

        $scope.create = function () {
            var valueSetDefinition = {
                about: Config.getResourceUriBase() + '/valueset/' + $scope.name + '/definition/1',
                officialResourceVersionId: '1',
                definedValueSet: {
                    content: $scope.name
                },
                sourceAndRole: $scope.valueSetDefinition.sourceAndRole,
                changeDescription: {
                    changeType: "CREATE",
                    committed: "PENDING",
                    containingChangeSet: "change",
                    changeDate: new Date()
                }
            };

            Valuesetdefinitions.new({ValueSetDefinition: valueSetDefinition}, function (response) {
                var statusCode = response.data.statusCode;
                if (statusCode === 201) {
                    Notification.success('New ValueSetDefinition Created');

                    var location = encodeURIComponent(Utils.removeURLParameter(response.data.headers.location, 'changesetcontext'));

                    $location.path('/valuesetdefinitions/' + location + '/edit');
                } else {
                    if (statusCode === 409) {
                        Notification.error('ValueSetDefinition with name `' + $scope.name + '` already exists.');
                    }
                }
            });

        };

    }
]).config(function (dialogsProvider) {
    // this provider is only available in the 4.0.0+ versions of angular-dialog-service
    dialogsProvider.useBackdrop(true);
    dialogsProvider.useEscClose(true);
    dialogsProvider.useCopy(false);
    dialogsProvider.setSize('lg');
});
