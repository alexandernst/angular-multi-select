var app = angular.module('demo', [
	'angular-multi-select',
	'angular-multi-select-data-converter',
	'angular-multi-select-styles-helper'
]);

app.controller('MainCtrl', [
	'$scope',
	'angularMultiSelect',
	'angularMultiSelectDataConverter',
	'angularMultiSelectStylesHelper',
	function($scope, angularMultiSelect, angularMultiSelectDataConverter, angularMultiSelectStylesHelper) {

		var keys = {
			ID_PROPERTY : 'num',
			OPEN_PROPERTY : 'abierto',
			CHECKED_PROPERTY : 'seleccionado',
			CHILDREN_PROPERTY : 'hijos',
		};

		var ams = new angularMultiSelect(keys);
		var amssh = new angularMultiSelectStylesHelper(keys);
		var dc = new angularMultiSelectDataConverter(keys);

		$scope.ams = ams;
		$scope.amssh = amssh;

		var checked_data = dc.check_prerequisites(full_data_2);
		var internal_data = dc.to_internal(checked_data);

		ams.insert(internal_data);

		$scope.items = ams.get_visible_tree();

		ams.on_data_change(function () {
			$scope.items = ams.get_visible_tree();
		});

		ams.on_visual_change(function () {
			$scope.items = ams.get_visible_tree();
		});
	}
]);
