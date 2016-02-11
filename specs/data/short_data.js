/*
 * Test if check_prerequisites can remove wrong 'children'
 * fields and (set) checked values properly.
 */

var short_data = [
	{ text: 'A', value: 'a', id: 1, children: 'foo'},
	{ text: 'B', value: 'b', id: 2, children: [
		{ text: 'C', value: 'c', id: 3, checked: true}
	]},
	{ text: 'D', value: 'd', id: 4, children: [
		{ text: 'E', value: 'e', id: 5, children: []},
		{ text: 'F', value: 'f', id: 6, checked: true}
	]}
];

var short_data_after_check_prerequisites = [
	{ text: 'A', value: 'a', id: 1, checked: false},
	{ text: 'B', value: 'b', id: 2, children: [
		{ text: 'C', value: 'c', id: 3, checked: true}
	]},
	{ text: 'D', value: 'd', id: 4, children: [
		{ text: 'E', value: 'e', id: 5, checked: false},
		{ text: 'F', value: 'f', id: 6, checked: true}
	]}
];

///////////////////////////////////////////////////////////////////////////////

/*
 * Test if check_prerequisites can generate unique IDs and
 * the 'value' field.
 */

var short_data_2 = [
	{ text: 'A'},
	{ text: 'B', children: [
		{ text: 'C', checked: true}
	]},
	{ text: 'D', children: [
		{ text: 'E'},
		{ text: 'F', checked: true}
	]}
];

var short_data_after_check_prerequisites_2 = [
	{ text: 'A', value: 'A', id: 1, checked: false},
	{ text: 'B', value: 'B', id: 2, children: [
		{ text: 'C', value: 'C', id: 3, checked: true}
	]},
	{ text: 'D', value: 'D', id: 4, children: [
		{ text: 'E', value: 'E', id: 5, checked: false},
		{ text: 'F', value: 'F', id: 6, checked: true}
	]}
];

///////////////////////////////////////////////////////////////////////////////

/*
 * Test if check_prerequisites can deal with duplicated IDs.
 */

var short_data_3 = [
	{ text: 'A', id: 1},
	{ text: 'B', children: [
		{ text: 'C', id: 1, checked: true}
	]},
	{ text: 'D', children: [
		{ text: 'E'},
		{ text: 'F', checked: true}
	]}
];

var short_data_after_check_prerequisites_3 = [
	{ text: 'A', value: 'A', id: 1, checked: false},
	{ text: 'B', value: 'B', id: 2, children: [
		{ text: 'C', value: 'C', id: 3, checked: true}
	]},
	{ text: 'D', value: 'D', id: 4, children: [
		{ text: 'E', value: 'E', id: 5, checked: false},
		{ text: 'F', value: 'F', id: 6, checked: true}
	]}
];

///////////////////////////////////////////////////////////////////////////////

/*
 * Test if check_prerequisites can deal with non-numeric IDs.
 */

var short_data_4 = [
	{ text: 'A', id: 'foo'},
	{ text: 'B', children: [
		{ text: 'C', id: 'bar', checked: true}
	]},
	{ text: 'D', children: [
		{ text: 'E'},
		{ text: 'F', checked: true}
	]}
];

var short_data_after_check_prerequisites_4 = [
	{ text: 'A', value: 'A', id: 'foo', checked: false},
	{ text: 'B', value: 'B', id: 1, children: [
		{ text: 'C', value: 'C', id: 'bar', checked: true}
	]},
	{ text: 'D', value: 'D', id: 2, children: [
		{ text: 'E', value: 'E', id: 3, checked: false},
		{ text: 'F', value: 'F', id: 4, checked: true}
	]}
];
