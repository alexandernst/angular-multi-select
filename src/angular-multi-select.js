var angular_multi_select = angular.module('angular-multi-select', [
	'angular-multi-select-engine',
	'angular-multi-select-constants',
	'angular-multi-select-styles-helper',
	'angular-multi-select-data-converter'
]);

angular_multi_select.directive('angularMultiSelect', [
	'angularMultiSelectEngine',
	'angularMultiSelectConstants',
	'angularMultiSelectStylesHelper',
	'angularMultiSelectDataConverter',
	function (angularMultiSelectEngine, angularMultiSelectConstants, angularMultiSelectStylesHelper, angularMultiSelectDataConverter) {
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

				var amse = new angularMultiSelectEngine(ops);
				var amssh = new angularMultiSelectStylesHelper(ops, attrs);
				var amsdc = new angularMultiSelectDataConverter(ops);

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
				 * Input/output models.
				 */

				/*
				 * Helpers
				 */
				$scope.reset_model = null;
				$scope.check_all   = function () { amse.check_all(); };
				$scope.check_none  = function () { amse.uncheck_all(); };
				$scope.reset       = function () { amse.insert($scope.reset_model); };

				/*
				 * Search
				 */
				$scope.search = "";

				$scope.amse = amse;
				$scope.amssh = amssh;


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
				 * The entry point of the directive. This monitors the input data and
				 * decides when to populate the internal data model and how to do it.
				 */
				$scope.$watch('inputModel', function (_new, _old) {
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
