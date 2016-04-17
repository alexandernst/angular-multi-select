demo.controller('demoOutputTypes', ['$scope', function ($scope) {

	$scope.input_data = [
		{ text: 'A', value: 'a', id: 1},
		{ text: 'B', value: 'b', id: 2},
		{ text: 'C', value: 'c', id: 3, checked: true},
		{ text: 'D', value: 'd', id: 4},
		{ text: 'E', value: 'e', id: 5},
		{ text: 'F', value: 'f', id: 6, checked: true}
	];

	$scope.output_data_1 = [];
	$scope.output_data_2 = [];
	$scope.output_data_3 = [];
	$scope.output_data_4 = [];
	$scope.output_data_5 = [];
	$scope.output_data_6 = [];

}]);
