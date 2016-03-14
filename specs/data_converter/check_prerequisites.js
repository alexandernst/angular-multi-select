/*
 * Test if check_prerequisites fails with wrong data.
 */

var check_prerequisites_wrong_data_1 = 'foo bar';

/////////////////////////////////////////////////

/*
 * Test if check_prerequisites can remove wrong 'children'
 * fields and (set) checked values properly.
 */

var check_prerequisites_short_data_1 = [
	{ text: 'A', value: 'a', id: 1, children: 'foo'},
	{ text: 'B', value: 'b', id: 2, children: [
		{ text: 'C', value: 'c', id: 3, checked: true}
	]},
	{ text: 'D', value: 'd', id: 4, children: [
		{ text: 'E', value: 'e', id: 5, children: []},
		{ text: 'F', value: 'f', id: 6, checked: true}
	]}
];

var check_prerequisites_short_data_1_after = [
	{ text: 'A', value: 'a', id: 1, checked: false, open: false},
	{ text: 'B', value: 'b', id: 2, open: false, children: [
		{ text: 'C', value: 'c', id: 3, checked: true, open: false}
	]},
	{ text: 'D', value: 'd', id: 4, open: false, children: [
		{ text: 'E', value: 'e', id: 5, checked: false, open: false},
		{ text: 'F', value: 'f', id: 6, checked: true, open: false}
	]}
];

/////////////////////////////////////////////////

/*
 * Test if check_prerequisites can generate unique IDs.
 */

var check_prerequisites_short_data_2 = [
	{ text: 'A'},
	{ text: 'B', children: [
		{ text: 'C', checked: true}
	]},
	{ text: 'D', children: [
		{ text: 'E'},
		{ text: 'F', checked: true}
	]}
];

var check_prerequisites_short_data_2_after = [
	{ text: 'A', id: 1, checked: false, open: false},
	{ text: 'B', id: 2, open: false, children: [
		{ text: 'C', id: 3, checked: true, open: false}
	]},
	{ text: 'D', id: 4, open: false, children: [
		{ text: 'E', id: 5, checked: false, open: false},
		{ text: 'F', id: 6, checked: true, open: false}
	]}
];

/////////////////////////////////////////////////

/*
 * Test if check_prerequisites can deal with duplicated IDs.
 */

var check_prerequisites_short_data_3 = [
	{ text: 'A', id: 1},
	{ text: 'B', children: [
		{ text: 'C', id: 1, checked: true}
	]},
	{ text: 'D', children: [
		{ text: 'E'},
		{ text: 'F', checked: true}
	]}
];

var check_prerequisites_short_data_3_after = [
	{ text: 'A', id: 1, checked: false, open: false},
	{ text: 'B', id: 2, open: false, children: [
		{ text: 'C', id: 3, checked: true, open: false}
	]},
	{ text: 'D', id: 4, open: false, children: [
		{ text: 'E', id: 5, checked: false, open: false},
		{ text: 'F', id: 6, checked: true, open: false}
	]}
];

/////////////////////////////////////////////////

/*
 * Test if check_prerequisites can deal with non-numeric IDs.
 */

var check_prerequisites_short_data_4 = [
	{ text: 'A', id: 'foo'},
	{ text: 'B', children: [
		{ text: 'C', id: 'bar', checked: true}
	]},
	{ text: 'D', children: [
		{ text: 'E'},
		{ text: 'F', checked: true}
	]}
];

var check_prerequisites_short_data_4_after = [
	{ text: 'A', id: 'foo', checked: false, open: false},
	{ text: 'B', id: 1, open: false, children: [
		{ text: 'C', id: 'bar', checked: true, open: false}
	]},
	{ text: 'D', id: 2, open: false, children: [
		{ text: 'E', id: 3, checked: false, open: false},
		{ text: 'F', id: 4, checked: true, open: false}
	]}
];

/////////////////////////////////////////////////

/*
 * Test if check_prerequisites can deal with open states.
 */

var check_prerequisites_short_data_5 = [
	{ text: 'A', id: 'foo', open: 1},
	{ text: 'B', open: true, children: [
		{ text: 'C', id: 'bar', checked: true}
	]},
	{ text: 'D', open: false, children: [
		{ text: 'E', open: 'foo'},
		{ text: 'F', checked: true}
	]}
];

var check_prerequisites_short_data_5_after = [
	{ text: 'A', id: 'foo', checked: false, open: false},
	{ text: 'B', id: 1, open: true, children: [
		{ text: 'C', id: 'bar', checked: true, open: false}
	]},
	{ text: 'D', id: 2, open: false, children: [
		{ text: 'E', id: 3, checked: false, open: false},
		{ text: 'F', id: 4, checked: true, open: false}
	]}
];

/////////////////////////////////////////////////

/*
 * Test if check_prerequisites can deal with all different names for keys.
 */

var check_prerequisites_short_data_6 = [
	{ text: 'A', num: 'foo', abierto: 1},
	{ text: 'B', abierto: true, hijos: [
		{ text: 'C', num: 'bar', seleccionado: true}
	]},
	{ text: 'D', abierto: false, hijos: [
		{ text: 'E', abierto: 'foo'},
		{ text: 'F', seleccionado: true}
	]}
];

var check_prerequisites_short_data_6_after = [
	{ text: 'A', num: 'foo', seleccionado: false, abierto: false},
	{ text: 'B', num: 1, abierto: true, hijos: [
		{ text: 'C', num: 'bar', seleccionado: true, abierto: false}
	]},
	{ text: 'D', num: 2, abierto: false, hijos: [
		{ text: 'E', num: 3, seleccionado: false, abierto: false},
		{ text: 'F', num: 4, seleccionado: true, abierto: false}
	]}
];

/////////////////////////////////////////////////

/*
 * Test if check_prerequisites can deal with some different names for keys.
 */

var check_prerequisites_short_data_7 = [
	{ text: 'A', num: 'foo', open: 1},
	{ text: 'B', open: true, hijos: [
		{ text: 'C', num: 'bar', seleccionado: true}
	]},
	{ text: 'D', open: false, hijos: [
		{ text: 'E', open: 'foo'},
		{ text: 'F', seleccionado: true}
	]}
];

var check_prerequisites_short_data_7_after = [
	{ text: 'A', num: 'foo', seleccionado: false, open: false},
	{ text: 'B', num: 1, open: true, hijos: [
		{ text: 'C', num: 'bar', seleccionado: true, open: false}
	]},
	{ text: 'D', num: 2, open: false, hijos: [
		{ text: 'E', num: 3, seleccionado: false, open: false},
		{ text: 'F', num: 4, seleccionado: true, open: false}
	]}
];

/////////////////////////////////////////////////
