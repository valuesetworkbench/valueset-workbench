'use strict';

angular.module('core')
    .directive('help', [function() {
        return {
            templateUrl:'modules/core/directives/help.client.view.html',
            restrict: 'E',
            scope: {
                content: '@content'
            }
        }
    }]);