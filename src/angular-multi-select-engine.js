var angular_multi_select_engine = angular.module('angular-multi-select-engine', [
	'angular-multi-select-constants'
]);

angular_multi_select_engine.factory('angularMultiSelectEngine', [
	'angularMultiSelectConstants',
	function (angularMultiSelectConstants) {
		var Engine = function (ops) {
			ops = ops || {};

			this.DEBUG             = ops.DEBUG             || false;
			this.NAME              = ops.NAME              || 'angular-multi-select-' + (Date.now() / 1000 | 0);
			this.MAX_CHECKED_LEAFS = ops.MAX_CHECKED_LEAFS || -1;

			this.ID_PROPERTY       = ops.ID_PROPERTY       || angularMultiSelectConstants.ID_PROPERTY;
			this.OPEN_PROPERTY     = ops.OPEN_PROPERTY     || angularMultiSelectConstants.OPEN_PROPERTY;
			this.CHECKED_PROPERTY  = ops.CHECKED_PROPERTY  || angularMultiSelectConstants.CHECKED_PROPERTY;
			this.CHILDREN_PROPERTY = ops.CHILDREN_PROPERTY || angularMultiSelectConstants.CHILDREN_PROPERTY;

			/*
			 * Initiate the database and setup index fields.
			 */
			this.db = new loki();

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
			this.on_data_change_fn = function () {
				/*
				 * Reserved for internal purposes.
				 */

				/*
				 * Handle situation where a maximum amount of checked leafs has been specified.
				 */
				if (this.MAX_CHECKED_LEAFS > -1 && this.stats.checked_leafs > this.MAX_CHECKED_LEAFS) {
					this.uncheck_first(this.stats.checked_leafs - this.MAX_CHECKED_LEAFS);
				}

				if (typeof(fn) === 'function') {
					fn();
				}
			};;
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
			this.on_visual_change_fn = function () {
				/*
				 * Reserved for internal purposes.
				 */

				if (typeof(fn) === 'function') {
					fn();
				}
			};
		};

		/*
		 ██████ ██████  ███████  █████  ████████ ███████      ██████  ██████  ██      ██      ███████  ██████ ████████ ██  ██████  ███    ██
		██      ██   ██ ██      ██   ██    ██    ██          ██      ██    ██ ██      ██      ██      ██         ██    ██ ██    ██ ████   ██
		██      ██████  █████   ███████    ██    █████       ██      ██    ██ ██      ██      █████   ██         ██    ██ ██    ██ ██ ██  ██
		██      ██   ██ ██      ██   ██    ██    ██          ██      ██    ██ ██      ██      ██      ██         ██    ██ ██    ██ ██  ██ ██
		 ██████ ██   ██ ███████ ██   ██    ██    ███████      ██████  ██████  ███████ ███████ ███████  ██████    ██    ██  ██████  ██   ████
		*/
		Engine.prototype.create_collection = function (name) {
			/*
			 * Create a collection in the database and create indices.
			 */
			if (this.DEBUG === true) console.time("create_collection");

			this.collection = this.db.addCollection(name, {
				indices: [
					this.ID_PROPERTY,
					this.CHECKED_PROPERTY,
					angularMultiSelectConstants.INTERNAL_KEY_LEVEL,
					angularMultiSelectConstants.INTERNAL_KEY_PARENTS_ID,
					angularMultiSelectConstants.INTERNAL_KEY_TREE_VISIBILITY
				],
				clone: true
			});

			if (this.DEBUG === true) console.timeEnd("create_collection");
		};

		/*
		██████  ███████ ███    ███  ██████  ██    ██ ███████      ██████  ██████  ██      ██      ███████  ██████ ████████ ██  ██████  ███    ██
		██   ██ ██      ████  ████ ██    ██ ██    ██ ██          ██      ██    ██ ██      ██      ██      ██         ██    ██ ██    ██ ████   ██
		██████  █████   ██ ████ ██ ██    ██ ██    ██ █████       ██      ██    ██ ██      ██      █████   ██         ██    ██ ██    ██ ██ ██  ██
		██   ██ ██      ██  ██  ██ ██    ██  ██  ██  ██          ██      ██    ██ ██      ██      ██      ██         ██    ██ ██    ██ ██  ██ ██
		██   ██ ███████ ██      ██  ██████    ████   ███████      ██████  ██████  ███████ ███████ ███████  ██████    ██    ██  ██████  ██   ████
		*/
		Engine.prototype.remove_collection = function (name) {
			/*
			 * Remove a collection from the database.
			 */
			if (this.DEBUG === true) console.time("remove_collection");

			this.db.removeCollection(name);

			if (this.DEBUG === true) console.timeEnd("remove_collection");
		}

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

			this.remove_collection(this.NAME);
			this.create_collection(this.NAME);

			this.reset_stats();

			items = items || [];

			if (Array.isArray(items)) {
				for (var i = 0; i < items.length; i++) {
					this.collection.insert(items[i]);
					this.update_stats(items[i]);
				}
			} else {
				this.collection.insert(items);
				this.update_stats(items);
			}

			if (this.DEBUG === true) console.timeEnd("insert");

			if (this.on_data_change_fn !== null) this.on_data_change_fn();
		};

		/*
		 ██████  ███████ ████████     ███████ ████████  █████  ████████ ███████
		██       ██         ██        ██         ██    ██   ██    ██    ██
		██   ███ █████      ██        ███████    ██    ███████    ██    ███████
		██    ██ ██         ██             ██    ██    ██   ██    ██         ██
		 ██████  ███████    ██        ███████    ██    ██   ██    ██    ███████
		*/
		Engine.prototype.get_stats = function () {
			return this.stats;
		};

		/*
		██    ██ ██████  ██████   █████  ████████ ███████     ███████ ████████  █████  ████████ ███████
		██    ██ ██   ██ ██   ██ ██   ██    ██    ██          ██         ██    ██   ██    ██    ██
		██    ██ ██████  ██   ██ ███████    ██    █████       ███████    ██    ███████    ██    ███████
		██    ██ ██      ██   ██ ██   ██    ██    ██               ██    ██    ██   ██    ██         ██
		 ██████  ██      ██████  ██   ██    ██    ███████     ███████    ██    ██   ██    ██    ███████
		*/
		Engine.prototype.update_stats = function (item) {
			switch (item[this.CHECKED_PROPERTY]) {
				case angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED:
					this.stats.checked_nodes++;
					this.stats.total_nodes++;
					break;
				case angularMultiSelectConstants.INTERNAL_DATA_NODE_UNCHECKED:
					this.stats.unchecked_nodes++;
					this.stats.total_nodes++;
					break;
				case angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED:
					this.stats.total_nodes++;
					break;

				case angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED:
					this.stats.checked_leafs++;
					this.stats.total_leafs++;
					break;
				case angularMultiSelectConstants.INTERNAL_DATA_LEAF_UNCHECKED:
					this.stats.total_leafs++;
					break;
			}
		};

		/*
		██████  ███████ ███████ ███████ ████████     ███████ ████████  █████  ████████ ███████
		██   ██ ██      ██      ██         ██        ██         ██    ██   ██    ██    ██
		██████  █████   ███████ █████      ██        ███████    ██    ███████    ██    ███████
		██   ██ ██           ██ ██         ██             ██    ██    ██   ██    ██         ██
		██   ██ ███████ ███████ ███████    ██        ███████    ██    ██   ██    ██    ███████
		*/
		Engine.prototype.reset_stats = function () {
			this.stats = {
				checked_leafs: 0,
				checked_nodes: 0,
				unchecked_nodes: 0,
				total_leafs: 0,
				total_nodes: 0
			};
		}

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

			var query_filter;
			switch (filter) {
				case angularMultiSelectConstants.FIND_LEAFS:
					query_filter = [
						angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED
					];
					break;

				case angularMultiSelectConstants.FIND_LEAFS_MIXED_NODES:
					query_filter = [
						angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED,
						angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED,
					];
					break;

				case angularMultiSelectConstants.FIND_LEAFS_CHECKED_NODES:
					query_filter = [
						angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED,
						angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED,
					];
					break;

				case angularMultiSelectConstants.FIND_LEAFS_MIXED_CHECKED_NODES:
					query_filter = [
						angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED,
						angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED,
						angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED
					];
					break;

				case angularMultiSelectConstants.FIND_MIXED_NODES:
					query_filter = [
						angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED
					];
					break;

				case angularMultiSelectConstants.FIND_CHECKED_NODES:
					query_filter = [
						angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED
					];
					break;

				case angularMultiSelectConstants.FIND_MIXED_CHECKED_NODES:
					query_filter = [
						angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED,
						angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED
					];
					break;

				default:
					query_filter = [
						angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED
					];
					break;
			}

			var tree = this.collection
				.chain()
				.find({
					[this.CHECKED_PROPERTY]: {
						'$in': query_filter
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

			this.stats.unchecked_nodes = 0;
			this.stats.checked_leafs = this.stats.total_leafs;
			this.stats.checked_nodes = this.stats.total_nodes;

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

			this.stats.checked_leafs = 0;
			this.stats.checked_nodes = 0;
			this.stats.unchecked_nodes = this.stats.total_nodes;

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
				case angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED:
				case angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED:
					this.uncheck_node(item);
					break;
				case angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED:
				case angularMultiSelectConstants.INTERNAL_DATA_NODE_UNCHECKED:
				case angularMultiSelectConstants.INTERNAL_DATA_LEAF_UNCHECKED:
					this.check_node(item);
					break;
			}
		};

		/*
		 ██████ ██   ██ ███████  ██████ ██   ██     ███    ██  ██████  ██████  ███████
		██      ██   ██ ██      ██      ██  ██      ████   ██ ██    ██ ██   ██ ██
		██      ███████ █████   ██      █████       ██ ██  ██ ██    ██ ██   ██ █████
		██      ██   ██ ██      ██      ██  ██      ██  ██ ██ ██    ██ ██   ██ ██
		 ██████ ██   ██ ███████  ██████ ██   ██     ██   ████  ██████  ██████  ███████
		*/
		Engine.prototype.check_node = function (item, ops) {
			if (this.DEBUG === true) console.time("check_node");

			var default_ops = {
				call_on_data_change_fn: true
			}

			ops = ops || {};
			for (var k in default_ops) {
				if (!ops.hasOwnProperty(k)) {
					ops[k] = default_ops[k];
				}
			}

			/*
			 * Used for internal calculations.
			 */
			var diff_checked_children = 0;
			var currently_checked_children = item[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN];

			/*
			 * If the item is a leaf, mark it as checked.
			 * If the item is a note, set it's counter of checked leafs to the number of leafs it contains.
			 */
			this.collection
				.chain()
				.find({
					[this.ID_PROPERTY]: item[this.ID_PROPERTY]
				})
				.update((obj) => {
					if (item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] === 0) {
						this.stats.checked_leafs++;

						obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED;
					} else {
						if (obj[this.CHECKED_PROPERTY] === angularMultiSelectConstants.INTERNAL_DATA_NODE_UNCHECKED) {
							this.stats.unchecked_nodes--;
						}
						this.stats.checked_nodes++;

						obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED;
						obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] = obj[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS];
						diff_checked_children = obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] - currently_checked_children;
					}
				});

			/*
			 * If the passed item is a leaf, search all parent nodes,
			 * add 1 to their checked_children counter and set their
			 * checked state based on the checked_children counter.
			 *
			 */
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
						if (obj[this.CHECKED_PROPERTY] === angularMultiSelectConstants.INTERNAL_DATA_NODE_UNCHECKED) {
							this.stats.unchecked_nodes--;
						}
						if (obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] + 1 === obj[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS]) {
							this.stats.checked_nodes++;
						}

						obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN]++; // We can't overflow this as we're checking an unchecked item
						if (obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] === obj[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS]) {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED;
						} else {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED;
						}
					});
			/*
			 * If it's a node:
			 *     1. Search all children leafs and nodes and mark them as checked.
			 *     2. Search all parent nodes,
			 *        add N to their checked_children counter and
			 *        set their checked state based on the checked_children counter.
			 *        N is the difference between the checked leafs of the nodes we're checking
			 *        before and after the operation.
			 */
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
							this.stats.checked_leafs++;

							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED;
						} else {
							this.stats.checked_nodes++;
							if (obj[this.CHECKED_PROPERTY] === angularMultiSelectConstants.INTERNAL_DATA_NODE_UNCHECKED) {
								this.stats.unchecked_nodes--;
							}

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
						if (obj[this.CHECKED_PROPERTY] === angularMultiSelectConstants.INTERNAL_DATA_NODE_UNCHECKED) {
							this.stats.unchecked_nodes--;
						}
						if (obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] + diff_checked_children === obj[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS]) {
							this.stats.checked_nodes++;
						}

						obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] += diff_checked_children;
						if (obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] === obj[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS]) {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED;
						} else {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED;
						}
					});
			}

			if (this.DEBUG === true) console.timeEnd("check_node");

			if (this.on_data_change_fn !== null && ops.call_on_data_change_fn) this.on_data_change_fn();
		};

		/*
		██    ██ ███    ██  ██████ ██   ██ ███████  ██████ ██   ██     ███    ██  ██████  ██████  ███████
		██    ██ ████   ██ ██      ██   ██ ██      ██      ██  ██      ████   ██ ██    ██ ██   ██ ██
		██    ██ ██ ██  ██ ██      ███████ █████   ██      █████       ██ ██  ██ ██    ██ ██   ██ █████
		██    ██ ██  ██ ██ ██      ██   ██ ██      ██      ██  ██      ██  ██ ██ ██    ██ ██   ██ ██
		 ██████  ██   ████  ██████ ██   ██ ███████  ██████ ██   ██     ██   ████  ██████  ██████  ███████
		*/
		Engine.prototype.uncheck_node = function (item, ops) {
			if (this.DEBUG === true) console.time("uncheck_node");

			var default_ops = {
				call_on_data_change_fn: true
			}

			ops = ops || {};
			for (var k in default_ops) {
				if (!ops.hasOwnProperty(k)) {
					ops[k] = default_ops[k];
				}
			}

			/*
			 * Used for internal calculations.
			 */
			var diff_checked_children = 0;
			var currently_checked_children = item[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN];

			/*
			 * If the item is a leaf, mark it as unchecked.
			 * If the item is a note, set it's counter of checked leafs to the number of leafs it contains.
			 */
			this.collection
				.chain()
				.find({
					[this.ID_PROPERTY]: item[this.ID_PROPERTY]
				})
				.update((obj) => {
					if (item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] === 0) {
						this.stats.checked_leafs--;

						obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_LEAF_UNCHECKED;
					} else {
						this.stats.checked_nodes--;
						this.stats.unchecked_nodes++;

						obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_UNCHECKED;
						obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] = 0;
						diff_checked_children = currently_checked_children - obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN];
					}
				});

			/*
			 * If the passed item is a leaf, search all parent nodes,
			 * substract 1 from their checked_children counter and set their
			 * checked state based on the checked_children counter.
			 */
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
						if (obj[this.CHECKED_PROPERTY] === angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED) {
							this.stats.checked_nodes--;
						}
						if (obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] - 1 === 0) {
							this.stats.unchecked_nodes++;
						}

						obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN]--; // We can't underflow this as we're unchecking a checked item
						if (obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] === 0) {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_UNCHECKED;
						} else {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED;
						}
					});
			/*
			 * If it's a node:
			 *     1. Search all children leafs and nodes and mark them as unchecked.
			 *     2. Search all parent nodes,
			 *        substract N from their checked_children counter and
			 *        set their checked state based on the checked_children counter.
			 *        N is the difference between the checked leafs of the nodes we're checking
			 *        before and after the operation.
			 */
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
							this.stats.checked_leafs--;

							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_LEAF_UNCHECKED;
						} else {
							this.stats.unchecked_nodes++;
							if (obj[this.CHECKED_PROPERTY] === angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED) {
								this.stats.checked_nodes--;
							}

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
						if (obj[this.CHECKED_PROPERTY] === angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED) {
							this.stats.checked_nodes--;
						}
						if (obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] - diff_checked_children === 0) {
							this.stats.unchecked_nodes++;
						}

						obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] -= diff_checked_children;
						if (obj[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] === 0) {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_UNCHECKED;
						} else {
							obj[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED;
						}
					});
			}

			if (this.DEBUG === true) console.timeEnd("uncheck_node");

			if (this.on_data_change_fn !== null && ops.call_on_data_change_fn) this.on_data_change_fn();
		};

		/*
		██    ██ ███    ██  ██████ ██   ██ ███████  ██████ ██   ██     ███████ ██ ██████  ███████ ████████
		██    ██ ████   ██ ██      ██   ██ ██      ██      ██  ██      ██      ██ ██   ██ ██         ██
		██    ██ ██ ██  ██ ██      ███████ █████   ██      █████       █████   ██ ██████  ███████    ██
		██    ██ ██  ██ ██ ██      ██   ██ ██      ██      ██  ██      ██      ██ ██   ██      ██    ██
		 ██████  ██   ████  ██████ ██   ██ ███████  ██████ ██   ██     ██      ██ ██   ██ ███████    ██
		*/
		Engine.prototype.uncheck_first = function (n) {
			/*
			 * Find the oldest n leaf that have been marked as checked and uncheck them.
			 * This function is used to control the maximum amount of checked leafs.
			 */
			if (this.DEBUG === true) console.time("uncheck_first");

			n = n || 1;

			var leaf = this.collection
				.chain()
				.find({
					'$and': [
						{
							[this.CHECKED_PROPERTY]: angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED
						},
						{
							[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS]: 0
						}
					]

				})
				/*
				 * Logic behind this sorting:
				 * First, get all the documents that are checked. Then sort them
				 * with the following rules:
				 *
				 * 1. First, all documents with 'meta.updated' key, keeping in mind:
				 *     1.1. The documents with a major 'updated' value (newest) go last.
				 *
				 * 2. Then, all other documents, but...
				 *     2.1. First the documents that have an older 'created' value.
				 *     2.2. If two documents have the same 'created' value, then the one
				 *          with the lowest order is sorted before.
				 */
				.sort(function (a, b) {
					if (!("updated" in a["meta"]) && !("updated" in b["meta"])) {
						var diff = a["meta"]["created"] - b["meta"]["created"];
						if (diff === 0) {
							return a[angularMultiSelectConstants.INTERNAL_KEY_ORDER] - b[angularMultiSelectConstants.INTERNAL_KEY_ORDER];
						} else {
							return diff;
						}
					}
					if (!("updated" in b["meta"])) {
						return -1;
					}
					if (!("updated" in a["meta"])) {
						return 1;
					}
					return a["meta"]["updated"] - b["meta"]["updated"];
				})
				.limit(n)
				.data();

			for (var i = 0; i < n; i++) {
				this.uncheck_node(leaf[i], {
					call_on_data_change_fn: false
				});
			}

			if (this.DEBUG === true) console.timeEnd("uncheck_first");
		}

		return Engine;
	}
]);
