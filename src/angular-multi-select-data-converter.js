var angular_multi_select_data_converter = angular.module('angular-multi-select-data-converter', []);

angular_multi_select_data_converter.factory('angularMultiSelectDataConverter', function () {
	return {
		check_prerequisites: function (data) {
			if (!Array.isArray(data)) return false;

			var correct = true;

			var ids = [];
			var last_id = 1;
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

					if (item.constructor.toString().indexOf('Array') !== -1) return (correct = false);

					// Check for the 2 main fields (text and value)
					// If value is not present, set it to text's value
					if (!item.hasOwnProperty('text')) return (correct = false);
					if (!item.hasOwnProperty('value')) item.value = item.text;

					// Check for id field.
					// If not present, assign one
					if (!item.hasOwnProperty('id') || ids.indexOf(item.id) !== -1) item.id = gen_id();
					ids.push(item.id);

					// Check for open field.
					// If open field doesn't exist or is not "true", set to false
					if (!item.hasOwnProperty('open') || item.open !== true) item.open = false;

					// Check for children field.
					// If not an array or empty array, remove it.
					if (item.hasOwnProperty('children') && !Array.isArray(item.children)) delete item.children;
					if (item.hasOwnProperty('children') && item.children.length === 0) delete item.children;

					// If children field is present, remove "checked" field.
					// If checked field is present, but value is not boolean or 1,
					// set to false.
					if (item.hasOwnProperty('children')) delete item.checked;
					if (item.hasOwnProperty('checked') && (item.checked !== true && item.checked !== 1)) item.checked = false;
					if (!item.hasOwnProperty('children') && !item.hasOwnProperty('checked')) item.checked = false;

					if (item.hasOwnProperty('children')) process_items(item.children);
				}
			}

			process_items(data);

			// Return data array or false if something is wrong.
			return correct ? data : correct;
		},

		to_internal: function (data) {
			var i, j, item;
			var final_data = [];

			var order = 1;
			function process_items (items, level) {
				for (var i = 0; i < items.length; i++) {
					item = items[i];
					var final_item = {};

					//Assumed to be ok
					final_item.text = item.text;
					final_item.value = item.value;
					final_item.id = item.id;
					final_item.open = item.open;
					if (item.hasOwnProperty('checked') && typeof(item.checked) === 'boolean') {
						final_item.checked = item.checked;
					} else {
						final_item.checked = null;
					}

					//Assigned in order
					final_item.order = order++;
					final_item.level = level;

					//Required to be present for further calculation
					final_item.children_leafs = 0;
					final_item.children_nodes = 0;
					final_item.parents_id = [];
					final_item.checked_children = 0;

					//TODO: calculate visibility
					final_item.tree_visibility = true; // should be set per request

					final_data.push(final_item);

					if (item.hasOwnProperty('children')) process_items(item.children, level + 1);
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
					parents.push(possible_parent.id);

					if (possible_parent.level === 0) break;
				}

				item.parents_id = parents.reverse();
			}

			// calculate both children and checked properties
			for (i = 0; i < final_data.length; i++) {
				item = final_data[i];

				// If this is a root element, it should be visible
				if (item.level === 0) item.tree_visibility = true;

				// we are guaranteed to have a checked property for leafs
				// if the current item is a leaf, it won't have children, hence skip
				if (typeof(item.checked) === 'boolean') continue;

				var counter_checked = 0;
				var counter_unchecked = 0;
				var counter_null = 0;

				for (j = i + 1; j < final_data.length; j++) {
					var child = final_data[j];

					// Decide if children should be visible in the tree
					if (item.level === child.level - 1) {
						child.tree_visibility = item.open;
					}

					if (item.level >= child.level) break;

					// Logic that decides the checked state of node items
					if (child.checked === true) {
						counter_checked++;
						item.children_leafs++;
					} else if (child.checked === false) {
						counter_unchecked++;
						item.children_leafs++;
					} else if (child.checked === null){
						counter_null++;
						item.children_nodes++;
					}

				}

				// If the number of checked or unchecked elements equals to
				// the number of children, then the current item should be
				// either 1 or -1 (checked or unchecked). Else, it should be
				// marked as 0 (mixed state).
				if (item.children_leafs === counter_checked) {
					item.checked = 1; //all checked
				} else if (item.children_leafs === counter_unchecked) {
					item.checked = -1; //all unchecked
				} else {
					item.checked = 0; //mixed
				}

				item.checked_children = counter_checked;
			}

			//for (i = 0; i < final_data.length; i++) {
			//	console.log("Final data", JSON.stringify(final_data[i]) );
			//}

			return final_data;
		}
	};
});
