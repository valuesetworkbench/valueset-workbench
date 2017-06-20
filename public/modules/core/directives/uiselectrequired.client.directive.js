'use strict';

angular.module('core')
    .directive('uiSelectRequired', function () {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.uiSelectRequired = function(modelValue, viewValue) {
                    if (modelValue) {
                        return true;
                    }
                    return false;
                };
            }
        };
    });
