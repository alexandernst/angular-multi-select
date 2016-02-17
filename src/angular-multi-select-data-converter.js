var angular_multi_select_data_converter = angular.module('angular-multi-select-data-converter', ['angular-multi-select-constants']);

angular_multi_select_data_converter.factory('angularMultiSelectDataConverter', [
	'angularMultiSelectConstants',
	function (angularMultiSelectConstants) {

		var DataConverter = function (ops) {
			ops = ops || {};
			this.DEBUG             = ops.DEBUG             || false;
			this.ID_PROPERTY       = ops.ID_PROPERTY       || angularMultiSelectConstants.ID_PROPERTY;
			this.OPEN_PROPERTY     = ops.OPEN_PROPERTY     || angularMultiSelectConstants.OPEN_PROPERTY;
			this.CHECKED_PROPERTY  = ops.CHECKED_PROPERTY  || angularMultiSelectConstants.CHECKED_PROPERTY;
			this.CHILDREN_PROPERTY = ops.CHILDREN_PROPERTY || angularMultiSelectConstants.CHILDREN_PROPERTY;
		};

		DataConverter.prototype.check_prerequisites = function (data) {
			if (this.DEBUG === true) console.time('check_prerequisites');

			if (!Array.isArray(data)) return false;

			var ids = [];
			var ctx = this;
			var last_id = 1;
			var correct = true;

			function gen_id () {
				while (ids.indexOf(last_id) !== -1) {
					last_id++;
				}

				return last_id;
			}

			function process_items (items) {
				if (correct === false) return;

				for (var i = 0; i < items.length; i++) {
					var item = items[i];

					if (item.constructor.toString().indexOf('Array') !== -1) {
						return (correct = false);
					}

					// Check for id field.
					// If not present, assign one
					if (
						!item.hasOwnProperty(ctx.ID_PROPERTY) ||
						ids.indexOf(item[ctx.ID_PROPERTY]) !== -1
					) {
						item[ctx.ID_PROPERTY] = gen_id();
					}
					ids.push(item[ctx.ID_PROPERTY]);

					// Check for open field.
					// If open field doesn't exist or is not "true", set to false
					if (
						!item.hasOwnProperty(ctx.OPEN_PROPERTY) ||
						item[ctx.OPEN_PROPERTY] !== angularMultiSelectConstants.INPUT_DATA_OPEN
					) {
						item[ctx.OPEN_PROPERTY] = angularMultiSelectConstants.INPUT_DATA_CLOSED;
					}

					// Check for children field.
					// If not an array or empty array, remove it.
					if (
						item.hasOwnProperty(ctx.CHILDREN_PROPERTY) &&
						(
							!Array.isArray(item[ctx.CHILDREN_PROPERTY]) ||
							item[ctx.CHILDREN_PROPERTY].length === 0
						)
					) {
						delete item[ctx.CHILDREN_PROPERTY];
					}

					// If children field is present, remove "checked" field.
					// If checked field is present, but value is not boolean or 1,
					// set to false.
					if (item.hasOwnProperty(ctx.CHILDREN_PROPERTY)) {
						delete item[ctx.CHECKED_PROPERTY];
					}

					if (
						item.hasOwnProperty(ctx.CHECKED_PROPERTY) &&
						item[ctx.CHECKED_PROPERTY] !== angularMultiSelectConstants.INPUT_DATA_CHECKED
					) {
						item[ctx.CHECKED_PROPERTY] = angularMultiSelectConstants.INPUT_DATA_UNCHECKED;
					}

					if (
						!item.hasOwnProperty(ctx.CHILDREN_PROPERTY) &&
						!item.hasOwnProperty(ctx.CHECKED_PROPERTY)
					) {
						item[ctx.CHECKED_PROPERTY] = angularMultiSelectConstants.INPUT_DATA_UNCHECKED;
					}

					if (item.hasOwnProperty(ctx.CHILDREN_PROPERTY)) {
						process_items(item[ctx.CHILDREN_PROPERTY]);
					}
				}
			}

			process_items(data);

			if (this.DEBUG === true) console.timeEnd('check_prerequisites');

			// Return data array or false if something is wrong.
			return correct ? data : correct;
		};

		DataConverter.prototype.to_internal = function (data) {

			if (this.DEBUG === true) console.time('to_internal');

			var order = 1;
			var ctx = this;
			var i, j, item;
			var final_data = [];

			function process_items (items, level) {
				for (var i = 0; i < items.length; i++) {
					item = items[i];

					var final_item = angular.copy(item);
					delete final_item[ctx.CHECKED_PROPERTY];
					delete final_item[ctx.CHILDREN_PROPERTY];

					if (
						item.hasOwnProperty(ctx.CHECKED_PROPERTY) &&
						typeof(item[ctx.CHECKED_PROPERTY]) === 'boolean'
					) {
						final_item[ctx.CHECKED_PROPERTY] = item[ctx.CHECKED_PROPERTY];
					} else {
						final_item[ctx.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECK_UNDEFINED;
					}

					//Assigned in order
					final_item.level = level;
					final_item.order = order++;

					//Required to be present for further calculation
					final_item.parents_id = [];
					final_item.children_leafs = 0;
					final_item.children_nodes = 0;
					final_item.checked_children = 0;
					final_item.tree_visibility = angularMultiSelectConstants.INTERNAL_DATA_VISIBILITY_UNDEFINED;

					final_data.push(final_item);

					if (item.hasOwnProperty(ctx.CHILDREN_PROPERTY)) {
						process_items(item[ctx.CHILDREN_PROPERTY], level + 1);
					}
				}
			}

			process_items(data, 0);

			// Create parents_id values
			for (i = 0; i < final_data.length; i++) {
				item = final_data[i];

				if (item.level === 0) continue;

				var parents = [];
				var last_level = item.level;
				for (j = i; j > 0; j--) {
					var possible_parent = final_data[j];

					if (possible_parent.level >= last_level) continue;

					last_level = possible_parent.level;
					parents.push(possible_parent[ctx.ID_PROPERTY]);

					if (possible_parent.level === 0) break;
				}

				item.parents_id = parents.reverse();
			}

			// calculate visibility, children and checked properties
			for (i = 0; i < final_data.length; i++) {
				item = final_data[i];

				// If this is a root element, it should be visible
				if (item.level === 0) item.tree_visibility = angularMultiSelectConstants.INTERNAL_DATA_VISIBLE;

				// we are guaranteed to have a checked property for leafs
				// if the current item is a leaf, it won't have children, hence skip
				if (typeof(item[ctx.CHECKED_PROPERTY]) === 'boolean') continue;

				var counter_checked = 0;
				var counter_unchecked = 0;
				var counter_null = 0;

				for (j = i + 1; j < final_data.length; j++) {
					var child = final_data[j];

					// Decide if children should be visible in the tree
					if (item.level === child.level - 1) {
						child.tree_visibility = item[ctx.OPEN_PROPERTY];
					}

					if (item.level >= child.level) break;

					// Logic that decides the checked state of node items
					if (child[ctx.CHECKED_PROPERTY] === angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED) {
						counter_checked++;
						item.children_leafs++;
					} else if (child[ctx.CHECKED_PROPERTY] === angularMultiSelectConstants.INTERNAL_DATA_LEAF_UNCHECKED) {
						counter_unchecked++;
						item.children_leafs++;
					} else if (child[ctx.CHECKED_PROPERTY] === angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECK_UNDEFINED){
						counter_null++;
						item.children_nodes++;
					}

				}

				// If the number of checked or unchecked elements equals to
				// the number of children, then the current item should be
				// either 1 or -1 (checked or unchecked). Else, it should be
				// marked as 0 (mixed state).
				if (item.children_leafs === counter_checked) {
					item[ctx.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED;
				} else if (item.children_leafs === counter_unchecked) {
					item[ctx.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_UNCHECKED;
				} else {
					item[ctx.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED;
				}

				item.checked_children = counter_checked;
			}

			if (this.DEBUG === true) console.timeEnd('to_internal');

			return final_data;
		};

		return DataConverter;
	}
]);
