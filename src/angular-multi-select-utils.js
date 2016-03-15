var angular_multi_select_utils = angular.module('angular-multi-select-utils', [
	'angular-multi-select-constants'
]);

angular_multi_select_utils.factory('angularMultiSelectUtils', [
	'angularMultiSelectConstants',
	function (angularMultiSelectConstants) {
		var Utils = function () {

		};

		Utils.prototype.sanitize_ops = function (ops) {
			ops = ops || {};

			return {
				DEBUG             : ops.DEBUG             || false,
				NAME              : ops.NAME              || 'angular-multi-select-' + Math.round(Date.now() / 1000) + '' + Math.random(),
				MAX_CHECKED_LEAFS : ops.MAX_CHECKED_LEAFS || -1,

				ID_PROPERTY       : ops.ID_PROPERTY       || angularMultiSelectConstants.ID_PROPERTY,
				OPEN_PROPERTY     : ops.OPEN_PROPERTY     || angularMultiSelectConstants.OPEN_PROPERTY,
				CHECKED_PROPERTY  : ops.CHECKED_PROPERTY  || angularMultiSelectConstants.CHECKED_PROPERTY,
				CHILDREN_PROPERTY : ops.CHILDREN_PROPERTY || angularMultiSelectConstants.CHILDREN_PROPERTY
			};
		};

		return Utils;
	}
]);
