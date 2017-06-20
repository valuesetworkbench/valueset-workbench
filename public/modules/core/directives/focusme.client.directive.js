'use strict';

// from http://stackoverflow.com/a/28404648/656853

angular.module('core').directive('focusMe', function($timeout) {
    return {
        scope: { trigger: '@focusMe' },
        link: function (scope, el) {
            scope.$watch('trigger', function (value) {
                if (value === "true") {
                    $timeout(function () {
                        el[0].focus();
                    });
                }
            });
        }
    };
});