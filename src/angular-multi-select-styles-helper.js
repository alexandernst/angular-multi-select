var angular_multi_select_styles_helper = angular.module('angular-multi-select-styles-helper', [
	'angular-multi-select-constants'
]);

angular_multi_select_styles_helper.factory('angularMultiSelectStylesHelper', [
	'$sce',
	'$interpolate',
	'angularMultiSelectConstants',
	function ($sce, $interpolate, angularMultiSelectConstants) {

		var StylesHelper = function (ops, attrs) {
			ops                    = ops                   || {};
			this.ID_PROPERTY       = ops.ID_PROPERTY       || angularMultiSelectConstants.ID_PROPERTY;
			this.OPEN_PROPERTY     = ops.OPEN_PROPERTY     || angularMultiSelectConstants.OPEN_PROPERTY;
			this.CHECKED_PROPERTY  = ops.CHECKED_PROPERTY  || angularMultiSelectConstants.CHECKED_PROPERTY;
			this.CHILDREN_PROPERTY = ops.CHILDREN_PROPERTY || angularMultiSelectConstants.CHILDREN_PROPERTY;

			this.START_REPLACE_SYMBOL_REGEX = /<\[/g;
			this.END_REPLACE_SYMBOL_REGEX   = /]>/g;
			this.START_INTERPOLATE_SYMBOL   = $interpolate.startSymbol();
			this.END_INTERPOLATE_SYMBOL     = $interpolate.endSymbol();

			/*
			 * String representation of nodes/leafs.
			 */
			this.node_repr_attr = attrs.nodeLabel || "";
			this.leaf_repr_attr = attrs.leafLabel || "";
			this.node_repr      = this.interpolate(this.node_repr_attr);
			this.leaf_repr      = this.interpolate(this.leaf_repr_attr);
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

		StylesHelper.prototype.interpolate = function (str) {
			return $interpolate(
				str.replace(this.START_REPLACE_SYMBOL_REGEX, this.START_INTERPOLATE_SYMBOL)
				.replace(this.END_REPLACE_SYMBOL_REGEX, this.END_INTERPOLATE_SYMBOL)
			);
		};

		StylesHelper.prototype.create_label = function (item) {
			//TODO: Cache + cache invalidation on data change

			var _interpolated;
			if (item.children_leafs === 0) {
				_interpolated = this.leaf_repr(item);
			} else {
				_interpolated = this.node_repr(item);
			}

			return $sce.trustAsHtml(_interpolated);
		};

		return StylesHelper;
	}
]);
