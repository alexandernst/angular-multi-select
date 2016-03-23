demo.controller('demoLeafsNodesStyling', ['$scope', function ($scope) {

	$scope.input_data = [
		{ text: 'A', value: 'a', id: 1},
		{ text: 'B', value: 'b', id: 2, open: true, children: [
			{ text: 'C', value: 'c', id: 3, checked: true}
		]},
		{ text: 'D', value: 'd', id: 4, children: [
			{ text: 'E', value: 'e', id: 5},
			{ text: 'F', value: 'f', id: 6, checked: true}
		]},
		{ text: 'G', value: 'g', id: 7, children: [
			{ text: 'H', value: 'h', id: 8},
			{ text: 'I', value: 'i', id: 9, children: [
				{ text: 'J', value: 'j', id: 10},
				{ text: 'K', value: 'k', id: 11}
			]},
			{ text: 'L', value: 'l', id: 12},
			{ text: 'M', value: 'm', id: 13}
		]}
	];

	$scope.output_data_1 = [];
	$scope.output_data_2 = [];

}]);
