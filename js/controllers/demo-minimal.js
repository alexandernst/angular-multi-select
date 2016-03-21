demo.controller('demoMinimal', ['$scope', function ($scope) {

	$scope.input_data = [
		{ text: 'A', value: 'a', id: 1},
		{ text: 'B', value: 'b', id: 2, open: true, children: [
			{ text: 'C', value: 'c', id: 3, checked: true}
		]},
		{ text: 'D', value: 'd', id: 4, children: [
			{ text: 'E', value: 'e', id: 5},
			{ text: 'F', value: 'f', id: 6, checked: true}
		]}
	];

	$scope.output_data = [];

}]);
