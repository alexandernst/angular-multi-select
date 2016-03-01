var angular_multi_select_engine = angular.module('angular-multi-select-engine', [
	'angular-multi-select-constants'
]);

angular_multi_select_engine.factory('angularMultiSelectEngine', [
	'angularMultiSelectConstants',
	function (angularMultiSelectConstants) {

		var Engine = function (ops) {
			ops = ops || {};
			this.DEBUG             = ops.DEBUG             || false;
			this.ID_PROPERTY       = ops.ID_PROPERTY       || angularMultiSelectConstants.ID_PROPERTY;
			this.OPEN_PROPERTY     = ops.OPEN_PROPERTY     || angularMultiSelectConstants.OPEN_PROPERTY;
			this.CHECKED_PROPERTY  = ops.CHECKED_PROPERTY  || angularMultiSelectConstants.CHECKED_PROPERTY;
			this.CHILDREN_PROPERTY = ops.CHILDREN_PROPERTY || angularMultiSelectConstants.CHILDREN_PROPERTY;

			/*
			 * Initiate the database and setup index fields.
			 */
			this.db = new loki();
			this.collection = this.db.addCollection('angular-multi-select', {
				indices: [
					this.ID_PROPERTY,
					this.CHECKED_PROPERTY,
					angularMultiSelectConstants.INTERNAL_KEY_LEVEL,
					angularMultiSelectConstants.INTERNAL_KEY_PARENTS_ID,
					angularMultiSelectConstants.INTERNAL_KEY_TREE_VISIBILITY
				],
				clone: true
			});

			this.on_data_change_fn = null;
			this.on_visual_change_fn = null;
		};

		/*
		 ██████  ███    ██     ██████   █████  ████████  █████       ██████ ██   ██  █████  ███    ██  ██████  ███████
		██    ██ ████   ██     ██   ██ ██   ██    ██    ██   ██     ██      ██   ██ ██   ██ ████   ██ ██       ██
		██    ██ ██ ██  ██     ██   ██ ███████    ██    ███████     ██      ███████ ███████ ██ ██  ██ ██   ███ █████
		██    ██ ██  ██ ██     ██   ██ ██   ██    ██    ██   ██     ██      ██   ██ ██   ██ ██  ██ ██ ██    ██ ██
		 ██████  ██   ████     ██████  ██   ██    ██    ██   ██      ██████ ██   ██ ██   ██ ██   ████  ██████  ███████
		*/
		Engine.prototype.on_data_change = function (fn) {
			/*
			 * Will be executed when the data in one or more of the items in the
			 * tree is changed. Changes such as open/close (visibility related)
			 * won't trigger this function.
			 *
			 * Note that this method will be ran only once after applying
			 * multiple data updates if there are more than one, like for example
			 * when checking a node that has multiple children.
			 */
			this.on_data_change_fn = fn;
		};


		/*
		 ██████  ███    ██     ██    ██ ██ ███████ ██    ██  █████  ██           ██████ ██   ██  █████  ███    ██  ██████  ███████
		██    ██ ████   ██     ██    ██ ██ ██      ██    ██ ██   ██ ██          ██      ██   ██ ██   ██ ████   ██ ██       ██
		██    ██ ██ ██  ██     ██    ██ ██ ███████ ██    ██ ███████ ██          ██      ███████ ███████ ██ ██  ██ ██   ███ █████
		██    ██ ██  ██ ██      ██  ██  ██      ██ ██    ██ ██   ██ ██          ██      ██   ██ ██   ██ ██  ██ ██ ██    ██ ██
		 ██████  ██   ████       ████   ██ ███████  ██████  ██   ██ ███████      ██████ ██   ██ ██   ██ ██   ████  ██████  ███████
		*/
		Engine.prototype.on_visual_change = function (fn) {
			/*
			* Will be executed when the tree changed somehow, visually speaking.
			* This function could be triggered by an open/close action for example.
			* Changes such as un/checking an item won't trigger this function.
			*
			* Note that this method will be ran only once, after applying all the
			* visual changes required by the action, like for example when closing
			* a node that has multiple children.
			*/
			this.on_visual_change_fn = fn;
		};

		/*
		██ ███    ██ ███████ ███████ ██████  ████████
		██ ████   ██ ██      ██      ██   ██    ██
		██ ██ ██  ██ ███████ █████   ██████     ██
		██ ██  ██ ██      ██ ██      ██   ██    ██
		██ ██   ████ ███████ ███████ ██   ██    ██
		*/
		Engine.prototype.insert = function (items) {
			/*
			 * Iterate over an array of items and insert them.
			 */
			if (this.DEBUG === true) console.time("insert");

			this.db.removeCollection('angular-multi-select');

			if (items === undefined) return;

			if (Array.isArray(items)) {
				for (var i = 0; i < items.length; i++) {
					this.collection.insert(items[i]);
				}
			} else {
				this.collection.insert(items);
			}

			if (this.DEBUG === true) console.timeEnd("insert");
			if (this.on_data_change_fn !== null) this.on_data_change_fn();
		};

		/*
		 ██████  ███████ ████████     ███████ ██    ██ ██      ██          ████████ ██████  ███████ ███████
		██       ██         ██        ██      ██    ██ ██      ██             ██    ██   ██ ██      ██
		██   ███ █████      ██        █████   ██    ██ ██      ██             ██    ██████  █████   █████
		██    ██ ██         ██        ██      ██    ██ ██      ██             ██    ██   ██ ██      ██
		 ██████  ███████    ██        ██       ██████  ███████ ███████        ██    ██   ██ ███████ ███████
		*/
		Engine.prototype.get_full_tree = function () {
			/*
			 * Get the entire set of data currently inserted in Loki.
			 */
			if (this.DEBUG === true) console.time("get_full_tree");

			var tree = this.collection
				.chain()
				.find({})
				.simplesort(angularMultiSelectConstants.INTERNAL_KEY_ORDER, false)
				.data();

			if (this.DEBUG === true) console.time("get_full_tree");
			return tree;
		};

		/*
		 ██████  ███████ ████████     ██    ██ ██ ███████ ██ ██████  ██      ███████     ████████ ██████  ███████ ███████
		██       ██         ██        ██    ██ ██ ██      ██ ██   ██ ██      ██             ██    ██   ██ ██      ██
		██   ███ █████      ██        ██    ██ ██ ███████ ██ ██████  ██      █████          ██    ██████  █████   █████
		██    ██ ██         ██         ██  ██  ██      ██ ██ ██   ██ ██      ██             ██    ██   ██ ██      ██
		 ██████  ███████    ██          ████   ██ ███████ ██ ██████  ███████ ███████        ██    ██   ██ ███████ ███████
		*/
		Engine.prototype.get_visible_tree = function () {
			/*
			 * Get only the visible elements from Loki.
			 */
			if (this.DEBUG === true) console.time("get_visible_tree");

			var tree = this.collection
				.chain()
				.find({
					[angularMultiSelectConstants.INTERNAL_KEY_TREE_VISIBILITY]: angularMultiSelectConstants.INTERNAL_DATA_VISIBLE
				})
				.simplesort(angularMultiSelectConstants.INTERNAL_KEY_ORDER, false)
				.data();

			if (this.DEBUG === true) console.timeEnd("get_visible_tree");
			return tree;
		};

		/*
		 ██████  ███████ ████████     ███████ ██ ██   ████████ ███████ ██████  ███████ ██████      ████████ ██████  ███████ ███████
		██       ██         ██        ██      ██ ██      ██    ██      ██   ██ ██      ██   ██        ██    ██   ██ ██      ██
		██   ███ █████      ██        █████   ██ ██      ██    █████   ██████  █████   ██   ██        ██    ██████  █████   █████
		██    ██ ██         ██        ██      ██ ██      ██    ██      ██   ██ ██      ██   ██        ██    ██   ██ ██      ██
		 ██████  ███████    ██        ██      ██ ███████ ██    ███████ ██   ██ ███████ ██████         ██    ██   ██ ███████ ███████
		*/
		Engine.prototype.get_filtered_tree = function (query) {
			if (this.DEBUG === true) console.time("get_filtered_tree");

			var filter = [];
			for (var i = 0; i < query.length; i++) {
				var item = query[i];
				filter.push({
					[item.field]: {
						'$contains': item.query
					}
				});
			}

			var tree = this.collection
				.chain()
				.find({
					'$and': filter
				})
				.simplesort(angularMultiSelectConstants.INTERNAL_KEY_ORDER, false)
				.data();

			if (this.DEBUG === true) console.timeEnd("get_filtered_tree");
			return tree;
		};

		/*
		 ██████  ███████ ████████      ██████ ██   ██ ███████  ██████ ██   ██ ███████ ██████      ████████ ██████  ███████ ███████
		██       ██         ██        ██      ██   ██ ██      ██      ██  ██  ██      ██   ██        ██    ██   ██ ██      ██
		██   ███ █████      ██        ██      ███████ █████   ██      █████   █████   ██   ██        ██    ██████  █████   █████
		██    ██ ██         ██        ██      ██   ██ ██      ██      ██  ██  ██      ██   ██        ██    ██   ██ ██      ██
		 ██████  ███████    ██         ██████ ██   ██ ███████  ██████ ██   ██ ███████ ██████         ██    ██   ██ ███████ ███████
		*/
		Engine.prototype.get_checked_tree = function (filter) {
			/*
			 * Get only the checked elements from Loki.
			 */

			if (this.DEBUG === true) console.time("get_checked_tree");

			filter = [
				angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED,
				angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED,
				angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED
			];
			if (filter !== undefined) {
				switch (filter) {
					case angularMultiSelectConstants.FIND_MIXED_NODES:
						filter = [
							angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED
						];
						break;
					case angularMultiSelectConstants.FIND_CHECKED_NODES:
						filter = [
							angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED
						];
						break;
					case angularMultiSelectConstants.FIND_CHECKED_LEAFS:
						filter = [
							angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED
						];
						break;
					case angularMultiSelectConstants.FIND_CHECKED_AND_MIXED_NODES:
						filter = [
							angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED,
							angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED
						];
						break;
					case angularMultiSelectConstants.FIND_CHECKED_LEAFS_AND_NODES:
						filter = [
							angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED,
							angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED,
						];
						break;
					case angularMultiSelectConstants.FIND_CHECKED_MIXED_LEAFS_NODES:
						filter = [
							angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED,
							angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED,
							angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED
						];
						break;
				}
			}

			var tree = this.collection
				.chain()
				.find({
					[this.CHECKED_PROPERTY]: {
						'$in': filter
					}
				})
				.simplesort(angularMultiSelectConstants.INTERNAL_KEY_ORDER, false)
				.data();

			if (this.DEBUG === true) console.timeEnd("get_checked_tree");
			return tree;
		};

		/*
		████████  ██████   ██████   ██████  ██      ███████      ██████  ██████  ███████ ███    ██
		   ██    ██    ██ ██       ██       ██      ██          ██    ██ ██   ██ ██      ████   ██
		   ██    ██    ██ ██   ███ ██   ███ ██      █████       ██    ██ ██████  █████   ██ ██  ██
		   ██    ██    ██ ██    ██ ██    ██ ██      ██          ██    ██ ██      ██      ██  ██ ██
		   ██     ██████   ██████   ██████  ███████ ███████      ██████  ██      ███████ ██   ████
		*/
		Engine.prototype.toggle_open_node = function (item) {
			/*
			 * Toggle the open/closed state of an element.
			 * Note that leafs are not supposed to be toggleable.
			 */
			if (item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] === 0) return;

			if (item[this.OPEN_PROPERTY] === angularMultiSelectConstants.INTERNAL_DATA_OPEN) {
				this.close_node(item);
			} else {
				this.open_node(item);
			}

			if (this.on_visual_change_fn !== null) this.on_visual_change_fn();
		};

		/*
		 ██████  ██████  ███████ ███    ██     ███    ██  ██████  ██████  ███████
		██    ██ ██   ██ ██      ████   ██     ████   ██ ██    ██ ██   ██ ██
		██    ██ ██████  █████   ██ ██  ██     ██ ██  ██ ██    ██ ██   ██ █████
		██    ██ ██      ██      ██  ██ ██     ██  ██ ██ ██    ██ ██   ██ ██
		 ██████  ██      ███████ ██   ████     ██   ████  ██████  ██████  ███████
		*/
		Engine.prototype.open_node = function (item) {
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
			if (this.DEBUG === true) console.time("open_node");

			var skip = 0;

			this.collection
				.chain()
				.find({
					[this.ID_PROPERTY]: item[this.ID_PROPERTY]
				})
				.update((obj) => {
					obj[this.OPEN_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_OPEN;
				});

			this.collection
				.chain()
				.find({
					'$and': [
						{
							[angularMultiSelectConstants.INTERNAL_KEY_PARENTS_ID]: {
								'$contains': item[this.ID_PROPERTY]
							}
						},
						{
							[angularMultiSelectConstants.INTERNAL_KEY_LEVEL]: {
								'$gte': item[angularMultiSelectConstants.INTERNAL_KEY_LEVEL] + 1
							}
						}
					]
				})
				.limit(item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] + item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_NODES])
				.update((obj) => {
					if (skip > 0) {
						skip--;
						return;
					}

					if (
						obj[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] > 0 &&
						obj[this.OPEN_PROPERTY] === angularMultiSelectConstants.INTERNAL_DATA_CLOSED
					) {
						skip = obj[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] + obj[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_NODES];
					}

					obj[angularMultiSelectConstants.INTERNAL_KEY_TREE_VISIBILITY] = angularMultiSelectConstants.INTERNAL_DATA_VISIBLE;
				});

			if (this.DEBUG === true) console.timeEnd("open_node");
		};

		/*
		 ██████ ██       ██████  ███████ ███████     ███    ██  ██████  ██████  ███████
		██      ██      ██    ██ ██      ██          ████   ██ ██    ██ ██   ██ ██
		██      ██      ██    ██ ███████ █████       ██ ██  ██ ██    ██ ██   ██ █████
		██      ██      ██    ██      ██ ██          ██  ██ ██ ██    ██ ██   ██ ██
		 ██████ ███████  ██████  ███████ ███████     ██   ████  ██████  ██████  ███████
		*/
		Engine.prototype.close_node = function (item) {
			/*
			 * Close an item.
			 * First, mark the item itself as closed, then find all
			 * children and mark then as invisible.
			 */
			if (this.DEBUG === true) console.time("close_node");

			this.collection
				.chain()
				.find({
					[this.ID_PROPERTY]: item[this.ID_PROPERTY]
				})
				.update((obj) => {
					obj[this.OPEN_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_CLOSED;
				});

			this.collection
				.chain()
				.find({
					'$and': [
						{
							[angularMultiSelectConstants.INTERNAL_KEY_PARENTS_ID]: {
								'$contains': item[this.ID_PROPERTY]
							}
						},
						{
							[angularMultiSelectConstants.INTERNAL_KEY_LEVEL]: {
								'$gte': item[angularMultiSelectConstants.INTERNAL_KEY_LEVEL] + 1
							}
						}
					]
				})
				.limit(item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] + item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_NODES])
				.update((obj) => {
					obj[angularMultiSelectConstants.INTERNAL_KEY_TREE_VISIBILITY] = angularMultiSelectConstants.INTERNAL_DATA_INVISIBLE;
				});

			if (this.DEBUG === true) console.timeEnd("close_node");
		};

		/*
		 ██████ ██   ██ ███████  ██████ ██   ██      █████  ██      ██
		██      ██   ██ ██      ██      ██  ██      ██   ██ ██      ██
		██      ███████ █████   ██      █████       ███████ ██      ██
		██      ██   ██ ██      ██      ██  ██      ██   ██ ██      ██
		 ██████ ██   ██ ███████  ██████ ██   ██     ██   ██ ███████ ███████
		*/
		Engine.prototype.check_all = function () {
			if (this.DEBUG === true) console.time("check_all");

			this.collection
				.chain()
				.find({})
				.update((obj) => {
					if (obj[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] === 0) {
						obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED;
					} else {
						obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED;
						obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] = obj[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS];
					}
				});

			if (this.DEBUG === true) console.time("check_all");
			if (this.on_data_change_fn !== null) this.on_data_change_fn();
		};

		/*
		██    ██ ███    ██  ██████ ██   ██ ███████  ██████ ██   ██      █████  ██      ██
		██    ██ ████   ██ ██      ██   ██ ██      ██      ██  ██      ██   ██ ██      ██
		██    ██ ██ ██  ██ ██      ███████ █████   ██      █████       ███████ ██      ██
		██    ██ ██  ██ ██ ██      ██   ██ ██      ██      ██  ██      ██   ██ ██      ██
		 ██████  ██   ████  ██████ ██   ██ ███████  ██████ ██   ██     ██   ██ ███████ ███████
		*/
		Engine.prototype.uncheck_all = function () {
			if (this.DEBUG === true) console.time("uncheck_all");

			this.collection
				.chain()
				.find({})
				.update((obj) => {
					if (obj[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] === 0) {
						obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_LEAF_UNCHECKED;
					} else {
						obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_UNCHECKED;
						obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] = 0;
					}
				});

			if (this.DEBUG === true) console.time("uncheck_all");
			if (this.on_data_change_fn !== null) this.on_data_change_fn();
		};

		/*
		████████  ██████   ██████   ██████  ██      ███████      ██████ ██   ██ ███████  ██████ ██   ██
		   ██    ██    ██ ██       ██       ██      ██          ██      ██   ██ ██      ██      ██  ██
		   ██    ██    ██ ██   ███ ██   ███ ██      █████       ██      ███████ █████   ██      █████
		   ██    ██    ██ ██    ██ ██    ██ ██      ██          ██      ██   ██ ██      ██      ██  ██
		   ██     ██████   ██████   ██████  ███████ ███████      ██████ ██   ██ ███████  ██████ ██   ██
		*/
		Engine.prototype.toggle_check_node = function (item) {
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
			switch (item[this.CHECKED_PROPERTY]) {
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

			if (this.on_data_change_fn !== null) this.on_data_change_fn();
		};

		/*
		 ██████ ██   ██ ███████  ██████ ██   ██     ███    ██  ██████  ██████  ███████
		██      ██   ██ ██      ██      ██  ██      ████   ██ ██    ██ ██   ██ ██
		██      ███████ █████   ██      █████       ██ ██  ██ ██    ██ ██   ██ █████
		██      ██   ██ ██      ██      ██  ██      ██  ██ ██ ██    ██ ██   ██ ██
		 ██████ ██   ██ ███████  ██████ ██   ██     ██   ████  ██████  ██████  ███████
		*/
		Engine.prototype.check_node = function (item) {
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
			if (this.DEBUG === true) console.time("check_node");

			var diff_checked_children = 0;
			var currently_checked_children = item[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN];

			this.collection
				.chain()
				.find({
					[this.ID_PROPERTY]: item[this.ID_PROPERTY]
				})
				.update((obj) => {
					if (item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] === 0) {
						obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED;
					} else {
						obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED;
						obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] = obj[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS];
						diff_checked_children = obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] - currently_checked_children;
					}
				});

			if (item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] === 0) {
				this.collection
					.chain()
					.find({
						[this.ID_PROPERTY]: {
							'$in': item[angularMultiSelectConstants.INTERNAL_KEY_PARENTS_ID]
						}
					})
					.simplesort(angularMultiSelectConstants.INTERNAL_KEY_ORDER, true)
					.update((obj) => {
						obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN]++; // We can't overflow this as we're checking an unchecked item
						if (obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] === obj[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS]) {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED;
						} else {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED;
						} //Note that we have can reach a -1 state here as we just checked a child leaf
					});
			} else {
				this.collection
					.chain()
					.find({
						'$and': [
							{
								[angularMultiSelectConstants.INTERNAL_KEY_PARENTS_ID]: {
									'$contains': item[this.ID_PROPERTY]
								}
							},
							{
								[angularMultiSelectConstants.INTERNAL_KEY_LEVEL]: {
									'$gte': item[angularMultiSelectConstants.INTERNAL_KEY_LEVEL] + 1
								}
							},
							{
								[this.CHECKED_PROPERTY]: {
									'$in': [
										angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED,
										angularMultiSelectConstants.INTERNAL_DATA_NODE_UNCHECKED,
										angularMultiSelectConstants.INTERNAL_DATA_LEAF_UNCHECKED
									]
								}
							}
						]
					})
					.simplesort(angularMultiSelectConstants.INTERNAL_KEY_ORDER, false)
					.update((obj) => {
						if (obj[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] === 0) {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED;
						} else {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED;
							obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] = obj[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS];
						}
					});

				this.collection
					.chain()
					.find({
						[this.ID_PROPERTY]: {
							'$in': item[angularMultiSelectConstants.INTERNAL_KEY_PARENTS_ID]
						}
					})
					.simplesort(angularMultiSelectConstants.INTERNAL_KEY_ORDER, true)
					.update((obj) => {
						obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] += diff_checked_children;
						if (obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] === obj[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS]) {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED;
						} else {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED;
						} //Note that we have can reach a -1 state here as we just checked a child leaf
					});
			}

			if (this.DEBUG === true) console.timeEnd("check_node");
		};

		/*
		██    ██ ███    ██  ██████ ██   ██ ███████  ██████ ██   ██     ███    ██  ██████  ██████  ███████
		██    ██ ████   ██ ██      ██   ██ ██      ██      ██  ██      ████   ██ ██    ██ ██   ██ ██
		██    ██ ██ ██  ██ ██      ███████ █████   ██      █████       ██ ██  ██ ██    ██ ██   ██ █████
		██    ██ ██  ██ ██ ██      ██   ██ ██      ██      ██  ██      ██  ██ ██ ██    ██ ██   ██ ██
		 ██████  ██   ████  ██████ ██   ██ ███████  ██████ ██   ██     ██   ████  ██████  ██████  ███████
		*/
		Engine.prototype.uncheck_node = function (item) {
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
			if (this.DEBUG === true) console.time("uncheck_node");

			var diff_checked_children = 0;
			var currently_checked_children = item[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN];

			this.collection
				.chain()
				.find({
					[this.ID_PROPERTY]: item[this.ID_PROPERTY]
				})
				.update((obj) => {
					if (item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] === 0) {
						obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_LEAF_UNCHECKED;
					} else {
						obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_UNCHECKED;
						obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] = 0;
						diff_checked_children = currently_checked_children - obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN];
					}
				});

			if (item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] === 0) {
				this.collection
					.chain()
					.find({
						[this.ID_PROPERTY]: {
							'$in': item[angularMultiSelectConstants.INTERNAL_KEY_PARENTS_ID]
						}
					})
					.simplesort(angularMultiSelectConstants.INTERNAL_KEY_ORDER, true)
					.update((obj) => {
						obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN]--; // We can't underflow this as we're unchecking a checked item
						if (obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] === 0) {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_UNCHECKED;
						} else {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED;
						} //Note that we have can reach a 1 state here as we just unchecked a child leaf
					});
			} else {
				this.collection
					.chain()
					.find({
						'$and': [
							{
								[angularMultiSelectConstants.INTERNAL_KEY_PARENTS_ID]: {
									'$contains': item[this.ID_PROPERTY]
								}
							},
							{
								[angularMultiSelectConstants.INTERNAL_KEY_LEVEL]: {
									'$gte': item[angularMultiSelectConstants.INTERNAL_KEY_LEVEL] + 1
								}
							},
							{
								[this.CHECKED_PROPERTY]: {
									'$in': [
										angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED,
										angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED,
										angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED
									]
								}
							}
						]
					})
					.simplesort(angularMultiSelectConstants.INTERNAL_KEY_ORDER, false)
					.update((obj) => {
						if (obj[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] === 0) {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_LEAF_UNCHECKED;
						} else {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_UNCHECKED;
							obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] = 0;
						}
					});

				this.collection
					.chain()
					.find({
						[this.ID_PROPERTY]: {
							'$in': item[angularMultiSelectConstants.INTERNAL_KEY_PARENTS_ID]
						}
					})
					.simplesort(angularMultiSelectConstants.INTERNAL_KEY_ORDER, true)
					.update((obj) => {
						obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] -= diff_checked_children;
						if (obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] === 0) {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_UNCHECKED;
						} else {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED;
						} //Note that we have can reach a -1 state here as we just checked a child leaf
					});
			}

			if (this.DEBUG === true) console.timeEnd("uncheck_node");
		};

		return Engine;
	}
]);
