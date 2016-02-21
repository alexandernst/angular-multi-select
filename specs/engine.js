describe('Testing engine', function() {
	beforeEach(function() {
		module('angular-multi-select-engine');
	});

	var angularMultiSelectEngine;

	beforeEach(function () {
		angular.mock.inject(function ($injector) {
			angularMultiSelectEngine = $injector.get('angularMultiSelectEngine');
		});
	});

	describe('Testing insert method', function () {
		it('Should be able to insert data and return it back as-is', inject(function () {
			var de = new angularMultiSelectEngine();
			var res = de.insert(to_internal_data_1_after);
			var tree = de.get_full_tree();
			expect(to_internal_data_1_after).toEqual(tree);
		}));

	});

});
