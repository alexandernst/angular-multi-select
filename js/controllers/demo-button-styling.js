demo.controller('demoButtonStyling', ['$scope', function ($scope) {

	$scope.input_data = [
		{ text: 'A', value: 'a', id: 1},
		{ text: 'B', value: 'b', id: 2},
		{ text: 'C', value: 'c', id: 3, checked: true},
		{ text: 'D', value: 'd', id: 4},
		{ text: 'E', value: 'e', id: 5},
		{ text: 'F', value: 'f', id: 6, checked: true}
	];

	$scope.input_data_2 = [
		{ text: 'A', value: 'a', id: 1, children: [
			{ text: 'A 1', value: 'a1', id: 11},
			{ text: 'A 2', value: 'a2', id: 12},
			{ text: 'A 3', value: 'a3', id: 13, children: [
				{ text: 'A 11', value: 'a11', id: 111},
				{ text: 'A 12', value: 'a12', id: 112},
				{ text: 'A 13', value: 'a13', id: 113}
			]},
		]},
		{ text: 'B', value: 'b', id: 2, children: [
			{ text: 'B 1', value: 'b1', id: 21},
			{ text: 'B 2', value: 'b2', id: 22},
		]},
		{ text: 'C', value: 'c', id: 3},
		{ text: 'D', value: 'd', id: 4, children: [
			{ text: 'D 1', value: 'd1', id: 41, children: [
				{ text: 'D 11', value: 'd11', id: 411, children: [
					{ text: 'D 111', value: 'd111', id: 4111, children: [
						{ text: 'D 1111', value: 'd1111', id: 41111}
					]}
				]}
			]}
		]},
		{ text: 'E', value: 'e', id: 5},
		{ text: 'F', value: 'f', id: 6, children: [
			{ text: 'F 1', value: 'f1', id: 61},
			{ text: 'F 2', value: 'f2', id: 62},
		]}
	];

	$scope.output_data_1 = [];
	$scope.output_data_2 = [];
	$scope.output_data_3 = [];

}]);
