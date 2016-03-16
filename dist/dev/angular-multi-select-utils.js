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
		if (typeof str === 'string') {
			return str.split(",").map(function (s) {
				return s.replace(/^\s+|\s+$/g, '');
			});
		} else {
			return str;
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
	Utils.prototype.process_kb_input = function (event, $scope) {
		/*
   * Kb events handler. React as follows based on key code:
   *
   * * escape - close the opened AMS instance.
   * * spacebar - toggle the open state of the focused item.
   * * keyup - focus the previos item, or if at the top, the last one.
   * * keydown - focus the next item, or if at the bottom, the first one.
   *
   * The is an exception in keyup/keydown handlers. Both should "skip"
   * one key hit in order to allow an "empty" focus.
   */
		var quit = true;

		var code = event.keyCode ? event.keyCode : event.which;
		switch (code) {
			case 27:
				//escape
				$scope.open = false;
				break;
			case 32:
				//spacebar
				var item = $scope.items[$scope.focused_index];
				if (item !== undefined) {
					$scope.amse.toggle_open_node(item);
					event.preventDefault();
				}
				break;
			case 38:
				//keyup
				$scope.focused_index = $scope.focused_index === -1 ? $scope.items.length - 1 : $scope.focused_index - 1;
				quit = false;
				break;
			case 40:
				//keydown
				$scope.focused_index = $scope.focused_index + 1 > $scope.items.length ? 0 : $scope.focused_index + 1;
				quit = false;
				break;
			default:
				//Nothing to do here...
				return;
		}

		$scope.$apply();

		return quit;
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
//# sourceMappingURL=angular-multi-select-utils.js.map
