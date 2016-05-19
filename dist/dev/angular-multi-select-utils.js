'use strict';

var angular_multi_select_utils = angular.module('angular-multi-select-utils', ['angular-multi-select-constants']);

angular_multi_select_utils.factory('angularMultiSelectUtils', ['angularMultiSelectConstants', function (angularMultiSelectConstants) {
	var Utils = function Utils() {};

	/*
 ███████  █████  ███    ██ ██ ████████ ██ ███████ ███████      ██████  ██████  ███████
 ██      ██   ██ ████   ██ ██    ██    ██    ███  ██          ██    ██ ██   ██ ██
 ███████ ███████ ██ ██  ██ ██    ██    ██   ███   █████       ██    ██ ██████  ███████
      ██ ██   ██ ██  ██ ██ ██    ██    ██  ███    ██          ██    ██ ██           ██
 ███████ ██   ██ ██   ████ ██    ██    ██ ███████ ███████      ██████  ██      ███████
 */
	Utils.prototype.sanitize_ops = function (ops) {
		/*
   * This will set all basic and required values to
   * "sane" defaults if none are provided.
   */
		ops = ops || {};

		return {
			DEBUG: ops.DEBUG || false,
			NAME: ops.NAME || 'angular-multi-select-' + Math.round(Date.now() / 1000) + '' + Math.random(),
			MAX_CHECKED_LEAFS: ops.MAX_CHECKED_LEAFS || -1,

			ID_PROPERTY: ops.ID_PROPERTY || angularMultiSelectConstants.ID_PROPERTY,
			OPEN_PROPERTY: ops.OPEN_PROPERTY || angularMultiSelectConstants.OPEN_PROPERTY,
			CHECKED_PROPERTY: ops.CHECKED_PROPERTY || angularMultiSelectConstants.CHECKED_PROPERTY,
			CHILDREN_PROPERTY: ops.CHILDREN_PROPERTY || angularMultiSelectConstants.CHILDREN_PROPERTY
		};
	};

	/*
  █████  ██████  ██████   █████  ██    ██     ███████ ██████   ██████  ███    ███      █████  ████████ ████████ ██████
 ██   ██ ██   ██ ██   ██ ██   ██  ██  ██      ██      ██   ██ ██    ██ ████  ████     ██   ██    ██       ██    ██   ██
 ███████ ██████  ██████  ███████   ████       █████   ██████  ██    ██ ██ ████ ██     ███████    ██       ██    ██████
 ██   ██ ██   ██ ██   ██ ██   ██    ██        ██      ██   ██ ██    ██ ██  ██  ██     ██   ██    ██       ██    ██   ██
 ██   ██ ██   ██ ██   ██ ██   ██    ██        ██      ██   ██  ██████  ██      ██     ██   ██    ██       ██    ██   ██
 */
	Utils.prototype.array_from_attr = function (str) {
		/*
   * This will take a string and try to split it
   * using ',' as separator and return the resulting
   * array or undefined.
   */
		if (typeof str === 'string' && str.length > 0) {
			return str.split(",").map(function (s) {
				return s.replace(/^\s+|\s+$/g, '');
			});
		} else {
			return [];
		}
	};

	/*
 ██████   █████  ██████  ███████ ███████     ██████   █████  ██ ██████  ███████
 ██   ██ ██   ██ ██   ██ ██      ██          ██   ██ ██   ██ ██ ██   ██ ██
 ██████  ███████ ██████  ███████ █████       ██████  ███████ ██ ██████  ███████
 ██      ██   ██ ██   ██      ██ ██          ██      ██   ██ ██ ██   ██      ██
 ██      ██   ██ ██   ██ ███████ ███████     ██      ██   ██ ██ ██   ██ ███████
 */
	Utils.prototype.parse_pairs = function (arr) {
		/*
   * Takes an array of primitives and checks if the second
   * value of each pair of values looks line a number (int or float),
   * and if it does, it converts it to a Number.
   *
   * Note that the function modifies the passed array instead
   * of creating a new one.
   */
		for (var i = 0; i < arr.length; i += 2) {
			var value = arr[i + 1];

			if (value.match(/^'(.*)'$/gi) !== null || value.match(/^"(.*)"$/gi) !== null) {
				arr[i + 1] = value.substring(1, value.length - 1);
			} else if (value.match(/^([0-9\.]*)$/gi) !== null) {
				arr[i + 1] = Number(value);
			}
		}
	};

	/*
 ███████ ██      ███████ ███    ███ ███████ ███    ██ ████████     ██████  ███████ ██       ██████  ███    ██  ██████  ███████     ████████  ██████      ██████  ██ ██████  ███████  ██████ ████████ ██ ██    ██ ███████
 ██      ██      ██      ████  ████ ██      ████   ██    ██        ██   ██ ██      ██      ██    ██ ████   ██ ██       ██             ██    ██    ██     ██   ██ ██ ██   ██ ██      ██         ██    ██ ██    ██ ██
 █████   ██      █████   ██ ████ ██ █████   ██ ██  ██    ██        ██████  █████   ██      ██    ██ ██ ██  ██ ██   ███ ███████        ██    ██    ██     ██   ██ ██ ██████  █████   ██         ██    ██ ██    ██ █████
 ██      ██      ██      ██  ██  ██ ██      ██  ██ ██    ██        ██   ██ ██      ██      ██    ██ ██  ██ ██ ██    ██      ██        ██    ██    ██     ██   ██ ██ ██   ██ ██      ██         ██    ██  ██  ██  ██
 ███████ ███████ ███████ ██      ██ ███████ ██   ████    ██        ██████  ███████ ███████  ██████  ██   ████  ██████  ███████        ██     ██████      ██████  ██ ██   ██ ███████  ██████    ██    ██   ████   ███████
 */
	Utils.prototype.element_belongs_to_directive = function (element, directive_name) {
		/*
   * Check if the passed DOM element is somewhere inside the DOM tree of the
   * directive identified by directive_name.
   */
		var res = false;

		var p = angular.element(element).parent();
		while (p.length > 0) {
			if (p.attr("name") === directive_name) {
				res = true;
				break;
			}
			p = p.parent();
		}

		return res;
	};

	/*
 ██████  ██████  ███████ ██    ██ ███████ ███    ██ ████████     ███████  ██████ ██████   ██████  ██      ██          ██████  ██    ██ ██████  ██████  ██      ██ ███    ██  ██████
 ██   ██ ██   ██ ██      ██    ██ ██      ████   ██    ██        ██      ██      ██   ██ ██    ██ ██      ██          ██   ██ ██    ██ ██   ██ ██   ██ ██      ██ ████   ██ ██
 ██████  ██████  █████   ██    ██ █████   ██ ██  ██    ██        ███████ ██      ██████  ██    ██ ██      ██          ██████  ██    ██ ██████  ██████  ██      ██ ██ ██  ██ ██   ███
 ██      ██   ██ ██       ██  ██  ██      ██  ██ ██    ██             ██ ██      ██   ██ ██    ██ ██      ██          ██   ██ ██    ██ ██   ██ ██   ██ ██      ██ ██  ██ ██ ██    ██
 ██      ██   ██ ███████   ████   ███████ ██   ████    ██        ███████  ██████ ██   ██  ██████  ███████ ███████     ██████   ██████  ██████  ██████  ███████ ██ ██   ████  ██████
 */
	Utils.prototype.prevent_scroll_bubbling = function (element) {
		element.addEventListener('mousewheel', function (e) {
			if (element.clientHeight + element.scrollTop + e.deltaY >= element.scrollHeight) {
				e.preventDefault();
				element.scrollTop = element.scrollHeight;
			} else if (element.scrollTop + e.deltaY <= 0) {
				e.preventDefault();
				element.scrollTop = 0;
			}
		}, false);
	};

	/*
 ██████  ██████   ██████   ██████ ███████ ███████ ███████     ██   ██ ██████      ██ ███    ██ ██████  ██    ██ ████████
 ██   ██ ██   ██ ██    ██ ██      ██      ██      ██          ██  ██  ██   ██     ██ ████   ██ ██   ██ ██    ██    ██
 ██████  ██████  ██    ██ ██      █████   ███████ ███████     █████   ██████      ██ ██ ██  ██ ██████  ██    ██    ██
 ██      ██   ██ ██    ██ ██      ██           ██      ██     ██  ██  ██   ██     ██ ██  ██ ██ ██      ██    ██    ██
 ██      ██   ██  ██████   ██████ ███████ ███████ ███████     ██   ██ ██████      ██ ██   ████ ██       ██████     ██
 */
	Utils.prototype.process_kb_input = function (event, $scope, element) {
		/*
   * Kb events handler. React as follows based on key code:
   *
   * * escape - close the opened AMS instance.
   * * spacebar - toggle the checked state of the focused item.
   * * keyup - focus the previos item, or if at the top, the last one.
   * * keydown - focus the next item, or if at the bottom, the first one.
   * * keyleft - close the current item.
   * * keyright - open the current item.
   *
   * There is an exception in keyup/keydown handlers. Both should "skip"
   * one key hit in order to allow an "empty" focus.
   */

		var item;
		var prevent = true;
		var code = event.keyCode ? event.keyCode : event.which;
		switch (code) {
			case 27:
				//escape
				$scope.open = false;
				break;
			case 32:
				//spacebar
				item = $scope.items[$scope.focused_index];
				if (item !== undefined) {
					$scope.amse.toggle_check_node(item);
				}
				break;
			case 37:
				//keyleft
				item = $scope.items[$scope.focused_index];
				if (item !== undefined && item[angularMultiSelectConstants.OPEN_PROPERTY] === angularMultiSelectConstants.INTERNAL_DATA_OPEN) {
					$scope.amse.toggle_open_node(item);
				}
				break;
			case 38:
				//keyup
				$scope.focused_index = $scope.focused_index === -1 ? $scope.items.length - 1 : $scope.focused_index - 1;
				break;
			case 39:
				//keyright
				item = $scope.items[$scope.focused_index];
				if (item !== undefined && item[angularMultiSelectConstants.OPEN_PROPERTY] === angularMultiSelectConstants.INTERNAL_DATA_CLOSED) {
					$scope.amse.toggle_open_node(item);
				}
				break;
			case 40:
				//keydown
				$scope.focused_index = $scope.focused_index + 1 > $scope.items.length ? 0 : $scope.focused_index + 1;
				break;
			default:
				prevent = false;
				break;
		}

		if (prevent === true) {
			event.preventDefault();
		}

		$scope.$apply();

		/*
   * This must be done after the $apply() call
   */
		if (code === 38 || code === 40) {
			if ($scope.focused_index !== -1) {
				this.scroll_to_item(element);
			}
		}
	};

	/*
 ███████  ██████ ██████   ██████  ██      ██          ████████  ██████      ██ ████████ ███████ ███    ███
 ██      ██      ██   ██ ██    ██ ██      ██             ██    ██    ██     ██    ██    ██      ████  ████
 ███████ ██      ██████  ██    ██ ██      ██             ██    ██    ██     ██    ██    █████   ██ ████ ██
      ██ ██      ██   ██ ██    ██ ██      ██             ██    ██    ██     ██    ██    ██      ██  ██  ██
 ███████  ██████ ██   ██  ██████  ███████ ███████        ██     ██████      ██    ██    ███████ ██      ██
 */
	Utils.prototype.scroll_to_item = function (element) {
		/*
   * Change the scroll position of the items container in such a way that
   * the focused item gets to be visible.
   */
		var item = element[0].getElementsByClassName('ams-item-focused')[0];
		if (item === undefined) {
			return;
		}

		var container = element[0].getElementsByClassName('ams-items')[0];
		container.scrollTop = item.offsetTop + item.offsetHeight - container.offsetHeight;
	};

	return Utils;
}]);
