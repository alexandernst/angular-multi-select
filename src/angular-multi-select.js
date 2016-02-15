var angular_multi_select = angular.module('angular-multi-select', []);

angular_multi_select.factory('angularMultiSelect', function () {

	/*
	 * Initiate the database and setup index fields.
	 */
	var db = new loki();
	var main_ctx = this;
	var on_data_change_fn;

	var collection = db.addCollection('items', {
		indices: ['id', 'parents_id', 'checked', 'level']
	});

	var on_data_change = function (fn) {
		main_ctx.on_data_change_fn = fn;
	}

	/*
	██ ███    ██ ███████ ███████ ██████  ████████
	██ ████   ██ ██      ██      ██   ██    ██
	██ ██ ██  ██ ███████ █████   ██████     ██
	██ ██  ██ ██      ██ ██      ██   ██    ██
	██ ██   ████ ███████ ███████ ██   ██    ██
	*/
	var insert = function (items) {
		/*
		 * Iterate over an array of items and insert them.
		 */
		if (Array.isArray(items)) {
			for (var i = 0; i < items.length; i++) {
				this.collection.insert(items[i]);
			}
		} else {
			this.collection.insert(items);
		}
	};

	/*
	 ██████  ███████ ████████     ███████ ██    ██ ██      ██          ████████ ██████  ███████ ███████
	██       ██         ██        ██      ██    ██ ██      ██             ██    ██   ██ ██      ██
	██   ███ █████      ██        █████   ██    ██ ██      ██             ██    ██████  █████   █████
	██    ██ ██         ██        ██      ██    ██ ██      ██             ██    ██   ██ ██      ██
	 ██████  ███████    ██        ██       ██████  ███████ ███████        ██    ██   ██ ███████ ███████
	*/
	var get_full_tree = function () {
		/*
		 * Get the entire set of data currently inserted in Loki.
		 */
		console.time("get_full_tree");

		var tree = this.collection
			.chain()
			.find({})
			.simplesort("order", false)
			.data();

		console.time("get_full_tree");
		return tree;
	};

	/*
	 ██████  ███████ ████████     ██    ██ ██ ███████ ██ ██████  ██      ███████     ████████ ██████  ███████ ███████
	██       ██         ██        ██    ██ ██ ██      ██ ██   ██ ██      ██             ██    ██   ██ ██      ██
	██   ███ █████      ██        ██    ██ ██ ███████ ██ ██████  ██      █████          ██    ██████  █████   █████
	██    ██ ██         ██         ██  ██  ██      ██ ██ ██   ██ ██      ██             ██    ██   ██ ██      ██
	 ██████  ███████    ██          ████   ██ ███████ ██ ██████  ███████ ███████        ██    ██   ██ ███████ ███████
	*/
	var get_visible_tree = function () {
		/*
		 * Get only the visible elements from Loki.
		 */
		console.time("get_visible_tree");

		var tree =  this.collection
			.chain()
			.find({})
			.find({'tree_visibility': true})
			.simplesort("order", false)
			.data();

		console.timeEnd("get_visible_tree");
		return tree;
	};

	/*
	████████  ██████   ██████   ██████  ██      ███████      ██████  ██████  ███████ ███    ██
	   ██    ██    ██ ██       ██       ██      ██          ██    ██ ██   ██ ██      ████   ██
	   ██    ██    ██ ██   ███ ██   ███ ██      █████       ██    ██ ██████  █████   ██ ██  ██
	   ██    ██    ██ ██    ██ ██    ██ ██      ██          ██    ██ ██      ██      ██  ██ ██
	   ██     ██████   ██████   ██████  ███████ ███████      ██████  ██      ███████ ██   ████
	*/
	var toggle_open_node = function (item) {
		/*
		 * Toggle the open/closed state of an element.
		 * Note that leafs are not supposed to be toggleable.
		 */
		if (item.children_leafs === 0) return;

		if (item.open === true) {
			this.close_node(item);
		} else {
			this.open_node(item);
		}

		main_ctx.on_data_change_fn();
	};

	/*
	 ██████  ██████  ███████ ███    ██     ███    ██  ██████  ██████  ███████
	██    ██ ██   ██ ██      ████   ██     ████   ██ ██    ██ ██   ██ ██
	██    ██ ██████  █████   ██ ██  ██     ██ ██  ██ ██    ██ ██   ██ █████
	██    ██ ██      ██      ██  ██ ██     ██  ██ ██ ██    ██ ██   ██ ██
	 ██████  ██      ███████ ██   ████     ██   ████  ██████  ██████  ███████
	*/
	var open_node = function (item) {
		/*
		 * Open an item.
		 * First, mark the item itself as open, then find all
		 * the children items of that item and iterate over the
		 * results. For each item:
		 *
		 * Ff the item is a node and it's closed, we'll create
		 * a rule such that it will skip the next N items on the
		 * result. Else mark the item as visible.
		 */
		console.time("open_node");

		var skip = 0;

		this.collection
			.chain()
			.find({ 'id': item.id })
			.update(function (obj) {
				obj.open = true;
			});

		this.collection
			.chain()
			.find({
				'$and': [
					{ 'parents_id': { '$contains': item.id } },
					{ 'level': {'$gte': item.level + 1 } }
				]
			})
			.limit(item.children_leafs + item.children_nodes)
			.update(function (obj) {
				if (skip > 0) {
					skip--;
					return;
				}

				if (obj.children_leafs > 0 && obj.open === false) {
					skip = obj.children_leafs + obj.children_nodes;
				}

				obj.tree_visibility = true;
			});

		console.timeEnd("open_node");
	};

	/*
	 ██████ ██       ██████  ███████ ███████     ███    ██  ██████  ██████  ███████
	██      ██      ██    ██ ██      ██          ████   ██ ██    ██ ██   ██ ██
	██      ██      ██    ██ ███████ █████       ██ ██  ██ ██    ██ ██   ██ █████
	██      ██      ██    ██      ██ ██          ██  ██ ██ ██    ██ ██   ██ ██
	 ██████ ███████  ██████  ███████ ███████     ██   ████  ██████  ██████  ███████
	*/
	var close_node = function (item) {
		/*
		 * Close an item.
		 * First, mark the item itself as closed, then find all
		 * children and mark then as invisible.
		 */
		console.time("close_node");

		this.collection
			.chain()
			.find({ 'id': item.id })
			.update(function (obj) {
				obj.open = false;
			});

		this.collection
			.chain()
			.find({
				'$and': [
					{ 'parents_id': { '$contains': item.id } },
					{ 'level': {'$gte': item.level + 1 } }
				]
			})
			.limit(item.children_leafs + item.children_nodes)
			.update(function (obj) {
				obj.tree_visibility = false;
			});

		console.timeEnd("close_node");
	};

	/*
	████████  ██████   ██████   ██████  ██      ███████      ██████ ██   ██ ███████  ██████ ██   ██
	   ██    ██    ██ ██       ██       ██      ██          ██      ██   ██ ██      ██      ██  ██
	   ██    ██    ██ ██   ███ ██   ███ ██      █████       ██      ███████ █████   ██      █████
	   ██    ██    ██ ██    ██ ██    ██ ██      ██          ██      ██   ██ ██      ██      ██  ██
	   ██     ██████   ██████   ██████  ███████ ███████      ██████ ██   ██ ███████  ██████ ██   ██
	*/
	var toggle_check_node = function (item) {
		/*
		 * Toggle the checked state on an item.
		 * Note that there are, in total, 5 different states:
		 *
		 * true: checked leaf.
		 * false: unchecked leaf.
		 * -1: all children leafs of the node are unchecked.
		 * 0: at least one children leaf of the node is checked.
		 * 1: all children leafs of the node are checked.
		 *
		 * If the node/item is (fully) checked, uncheck, else check.
		 */
		switch (item.checked) {
			case 1:
			case true:
				this.uncheck_node(item);
				break;
			case 0:
			case -1:
			case false:
				this.check_node(item);
				break;
		}

		main_ctx.on_data_change_fn();
	};

	/*
	 ██████ ██   ██ ███████  ██████ ██   ██     ███    ██  ██████  ██████  ███████
	██      ██   ██ ██      ██      ██  ██      ████   ██ ██    ██ ██   ██ ██
	██      ███████ █████   ██      █████       ██ ██  ██ ██    ██ ██   ██ █████
	██      ██   ██ ██      ██      ██  ██      ██  ██ ██ ██    ██ ██   ██ ██
	 ██████ ██   ██ ███████  ██████ ██   ██     ██   ████  ██████  ██████  ███████
	*/
	var check_node = function (item) {
		/*
		 * Set an item as checked.
		 * If the passed item is a leaf:
		 *     1. Mark it as checked.
		 *     2. Search all parent nodes,
		 *        add 1 to their checked_children counter and
		 *        set their checked state based on the checked_children counter.
		 *
		 * If it's a node:
		 *     1. Mark it as 1 (checked node).
		 *     2. Set the counter of checked leafs to the number of leafs it contains.
		 *     3. Search all children leafs and nodes and mark them as checked.
		 *     4. Search all parent nodes,
		 *        add N to their checked_children counter and
		 *        set their checked state based on the checked_children counter.
		 *        N is the difference between the checked leafs of the nodes we're checking
		 *        before and after the operation.
		 */
		console.time("check_node");

		var ctx = this;
		var diff_checked_children = 0;
		var currently_checked_children = item.checked_children;

		this.collection
			.chain()
			.find({ 'id': item.id })
			.update(function (obj) {
				if (item.children_leafs === 0) {
					obj.checked = true;
				} else {
					obj.checked = 1;
					obj.checked_children = obj.children_leafs;
					diff_checked_children = obj.checked_children - currently_checked_children;
				}
			});

		if (item.children_leafs === 0) {
			this.collection
				.chain()
				.find({
					'id': {'$in': item.parents_id}
				})
				.simplesort("order", true)
				.update(function (obj) {
					obj.checked_children++; // We can't overflow this as we're checking an unchecked item
					if (obj.checked_children === obj.children_leafs) {
						obj.checked = 1;
					} else {
						obj.checked = 0;
					} //Note that we have can reach a -1 state here as we just checked a child leaf
				});
		} else {
			this.collection
				.chain()
				.find({
					'$and': [
						{ 'parents_id': { '$contains': item.id } },
						{ 'level': {'$gte': item.level + 1 } },
						{ 'checked': {'$in': [0, -1, false] } }
					]
				})
				.simplesort("order", false)
				.update(function (obj) {
					if (obj.children_leafs === 0) {
						obj.checked = true;
					} else {
						obj.checked = 1;
					}
				});

			this.collection
				.chain()
				.find({
					'id': {'$in': item.parents_id}
				})
				.simplesort("order", true)
				.update(function (obj) {
					obj.checked_children += diff_checked_children;
					if (obj.checked_children === obj.children_leafs) {
						obj.checked = 1;
					} else {
						obj.checked = 0;
					} //Note that we have can reach a -1 state here as we just checked a child leaf
				});
		}

		console.timeEnd("check_node");
	};

	/*
	██    ██ ███    ██  ██████ ██   ██ ███████  ██████ ██   ██     ███    ██  ██████  ██████  ███████
	██    ██ ████   ██ ██      ██   ██ ██      ██      ██  ██      ████   ██ ██    ██ ██   ██ ██
	██    ██ ██ ██  ██ ██      ███████ █████   ██      █████       ██ ██  ██ ██    ██ ██   ██ █████
	██    ██ ██  ██ ██ ██      ██   ██ ██      ██      ██  ██      ██  ██ ██ ██    ██ ██   ██ ██
	 ██████  ██   ████  ██████ ██   ██ ███████  ██████ ██   ██     ██   ████  ██████  ██████  ███████
	*/
	var uncheck_node = function (item) {
		/*
		 * If the passed item is a leaf:
		 *     1. Mark it as unchecked.
		 *     2. Search all parent nodes,
		 *        rest 1 from their checked_children counter and
		 *        set their checked state based on the checked_children counter.
		 *
		 * If it's a node:
		 *     1. Mark it as 1 (checked node).
		 *     2. Set the counter of checked leafs to the number of leafs it contains.
		 *     3. Search all children leafs and nodes and mark them as checked.
		 *     4. Search all parent nodes,
		 *        add N to their checked_children counter and
		 *        set their checked state based on the checked_children counter.
		 *        N is the difference between the checked leafs of the nodes we're checking
		 *        before and after the operation.
		 */
		console.time("uncheck_node");

		var ctx = this;
		var diff_checked_children = 0;
		var currently_checked_children = item.checked_children;

		this.collection
			.chain()
			.find({ 'id': item.id })
			.update(function (obj) {
				if (item.children_leafs === 0) {
					obj.checked = false;
				} else {
					obj.checked = -1;
					obj.checked_children = 0;
					diff_checked_children = obj.checked_children;
				}
			});

		if (item.children_leafs === 0) {
			this.collection
				.chain()
				.find({
					'id': {'$in': item.parents_id}
				})
				.simplesort("order", true)
				.update(function (obj) {
					obj.checked_children--; // We can't underflow this as we're unchecking a checked item
					if (obj.checked_children === 0) {
						obj.checked = -1;
					} else {
						obj.checked = 0;
					} //Note that we have can reach a 1 state here as we just unchecked a child leaf
				});
		} else {
			this.collection
				.chain()
				.find({
					'$and': [
						{ 'parents_id': { '$contains': item.id } },
						{ 'level': {'$gte': item.level + 1 } },
						{ 'checked': {'$in': [0, 1, true] } }
					]
				})
				.simplesort("order", false)
				.update(function (obj) {
					if (obj.children_leafs === 0) {
						obj.checked = false;
					} else {
						obj.checked = -1;
					}
				});

			this.collection
				.chain()
				.find({
					'id': {'$in': item.parents_id}
				})
				.simplesort("order", true)
				.update(function (obj) {
					obj.checked_children -= diff_checked_children;
					if (obj.checked_children === obj.children_leafs) {
						obj.checked = -1;
					} else {
						obj.checked = 0;
					} //Note that we have can reach a -1 state here as we just checked a child leaf
				});
		}

		console.timeEnd("uncheck_node");
	};

	return {
		db: db,

		collection: collection,

		on_data_change: on_data_change,

		insert: insert,

		get_full_tree: get_full_tree,

		get_visible_tree: get_visible_tree,

		toggle_open_node: toggle_open_node,

		open_node: open_node,

		close_node: close_node,

		toggle_check_node: toggle_check_node,

		check_node: check_node,

		uncheck_node: uncheck_node
	};
});

var angular_multi_select_styles_helper = angular.module('angular-multi-select-styles-helper', []);

angular_multi_select_styles_helper.factory('angularMultiSelectStylesHelper', function () {
	return {
		get_open_class: function (item) {
			return item.open === true ? 'open' : 'closed';
		},

		get_checked_class: function (item) {
			if (typeof(item.checked) === 'boolean' ) {
				return item.checked ? 'checked' : 'unchecked';
			} else {
				return item.checked < 0 ? 'unchecked' : item.checked > 0 ? 'checked' : 'mixed';
			}
		},

		get_type_class: function (item) {
			return item.children_leafs === 0 ? 'leaf' : 'node';
		}
	};
});
