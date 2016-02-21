var angular_multi_select_styles_helper = angular.module('angular-multi-select-styles-helper', [
	'angular-multi-select-constants'
]);

angular_multi_select_styles_helper.factory('angularMultiSelectStylesHelper', [
	'angularMultiSelectConstants',
	function (angularMultiSelectConstants) {

		var StylesHelper = function (ops) {
			ops = ops || {};
			this.ID_PROPERTY       = ops.ID_PROPERTY       || angularMultiSelectConstants.ID_PROPERTY;
			this.OPEN_PROPERTY     = ops.OPEN_PROPERTY     || angularMultiSelectConstants.OPEN_PROPERTY;
			this.CHECKED_PROPERTY  = ops.CHECKED_PROPERTY  || angularMultiSelectConstants.CHECKED_PROPERTY;
			this.CHILDREN_PROPERTY = ops.CHILDREN_PROPERTY || angularMultiSelectConstants.CHILDREN_PROPERTY;
		};

		StylesHelper.prototype.get_open_class = function (item) {
			return item[this.OPEN_PROPERTY] === true ?
				angularMultiSelectConstants.CSS_OPEN :
				angularMultiSelectConstants.CSS_CLOSED;
		};

		StylesHelper.prototype.get_checked_class = function (item) {
			if (typeof(item[this.CHECKED_PROPERTY]) === 'boolean' ) {
				return item[this.CHECKED_PROPERTY] ?
					angularMultiSelectConstants.CSS_LEAF_CHECKED :
					angularMultiSelectConstants.CSS_LEAF_UNCHECKED;
			} else {
				return item[this.CHECKED_PROPERTY] < 0 ?
					angularMultiSelectConstants.CSS_NODE_UNCHECKED :
						item[this.CHECKED_PROPERTY] > 0 ?
							angularMultiSelectConstants.CSS_NODE_CHECKED :
							angularMultiSelectConstants.CSS_NODE_MIXED;
			}
		};

		StylesHelper.prototype.get_type_class = function (item) {
			return item.children_leafs === 0 ?
				angularMultiSelectConstants.CSS_LEAF :
				angularMultiSelectConstants.CSS_NODE;
		};

		return StylesHelper;
	}
]);
