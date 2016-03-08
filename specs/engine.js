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
		it('Should be able to insert data and return it back as-is', function () {
			var e = new angularMultiSelectEngine();
			e.insert(to_internal_data_1_after);
			var tree = e.get_full_tree();

			//TODO: remove after https://github.com/techfort/LokiJS/issues/346
			for (var i = 0; i < tree.length; i++) {
				delete tree[i].meta;
				delete tree[i].$loki;
			}

			expect(to_internal_data_1_after).toEqual(tree);
		});

		it('Should be able to remove old collection before inserting a new one', function () {
			var e = new angularMultiSelectEngine();
			e.insert(to_internal_data_1_after);
			e.insert(to_internal_data_1_after);
			var tree = e.get_full_tree();

			//TODO: remove after https://github.com/techfort/LokiJS/issues/346
			for (var i = 0; i < tree.length; i++) {
				delete tree[i].meta;
				delete tree[i].$loki;
			}

			expect(to_internal_data_1_after).toEqual(tree);
		});

	});

});
