var full_data = [
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
	]},
	{ text: 'N', value: 'n', id: 14, open: true, children: [
		{ text: 'O', value: 'o', id: 15},
		{ text: 'P', value: 'p', id: 16, open: true, children: [
			{ text: 'Q', value: 'q', id: 17, open: true, children: [
				{ text: 'R', value: 'r', id: 18, children: [
					{ text: 'S', value: 's', id: 19, checked: true}
				]},
				{ text: 'T', value: 't', id: 20}
			]},
			{ text: 'U', value: 'u', id: 21}
		]},
		{ text: 'V', value: 'v', id: 22}
	]},
	{ text: 'W', value: 'w', id: 23},
	{ text: 'X', value: 'x', id: 24, children: [
		{ text: 'Y', value: 'y', id: 25, checked: true},
		{ text: 'Z', value: 'z', id: 26, checked: true}
	]}
];

var full_data_2 = [
	{ text: 'A', value: 'a', num: 1},
	{ text: 'B', value: 'b', num: 2, abierto: true, hijos: [
		{ text: 'C', value: 'c', num: 3, seleccionado: true}
	]},
	{ text: 'D', value: 'd', num: 4, hijos: [
		{ text: 'E', value: 'e', num: 5},
		{ text: 'F', value: 'f', num: 6, seleccionado: true}
	]},
	{ text: 'G', value: 'g', num: 7, hijos: [
		{ text: 'H', value: 'h', num: 8},
		{ text: 'I', value: 'i', num: 9, hijos: [
			{ text: 'J', value: 'j', num: 10},
			{ text: 'K', value: 'k', num: 11}
		]},
		{ text: 'L', value: 'l', num: 12},
		{ text: 'M', value: 'm', num: 13}
	]},
	{ text: 'N', value: 'n', num: 14, abierto: true, hijos: [
		{ text: 'O', value: 'o', num: 15},
		{ text: 'P', value: 'p', num: 16, abierto: true, hijos: [
			{ text: 'Q', value: 'q', num: 17, abierto: true, hijos: [
				{ text: 'R', value: 'r', num: 18, hijos: [
					{ text: 'S', value: 's', num: 19, seleccionado: true}
				]},
				{ text: 'T', value: 't', num: 20}
			]},
			{ text: 'U', value: 'u', num: 21}
		]},
		{ text: 'V', value: 'v', num: 22}
	]},
	{ text: 'W', value: 'w', num: 23},
	{ text: 'X', value: 'x', num: 24, hijos: [
		{ text: 'Y', value: 'y', num: 25, seleccionado: true},
		{ text: 'Z', value: 'z', num: 26, seleccionado: true}
	]}
];
