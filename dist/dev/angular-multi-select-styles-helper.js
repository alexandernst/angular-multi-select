'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var angular_multi_select_styles_helper = angular.module('angular-multi-select-styles-helper', ['angular-multi-select-utils', 'angular-multi-select-constants']);

angular_multi_select_styles_helper.run([function () {
	'use strict';
	/*
  * This is used to generate some CSS styling at runtime.
  * This code as ran after everything else is loaded and
  * uses "document.styleSheets" to read the loaded CSS styling.
  *
  * * The right padding of each element is extended with as many
  * pixels as the width of the check marker.
  *
  * * 20 levels of indent classes are generated based on the
  * width of the first level.
  */

	var inject = angular.element("<style>");

	//Default values, just in case...
	var check_width = 10;
	var level_width = 20;

	var styles = document.styleSheets || [];
	for (var i = 0; i < styles.length; i++) {
		var style = styles[i];

		if (!style.href || style.href.indexOf("angular-multi-select") === -1) {
			continue;
		}

		var rules = style.cssRules || [];
		for (var j = 0; j < rules.length; j++) {
			var rule = rules[j];

			switch (rule.selectorText) {
				case ".ams-item .check":
					check_width = parseInt(rule.style.width);
					break;
				case ".ams-item-level-0":
					level_width = parseInt(rule.style.paddingLeft);
					break;
			}
		}
	}

	var indent = "";
	for (i = 1; i < 20; i++) {
		indent += '.ams-item-level-' + i + ' { padding-left: ' + (i + 1) * level_width + 'px; }';
	}
	inject.text('.ams-item { padding-right: ' + (check_width + 10) + 'px; } ' + indent);
	angular.element(document.getElementsByTagName('head')).append(inject);
}]);

