var app = angular.module('demo', ['angular-multi-select']);

app.controller('MainCtrl', function($scope, dataConverter, stylesHelper) {
	$scope.get_checked_class = stylesHelper.get_checked_class;
	$scope.get_open_class = stylesHelper.get_open_class;
	$scope.get_type_class = stylesHelper.get_type_class;

	var checked_data = dataConverter.check_prerequisites(full_data);
    $scope.items = dataConverter.to_internal(checked_data);
});
