var angular_multi_select = angular.module('angular-multi-select');

angular_multi_select.filter('translate', [
	'angularMultiSelectI18n',
	function (angularMultiSelectI18n) {
		return function (text) {
			return angularMultiSelectI18n.translate(text);
		};
	}
]);
