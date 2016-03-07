var angular_multi_select = angular.module('angular-multi-select', [
	'angular-multi-select-engine',
	'angular-multi-select-constants',
	'angular-multi-select-styles-helper',
	'angular-multi-select-data-converter'
]);

angular_multi_select.factory('$exceptionHandler', function () {
	return function (exception, cause) {
		console.log(exception, cause);
	};
});

angular_multi_select.directive('angularMultiSelect', [
	'$http',
	'$window',
	'$timeout',
	'angularMultiSelectEngine',
	'angularMultiSelectConstants',
	'angularMultiSelectStylesHelper',
	'angularMultiSelectDataConverter',
	function ($http, $window, $timeout, angularMultiSelectEngine, angularMultiSelectConstants, angularMultiSelectStylesHelper, angularMultiSelectDataConverter) {
		'use strict';
		return {
			restrict: 'AE',

			scope: {
				inputModel: '=',
				outputModel: '='
			},

			templateUrl: '../src/angular-multi-select.tpl',

			link: function ($scope, element, attrs) {
				var self = {};
				var el_attrs = element[0].attributes;
				var el_attrs_vals = Object.keys(el_attrs).map((key) => el_attrs[key]);

				/*
				 █████  ████████ ████████ ██████  ██ ██████  ██    ██ ████████ ███████ ███████
				██   ██    ██       ██    ██   ██ ██ ██   ██ ██    ██    ██    ██      ██
				███████    ██       ██    ██████  ██ ██████  ██    ██    ██    █████   ███████
				██   ██    ██       ██    ██   ██ ██ ██   ██ ██    ██    ██    ██           ██
				██   ██    ██       ██    ██   ██ ██ ██████   ██████     ██    ███████ ███████
				*/
				/*
				* Find out what are the properties names of the important bits
				* of the input data.
				*/
				$scope.ops = {
					DEBUG             : attrs.debug            === "true" ? true : false,
					NAME              : attrs.name             || undefined,
					MAX_CHECKED_LEAFS : parseInt(attrs.maxCheckedLeafs) || -1,

					ID_PROPERTY       : attrs.idProperty       || angularMultiSelectConstants.ID_PROPERTY,
					OPEN_PROPERTY     : attrs.openProperty     || angularMultiSelectConstants.OPEN_PROPERTY,
					CHECKED_PROPERTY  : attrs.checkedProperty  || angularMultiSelectConstants.CHECKED_PROPERTY,
					CHILDREN_PROPERTY : attrs.childrenProperty || angularMultiSelectConstants.CHILDREN_PROPERTY
				};

				/*
				 * Find out if the input data should be threated in some special way.
				 */
				self.do_not_check_data   = attrs.doNotCheckData   === "true" ? true : false;
				self.do_not_convert_data = attrs.doNotConvertData === "true" ? true : false;

				/*
				 * Find out if the output data should be converted in some special way.
				 */
				self.output_type = attrs.outputType === undefined ? 'objects' : attrs.outputType;
				self.output_keys = attrs.outputKeys === undefined ? undefined : attrs.outputKeys;
				if (self.output_keys !== undefined) {
					self.output_keys = self.output_keys
						.split(",")
						.map(function (s) {
							return s.replace(/^\s+|\s+$/g, '');
						});
				}
				self.output_filter = attrs.outputFilter === undefined ? angularMultiSelectConstants.FIND_LEAFS : attrs.outputFilter;

				/*
				 * Find out which field to use for the 'search' functionality.
				 */
				self.search_field = attrs.searchField === undefined ? null : attrs.searchField;

				/*
				 █████  ███    ███ ███████      ██████  ██████       ██ ███████  ██████ ████████ ███████
				██   ██ ████  ████ ██          ██    ██ ██   ██      ██ ██      ██         ██    ██
				███████ ██ ████ ██ ███████     ██    ██ ██████       ██ █████   ██         ██    ███████
				██   ██ ██  ██  ██      ██     ██    ██ ██   ██ ██   ██ ██      ██         ██         ██
				██   ██ ██      ██ ███████      ██████  ██████   █████  ███████  ██████    ██    ███████
				*/
				var amse = new angularMultiSelectEngine($scope.ops);
				var amssh = new angularMultiSelectStylesHelper($scope.ops, attrs);
				var amsdc = new angularMultiSelectDataConverter($scope.ops);
				$scope.amse = amse;
				$scope.amssh = amssh;

				/*
				██    ██ ██ ███████ ██ ██████  ██ ██      ██ ████████ ██    ██
				██    ██ ██ ██      ██ ██   ██ ██ ██      ██    ██     ██  ██
				██    ██ ██ ███████ ██ ██████  ██ ██      ██    ██      ████
				 ██  ██  ██      ██ ██ ██   ██ ██ ██      ██    ██       ██
				  ████   ██ ███████ ██ ██████  ██ ███████ ██    ██       ██
				*/
				$scope.open = false;
				$window.onclick = function (event) {
					if (!event.target) {
						return;
					}

					var p = angular.element(event.target).parent();
					while (p.length > 0) {
						if (
							p[0].className !== undefined &&
							(
								p.hasClass("ams-item") ||
								p.hasClass("ams-container") ||
								p.hasClass("ams-button") ||
								p.hasClass("ams")
							)
						) {
							return;
						}
						p = p.parent();
					}

					$scope.open = false;
					$scope.$apply();
				};

				/*
				██   ██ ███████ ██      ██████  ███████ ██████  ███████
				██   ██ ██      ██      ██   ██ ██      ██   ██ ██
				███████ █████   ██      ██████  █████   ██████  ███████
				██   ██ ██      ██      ██      ██      ██   ██      ██
				██   ██ ███████ ███████ ██      ███████ ██   ██ ███████
				*/
				/*
				 * The 'reset_model' will be filled in with the first available
				 * data from the input model and will be used when the 'reset'
				 * function is triggered.
				 */
				$scope.reset_model = null;
				$scope.check_all   = function () { amse.check_all(); };
				$scope.check_none  = function () { amse.uncheck_all(); };
				$scope.reset       = function () {
					amse.insert($scope.reset_model);
					$scope.items = amse.get_visible_tree();
				};

				/*
				███████ ███████  █████  ██████   ██████ ██   ██
				██      ██      ██   ██ ██   ██ ██      ██   ██
				███████ █████   ███████ ██████  ██      ███████
				     ██ ██      ██   ██ ██   ██ ██      ██   ██
				███████ ███████ ██   ██ ██   ██  ██████ ██   ██
				*/
				$scope.search = "";
				$scope.search_promise = null;
				$scope.search_spinner_visible = false;
				$scope.$watch('search', function (_new, _old) {
					if (_new === _old && _new === "") {
						return;
					}

					if($scope.searchField === null) {
						return;
					}

					/*
					 * This means that there was a search, but it was deleted
					 * and now the normal tree should be repainted.
					 */
					if (_new === "") {
						if ($scope.search_promise !== null) {
							$timeout.cancel($scope.search_promise);
						}
						$scope.items = amse.get_visible_tree();
						$scope.search_spinner_visible = false;
						return;
					}

					/*
					 * If the code execution gets here, it means that there is
					 * a search that should be performed
					 */
					if ($scope.search_promise !== null) {
						$timeout.cancel($scope.search_promise);
					}

					$scope.search_spinner_visible = true;
					$scope.search_promise = $timeout(function (query) {
						//TODO: this needs a lot of improving
						var filter = [];
						filter.push({
							field: self.search_field,
							query: query
						});

						$scope.items = amse.get_filtered_tree(filter);
						$scope.search_spinner_visible = false;
					}, 1500, true, _new);
				});

				/*
				 ██████  ███    ██     ██████   █████  ████████  █████       ██████ ██   ██  █████  ███    ██  ██████  ███████
				██    ██ ████   ██     ██   ██ ██   ██    ██    ██   ██     ██      ██   ██ ██   ██ ████   ██ ██       ██
				██    ██ ██ ██  ██     ██   ██ ███████    ██    ███████     ██      ███████ ███████ ██ ██  ██ ██   ███ █████
				██    ██ ██  ██ ██     ██   ██ ██   ██    ██    ██   ██     ██      ██   ██ ██   ██ ██  ██ ██ ██    ██ ██
				 ██████  ██   ████     ██████  ██   ██    ██    ██   ██      ██████ ██   ██ ██   ██ ██   ████  ██████  ███████
				*/
				amse.on_data_change(function () {
					/*
					 * Will be triggered every time the internal model data is changed.
					 * That could happen on check/uncheck, for example.
					 */

					$scope.stats = amse.get_stats();
					/*
					 * Get the visible tree only once. Consecutive calls on un/check
					 * will automatically propagate to the rendered tree.
					 */
					$scope.items = amse.get_visible_tree();

					if ($scope.outputModel !== undefined) {
						var checked_tree = amse.get_checked_tree(self.output_filter);

						/*
						 * Remove internal (undeeded) data.
						 */
						var res = $scope.ops.DEBUG ? checked_tree : amsdc.to_external(checked_tree);

						/*
						 * Convert the data to the desired output.
						 */
						switch (self.output_type) {
							case 'objects':
								res = amsdc.to_array_of_objects(res, self.output_keys);
								break;
							case 'arrays':
								res = amsdc.to_array_of_arrays(res, self.output_keys);
								break;
							case 'object':
								res = amsdc.to_object(res, self.output_keys);
								break;
							case 'array':
								res = amsdc.to_array(res, self.output_keys);
								break;
							case 'value':
								res = amsdc.to_array(res, self.output_keys);
								break;
						}

						$scope.outputModel = res;
					}
				});

				/*
				 ██████  ███    ██     ██    ██ ██ ███████ ██    ██  █████  ██           ██████ ██   ██  █████  ███    ██  ██████  ███████
				██    ██ ████   ██     ██    ██ ██ ██      ██    ██ ██   ██ ██          ██      ██   ██ ██   ██ ████   ██ ██       ██
				██    ██ ██ ██  ██     ██    ██ ██ ███████ ██    ██ ███████ ██          ██      ███████ ███████ ██ ██  ██ ██   ███ █████
				██    ██ ██  ██ ██      ██  ██  ██      ██ ██    ██ ██   ██ ██          ██      ██   ██ ██   ██ ██  ██ ██ ██    ██ ██
				 ██████  ██   ████       ████   ██ ███████  ██████  ██   ██ ███████      ██████ ██   ██ ██   ██ ██   ████  ██████  ███████
				*/
				amse.on_visual_change(function () {
					/*
					 * Will be triggered when a change that requires a visual change happende.
					 * This is normaly on open/close actions.
					 */
					$scope.items = amse.get_visible_tree();
				});

				/*
				███    ███  █████  ██ ███    ██
				████  ████ ██   ██ ██ ████   ██
				██ ████ ██ ███████ ██ ██ ██  ██
				██  ██  ██ ██   ██ ██ ██  ██ ██
				██      ██ ██   ██ ██ ██   ████
				*/
				self.init = function (data) {
					if (!Array.isArray(data)) {
						return;
					}

					var checked_data  = self.do_not_check_data   ? data         : amsdc.check_prerequisites(data);
					var internal_data = self.do_not_convert_data ? checked_data : amsdc.to_internal(checked_data);

					if ($scope.reset_model === null) {
						$scope.reset_model = internal_data;
					}

					amse.insert(internal_data);
				};

				$scope.$watch('inputModel', function (_new, _old) {
					/*
					* The entry point of the directive. This monitors the input data and
					* decides when to populate the internal data model and how to do it.
					*/
					if (typeof(_new) === "string") {
						try {
							self.init(JSON.parse(_new));
						} catch (e) {
							$http.get(_new).then(function (response) {
								self.init(response.data);
							});
						}
					} else {
						self.init(_new);
					}
				});

				$scope.$on('$destroy', function () {
					//TODO: clean
				});
			}
		};
	}
]);
