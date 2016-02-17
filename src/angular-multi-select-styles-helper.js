var angular_multi_select_styles_helper = angular.module('angular-multi-select-styles-helper', ['angular-multi-select-constants']);

angular_multi_select_styles_helper.factory('angularMultiSelectStylesHelper', function (angularMultiSelectConstants) {
	return {
		get_open_class: function (item) {
			return item.open === true ? 'open' : 'closed';
		},

		get_checked_class: function (item) {
			if (typeof(item.checked) === 'boolean' ) {
				return item.checked ? 'checked' : 'unchecked';
			} else {
				return item.checked < 0 ? 'unchecked' : item.checked > 0 ? 'checked' : 'mixed';
			}
		},

		get_type_class: function (item) {
			return item.children_leafs === 0 ? 'leaf' : 'node';
		}
	};
});