angular_multi_select_styles_helper.factory('angularMultiSelectStylesHelper', ['$sce', '$interpolate', 'angularMultiSelectUtils', 'angularMultiSelectConstants', function ($sce, $interpolate, angularMultiSelectUtils, angularMultiSelectConstants) {
	'use strict';
	/*
  ██████  ██████  ███    ██ ███████ ████████ ██████  ██    ██  ██████ ████████  ██████  ██████
 ██      ██    ██ ████   ██ ██         ██    ██   ██ ██    ██ ██         ██    ██    ██ ██   ██
 ██      ██    ██ ██ ██  ██ ███████    ██    ██████  ██    ██ ██         ██    ██    ██ ██████
 ██      ██    ██ ██  ██ ██      ██    ██    ██   ██ ██    ██ ██         ██    ██    ██ ██   ██
  ██████  ██████  ██   ████ ███████    ██    ██   ██  ██████   ██████    ██     ██████  ██   ██
 */

	var StylesHelper = function StylesHelper(ops, attrs) {
		attrs = attrs || {};
		this.amsu = new angularMultiSelectUtils();
		_extends(this, this.amsu.sanitize_ops(ops));

		this.START_REPLACE_SYMBOL_REGEX = /<\[/g;
		this.END_REPLACE_SYMBOL_REGEX = /\]>/g;
		this.START_INTERPOLATE_SYMBOL = $interpolate.startSymbol();
		this.END_INTERPOLATE_SYMBOL = $interpolate.endSymbol();

		this.START_REPLACE_SYMBOL_ALTERNATIVE_REGEX = /<#/g;
		this.END_REPLACE_SYMBOL_ALTERNATIVE_REGEX = /#>/g;
		this.START_INTERPOLATE_SYMBOL_ALTERNATIVE = $interpolate.startSymbol();
		this.END_INTERPOLATE_SYMBOL_ALTERNATIVE = $interpolate.endSymbol();

		this.START_REPLACE_SYMBOL_ALTERNATIVE2_REGEX = /<\(/g;
		this.END_REPLACE_SYMBOL_ALTERNATIVE2_REGEX = /\)>/g;
		this.START_INTERPOLATE_SYMBOL_ALTERNATIVE2 = $interpolate.startSymbol();
		this.END_INTERPOLATE_SYMBOL_ALTERNATIVE2 = $interpolate.endSymbol();

		this.START_REPLACE_SYMBOL_ALTERNATIVE_REPETITIVE_REGEX = /<#/g;
		this.END_REPLACE_SYMBOL_ALTERNATIVE_REPETITIVE_REGEX = /#>/g;
		this.START_INTERPOLATE_SYMBOL_ALTERNATIVE_REPETITIVE = '<[' + $interpolate.startSymbol();
		this.END_INTERPOLATE_SYMBOL_ALTERNATIVE_REPETITIVE = $interpolate.endSymbol() + ']>';

		/*
   * String representation of nodes/leafs and dropdown label.
   */
		this.dropdown_repr_attr = attrs.dropdownLabel || "";
		this.dropdown_repr = this.interpolate_alternative(this.dropdown_repr_attr)({ angularMultiSelectConstants: angularMultiSelectConstants });
		this.dropdown_repr = this.interpolate(this.dropdown_repr);

		this.node_repr_attr = attrs.nodeLabel || "";
		this.node_repr = this.interpolate_alternative_repetitive(this.node_repr_attr)({ angularMultiSelectConstants: angularMultiSelectConstants });
		this.node_repr = this.interpolate(this.node_repr);

		this.leaf_repr_attr = attrs.leafLabel || "";
		this.leaf_repr = this.interpolate_alternative_repetitive(this.leaf_repr_attr)({ angularMultiSelectConstants: angularMultiSelectConstants });
		this.leaf_repr = this.interpolate(this.leaf_repr);
	};

	/*
  ██████  ███████ ████████     ██      ███████ ██    ██ ███████ ██           ██████ ██       █████  ███████ ███████
 ██       ██         ██        ██      ██      ██    ██ ██      ██          ██      ██      ██   ██ ██      ██
 ██   ███ █████      ██        ██      █████   ██    ██ █████   ██          ██      ██      ███████ ███████ ███████
 ██    ██ ██         ██        ██      ██       ██  ██  ██      ██          ██      ██      ██   ██      ██      ██
  ██████  ███████    ██        ███████ ███████   ████   ███████ ███████      ██████ ███████ ██   ██ ███████ ███████
 */
	StylesHelper.prototype.get_level_class = function (item) {
		return "ams-item-level-" + item[angularMultiSelectConstants.INTERNAL_KEY_LEVEL];
	};

	/*
  ██████  ███████ ████████      ██████  ██████  ███████ ███    ██      ██████ ██       █████  ███████ ███████
 ██       ██         ██        ██    ██ ██   ██ ██      ████   ██     ██      ██      ██   ██ ██      ██
 ██   ███ █████      ██        ██    ██ ██████  █████   ██ ██  ██     ██      ██      ███████ ███████ ███████
 ██    ██ ██         ██        ██    ██ ██      ██      ██  ██ ██     ██      ██      ██   ██      ██      ██
  ██████  ███████    ██         ██████  ██      ███████ ██   ████      ██████ ███████ ██   ██ ███████ ███████
 */
	StylesHelper.prototype.get_open_class = function (item) {
		if (item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] === 0) {
			return '';
		}

		return item[this.OPEN_PROPERTY] === true ? angularMultiSelectConstants.CSS_OPEN : angularMultiSelectConstants.CSS_CLOSED;
	};

	/*
  ██████  ███████ ████████      ██████ ██   ██ ███████  ██████ ██   ██ ███████ ██████       ██████ ██       █████  ███████ ███████
 ██       ██         ██        ██      ██   ██ ██      ██      ██  ██  ██      ██   ██     ██      ██      ██   ██ ██      ██
 ██   ███ █████      ██        ██      ███████ █████   ██      █████   █████   ██   ██     ██      ██      ███████ ███████ ███████
 ██    ██ ██         ██        ██      ██   ██ ██      ██      ██  ██  ██      ██   ██     ██      ██      ██   ██      ██      ██
  ██████  ███████    ██         ██████ ██   ██ ███████  ██████ ██   ██ ███████ ██████       ██████ ███████ ██   ██ ███████ ███████
 */
	StylesHelper.prototype.get_checked_class = function (item) {
		if (typeof item[this.CHECKED_PROPERTY] === 'boolean') {
			return item[this.CHECKED_PROPERTY] ? angularMultiSelectConstants.CSS_LEAF_CHECKED : angularMultiSelectConstants.CSS_LEAF_UNCHECKED;
		} else {
			return item[this.CHECKED_PROPERTY] < 0 ? angularMultiSelectConstants.CSS_NODE_UNCHECKED : item[this.CHECKED_PROPERTY] > 0 ? angularMultiSelectConstants.CSS_NODE_CHECKED : angularMultiSelectConstants.CSS_NODE_MIXED;
		}
	};

	/*
  ██████  ███████ ████████     ████████ ██    ██ ██████  ███████      ██████ ██       █████  ███████ ███████
 ██       ██         ██           ██     ██  ██  ██   ██ ██          ██      ██      ██   ██ ██      ██
 ██   ███ █████      ██           ██      ████   ██████  █████       ██      ██      ███████ ███████ ███████
 ██    ██ ██         ██           ██       ██    ██      ██          ██      ██      ██   ██      ██      ██
  ██████  ███████    ██           ██       ██    ██      ███████      ██████ ███████ ██   ██ ███████ ███████
 */
	StylesHelper.prototype.get_type_class = function (item) {
		return item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] === 0 ? angularMultiSelectConstants.CSS_LEAF : angularMultiSelectConstants.CSS_NODE;
	};

	/*
 ██ ███    ██ ████████ ███████ ██████  ██████   ██████  ██       █████  ████████ ███████
 ██ ████   ██    ██    ██      ██   ██ ██   ██ ██    ██ ██      ██   ██    ██    ██
 ██ ██ ██  ██    ██    █████   ██████  ██████  ██    ██ ██      ███████    ██    █████
 ██ ██  ██ ██    ██    ██      ██   ██ ██      ██    ██ ██      ██   ██    ██    ██
 ██ ██   ████    ██    ███████ ██   ██ ██       ██████  ███████ ██   ██    ██    ███████
 */
	StylesHelper.prototype.interpolate = function (str) {
		/*
   * Interpolation method used to interpolate <[ ]>.
   * This is normaly used to interpolate the data of nodes/leafs.
   */
		str = str.replace(this.START_REPLACE_SYMBOL_REGEX, this.START_INTERPOLATE_SYMBOL).replace(this.END_REPLACE_SYMBOL_REGEX, this.END_INTERPOLATE_SYMBOL);
		return $interpolate(str);
	};

	/*
 ██ ███    ██ ████████ ███████ ██████  ██████   ██████  ██       █████  ████████ ███████      █████  ██   ████████ ███████ ██████  ███    ██  █████  ████████ ██ ██    ██ ███████
 ██ ████   ██    ██    ██      ██   ██ ██   ██ ██    ██ ██      ██   ██    ██    ██          ██   ██ ██      ██    ██      ██   ██ ████   ██ ██   ██    ██    ██ ██    ██ ██
 ██ ██ ██  ██    ██    █████   ██████  ██████  ██    ██ ██      ███████    ██    █████       ███████ ██      ██    █████   ██████  ██ ██  ██ ███████    ██    ██ ██    ██ █████
 ██ ██  ██ ██    ██    ██      ██   ██ ██      ██    ██ ██      ██   ██    ██    ██          ██   ██ ██      ██    ██      ██   ██ ██  ██ ██ ██   ██    ██    ██  ██  ██  ██
 ██ ██   ████    ██    ███████ ██   ██ ██       ██████  ███████ ██   ██    ██    ███████     ██   ██ ███████ ██    ███████ ██   ██ ██   ████ ██   ██    ██    ██   ████   ███████
 */
	StylesHelper.prototype.interpolate_alternative = function (str) {
		/*
   * Interpolation method used to interpolate <# #>.
   * This is normaly used to interpolate the data of the dropdown label, but
   * can also be used to interpolate internal data.
   */
		str = str.replace(this.START_REPLACE_SYMBOL_ALTERNATIVE_REGEX, this.START_INTERPOLATE_SYMBOL_ALTERNATIVE).replace(this.END_REPLACE_SYMBOL_ALTERNATIVE_REGEX, this.END_INTERPOLATE_SYMBOL_ALTERNATIVE);
		return $interpolate(str);
	};

	/*
 ██ ███    ██ ████████ ███████ ██████  ██████   ██████  ██       █████  ████████ ███████      █████  ██   ████████ ███████ ██████  ███    ██  █████  ████████ ██ ██    ██ ███████     ██████
 ██ ████   ██    ██    ██      ██   ██ ██   ██ ██    ██ ██      ██   ██    ██    ██          ██   ██ ██      ██    ██      ██   ██ ████   ██ ██   ██    ██    ██ ██    ██ ██               ██
 ██ ██ ██  ██    ██    █████   ██████  ██████  ██    ██ ██      ███████    ██    █████       ███████ ██      ██    █████   ██████  ██ ██  ██ ███████    ██    ██ ██    ██ █████        █████
 ██ ██  ██ ██    ██    ██      ██   ██ ██      ██    ██ ██      ██   ██    ██    ██          ██   ██ ██      ██    ██      ██   ██ ██  ██ ██ ██   ██    ██    ██  ██  ██  ██          ██
 ██ ██   ████    ██    ███████ ██   ██ ██       ██████  ███████ ██   ██    ██    ███████     ██   ██ ███████ ██    ███████ ██   ██ ██   ████ ██   ██    ██    ██   ████   ███████     ███████
 */
	StylesHelper.prototype.interpolate_alternative2 = function (str) {
		/*
   * Interpolation method used to interpolate <( )>.
   * This is normaly used to interpolate the data of each output model
   * item in the dropdown label.
   */
		str = str.replace(this.START_REPLACE_SYMBOL_ALTERNATIVE2_REGEX, this.START_INTERPOLATE_SYMBOL_ALTERNATIVE2).replace(this.END_REPLACE_SYMBOL_ALTERNATIVE2_REGEX, this.END_INTERPOLATE_SYMBOL_ALTERNATIVE2);
		return $interpolate(str);
	};

	/*
 ██ ███    ██ ████████ ███████ ██████  ██████   ██████  ██       █████  ████████ ███████      █████  ██   ████████ ███████ ██████  ███    ██  █████  ████████ ██ ██    ██ ███████     ██████  ███████ ██████  ███████ ████████ ██ ████████ ██ ██    ██ ███████
 ██ ████   ██    ██    ██      ██   ██ ██   ██ ██    ██ ██      ██   ██    ██    ██          ██   ██ ██      ██    ██      ██   ██ ████   ██ ██   ██    ██    ██ ██    ██ ██          ██   ██ ██      ██   ██ ██         ██    ██    ██    ██ ██    ██ ██
 ██ ██ ██  ██    ██    █████   ██████  ██████  ██    ██ ██      ███████    ██    █████       ███████ ██      ██    █████   ██████  ██ ██  ██ ███████    ██    ██ ██    ██ █████       ██████  █████   ██████  █████      ██    ██    ██    ██ ██    ██ █████
 ██ ██  ██ ██    ██    ██      ██   ██ ██      ██    ██ ██      ██   ██    ██    ██          ██   ██ ██      ██    ██      ██   ██ ██  ██ ██ ██   ██    ██    ██  ██  ██  ██          ██   ██ ██      ██      ██         ██    ██    ██    ██  ██  ██  ██
 ██ ██   ████    ██    ███████ ██   ██ ██       ██████  ███████ ██   ██    ██    ███████     ██   ██ ███████ ██    ███████ ██   ██ ██   ████ ██   ██    ██    ██   ████   ███████     ██   ██ ███████ ██      ███████    ██    ██    ██    ██   ████   ███████
 */
	StylesHelper.prototype.interpolate_alternative_repetitive = function (str) {
		/*
   * Interpolation method used to interpolate <# #>.
   * This is normaly used to interpolate the data of the nodes/leafs, but
   * there is one difference between this method and 'interpolate'. This method
   * is suitable to be called and then chain a call to 'interpolate'. This is
   * useful when the user wants to interpolate some constant values from
   * angularMultiSelectConstants and then interpolate those values with a node/leaf.
   */
		str = str.replace(this.START_REPLACE_SYMBOL_ALTERNATIVE_REPETITIVE_REGEX, this.START_INTERPOLATE_SYMBOL_ALTERNATIVE_REPETITIVE).replace(this.END_REPLACE_SYMBOL_ALTERNATIVE_REPETITIVE_REGEX, this.END_INTERPOLATE_SYMBOL_ALTERNATIVE_REPETITIVE);
		return $interpolate(str);
	};

	/*
  ██████ ██████  ███████  █████  ████████ ███████     ██████  ██████   ██████  ██████  ██████   ██████  ██     ██ ███    ██     ██       █████  ██████  ███████ ██
 ██      ██   ██ ██      ██   ██    ██    ██          ██   ██ ██   ██ ██    ██ ██   ██ ██   ██ ██    ██ ██     ██ ████   ██     ██      ██   ██ ██   ██ ██      ██
 ██      ██████  █████   ███████    ██    █████       ██   ██ ██████  ██    ██ ██████  ██   ██ ██    ██ ██  █  ██ ██ ██  ██     ██      ███████ ██████  █████   ██
 ██      ██   ██ ██      ██   ██    ██    ██          ██   ██ ██   ██ ██    ██ ██      ██   ██ ██    ██ ██ ███ ██ ██  ██ ██     ██      ██   ██ ██   ██ ██      ██
  ██████ ██   ██ ███████ ██   ██    ██    ███████     ██████  ██   ██  ██████  ██      ██████   ██████   ███ ███  ██   ████     ███████ ██   ██ ██████  ███████ ███████
 */
	StylesHelper.prototype.create_dropdown_label = function (stats, outputModel, output_type) {
		//TODO: Cache + cache invalidation on data change

		if (stats === undefined) {
			return '';
		}

		/*
   * This is kind of a hack... 'stats' is an object that is used to interpolate
   * the dropdown label. Since the interpolation string might contain a call to the
   * 'outputModelIterator' filter, we need to pass somehow the output model and the
   * output type. The easiest way (and the cleanest, AFAIK) is to attach temporarily
   * those to the 'stats' object and then delete them.
   */
		stats[angularMultiSelectConstants.INTERNAL_KEY_OUTPUT_MODEL_HACK] = outputModel;
		stats[angularMultiSelectConstants.INTERNAL_KEY_OUTPUT_TYPE_HACK] = output_type;

		var _interpolated = this.dropdown_repr(stats);

		delete stats[angularMultiSelectConstants.INTERNAL_KEY_OUTPUT_MODEL_HACK];
		delete stats[angularMultiSelectConstants.INTERNAL_KEY_OUTPUT_TYPE_HACK];

		return $sce.trustAsHtml(_interpolated);
	};

	/*
  ██████ ██████  ███████  █████  ████████ ███████     ██       █████  ██████  ███████ ██
 ██      ██   ██ ██      ██   ██    ██    ██          ██      ██   ██ ██   ██ ██      ██
 ██      ██████  █████   ███████    ██    █████       ██      ███████ ██████  █████   ██
 ██      ██   ██ ██      ██   ██    ██    ██          ██      ██   ██ ██   ██ ██      ██
  ██████ ██   ██ ███████ ██   ██    ██    ███████     ███████ ██   ██ ██████  ███████ ███████
 */
	StylesHelper.prototype.create_label = function (item) {
		//TODO: Cache + cache invalidation on data change

		var _interpolated;
		if (item[angularMultiSelectConstants.INTERNAL_KEY_CHILDREN_LEAFS] === 0) {
			_interpolated = this.leaf_repr(item);
		} else {
			_interpolated = this.node_repr(item);
		}

		return $sce.trustAsHtml(_interpolated);
	};

	/*
 ████████ ██████   █████  ███    ██ ███████ ███████  ██████  ██████  ███    ███     ██████   ██████  ███████ ██ ████████ ██  ██████  ███    ██
    ██    ██   ██ ██   ██ ████   ██ ██      ██      ██    ██ ██   ██ ████  ████     ██   ██ ██    ██ ██      ██    ██    ██ ██    ██ ████   ██
    ██    ██████  ███████ ██ ██  ██ ███████ █████   ██    ██ ██████  ██ ████ ██     ██████  ██    ██ ███████ ██    ██    ██ ██    ██ ██ ██  ██
    ██    ██   ██ ██   ██ ██  ██ ██      ██ ██      ██    ██ ██   ██ ██  ██  ██     ██      ██    ██      ██ ██    ██    ██ ██    ██ ██  ██ ██
    ██    ██   ██ ██   ██ ██   ████ ███████ ██       ██████  ██   ██ ██      ██     ██       ██████  ███████ ██    ██    ██  ██████  ██   ████
 */
	StylesHelper.prototype.transform_position = function (element) {
		var btn = element[0].getElementsByClassName('ams-button')[0];
		var container = element[0].getElementsByClassName('ams-container')[0];

		var translateX = 0,
		    translateY = 0;
		var btn_rect = btn.getBoundingClientRect();
		var container_rect = container.getBoundingClientRect();

		/*
   * If the available width to the right is not enough and there is
   * enough available width to the left, flip the X position.
   */
		if (document.documentElement.clientWidth - (btn_rect.left + btn_rect.width) < container_rect.width && btn_rect.left + btn_rect.width >= container_rect.width) {
			translateX -= container_rect.width - btn_rect.width;
		}

		/*
   * If the available height to the bottom is not enough and there is
   * enough available height to the top, flip the Y position.
   */
		if (document.documentElement.clientHeight - (btn_rect.top + btn_rect.height) < container_rect.height && btn_rect.top >= container_rect.height) {
			translateY -= container_rect.height + btn_rect.height;
		}

		container.style.transform = "translate(" + translateX + "px, " + translateY + "px)";
	};

	return StylesHelper;
}]);
