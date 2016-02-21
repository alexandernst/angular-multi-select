/*
 * It should return empty array on invalid data
 */

var to_array_data_1 = {};

var to_array_data_2 = [];

var to_array_data_3 = [
	['foo'],
	['bar']
];

/////////////////////////////////////////////////

/*
 * It should return the correct data...
 */

var to_array_data_4 = [
	{a: 'foo1', b: 'bar1', c: 42},
	{a: 'foo2', b: 'bar2', c: 43},
	{a: 'foo3', b: 'bar3', c: 44}
];

var to_array_data_4_res = [
	'foo1', 'bar1', 42,
	'foo2', 'bar2', 43,
	'foo3', 'bar3', 44
];

var to_array_data_5 = [
	{a: 'foo1', b: 'bar1', c: 42},
	{a: 'foo2', b: 'bar2', c: 43},
	{a: 'foo3', b: 'bar3', c: 44}
];

var to_array_data_5_res = [
	'foo1', 42,
	'foo2', 43,
	'foo3', 44
];
