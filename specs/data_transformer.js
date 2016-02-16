describe('Testing data converter service', function() {
	beforeEach(
		module('angular-multi-select-data-converter')
	);

	var scope, dc;

	beforeEach(function () {
		angular.mock.inject(function ($injector) {
			angularMultiSelectDataConverter = $injector.get('angularMultiSelectDataConverter');
			dc = new angularMultiSelectDataConverter();
		});
	});

	describe('Testing check_prerequisites method', function () {
		it('Should fail with wrong input data', function () {
			var res = dc.check_prerequisites(wrong_data);
			expect(res).toEqual(false);
		});

		it('Should be able to fill in empty/missing values and remove wrong ones', inject(function () {
			var res = dc.check_prerequisites(short_data);
			expect(res).toEqual(short_data_after_check_prerequisites);

			var res2 = dc.check_prerequisites(short_data_2);
			expect(res2).toEqual(short_data_after_check_prerequisites_2);

			var res3 = dc.check_prerequisites(short_data_3);
			expect(res3).toEqual(short_data_after_check_prerequisites_3);

			var res4 = dc.check_prerequisites(short_data_4);
			expect(res4).toEqual(short_data_after_check_prerequisites_4);

			var res5 = dc.check_prerequisites(short_data_5);
			expect(res5).toEqual(short_data_after_check_prerequisites_5);
		}));

		it('Should be able to handle different key names in object items', inject(function () {
			var dc_mod = new angularMultiSelectDataConverter({
				ID_PROPERTY: 'num',
				OPEN_PROPERTY: 'abierto',
				CHECKED_PROPERTY: 'seleccionado',
				CHILDREN_PROPERTY: 'hijos'
			});
			var res6 = dc_mod.check_prerequisites(short_data_6);
			expect(res6).toEqual(short_data_after_check_prerequisites_6);

			var dc_mod_2 = new angularMultiSelectDataConverter({
				ID_PROPERTY: 'num',
				CHECKED_PROPERTY: 'seleccionado',
				CHILDREN_PROPERTY: 'hijos'
			});
			var res7 = dc_mod_2.check_prerequisites(short_data_7);
			expect(res7).toEqual(short_data_after_check_prerequisites_7);
		}));
	});

	describe('Testing to_internal method', function () {
		it('Should be able to convert full input data to internal data structure', inject(function () {
			var res = dc.check_prerequisites(full_data);
			var internal_data = dc.to_internal(res);
			expect(internal_data).toEqual(final_data);
		}));

		it('Should be able to do the previous check but using different names for the keys of the object items', inject(function () {
			var dc_mod_3 = new angularMultiSelectDataConverter({
				ID_PROPERTY: 'num',
				OPEN_PROPERTY: 'abierto',
				CHECKED_PROPERTY: 'seleccionado',
				CHILDREN_PROPERTY: 'hijos'
			});
			var res = dc_mod_3.check_prerequisites(full_data_2);
			var internal_data = dc_mod_3.to_internal(res);
			expect(internal_data).toEqual(final_data_2);
		}));
	});

});
