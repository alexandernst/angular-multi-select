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

	$scope.angularMultiSelectStylesHelper = angularMultiSelectStylesHelper;
	$scope.angularMultiSelect = angularMultiSelect;


	console.time('check_prerequisites');
	var checked_data = angularMultiSelectDataConverter.check_prerequisites(full_data);
	console.timeEnd('check_prerequisites');

	console.time('to_internal');
	var internal_data = angularMultiSelectDataConverter.to_internal(checked_data);
	console.timeEnd('to_internal');

	angularMultiSelect.insert(internal_data);

	$scope.items = angularMultiSelect.get_visible_tree();
	angularMultiSelect.on_data_change(function () {
		$scope.items = angularMultiSelect.get_visible_tree();
	});
}]);
