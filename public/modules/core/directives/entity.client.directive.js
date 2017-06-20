'use strict';

angular.module('core')
    .directive('entityNameAndUri',[function() {
        return {
            templateUrl:'modules/core/directives/entityNameAndUri.client.view.html',
            restrict: 'E',
            transclude: true,
            scope: {
                entity: '=entity'
            }
        }
    }]);
