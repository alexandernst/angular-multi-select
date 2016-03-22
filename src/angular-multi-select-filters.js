var angular_multi_select = angular.module('angular-multi-select');

angular_multi_select.filter('translate', [
	'angularMultiSelectI18n',
	function (angularMultiSelectI18n) {
		return function (text) {
			return angularMultiSelectI18n.translate(text);
		};
	}
]);

angular_multi_select.filter('outputModelIterator', [
	'angularMultiSelectConstants',
	'angularMultiSelectStylesHelper',
	function (angularMultiSelectConstants, angularMultiSelectStylesHelper) {
		return function (text, data, glue) {
			var amssh = new angularMultiSelectStylesHelper();

			var output = [];

			var exp;
			switch (data[angularMultiSelectConstants.INTERNAL_KEY_OUTPUT_TYPE_HACK]) {
				case angularMultiSelectConstants.OUTPUT_DATA_TYPE_OBJECTS:
				case angularMultiSelectConstants.OUTPUT_DATA_TYPE_ARRAYS:
					data[angularMultiSelectConstants.INTERNAL_KEY_OUTPUT_MODEL_HACK].map(function (v) {
						exp = amssh.interpolate_alternative2(text);
						output.push(exp(v));
					});
					break;
				case angularMultiSelectConstants.OUTPUT_DATA_TYPE_OBJECT:
				case angularMultiSelectConstants.OUTPUT_DATA_TYPE_ARRAY:
					exp = amssh.interpolate_alternative2(text);
					output.push(exp(v));
					break;
				case angularMultiSelectConstants.OUTPUT_DATA_TYPE_VALUE:
					output.push(data[angularMultiSelectConstants.INTERNAL_KEY_OUTPUT_MODEL_HACK]);
					break;
			}

			return output.join(glue);
		};
	}
]);
