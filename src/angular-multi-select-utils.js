var angular_multi_select_utils = angular.module('angular-multi-select-utils', [
	'angular-multi-select-constants'
]);

angular_multi_select_utils.factory('angularMultiSelectUtils', [
	'angularMultiSelectConstants',
	function (angularMultiSelectConstants) {
		var Utils = function () {

		};

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
				DEBUG             : ops.DEBUG             || false,
				NAME              : ops.NAME              || 'angular-multi-select-' + Math.round(Date.now() / 1000) + '' + Math.random(),
				MAX_CHECKED_LEAFS : ops.MAX_CHECKED_LEAFS || -1,

				ID_PROPERTY       : ops.ID_PROPERTY       || angularMultiSelectConstants.ID_PROPERTY,
				OPEN_PROPERTY     : ops.OPEN_PROPERTY     || angularMultiSelectConstants.OPEN_PROPERTY,
				CHECKED_PROPERTY  : ops.CHECKED_PROPERTY  || angularMultiSelectConstants.CHECKED_PROPERTY,
				CHILDREN_PROPERTY : ops.CHILDREN_PROPERTY || angularMultiSelectConstants.CHILDREN_PROPERTY
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
			if (typeof(str) === 'string') {
				return str.split(",")
				.map(s => s.replace(/^\s+|\s+$/g, ''));
			} else {
				return str;
			}
		};

		return Utils;
	}
]);
