'use strict';

// Exports controller
angular.module('exports').controller('ExportsController', ['$scope', '$stateParams', '$location', 'dialogs', 'Authentication', 'Exports', 'Valuesets',
	function($scope, $stateParams, $location, dialogs, Authentication, Exports, Valuesets ) {
		$scope.authentication = Authentication;

        // Find a list of Valuesets
        $scope.findValueSets = function() {
            $scope.valuesets = Valuesets.query();
        };

        $scope.findValueSets();

        $scope.clearAllExports = function() {
            for(var i=0;i<$scope.valuesets.length;i++) { delete $scope.valuesets[i].export }
        }

        $scope.selectAllExports = function() {
            for(var i=0;i<$scope.valuesets.length;i++) { $scope.valuesets[i].export = true }
        }

        $scope.hasExport = function(valuesets) {
            for(var i=0;i<valuesets.length;i++) {
                if(valuesets[i].export == true) {
                    return true;
                }
            }

            return false;
        }

        $scope.export = function() {
            var exported = [];
            dialogs.create('/modules/exports/views/exports-modal.html', 'exportCtrl', exported);

            for(var i=0;i<$scope.valuesets.length;i++) {
                var valueset = $scope.valuesets[i];

                if(valueset.export) {
                    var export_ = new Exports ({
                        valuesetId: valueset.id
                    });

                    (function(valueset_) {
                        export_.$save(function(response) {
                            exported.push(valueset_);
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                    })(valueset);
                }
            }
        }

		// Create new Export
		$scope.create = function() {
			// Create new Export object
			var export_ = new Exports ({
				name: this.name
			});

			// Redirect after save
			export_.$save(function(response) {
				$location.path('exports/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Export
		$scope.remove = function( export_ ) {
			if ( export_ ) { export_.$remove();

				for (var i in $scope.exports ) {
					if ($scope.exports [i] === export_ ) {
						$scope.exports.splice(i, 1);
					}
				}
			} else {
				$scope.export.$remove(function() {
					$location.path('exports');
				});
			}
		};

		// Update existing Export
		$scope.update = function() {
			var export_ = $scope.export;

			export_.$update(function() {
				$location.path('exports/' + export_._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Exports
		$scope.find = function() {
			$scope.exports = Exports.query();
		};

		// Find existing Export
		$scope.findOne = function() {
			$scope.export = Exports.get({ 
				exportId: $stateParams.exportId
			});
		};
	}
]).controller('exportCtrl',function($log,$http,$timeout,$scope,$modalInstance,data){

        $scope.exported = data;
        //

        ///
        $scope.done = function(){
            $modalInstance.close($scope);
        }; // end done
    }) // end customCodeCtrl

    .config(function(dialogsProvider){
        // this provider is only available in the 4.0.0+ versions of angular-dialog-service
        dialogsProvider.useBackdrop(true);
        dialogsProvider.useEscClose(true);
        dialogsProvider.useCopy(false);
        dialogsProvider.setSize('lg');
    });