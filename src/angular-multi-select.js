var angular_multi_select = angular.module('angular-multi-select', [
	'angular-multi-select-engine',
	'angular-multi-select-styles-helper',
	'angular-multi-select-data-converter'
]);

angular_multi_select.directive('angularMultiSelect', [
	'angularMultiSelectEngine',
	'angularMultiSelectStylesHelper',
	'angularMultiSelectDataConverter',
	function (angularMultiSelectEngine, angularMultiSelectStylesHelper, angularMultiSelectDataConverter) {
		return {
			restrict: 'AE',

			scope: {
				inputModel: '=',
				outputModel: '='
			},

			templateUrl: '../src/angular-multi-select.tpl',

			link: function ($scope, element, attrs) {

				var keys = {
					ID_PROPERTY : 'num',
					OPEN_PROPERTY : 'abierto',
					CHECKED_PROPERTY : 'seleccionado',
					CHILDREN_PROPERTY : 'hijos',
				};

				var amse = new angularMultiSelectEngine(keys);
				var amssh = new angularMultiSelectStylesHelper(keys);

				$scope.amse = amse;
				$scope.amssh = amssh;



				amse.on_data_change(function () {
					$scope.items = amse.get_visible_tree();

					console.log("asdasd", $scope.outputModel);
					//if ($scope.outputModel !== undefined) {
						//TODO: fill the output only with the desired results
						// TIP: Use dataConverter
						$scope.outputModel = amse.get_checked_tree();
					//}
				});

				amse.on_visual_change(function () {
					$scope.items = amse.get_visible_tree();
				});

				$scope.$watch('inputModel', function (_new, _old) {
					amse.insert($scope.inputModel);
				});
			}
		};
	}
]);
