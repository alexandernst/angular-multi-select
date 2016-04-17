'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var angular_multi_select_data_converter = angular.module('angular-multi-select-data-converter', ['angular-multi-select-utils', 'angular-multi-select-constants']);

angular_multi_select_data_converter.factory('angularMultiSelectDataConverter', ['angularMultiSelectUtils', 'angularMultiSelectConstants', function (angularMultiSelectUtils, angularMultiSelectConstants) {
	'use strict';
	/*
  ██████  ██████  ███    ██ ███████ ████████ ██████  ██    ██  ██████ ████████  ██████  ██████
 ██      ██    ██ ████   ██ ██         ██    ██   ██ ██    ██ ██         ██    ██    ██ ██   ██
 ██      ██    ██ ██ ██  ██ ███████    ██    ██████  ██    ██ ██         ██    ██    ██ ██████
 ██      ██    ██ ██  ██ ██      ██    ██    ██   ██ ██    ██ ██         ██    ██    ██ ██   ██
  ██████  ██████  ██   ████ ███████    ██    ██   ██  ██████   ██████    ██     ██████  ██   ██
 */

	var DataConverter = function DataConverter(ops) {
		this.amsu = new angularMultiSelectUtils();
		_extends(this, this.amsu.sanitize_ops(ops));
	};

	/*
  ██████ ██   ██ ███████  ██████ ██   ██     ██████  ██████  ███████ ██████  ███████  ██████  ██    ██ ██ ███████ ██ ████████ ███████ ███████
 ██      ██   ██ ██      ██      ██  ██      ██   ██ ██   ██ ██      ██   ██ ██      ██    ██ ██    ██ ██ ██      ██    ██    ██      ██
 ██      ███████ █████   ██      █████       ██████  ██████  █████   ██████  █████   ██    ██ ██    ██ ██ ███████ ██    ██    █████   ███████
 ██      ██   ██ ██      ██      ██  ██      ██      ██   ██ ██      ██   ██ ██      ██ ▄▄ ██ ██    ██ ██      ██ ██    ██    ██           ██
  ██████ ██   ██ ███████  ██████ ██   ██     ██      ██   ██ ███████ ██   ██ ███████  ██████   ██████  ██ ███████ ██    ██    ███████ ███████
                                                                                         ▀▀
 */
	DataConverter.prototype.check_prerequisites = function (data) {
		/*
   * Takes an array of data and walks through each element object
   * and checks if each object has:
   *
   * - a valid ID. If it doesn't, it generates one.
   * - open property. If it's not 'true' (strictly compared), it
   *   creates one and set's it to false.
   * - children property. If it's not an array or if it's empty,
   *   it deletes the property, else it will delete the checked
   *   property. Note that nodes can't have a checked property at
   *   this step of the process.
   * - checked property. If it's not 'true' (strictly compared),
   *   creates one and set's it to false.
   *
   * Note that you can completely skip this step (thus saving some
   * CPU cycles) if you are sure that all objects in your input data:
   *
   * - have valid and unique ID.
   * - have open property, which is boolean and false for leafs
   * - children properties are non-empty arrays
   * - only leafs have a checked property and it's a boolean
   */
		if (this.DEBUG === true) console.time(this.NAME + ' -> check_prerequisites');

		if (!Array.isArray(data)) return false;

		var ids = new Set();
		var ctx = this;
		var correct = true;
		var id_seed = Date.now();

		function process_items(items) {
			if (correct === false) return;

			for (var i = 0; i < items.length; i++) {
				var item = items[i];

				if (item.constructor.toString().indexOf('Array') !== -1) {
					return correct = false;
				}

				// Check for id field.
				// If not present, assign one
				if (!(ctx.ID_PROPERTY in item) || ids.has(item[ctx.ID_PROPERTY])) {
					while (ids.has(id_seed)) {
						id_seed++;
					}
					item[ctx.ID_PROPERTY] = id_seed++;
				}
				ids.add(item[ctx.ID_PROPERTY]);

				// Check for open field.
				// If open field doesn't exist or is not "true", set to false
				if (!(ctx.OPEN_PROPERTY in item) || item[ctx.OPEN_PROPERTY] !== angularMultiSelectConstants.INPUT_DATA_OPEN) {
					item[ctx.OPEN_PROPERTY] = angularMultiSelectConstants.INPUT_DATA_CLOSED;
				}

				// Check for children field.
				// If not an array or empty array, remove it.
				if (ctx.CHILDREN_PROPERTY in item && (!Array.isArray(item[ctx.CHILDREN_PROPERTY]) || item[ctx.CHILDREN_PROPERTY].length === 0)) {
					delete item[ctx.CHILDREN_PROPERTY];
				}

				// If children field is present, remove "checked" field.
				// If checked field is present, but value is not boolean or 1,
				// set to false.
				if (ctx.CHILDREN_PROPERTY in item) {
					delete item[ctx.CHECKED_PROPERTY];
				}

				if (ctx.CHECKED_PROPERTY in item && item[ctx.CHECKED_PROPERTY] !== angularMultiSelectConstants.INPUT_DATA_CHECKED) {
					item[ctx.CHECKED_PROPERTY] = angularMultiSelectConstants.INPUT_DATA_UNCHECKED;
				}

				if (!(ctx.CHILDREN_PROPERTY in item) && !(ctx.CHECKED_PROPERTY in item)) {
					item[ctx.CHECKED_PROPERTY] = angularMultiSelectConstants.INPUT_DATA_UNCHECKED;
				}

				if (ctx.CHILDREN_PROPERTY in item) {
					process_items(item[ctx.CHILDREN_PROPERTY]);
				}
			}
		}

		process_items(data);

		if (this.DEBUG === true) console.timeEnd(this.NAME + ' -> check_prerequisites');

		// Return data array or false if something is wrong.
		return correct ? data : correct;
	};

	/*
 ████████  ██████      ██ ███    ██ ████████ ███████ ██████  ███    ██  █████  ██
    ██    ██    ██     ██ ████   ██    ██    ██      ██   ██ ████   ██ ██   ██ ██
    ██    ██    ██     ██ ██ ██  ██    ██    █████   ██████  ██ ██  ██ ███████ ██
    ██    ██    ██     ██ ██  ██ ██    ██    ██      ██   ██ ██  ██ ██ ██   ██ ██
    ██     ██████      ██ ██   ████    ██    ███████ ██   ██ ██   ████ ██   ██ ███████
 */
	DataConverter.prototype.to_internal = function (data) {
		/*
   * Takes an array of (nested) objects and flattens it, while
   * also adding some internal properties required for faster
   * un/check and state actions.
   *
   * Note that you can skip this step (thus saving some CPU cycles)
   * only if you're completely sure how this method works, what and
   * how it does what it does.
   */
		if (this.DEBUG === true) console.time(this.NAME + ' -> to_internal');

		var order = 1;
		var ctx = this;
		var i, j, item;
		var final_data = [];

		function process_items(items, level) {
			for (var i = 0; i < items.length; i++) {
				item = items[i];

				var final_item = _extends({}, item);
				delete final_item[ctx.CHECKED_PROPERTY];
				delete final_item[ctx.CHILDREN_PROPERTY];

				if (ctx.CHECKED_PROPERTY in item && typeof item[ctx.CHECKED_PROPERTY] === 'boolean') {
					final_item[ctx.CHECKED_PROPERTY] = item[ctx.CHECKED_PROPERTY];
				} else {
					final_item[ctx.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECK_UNDEFINED;
				}

				//Assigned in order
				final_item[angularMultiSelectConstants.INTERNAL_KEY_LEVEL] = level;
				final_item[angularMultiSelectConstants.INTERNAL_KEY_ORDER] = order++;

				//Required to be present for further calculation
				final_item[angularMultiSelectConstants.INTERNAL_KEY_PARENTS_ID] = [];
				final_item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] = 0;
				final_item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_NODES] = 0;
				final_item[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] = 0;
				final_item[angularMultiSelectConstants.INTERNAL_KEY_TREE_VISIBILITY] = angularMultiSelectConstants.INTERNAL_DATA_VISIBILITY_UNDEFINED;
				final_item[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_MODIFICATION] = 0;

				final_data.push(final_item);

				if (ctx.CHILDREN_PROPERTY in item) {
					process_items(item[ctx.CHILDREN_PROPERTY], level + 1);
				}
			}
		}

		process_items(data, 0);

		// calculate parents_id, visibility, children and checked properties
		var parents = [];
		var time_seed = Date.now();
		for (i = 0; i < final_data.length; i++) {
			item = final_data[i];

			item[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_MODIFICATION] = time_seed++;

			// Assign all the parent node IDs
			parents[item[angularMultiSelectConstants.INTERNAL_KEY_LEVEL]] = item[ctx.ID_PROPERTY];
			if (item[angularMultiSelectConstants.INTERNAL_KEY_LEVEL] !== 0) {
				item[angularMultiSelectConstants.INTERNAL_KEY_PARENTS_ID] = parents.slice(0, item[angularMultiSelectConstants.INTERNAL_KEY_LEVEL]);
			}

			// If this is a root element, it should be visible
			if (item[angularMultiSelectConstants.INTERNAL_KEY_LEVEL] === 0) item[angularMultiSelectConstants.INTERNAL_KEY_TREE_VISIBILITY] = angularMultiSelectConstants.INTERNAL_DATA_VISIBLE;

			// we are guaranteed to have a checked property for leafs
			// if the current item is a leaf, it won't have children, hence skip
			if (typeof item[this.CHECKED_PROPERTY] === 'boolean') continue;

			var counter_checked = 0;
			var counter_unchecked = 0;
			var counter_null = 0;

			for (j = i + 1; j < final_data.length; j++) {
				var child = final_data[j];

				// Decide if children should be visible in the tree
				if (item[angularMultiSelectConstants.INTERNAL_KEY_LEVEL] === child[angularMultiSelectConstants.INTERNAL_KEY_LEVEL] - 1) {
					child[angularMultiSelectConstants.INTERNAL_KEY_TREE_VISIBILITY] = item[this.OPEN_PROPERTY];
				}

				if (item[angularMultiSelectConstants.INTERNAL_KEY_LEVEL] >= child[angularMultiSelectConstants.INTERNAL_KEY_LEVEL]) break;

				// Logic that decides the checked state of node items
				if (child[this.CHECKED_PROPERTY] === angularMultiSelectConstants.INTERNAL_DATA_LEAF_CHECKED) {
					counter_checked++;
					item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS]++;
				} else if (child[this.CHECKED_PROPERTY] === angularMultiSelectConstants.INTERNAL_DATA_LEAF_UNCHECKED) {
					counter_unchecked++;
					item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS]++;
				} else if (child[this.CHECKED_PROPERTY] === angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECK_UNDEFINED) {
					counter_null++;
					item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_NODES]++;
				}
			}

			// If the number of checked or unchecked elements equals to
			// the number of children, then the current item should be
			// either 1 or -1 (checked or unchecked). Else, it should be
			// marked as 0 (mixed state).
			if (item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] === counter_checked) {
				item[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_CHECKED;
			} else if (item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] === counter_unchecked) {
				item[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_UNCHECKED;
			} else {
				item[this.CHECKED_PROPERTY] = angularMultiSelectConstants.INTERNAL_DATA_NODE_MIXED;
			}

			item[angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN] = counter_checked;
		}

		if (this.DEBUG === true) console.timeEnd(this.NAME + ' -> to_internal');

		return final_data;
	};

	/*
 ████████  ██████      ███████ ██   ██ ████████ ███████ ██████  ███    ██  █████  ██
    ██    ██    ██     ██       ██ ██     ██    ██      ██   ██ ████   ██ ██   ██ ██
    ██    ██    ██     █████     ███      ██    █████   ██████  ██ ██  ██ ███████ ██
    ██    ██    ██     ██       ██ ██     ██    ██      ██   ██ ██  ██ ██ ██   ██ ██
    ██     ██████      ███████ ██   ██    ██    ███████ ██   ██ ██   ████ ██   ██ ███████
 */
	DataConverter.prototype.to_external = function (data) {
		/*
   * This is the opposite of what 'to_internal' is supposed to do.
   * This will take an array of objects, usually the output of
   * get_*_tree and delete all the metadata of the engine, leaving
   * only the data that the user cares about.
   */
		if (!Array.isArray(data) || data.length === 0) {
			return [];
		}

		if (this.DEBUG === true) console.time(this.NAME + ' -> to_external');

		data = JSON.parse(JSON.stringify(data));

		for (var i = 0; i < data.length; i++) {
			//AMS engine metadata
			delete data[i][angularMultiSelectConstants.INTERNAL_KEY_LEVEL];
			delete data[i][angularMultiSelectConstants.INTERNAL_KEY_ORDER];
			delete data[i][angularMultiSelectConstants.INTERNAL_KEY_PARENTS_ID];
			delete data[i][angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS];
			delete data[i][angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_NODES];
			delete data[i][angularMultiSelectConstants.INTERNAL_KEY_CHECKED_CHILDREN];
			delete data[i][angularMultiSelectConstants.INTERNAL_KEY_TREE_VISIBILITY];
			delete data[i][angularMultiSelectConstants.INTERNAL_KEY_CHECKED_MODIFICATION];

			//TODO: Remove after https://github.com/techfort/LokiJS/issues/346
			delete data[i].meta;
			delete data[i].$loki;
		}

		if (this.DEBUG === true) console.timeEnd(this.NAME + ' -> to_external');

		return data;
	};

	/*
 ████████  ██████      ███████  ██████  ██████  ███    ███  █████  ████████
    ██    ██    ██     ██      ██    ██ ██   ██ ████  ████ ██   ██    ██
    ██    ██    ██     █████   ██    ██ ██████  ██ ████ ██ ███████    ██
    ██    ██    ██     ██      ██    ██ ██   ██ ██  ██  ██ ██   ██    ██
    ██     ██████      ██       ██████  ██   ██ ██      ██ ██   ██    ██
 */
	DataConverter.prototype.to_format = function (data, format, keys) {
		/*
   * Converts the input data to the desired output.
   */
		var res;

		switch (format) {
			case angularMultiSelectConstants.OUTPUT_DATA_TYPE_OBJECTS:
				res = this.to_array_of_objects(data, keys);
				break;
			case angularMultiSelectConstants.OUTPUT_DATA_TYPE_ARRAYS:
				res = this.to_array_of_arrays(data, keys);
				break;
			case angularMultiSelectConstants.OUTPUT_DATA_TYPE_OBJECT:
				res = this.to_object(data, keys);
				break;
			case angularMultiSelectConstants.OUTPUT_DATA_TYPE_ARRAY:
				res = this.to_array(data, keys);
				break;
			case angularMultiSelectConstants.OUTPUT_DATA_TYPE_VALUES:
				res = this.to_values(data, keys);
				break;
			case angularMultiSelectConstants.OUTPUT_DATA_TYPE_VALUE:
				res = this.to_value(data, keys);
				break;
		}

		return res;
	};

	/*
 ████████  ██████       █████  ██████  ██████   █████  ██    ██      ██████  ███████      ██████  ██████       ██ ███████  ██████ ████████ ███████
    ██    ██    ██     ██   ██ ██   ██ ██   ██ ██   ██  ██  ██      ██    ██ ██          ██    ██ ██   ██      ██ ██      ██         ██    ██
    ██    ██    ██     ███████ ██████  ██████  ███████   ████       ██    ██ █████       ██    ██ ██████       ██ █████   ██         ██    ███████
    ██    ██    ██     ██   ██ ██   ██ ██   ██ ██   ██    ██        ██    ██ ██          ██    ██ ██   ██ ██   ██ ██      ██         ██         ██
    ██     ██████      ██   ██ ██   ██ ██   ██ ██   ██    ██         ██████  ██           ██████  ██████   █████  ███████  ██████    ██    ███████
 */
	DataConverter.prototype.to_array_of_objects = function (data, keys) {
		/*
   * Takes an array of objects (the result of get_checked_tree usually)
   * and returns it as is if the "keys" argument hasn't been passed or
   * an array of objects, each object containing only the keys in the
   * "key" argument.
   */
		if (!Array.isArray(data) || data.length === 0) {
			return [];
		}

		if (this.DEBUG === true) console.time(this.NAME + ' -> to_array_of_objects');

		if (keys === undefined) {
			keys = [];
		}

		var new_data = [];
		for (var i = 0; i < data.length; i++) {
			var new_obj = {};
			var obj = data[i];

			if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || Array.isArray(obj)) {
				continue;
			}

			if (keys.length === 0) {
				new_data.push(obj);
			} else {
				for (var j = 0; j < keys.length; j++) {
					if (!(keys[j] in obj)) {
						continue;
					}

					new_obj[keys[j]] = obj[keys[j]];
				}
				new_data.push(new_obj);
			}
		}

		if (this.DEBUG === true) console.timeEnd(this.NAME + ' -> to_array_of_objects');

		return new_data;
	};

	/*
 ████████  ██████       █████  ██████  ██████   █████  ██    ██      ██████  ███████      █████  ██████  ██████   █████  ██    ██ ███████
    ██    ██    ██     ██   ██ ██   ██ ██   ██ ██   ██  ██  ██      ██    ██ ██          ██   ██ ██   ██ ██   ██ ██   ██  ██  ██  ██
    ██    ██    ██     ███████ ██████  ██████  ███████   ████       ██    ██ █████       ███████ ██████  ██████  ███████   ████   ███████
    ██    ██    ██     ██   ██ ██   ██ ██   ██ ██   ██    ██        ██    ██ ██          ██   ██ ██   ██ ██   ██ ██   ██    ██         ██
    ██     ██████      ██   ██ ██   ██ ██   ██ ██   ██    ██         ██████  ██          ██   ██ ██   ██ ██   ██ ██   ██    ██    ███████
 */
	DataConverter.prototype.to_array_of_arrays = function (data, keys) {
		/*
   * Takes an array of objects (the result of get_checked_tree usually)
   * and returns an array of arrays. Each array inside the returned
   * array contains the values of the keys that result of the
   * intersection of the object's keys and the argument "keys". The
   * array will contain the values in the order they have in the "key"
   * argument.
   */
		if (!Array.isArray(data) || data.length === 0) {
			return [];
		}

		if (this.DEBUG === true) console.time(this.NAME + ' -> to_array_of_arrays');

		if (keys === undefined) {
			keys = [];
		}

		function vals(obj) {
			return Object.keys(obj).map(function (key) {
				return obj[key];
			});
		}

		var new_data = [];
		for (var i = 0; i < data.length; i++) {
			var new_arr = [];
			var obj = data[i];

			if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || Array.isArray(obj)) {
				continue;
			}

			if (keys.length === 0) {
				new_data.push(vals(obj));
			} else {
				for (var j = 0; j < keys.length; j++) {
					if (!(keys[j] in obj)) {
						continue;
					}

					new_arr.push(obj[keys[j]]);
				}
				new_data.push(new_arr);
			}
		}

		if (this.DEBUG === true) console.timeEnd(this.NAME + ' -> to_array_of_arrays');

		return new_data;
	};

	/*
 ████████  ██████       █████  ██████  ██████   █████  ██    ██
    ██    ██    ██     ██   ██ ██   ██ ██   ██ ██   ██  ██  ██
    ██    ██    ██     ███████ ██████  ██████  ███████   ████
    ██    ██    ██     ██   ██ ██   ██ ██   ██ ██   ██    ██
    ██     ██████      ██   ██ ██   ██ ██   ██ ██   ██    ██
 */
	DataConverter.prototype.to_array = function (data, keys) {
		/*
   * Takes an array of objects (the result of get_checked_tree usually)
   * and returns a single array filled with the values of all the
   * objects's keys that are contained in the "keys" argument.
   * This usually doesn't make much sense when more than 1 item in the
   * tree is selected, but you're free to use it however you like.
   */
		if (!Array.isArray(data) || data.length === 0) {
			return [];
		}

		if (this.DEBUG === true) console.time(this.NAME + ' -> to_array');

		if (keys === undefined) {
			keys = [];
		}

		function vals(obj) {
			return Object.keys(obj).map(function (key) {
				return obj[key];
			});
		}

		var j;
		var obj = data[0];
		var ret = [];

		if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || Array.isArray(obj)) {
			//do nothing
		} else {
				if (keys.length === 0) {
					var obj_vals = vals(obj);
					for (j = 0; j < obj_vals.length; j++) {
						ret.push(obj_vals[j]);
					}
				} else {
					for (j = 0; j < keys.length; j++) {
						if (!(keys[j] in obj)) {
							continue;
						}

						ret.push(obj[keys[j]]);
					}
				}
			}

		if (this.DEBUG === true) console.timeEnd(this.NAME + ' -> to_array');

		return ret;
	};

	/*
 ████████  ██████       ██████  ██████       ██ ███████  ██████ ████████
    ██    ██    ██     ██    ██ ██   ██      ██ ██      ██         ██
    ██    ██    ██     ██    ██ ██████       ██ █████   ██         ██
    ██    ██    ██     ██    ██ ██   ██ ██   ██ ██      ██         ██
    ██     ██████       ██████  ██████   █████  ███████  ██████    ██
 */
	DataConverter.prototype.to_object = function (data, keys) {
		/*
   * Takes an array of objects (the result of get_checked_tree usually)
   * and returns the first object.
   * If the "keys" argument is passed, only the keys of the object that
   * match the values in the "keys" argument will be returned.
   * This usually doesn't make much sense when more than 1 item in the tree
   * is selected, but you're free to use it however you like.
   */

		if (!Array.isArray(data) || data.length === 0) {
			return {};
		}

		if (this.DEBUG === true) console.time(this.NAME + ' -> to_object');

		if (keys === undefined) {
			keys = [];
		}

		var ret;
		var obj = data[0];

		if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || Array.isArray(obj)) {
			ret = {};
		} else {
			if (keys.length === 0) {
				ret = obj;
			} else {
				var new_obj = {};
				for (var i = 0; i < keys.length; i++) {
					if (!(keys[i] in obj)) {
						continue;
					}

					new_obj[keys[i]] = obj[keys[i]];
				}
				ret = new_obj;
			}
		}

		if (this.DEBUG === true) console.timeEnd(this.NAME + ' -> to_object');

		return ret;
	};

	/*
 ████████  ██████      ██    ██  █████  ██      ██    ██ ███████ ███████
    ██    ██    ██     ██    ██ ██   ██ ██      ██    ██ ██      ██
    ██    ██    ██     ██    ██ ███████ ██      ██    ██ █████   ███████
    ██    ██    ██      ██  ██  ██   ██ ██      ██    ██ ██           ██
    ██     ██████        ████   ██   ██ ███████  ██████  ███████ ███████
 */
	DataConverter.prototype.to_values = function (data, keys) {
		/*
   * Takes an array of one object (the result of get_checked_tree usually)
   * and returns the value of the key in the object that is passed as the
   * "key" argument.
   * If "key" hasn't been passed, the first available value in the object
   * will be returned.
   */
		if (!Array.isArray(data) || data.length === 0) {
			return [];
		}

		if (this.DEBUG === true) console.time(this.NAME + ' -> to_values');

		if (keys === undefined) {
			keys = [];
		}

		var ret = [];

		if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' || !Array.isArray(data) || keys.length === 0) {
			//do nothing
		} else {
				for (var i = 0; i < data.length; i++) {
					for (var j = 0; j < keys.length; j++) {
						if (!(keys[j] in data[i])) {
							continue;
						}

						ret.push(data[i][keys[j]]);
					}
				}
			}

		if (this.DEBUG === true) console.timeEnd(this.NAME + ' -> to_values');

		return ret;
	};

	/*
 ████████  ██████      ██    ██  █████  ██      ██    ██ ███████
    ██    ██    ██     ██    ██ ██   ██ ██      ██    ██ ██
    ██    ██    ██     ██    ██ ███████ ██      ██    ██ █████
    ██    ██    ██      ██  ██  ██   ██ ██      ██    ██ ██
    ██     ██████        ████   ██   ██ ███████  ██████  ███████
 */
	DataConverter.prototype.to_value = function (data, key) {
		/*
   * Takes an array of one object (the result of get_checked_tree usually)
   * and returns the value of the key in the object that is passed as the
   * "key" argument.
   * If "key" hasn't been passed, the first available value in the object
   * will be returned.
   */
		if (!Array.isArray(data) || data.length === 0) {
			return undefined;
		}

		if (this.DEBUG === true) console.time(this.NAME + ' -> to_value');

		var ret;
		var obj = data[0];

		if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || Array.isArray(obj)) {
			ret = undefined;
		} else {
			if (key === undefined) {
				var keys = Object.keys(obj);
				if (keys.length === 0) {
					ret = undefined;
				} else {
					key = keys[0];
					ret = key in obj ? obj[key] : undefined;
				}
			} else {
				key = Array.isArray(key) ? key[0] : key;
				ret = key in obj ? obj[key] : undefined;
			}
		}

		if (this.DEBUG === true) console.timeEnd(this.NAME + ' -> to_value');

		return ret;
	};

	return DataConverter;
}]);
