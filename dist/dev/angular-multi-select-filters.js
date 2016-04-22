'use strict';

var angular_multi_select = angular.module('angular-multi-select');

angular_multi_select.filter('translate', ['angularMultiSelectI18n', function (angularMultiSelectI18n) {
	return function (text) {
		return angularMultiSelectI18n.translate(text);
	};
}]);

angular_multi_select.filter('outputModelIterator', ['angularMultiSelectConstants', 'angularMultiSelectStylesHelper', function (angularMultiSelectConstants, angularMultiSelectStylesHelper) {
	return function (text, data, glue, default_str) {
		var exp,
		    output = [];
		var amssh = new angularMultiSelectStylesHelper();

		if (!data[angularMultiSelectConstants.INTERNAL_KEY_OUTPUT_MODEL_HACK] || data[angularMultiSelectConstants.INTERNAL_KEY_OUTPUT_MODEL_HACK].length === 0) {
			return default_str || "";
		}

		switch (data[angularMultiSelectConstants.INTERNAL_KEY_OUTPUT_TYPE_HACK]) {
			case angularMultiSelectConstants.OUTPUT_DATA_TYPE_OBJECTS:
			case angularMultiSelectConstants.OUTPUT_DATA_TYPE_ARRAYS:
			case angularMultiSelectConstants.OUTPUT_DATA_TYPE_VALUES:
				data[angularMultiSelectConstants.INTERNAL_KEY_OUTPUT_MODEL_HACK].map(function (v) {
					exp = amssh.interpolate_alternative2(text);
					output.push(exp(v));
				});
				break;
			case angularMultiSelectConstants.OUTPUT_DATA_TYPE_OBJECT:
			case angularMultiSelectConstants.OUTPUT_DATA_TYPE_ARRAY:
			case angularMultiSelectConstants.OUTPUT_DATA_TYPE_VALUE:
				exp = amssh.interpolate_alternative2(text);
				output.push(exp(data[angularMultiSelectConstants.INTERNAL_KEY_OUTPUT_MODEL_HACK][0]));
				break;
		}

		return output.join(glue) || default_str || "";
	};
}]);
