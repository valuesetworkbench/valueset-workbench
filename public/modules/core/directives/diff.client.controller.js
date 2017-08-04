'use strict';


angular.module('core')
    .controller('DiffController', function ($scope, $injector, $http, Groups, Users, Authentication, Config, $modalInstance, data) {

        var diff = JsDiff.createPatch("History", data.from, data.to, "Old File", "New File");

        var diff2htmlUi = new Diff2HtmlUI({
            diff: diff
        });

        $modalInstance.rendered.then(function () {
            diff2htmlUi.draw($('.diff'), {
                outputFormat: "side-by-side"
            });
        });

        $scope.done = function () {
            $modalInstance.close($scope);
        };

    });