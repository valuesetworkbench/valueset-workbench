'use strict';

//thanks -> https://gist.github.com/jeffjohnson9046/9470800
angular.module('core').filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
        return $filter('number')(input * 100, decimals) + '%';
    };
}]);
