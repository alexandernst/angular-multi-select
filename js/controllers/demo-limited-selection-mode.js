demo.controller('demoLimitedSelectionMode', ['$scope', function ($scope) {

	$scope.input_data = [
		{ text: 'A', value: 'a', id: 1},
		{ text: 'B', value: 'b', id: 2},
		{ text: 'C', value: 'c', id: 3},
		{ text: 'D', value: 'd', id: 4},
		{ text: 'E', value: 'e', id: 5},
		{ text: 'F', value: 'f', id: 6}
	];

	$scope.output_data = [];

}]);
