var angular_multi_select = angular.module('angular-multi-select', []);

angular_multi_select.factory("stylesHelper", function() {
	return {
		get_open_class: function (item) {
			return item.open === true ? "open" : "closed";
		},

		get_checked_class: function (item) {
			if (typeof(item.checked) === "boolean" ) {
				return item.checked ? "checked" : "unchecked";
			} else {
				switch (item.checked) {
					case -1:
					return "unchecked";
					case 0:
					return "mixed";
					case 1:
					return "checked";
					default:
					return "unknown";
				}
			}
		}
	};
});

angular_multi_select.factory("dataConverter", function() {
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

					if (item.constructor.toString().indexOf("Array") != -1) return (correct = false);

					// Check for the 2 main fields (text and value)
					// If value is not present, set it to text's value
					if (!item.hasOwnProperty('text')) return (correct = false);
					if (!item.hasOwnProperty('value')) item.value = item.text;

					// Check for id field.
					// If not present, assign one
					if (!item.hasOwnProperty('id') || ids.indexOf(item.id) !== -1) item.id = gen_id();
					ids.push(item.id);

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

			console.time("to_internal");

			var order = 1;
			function process_items (items, level) {
				for (var i = 0; i < items.length; i++) {
					item = items[i];
					var final_item = {};

					//Assumed to be ok
					final_item.text = item.text;
					final_item.value = item.value;
					final_item.id = item.id;
					if (item.hasOwnProperty('checked') && typeof(item.checked) === "boolean") {
						final_item.checked = item.checked;
					} else {
						final_item.checked = null;
					}

					//Assigned in order
					final_item.order = order++;
					final_item.level = level;

					//Required to be present for further calculation
					final_item.children = 0;
					final_item.parents_id = [];

					//TODO: calculate state
					final_item.open = true;            // should be set per request
					final_item.tree_visibility = true; // should be set per request

					final_data.push(final_item);

					if (item.hasOwnProperty('children')) process_items(item.children, level + 1);
				}
			}

			process_items(data, 0);

			// create parents_id values
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

				// we are guaranteed to have a checked property for leafs
				// if the current item is a leaf, it won't have children, hence skip
				if (typeof(item.checked) === "boolean") continue;

				var counter = 0;
				var counter_null = 0;

				for (j = i + 1; j < final_data.length; j++) {
					var child = final_data[j];

					if (item.level >= child.level) break;

					if (child.checked === true) {
						counter++;
					} else if (child.checked === false) {
						counter--;
					} else if (child.checked === null){
						counter_null++;
					}

					item.children++;
				}

				if (item.children === Math.abs(counter) + counter_null) {
					item.checked = counter > 0 ? 1 : -1; //all unchecked or all checked
				} else {
					item.checked = 0; //mixed
				}
			}

			console.timeEnd("to_internal");

			//for (i = 0; i < final_data.length; i++) {
			//	console.log("Final data", JSON.stringify(final_data[i]) );
			//}

			return final_data;
		}
	};
});
