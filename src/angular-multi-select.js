var angular_multi_select = angular.module('angular-multi-select', [
	'angular-multi-select-engine',
	'angular-multi-select-constants',
	'angular-multi-select-styles-helper',
	'angular-multi-select-data-converter'
]);

angular_multi_select.directive('angularMultiSelect', [
	'$window',
	'$timeout',
	'angularMultiSelectEngine',
	'angularMultiSelectConstants',
	'angularMultiSelectStylesHelper',
	'angularMultiSelectDataConverter',
	function ($window, $timeout, angularMultiSelectEngine, angularMultiSelectConstants, angularMultiSelectStylesHelper, angularMultiSelectDataConverter) {
		return {
			restrict: 'AE',

			scope: {
				inputModel: '=',
				outputModel: '='
			},

			templateUrl: '../src/angular-multi-select.tpl',

			link: function ($scope, element, attrs) {
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
				var ops = {
					DEBUG             : attrs.debug            === "true" ? true : false,
					ID_PROPERTY       : attrs.idProperty       || angularMultiSelectConstants.ID_PROPERTY,
					OPEN_PROPERTY     : attrs.openProperty     || angularMultiSelectConstants.OPEN_PROPERTY,
					CHECKED_PROPERTY  : attrs.checkedProperty  || angularMultiSelectConstants.CHECKED_PROPERTY,
					CHILDREN_PROPERTY : attrs.childrenProperty || angularMultiSelectConstants.CHILDREN_PROPERTY,
				};

				/*
				 * Find out if the input data should be threated in some special way.
				 */
				this.do_not_check_data   = attrs.doNotCheckData   === "true" ? true : false;
				this.do_not_convert_data = attrs.doNotConvertData === "true" ? true : false;

				/*
				 * Find out if the output data should be converted in some special way.
				 */
				this.output_type = attrs.outputType === undefined ? 'objects' : attrs.outputType;

				/*
				 * Find out which field to use for the 'search' functionality.
				 */
				this.search_field = attrs.searchField === undefined ? null : attrs.searchField;

				/*
				 █████  ███    ███ ███████      ██████  ██████       ██ ███████  ██████ ████████ ███████
				██   ██ ████  ████ ██          ██    ██ ██   ██      ██ ██      ██         ██    ██
				███████ ██ ████ ██ ███████     ██    ██ ██████       ██ █████   ██         ██    ███████
				██   ██ ██  ██  ██      ██     ██    ██ ██   ██ ██   ██ ██      ██         ██         ██
				██   ██ ██      ██ ███████      ██████  ██████   █████  ███████  ██████    ██    ███████
				*/
				var amse = new angularMultiSelectEngine(ops);
				var amssh = new angularMultiSelectStylesHelper(ops, attrs);
				var amsdc = new angularMultiSelectDataConverter(ops);
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
				//$scope.$watch('open', function () {

				//});

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
						return;
					}

					/*
					 * If the code execution gets here, it means that there is
					 * a search that should be performed
					 */
					if ($scope.search_promise !== null) {
						$timeout.cancel($scope.search_promise);
					}

					$scope.search_promise = $timeout(function (query) {
						//TODO: this needs a lot of improving
						var filter = [];
						filter.push({
							field: this.search_field,
							query: query
						});

						$scope.items = amse.get_filtered_tree(filter);
					}, 2300, true, _new);
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

					/*
					 * Get the visible tree only once. Consecutive calls on un/check
					 * will automatically propagate to the rendered tree.
					 */
					if ($scope.items === undefined) {
						$scope.items = amse.get_visible_tree();
					}

					if ($scope.outputModel !== undefined) {
						var checked_tree = amse.get_checked_tree();

						var res = checked_tree;
						switch (this.output_type) {
							case 'objects':
								res = amsdc.to_array_of_objects(checked_tree);
								break;
							case 'arrays':
								res = amsdc.to_array_of_arrays(checked_tree);
								break;
							case 'object':
								res = amsdc.to_object(checked_tree);
								break;
							case 'array':
								res = amsdc.to_array(checked_tree);
								break;
							case 'value':
								res = amsdc.to_array(checked_tree);
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
				$scope.$watch('inputModel', function (_new, _old) {
					/*
					* The entry point of the directive. This monitors the input data and
					* decides when to populate the internal data model and how to do it.
					*/
					var checked_data  = this.do_not_check_data   ? _new         : amsdc.check_prerequisites(_new);
					var internal_data = this.do_not_convert_data ? checked_data : amsdc.to_internal(checked_data);

					if (_new !== undefined && $scope.reset_model === null) {
						$scope.reset_model = angular.copy(internal_data);
					}

					amse.insert(internal_data);
				});
			}
		};
	}
]);
