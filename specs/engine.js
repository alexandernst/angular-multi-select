describe('Testing engine', function() {
	beforeEach(function() {
		module('angular-multi-select-engine');
		module('angular-multi-select-data-converter');
	});

	var angularMultiSelectEngine;
	var angularMultiSelectConstants;
	var angularMultiSelectDataConverter;

	beforeEach(function () {
		angular.mock.inject(function ($injector) {
			angularMultiSelectEngine = $injector.get('angularMultiSelectEngine');
			angularMultiSelectConstants = $injector.get('angularMultiSelectConstants');
			angularMultiSelectDataConverter = $injector.get('angularMultiSelectDataConverter');
		});
	});

	describe('Testing insert method', function () {
		it('It should be able to insert data and return it back as-is', function () {
			var e = new angularMultiSelectEngine();
			e.insert(to_internal_data_1_after);
			var tree = e.get_full_tree();

			//TODO: remove after https://github.com/techfort/LokiJS/issues/346
			for (var i = 0; i < tree.length; i++) {
				delete tree[i].meta;
				delete tree[i].$loki;
			}

			expect(tree).toEqual(to_internal_data_1_after);
		});

		it('It should be able to remove old collection before inserting a new one', function () {
			var e = new angularMultiSelectEngine();
			e.insert(to_internal_data_1_after);
			e.insert(to_internal_data_1_after);
			var tree = e.get_full_tree();

			//TODO: remove after https://github.com/techfort/LokiJS/issues/346
			for (var i = 0; i < tree.length; i++) {
				delete tree[i].meta;
				delete tree[i].$loki;
			}

			expect(tree).toEqual(to_internal_data_1_after);
		});
	});

	describe('Testing tree select operations', function () {
		it('It should be able to do a get_full_tree()', function () {
			var e = new angularMultiSelectEngine();
			e.insert(to_internal_data_1_after);

			var tree = e.get_full_tree();

			//TODO: remove after https://github.com/techfort/LokiJS/issues/346
			for (var i = 0; i < tree.length; i++) {
				delete tree[i].meta;
				delete tree[i].$loki;
			}

			expect(tree).toEqual(to_internal_data_1_after);
		});

		it('It should be able to do a get_visible_tree()', function () {
			var e = new angularMultiSelectEngine();
			e.insert(to_internal_data_1_after);

			var tree = e.get_visible_tree();
			var dc = new angularMultiSelectDataConverter();
			tree = dc.to_external(tree);

			expect(tree).toEqual(get_visible_res);
		});

		it('It should be able to do a get_filtered_tree()', function () {
			var e = new angularMultiSelectEngine();
			e.insert(to_internal_data_1_after);

			var tree = e.get_filtered_tree([{
				field: "text",
				query: "A"
			}]);

			var dc = new angularMultiSelectDataConverter();
			tree = dc.to_external(tree);

			expect(tree).toEqual(get_filtered_1);
		});

		it('It should be able to do a get_checked_tree() with FIND_LEAFS', function () {
			var e = new angularMultiSelectEngine();
			e.insert(to_internal_data_1_after);

			var tree = e.get_checked_tree(angularMultiSelectConstants.FIND_LEAFS);
			var dc = new angularMultiSelectDataConverter();
			tree = dc.to_external(tree);

			expect(tree).toEqual(find_leafs_res);
		});

		it('It should be able to do a get_checked_tree() with FIND_LEAFS_MIXED_NODES', function () {
			var e = new angularMultiSelectEngine();
			e.insert(to_internal_data_1_after);

			var tree = e.get_checked_tree(angularMultiSelectConstants.FIND_LEAFS_MIXED_NODES);
			var dc = new angularMultiSelectDataConverter();
			tree = dc.to_external(tree);

			expect(tree).toEqual(find_leafs_mixed_nodes_res);
		});

		it('It should be able to do a get_checked_tree() with FIND_LEAFS_CHECKED_NODES', function () {
			var e = new angularMultiSelectEngine();
			e.insert(to_internal_data_1_after);

			var tree = e.get_checked_tree(angularMultiSelectConstants.FIND_LEAFS_CHECKED_NODES);
			var dc = new angularMultiSelectDataConverter();
			tree = dc.to_external(tree);

			expect(tree).toEqual(find_leafs_checked_nodes_res);
		});

		it('It should be able to do a get_checked_tree() with FIND_LEAFS_MIXED_CHECKED_NODES', function () {
			var e = new angularMultiSelectEngine();
			e.insert(to_internal_data_1_after);

			var tree = e.get_checked_tree(angularMultiSelectConstants.FIND_LEAFS_MIXED_CHECKED_NODES);
			var dc = new angularMultiSelectDataConverter();
			tree = dc.to_external(tree);

			expect(tree).toEqual(find_leafs_mixed_checked_nodes_res);
		});

		it('It should be able to do a get_checked_tree() with FIND_MIXED_NODES', function () {
			var e = new angularMultiSelectEngine();
			e.insert(to_internal_data_1_after);

			var tree = e.get_checked_tree(angularMultiSelectConstants.FIND_MIXED_NODES);
			var dc = new angularMultiSelectDataConverter();
			tree = dc.to_external(tree);

			expect(tree).toEqual(find_mixed_nodes_res);
		});

		it('It should be able to do a get_checked_tree() with FIND_CHECKED_NODES', function () {
			var e = new angularMultiSelectEngine();
			e.insert(to_internal_data_1_after);

			var tree = e.get_checked_tree(angularMultiSelectConstants.FIND_CHECKED_NODES);
			var dc = new angularMultiSelectDataConverter();
			tree = dc.to_external(tree);

			expect(tree).toEqual(find_checked_nodes_res);
		});

		it('It should be able to do a get_checked_tree() with FIND_MIXED_CHECKED_NODES', function () {
			var e = new angularMultiSelectEngine();
			e.insert(to_internal_data_1_after);

			var tree = e.get_checked_tree(angularMultiSelectConstants.FIND_MIXED_CHECKED_NODES);
			var dc = new angularMultiSelectDataConverter();
			tree = dc.to_external(tree);

			expect(tree).toEqual(find_mixed_checked_nodes_res);
		});
	});

	describe('Testing tree (un)check operations', function () {
		it('It should honor MAX_CHECKED_LEAFS', function () {
			var e = new angularMultiSelectEngine({
				MAX_CHECKED_LEAFS: 1
			});
			e.insert(to_internal_data_1_after);
			var tree = e.get_checked_tree();

			expect(tree[0].value).toEqual("z");

			tree = e.get_full_tree();
			e.check_node(tree[2]);

			tree = e.get_checked_tree();

			expect(tree[0].value).toEqual("c");

			var e2 = new angularMultiSelectEngine({
				MAX_CHECKED_LEAFS: 2
			});
			e2.insert(to_internal_data_1_after);
			tree = e2.get_checked_tree();

			expect(tree[0].value).toEqual("y");
			expect(tree[1].value).toEqual("z");

			tree = e.get_full_tree();
			e.check_node(tree[2]);

			tree = e.get_checked_tree();

			expect(tree[0].value).toEqual("c");
		});

		it('It should correctly toggle the checked state of an item', function () {
			var e = new angularMultiSelectEngine();
			e.insert(to_internal_data_1_after);

			var tree = e.get_full_tree();
			expect(tree[0].checked).toEqual(false);

			e.toggle_check_node(tree[0]);
			tree = e.get_full_tree();
			expect(tree[0].checked).toEqual(true);

			e.toggle_check_node(tree[0]);
			tree = e.get_full_tree();
			expect(tree[0].checked).toEqual(false);
		});
	});

	describe('Testing tree open/close operations', function () {
		it('It should correctly toggle the open state of an item', function () {
			var e = new angularMultiSelectEngine();
			e.insert(to_internal_data_1_after);

			// A
			var tree = e.get_full_tree();
			expect(tree[0].open).toEqual(false);

			e.toggle_open_node(tree[0]);
			tree = e.get_full_tree();
			expect(tree[0].open).toEqual(false);

			e.toggle_open_node(tree[0]);
			tree = e.get_full_tree();
			expect(tree[0].open).toEqual(false);

			// B
			tree = e.get_full_tree();
			expect(tree[1].open).toEqual(true);

			e.toggle_open_node(tree[1]);
			tree = e.get_full_tree();
			expect(tree[1].open).toEqual(false);

			e.toggle_open_node(tree[1]);
			tree = e.get_full_tree();
			expect(tree[1].open).toEqual(true);
		});
	});

	describe('Testing tree stats', function () {
		it('It should be able to return correct stats', function () {
			var e = new angularMultiSelectEngine();
			e.insert(to_internal_data_1_after);
			expect(e.get_stats()).toEqual(get_stats_1);

			tree = e.get_full_tree();

			e.check_node(tree[0]);
			expect(e.get_stats()).toEqual(get_stats_2);

			e.uncheck_node(tree[25]);
			expect(e.get_stats()).toEqual(get_stats_3);

			e.uncheck_node(tree[24]);
			expect(e.get_stats()).toEqual(get_stats_4);
		});
	});

});
