var app = angular.module('demo', [
	'angular-multi-select',
	'angular-multi-select-data-converter',
	'angular-multi-select-styles-helper'
]);

app.controller('MainCtrl', [
	'$scope',
	'$interval',
	'angularMultiSelect',
	'angularMultiSelectDataConverter',
	'angularMultiSelectStylesHelper',
	function($scope, $interval, angularMultiSelect, angularMultiSelectDataConverter, angularMultiSelectStylesHelper) {

		var ams = new angularMultiSelect();
		var dc = new angularMultiSelectDataConverter();

		$scope.angularMultiSelect = ams;
		$scope.angularMultiSelectStylesHelper = angularMultiSelectStylesHelper;

		console.time('check_prerequisites');
		var checked_data = dc.check_prerequisites(full_data);
		console.timeEnd('check_prerequisites');

		console.time('to_internal');
		var internal_data = dc.to_internal(checked_data);
		console.timeEnd('to_internal');

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
