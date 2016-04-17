describe('Testing data converter', function() {
	beforeEach(function() {
		module('angular-multi-select-data-converter');
	});

	var angularMultiSelectDataConverter;
	var angularMultiSelectConstants;

	beforeEach(function () {
		angular.mock.inject(function ($injector) {
			angularMultiSelectDataConverter = $injector.get('angularMultiSelectDataConverter');
			angularMultiSelectConstants = $injector.get('angularMultiSelectConstants');
		});
	});

	/*
	 ██████ ██   ██ ███████  ██████ ██   ██     ██████  ██████  ███████ ██████  ███████  ██████  ██    ██ ██ ███████ ██ ████████ ███████ ███████
	██      ██   ██ ██      ██      ██  ██      ██   ██ ██   ██ ██      ██   ██ ██      ██    ██ ██    ██ ██ ██      ██    ██    ██      ██
	██      ███████ █████   ██      █████       ██████  ██████  █████   ██████  █████   ██    ██ ██    ██ ██ ███████ ██    ██    █████   ███████
	██      ██   ██ ██      ██      ██  ██      ██      ██   ██ ██      ██   ██ ██      ██ ▄▄ ██ ██    ██ ██      ██ ██    ██    ██           ██
	 ██████ ██   ██ ███████  ██████ ██   ██     ██      ██   ██ ███████ ██   ██ ███████  ██████   ██████  ██ ███████ ██    ██    ███████ ███████
	                                                                                        ▀▀
	*/
	describe('Testing check_prerequisites method', function () {
		it('It should fail with wrong input data', function () {
			var dc = new angularMultiSelectDataConverter();
			var res = dc.check_prerequisites(check_prerequisites_wrong_data_1);
			expect(res).toEqual(false);
		});

		it('It should be able to fill in empty/missing values and remove wrong ones', inject(function () {
			spyOn(Date, 'now').and.callFake(function() {
				return 1;
			});

			var dc = new angularMultiSelectDataConverter();
			var res = dc.check_prerequisites(check_prerequisites_short_data_1);
			expect(res).toEqual(check_prerequisites_short_data_1_after);

			var res2 = dc.check_prerequisites(check_prerequisites_short_data_2);
			expect(res2).toEqual(check_prerequisites_short_data_2_after);

			var res3 = dc.check_prerequisites(check_prerequisites_short_data_3);
			expect(res3).toEqual(check_prerequisites_short_data_3_after);

			var res4 = dc.check_prerequisites(check_prerequisites_short_data_4);
			expect(res4).toEqual(check_prerequisites_short_data_4_after);

			var res5 = dc.check_prerequisites(check_prerequisites_short_data_5);
			expect(res5).toEqual(check_prerequisites_short_data_5_after);
		}));

		it('It should be able to handle different key names in object items', inject(function () {
			spyOn(Date, 'now').and.callFake(function() {
				return 1;
			});

			var dc_mod = new angularMultiSelectDataConverter({
				ID_PROPERTY: 'num',
				OPEN_PROPERTY: 'abierto',
				CHECKED_PROPERTY: 'seleccionado',
				CHILDREN_PROPERTY: 'hijos'
			});
			var res6 = dc_mod.check_prerequisites(check_prerequisites_short_data_6);
			expect(res6).toEqual(check_prerequisites_short_data_6_after);

			var dc_mod_2 = new angularMultiSelectDataConverter({
				ID_PROPERTY: 'num',
				CHECKED_PROPERTY: 'seleccionado',
				CHILDREN_PROPERTY: 'hijos'
			});
			var res7 = dc_mod_2.check_prerequisites(check_prerequisites_short_data_7);
			expect(res7).toEqual(check_prerequisites_short_data_7_after);
		}));
	});

	/*
	████████  ██████      ██ ███    ██ ████████ ███████ ██████  ███    ██  █████  ██
	   ██    ██    ██     ██ ████   ██    ██    ██      ██   ██ ████   ██ ██   ██ ██
	   ██    ██    ██     ██ ██ ██  ██    ██    █████   ██████  ██ ██  ██ ███████ ██
	   ██    ██    ██     ██ ██  ██ ██    ██    ██      ██   ██ ██  ██ ██ ██   ██ ██
	   ██     ██████      ██ ██   ████    ██    ███████ ██   ██ ██   ████ ██   ██ ███████
	*/
	describe('Testing to_internal method', function () {
		it('It should be able to convert full input data to internal data structure', inject(function () {
			var dc = new angularMultiSelectDataConverter();
			var res = dc.check_prerequisites(to_internal_data_1);
			var internal_data = dc.to_internal(res);

			for (var i = 0; i < internal_data.length; i++) {
				delete internal_data[i][angularMultiSelectConstants.INTERNAL_KEY_CHECKED_MODIFICATION];
			}

			expect(internal_data).toEqual(to_internal_data_1_after);
		}));

		it('It should be able to do the previous check but using different names for the keys of the object items', inject(function () {
			var dc = new angularMultiSelectDataConverter({
				ID_PROPERTY: 'num',
				OPEN_PROPERTY: 'abierto',
				CHECKED_PROPERTY: 'seleccionado',
				CHILDREN_PROPERTY: 'hijos'
			});
			var res = dc.check_prerequisites(to_internal_data_2);
			var internal_data = dc.to_internal(res);

			for (var i = 0; i < internal_data.length; i++) {
				delete internal_data[i][angularMultiSelectConstants.INTERNAL_KEY_CHECKED_MODIFICATION];
			}

			expect(internal_data).toEqual(to_internal_data_2_after);
		}));
	});

	/*
	████████  ██████       █████  ██████  ██████   █████  ██    ██      ██████  ███████      ██████  ██████       ██ ███████  ██████ ████████ ███████
	   ██    ██    ██     ██   ██ ██   ██ ██   ██ ██   ██  ██  ██      ██    ██ ██          ██    ██ ██   ██      ██ ██      ██         ██    ██
	   ██    ██    ██     ███████ ██████  ██████  ███████   ████       ██    ██ █████       ██    ██ ██████       ██ █████   ██         ██    ███████
	   ██    ██    ██     ██   ██ ██   ██ ██   ██ ██   ██    ██        ██    ██ ██          ██    ██ ██   ██ ██   ██ ██      ██         ██         ██
	   ██     ██████      ██   ██ ██   ██ ██   ██ ██   ██    ██         ██████  ██           ██████  ██████   █████  ███████  ██████    ██    ███████
	*/
	describe('Testing to_array_of_objects method', function () {
		it('It should return empty array on invalid data', function () {
			var dc = new angularMultiSelectDataConverter();

			res = dc.to_array_of_objects();
			expect(res).toEqual([]);

			var res = dc.to_array_of_objects(to_array_of_objects_data_1);
			expect(res).toEqual([]);

			res = dc.to_array_of_objects(to_array_of_objects_data_2);
			expect(res).toEqual([]);

			res = dc.to_array_of_objects(to_array_of_objects_data_3);
			expect(res).toEqual([]);
		});

		it('It should return the correct data when no "keys" argument is passed', function () {
			var dc = new angularMultiSelectDataConverter();

			var res = dc.to_array_of_objects(to_array_of_objects_data_4);
			expect(res).toEqual(to_array_of_objects_data_4);
		});

		it('It should return the correct data when "keys" argument is passed', function () {
			var dc = new angularMultiSelectDataConverter();

			var res = dc.to_array_of_objects(to_array_of_objects_data_4, ['a', 'c']);
			expect(res).toEqual(to_array_of_objects_data_4_res);
		});

		it('It should return the correct data when "keys" argument is passed and has invalid keys', function () {
			var dc = new angularMultiSelectDataConverter();

			var res = dc.to_array_of_objects(to_array_of_objects_data_4, ['a', 'c', 'z']);
			expect(res).toEqual(to_array_of_objects_data_4_res);
		});
	});

	/*
	████████  ██████       █████  ██████  ██████   █████  ██    ██      ██████  ███████      █████  ██████  ██████   █████  ██    ██ ███████
	   ██    ██    ██     ██   ██ ██   ██ ██   ██ ██   ██  ██  ██      ██    ██ ██          ██   ██ ██   ██ ██   ██ ██   ██  ██  ██  ██
	   ██    ██    ██     ███████ ██████  ██████  ███████   ████       ██    ██ █████       ███████ ██████  ██████  ███████   ████   ███████
	   ██    ██    ██     ██   ██ ██   ██ ██   ██ ██   ██    ██        ██    ██ ██          ██   ██ ██   ██ ██   ██ ██   ██    ██         ██
	   ██     ██████      ██   ██ ██   ██ ██   ██ ██   ██    ██         ██████  ██          ██   ██ ██   ██ ██   ██ ██   ██    ██    ███████
	*/
	describe('Testing to_array_of_arrays method', function () {
		it('It should return empty array on invalid data', function () {
			var dc = new angularMultiSelectDataConverter();

			res = dc.to_array_of_arrays();
			expect(res).toEqual([]);

			var res = dc.to_array_of_arrays(to_array_of_arrays_data_1);
			expect(res).toEqual([]);

			res = dc.to_array_of_arrays(to_array_of_arrays_data_2);
			expect(res).toEqual([]);

			res = dc.to_array_of_arrays(to_array_of_arrays_data_3);
			expect(res).toEqual([]);
		});

		it('It should return the correct data when no "keys" argument is passed', function () {
			var dc = new angularMultiSelectDataConverter();

			var res = dc.to_array_of_arrays(to_array_of_arrays_data_4);
			expect(res).toEqual(to_array_of_arrays_data_4_res);
		});

		it('It should return the correct data when "keys" argument is passed', function () {
			var dc = new angularMultiSelectDataConverter();

			var res = dc.to_array_of_arrays(to_array_of_arrays_data_5, ['a', 'c']);
			expect(res).toEqual(to_array_of_arrays_data_5_res);

			res = dc.to_array_of_arrays(to_array_of_arrays_data_5, ['c', 'a']);
			expect(res).toEqual(to_array_of_arrays_data_6_res);
		});

		it('It should return the correct data when "keys" argument is passed and has invalid keys', function () {
			var dc = new angularMultiSelectDataConverter();

			var res = dc.to_array_of_arrays(to_array_of_arrays_data_5, ['a', 'c', 'z']);
			expect(res).toEqual(to_array_of_arrays_data_5_res);
		});
	});

	/*
	████████  ██████       █████  ██████  ██████   █████  ██    ██
	   ██    ██    ██     ██   ██ ██   ██ ██   ██ ██   ██  ██  ██
	   ██    ██    ██     ███████ ██████  ██████  ███████   ████
	   ██    ██    ██     ██   ██ ██   ██ ██   ██ ██   ██    ██
	   ██     ██████      ██   ██ ██   ██ ██   ██ ██   ██    ██
	*/
	describe('Testing to_array method', function () {
		it('It should return empty array on invalid data', function () {
			var dc = new angularMultiSelectDataConverter();

			res = dc.to_array();
			expect(res).toEqual([]);

			var res = dc.to_array(to_array_data_1);
			expect(res).toEqual([]);

			res = dc.to_array(to_array_data_2);
			expect(res).toEqual([]);

			res = dc.to_array(to_array_data_3);
			expect(res).toEqual([]);
		});

		it('It should return the correct data when no "keys" argument is passed', function () {
			var dc = new angularMultiSelectDataConverter();

			var res = dc.to_array(to_array_data_4);
			expect(res).toEqual(to_array_data_4_res);
		});

		it('It should return the correct data when "keys" argument is passed', function () {
			var dc = new angularMultiSelectDataConverter();

			var res = dc.to_array(to_array_data_5, ['a', 'c']);
			expect(res).toEqual(to_array_data_5_res);

			res = dc.to_array(to_array_data_5, ['c', 'a']);
			expect(res).toEqual(to_array_data_6_res);
		});

		it('It should return the correct data when "keys" argument is passed and has invalid keys', function () {
			var dc = new angularMultiSelectDataConverter();

			var res = dc.to_array(to_array_data_5, ['a', 'c', 'z']);
			expect(res).toEqual(to_array_data_5_res);
		});
	});

	/*
	████████  ██████       ██████  ██████       ██ ███████  ██████ ████████
	   ██    ██    ██     ██    ██ ██   ██      ██ ██      ██         ██
	   ██    ██    ██     ██    ██ ██████       ██ █████   ██         ██
	   ██    ██    ██     ██    ██ ██   ██ ██   ██ ██      ██         ██
	   ██     ██████       ██████  ██████   █████  ███████  ██████    ██
	*/
	describe('Testing to_object method', function () {
		it('It should return empty array on invalid data', function () {
			var dc = new angularMultiSelectDataConverter();

			res = dc.to_object();
			expect(res).toEqual({});

			var res = dc.to_object(to_object_data_1);
			expect(res).toEqual({});

			res = dc.to_object(to_object_data_2);
			expect(res).toEqual({});

			res = dc.to_object(to_object_data_3);
			expect(res).toEqual({});
		});

		it('It should return the correct data when no "keys" argument is passed', function () {
			var dc = new angularMultiSelectDataConverter();

			var res = dc.to_object(to_object_data_4);
			expect(res).toEqual(to_object_data_4_res);
		});

		it('It should return the correct data when "keys" argument is passed', function () {
			var dc = new angularMultiSelectDataConverter();

			var res = dc.to_object(to_object_data_5, ['a', 'c']);
			expect(res).toEqual(to_object_data_5_res);
		});

		it('It should return the correct data when "keys" argument is passed and has invalid keys', function () {
			var dc = new angularMultiSelectDataConverter();

			var res = dc.to_object(to_object_data_5, ['a', 'c', 'z']);
			expect(res).toEqual(to_object_data_5_res);
		});
	});

	/*
	████████  ██████      ██    ██  █████  ██      ██    ██ ███████ ███████
	   ██    ██    ██     ██    ██ ██   ██ ██      ██    ██ ██      ██
	   ██    ██    ██     ██    ██ ███████ ██      ██    ██ █████   ███████
	   ██    ██    ██      ██  ██  ██   ██ ██      ██    ██ ██           ██
	   ██     ██████        ████   ██   ██ ███████  ██████  ███████ ███████
	*/
	describe('Testing to_values method', function () {
		it('It should return empty array on invalid data', function () {
			var dc = new angularMultiSelectDataConverter();

			res = dc.to_values();
			expect(res).toEqual([]);

			var res = dc.to_values(to_values_data_1);
			expect(res).toEqual([]);

			res = dc.to_values(to_values_data_2);
			expect(res).toEqual([]);

			res = dc.to_values(to_values_data_3);
			expect(res).toEqual([]);
		});

		it('It should return the correct data when no "keys" argument is passed', function () {
			var dc = new angularMultiSelectDataConverter();

			var res = dc.to_values(to_value_data_4);
			expect(res).toEqual([]);
		});

		it('It should return the correct data when "keys" argument is passed', function () {
			var dc = new angularMultiSelectDataConverter();

			var res = dc.to_values(to_value_data_4, ['a']);
			expect(res).toEqual(['foo1', 'foo2', 'foo3']);

			res = dc.to_values(to_value_data_4, ['c', 'a']);
			expect(res).toEqual([42, 'foo1', 43, 'foo2', 44, 'foo3']);
		});

		it('It should return the correct data when "keys" argument is passed and has invalid keys', function () {
			var dc = new angularMultiSelectDataConverter();

			var res = dc.to_values(to_value_data_4, ['z']);
			expect(res).toEqual([]);
		});
	});

	/*
	████████  ██████      ██    ██  █████  ██      ██    ██ ███████
	   ██    ██    ██     ██    ██ ██   ██ ██      ██    ██ ██
	   ██    ██    ██     ██    ██ ███████ ██      ██    ██ █████
	   ██    ██    ██      ██  ██  ██   ██ ██      ██    ██ ██
	   ██     ██████        ████   ██   ██ ███████  ██████  ███████
	*/
	describe('Testing to_value method', function () {
		it('It should return empty array on invalid data', function () {
			var dc = new angularMultiSelectDataConverter();

			res = dc.to_value();
			expect(res).toEqual(undefined);

			var res = dc.to_value(to_value_data_1);
			expect(res).toEqual(undefined);

			res = dc.to_value(to_value_data_2);
			expect(res).toEqual(undefined);

			res = dc.to_value(to_value_data_3);
			expect(res).toEqual(undefined);
		});

		it('It should return the correct data when no "keys" argument is passed', function () {
			var dc = new angularMultiSelectDataConverter();

			var res = dc.to_value(to_value_data_4);
			expect(res).toEqual('foo1');
		});

		it('It should return the correct data when "keys" argument is passed', function () {
			var dc = new angularMultiSelectDataConverter();

			var res = dc.to_value(to_value_data_4, 'a');
			expect(res).toEqual('foo1');
		});

		it('It should return the correct data when "keys" argument is passed and has invalid keys', function () {
			var dc = new angularMultiSelectDataConverter();

			var res = dc.to_value(to_value_data_4, 'z');
			expect(res).toEqual(undefined);
		});
	});

});
