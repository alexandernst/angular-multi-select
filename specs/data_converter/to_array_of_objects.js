/*
 * It should return empty array on invalid data
 */

var to_array_of_objects_data_1 = {};

var to_array_of_objects_data_2 = [];

var to_array_of_objects_data_3 = [
	['foo'],
	['bar']
];

/////////////////////////////////////////////////

/*
 * It should return the correct data...
 */

var to_array_of_objects_data_4 = [
	{a: 'foo', b: 'bar', c: 42},
	{a: 'foo', b: 'bar', c: 42},
	{a: 'foo', b: 'bar', c: 42}
];

var to_array_of_objects_data_4_res = [
	{a: 'foo', c: 42},
	{a: 'foo', c: 42},
	{a: 'foo', c: 42}
];
