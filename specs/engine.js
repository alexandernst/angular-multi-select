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
			de.insert(to_internal_data_1_after);
			var tree = de.get_full_tree();

			//TODO: remove after https://github.com/techfort/LokiJS/issues/346
			for (var i = 0; i < tree.length; i++) {
				delete tree[i].meta;
				delete tree[i].$loki;
			}

			expect(to_internal_data_1_after).toEqual(tree);
		}));

		xit('Should be able to remove old collection before inserting a new one', inject(function () {
			var de = new angularMultiSelectEngine();
			de.insert(to_internal_data_1_after);
			de.insert(to_internal_data_1_after);
			var tree = de.get_full_tree();

			expect(to_internal_data_1_after).toEqual(tree);
		}));

	});

});
