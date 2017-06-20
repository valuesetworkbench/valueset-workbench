'use strict';

angular.module('valuesetdefinitions')
    .directive('gauge',[function() {
        return {
            templateUrl:'modules/valuesetdefinitions/directives/gauge.client.view.html',
            restrict: 'E',
            replace: true,
            scope: {
                value: '@value',
                max: '@max',
                hideScore: "@hideScore"
            },
            controller: function($scope){
                $scope.getNumber = function(num) {
                    var max = Math.round($scope.max);
                    var fillSize = Math.round((num / $scope.max) * max);
                    var arr = new Array(max + 1).fill(false);
                    angular.forEach(arr, function(_, i) {
                        if(i <= fillSize) {
                            arr[i] = true;
                        }
                    });

                    return arr;
                }
            }
        }
    }]);
