/*
 * Angular JS Multi Select
 * Creates a dropdown-like widget with check-able items.
 *
 * Project started on: 23 May 2015
 * Current version: 4.0.6
 *
 * Released under the MIT License
 * --------------------------------------------------------------------------------
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Alexander Nestorov (https://github.com/alexandernst)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * --------------------------------------------------------------------------------
 */

'use strict';

var angular_multi_select = angular.module('angular-multi-select', ['ng', 'angular.filter']);

angular_multi_select.directive('angularMultiSelect', ['$sce', '$timeout', '$filter', '$interpolate', function ($sce, $timeout, $filter, $interpolate) {
	return {
		restrict: 'AE',

		scope: {
			// models
			inputModel: '=',
			outputModel: '=',

			// settings based on attribute
			isDisabled: '=',

			// callbacks
			onClear: '&',
			onClose: '&',
			onSearchChange: '&',
			onItemClick: '&',
			onOpen: '&',
			onReset: '&',
			onSelectAll: '&',
			onSelectNone: '&',

			// i18n
			translation: '='
		},

		templateUrl: 'angular-multi-select.htm',

		link: function ($scope, element, attrs) {

			$scope._shadowModel = [];
			$scope.filteredModel = [];
			$scope.searchInput = {
				value: ''  // Won't work if not an object. Why? Fuck me if I know...
			};
			attrs.idProperty = attrs.idProperty || "angular-multi-select-id";
			attrs.selectionMode = attrs.selectionMode || "multi";
			attrs.selectionMode = attrs.selectionMode.toLowerCase();
			attrs.helperElements = attrs.helperElements || "reset filter";
			attrs.searchProperty = attrs.searchProperty || "";
			attrs.minSearchLength = parseInt(attrs.minSearchLength, 10) || 3;

			$scope.icon = {
				selectAll: '&#10003;',
				selectNone: '&times;',
				reset: '&#8630;',
				tickMark: $sce.trustAsHtml('&#10003;')
			};

			$scope._trans = {
				selectAll: "Select all",
				selectNone: "Select none",
				reset: "Reset",
				search: "Search..."
			};
			angular.extend($scope._trans, $scope.translation);

			$scope.lang = {
				selectAll: $sce.trustAsHtml($scope.icon.selectAll + '&nbsp;&nbsp;' + $scope._trans.selectAll),
				selectNone: $sce.trustAsHtml($scope.icon.selectNone + '&nbsp;&nbsp;' + $scope._trans.selectNone),
				reset: $sce.trustAsHtml($scope.icon.reset + '&nbsp;&nbsp;' + $scope._trans.reset),
				search: $scope._trans.search
			};

			$scope.helperStatus     = {
				all     : attrs.helperElements.search(new RegExp(/\ball\b/)) !== -1 ? true : attrs.helperElements.search(new RegExp(/\bnoall\b/)) !== -1 ? false : attrs.selectionMode === "multi",
				none    : attrs.helperElements.search(new RegExp(/\bnone\b/)) !== -1 ? true : attrs.helperElements.search(new RegExp(/\bnonone\b/)) !== -1 ? false : attrs.selectionMode === "multi",
				reset   : attrs.helperElements.search(new RegExp(/\breset\b/)) !== -1 ? true : attrs.helperElements.search(new RegExp(/\bnoreset\b/)) === -1,
				filter  : attrs.helperElements.search(new RegExp(/\bfilter\b/)) !== -1 ? true : attrs.helperElements.search(new RegExp(/\bnofilter\b/)) === -1
			};

			$scope.kbFocus = [];
			$scope.kbFocusIndex = null;
			$scope.visible = false;
			$scope.buttonLabel = '';
			$scope.tickProperty = attrs.tickProperty;
			$scope.idProperty = attrs.idProperty;
			$scope.groupProperty = attrs.groupProperty;
			$scope.itemLabel = attrs.itemLabel;

			/**
			 * Recursive function for iterating nested objects.
			 * This function will take an array `obj` of objects and will
			 * traverse all object and nested object that have a property
			 * called `key`, if that property's value is an array.
			 * A filter function (`fn`) can be passed. If that is the case,
			 * the filter function will be passed each object. If `true` is
			 * returned, the object won't be filtered, otherwise it will be
			 * filtered only if that object doesn't contain any nested objects
			 * that will be included (that is, it will be filtered only if
			 * `fn` returned `false` for all nested objects of the current
			 * object).
			 * @param {Object|Array} obj
			 * @param {String} key
			 * @param {function(Object)} fn
			 * @returns {*}
			 * @private
			 */
			$scope._walk = function(obj, key, fn) {
				if(angular.isArray(obj)) {
					var _objs = [];

					angular.forEach(obj, function(_obj) {
						var _tmp_obj = $scope._walk(_obj, key, fn);
						if(_tmp_obj !== null) {
							_objs.push(_tmp_obj);
						}
					});

					return _objs.length > 0 ? _objs : null;
				} else if(angular.isObject(obj)) {
					fn = fn || function(){ return true; };
					var should_be_returned = fn(obj);

					if (obj.hasOwnProperty(key) && angular.isArray(obj[key]) ) {
						var sub = [];
						angular.forEach(obj[key], function(v) {
							var new_obj = $scope._walk(v, key, fn);
							if( new_obj !== null ) {
								sub.push( new_obj );
							}
						});
						if(sub.length !== obj[key].length){
							obj[key] = sub;
						}
						should_be_returned = sub.length > 0;
					}

					return should_be_returned ? obj : null;
				}
			};

			/**
			 * Helper function that syncs the changes from modelA to modelB.
			 * @param {Array} dst
			 * @param {Array} src
			 * @private
			 */
			$scope._syncModels = function(dst, src) {
				$scope._walk(src, attrs.groupProperty, function(item) {
					$scope._walk(dst, attrs.groupProperty, function(_item) {
						if(_item[attrs.idProperty] === item[attrs.idProperty]) {
							//Don't use extend here as it's really expensive and because
							//the only thing that can change in an item is it's tick state.
							_item[attrs.tickProperty] = item[attrs.tickProperty];
						}
						return true;
					});
					return true;
				});
			};

			/**
			 * Helper function that will ensure that all items
			 * have an unique ID.
			 * @param {Array} model
			 * @private
			 */
			$scope._enforceIDs = function(model) {
				var ids = [];

				$scope._walk(model, attrs.groupProperty, function(_item) {
					if(_item.hasOwnProperty(attrs.idProperty) === false || ids.indexOf(_item[attrs.idProperty]) !== -1) {
						_item[attrs.idProperty] = Math.floor((Math.random() * 100000000) + 1);
					}
					ids.push(_item[attrs.idProperty]);
					return true;
				});
			};

			/**
			 * Helper function used to get the parent of an item.
			 * @param {Array} model
			 * @param {Object} item
			 * @returns {Object}
			 * @private
			 */
			$scope._getParent = function(model, item) {
				var parent = null;
				var _found = false;
				var _lastParent = null;

				$scope._walk(model, attrs.groupProperty, function(_item) {

					if(_found === true) return true;

					if($scope._hasChildren(_item, false) > 0 && _item[attrs.idProperty] !== item[attrs.idProperty]) {
						_lastParent = _item;
					}

					if(_item[attrs.idProperty] === item[attrs.idProperty]) {
						parent = _lastParent;
						_found = true;
					}

					return true;
				});

				return parent;
			};

			/**
			 * Helper function that returns all the leafs of a model.
			 * @param {Array} model
			 * @returns {Array}
			 * @private
			 */
			$scope._getLeafs = function(model) {
				var _leafs = [];

				$scope._walk(model, attrs.groupProperty, function(_item) {
					if($scope._hasChildren(_item, false) === 0) {
						_leafs.push(_item);
					}
					return true;
				});

				return _leafs;
			};

			/**
			 * Helper function that returns all the nodes of a model,
			 * that is, all the items that have children.
			 * @param {Array} model
			 * @returns {Array}
			 * @private
			 */
			$scope._getNodes = function(model) {
				var _nodes = [];

				$scope._walk(model, attrs.groupProperty, function(_item) {
					if($scope._hasChildren(_item, false) > 0) {
						_nodes.push(_item);
					}
					return true;
				});

				return _nodes;
			};

			/**
			 * Helper function to draw each item's label
			 * @param {Object} item
			 * @returns {String}
			 * @private
			 */
			$scope._createLabel = function(item) {

				var _fmt = attrs.itemLabel;

				//TODO: It would be nicer to make this "the Angular way"
				//http://stackoverflow.com/questions/30503000/
				/*
				var _s = $interpolate.startSymbol();
				var _e = $interpolate.endSymbol();

				$interpolate.startSymbol("{|");
				$interpolate.endSymbol("|}");
				*/

				_fmt = _fmt.replace(/\{\|/g, "{{");
				_fmt = _fmt.replace(/\|\}/g, "}}");

				var _interpolated = $interpolate(_fmt)(item);

				/*
				$interpolate.startSymbol(_s);
				$interpolate.endSymbol(_e);
				*/

				return $sce.trustAsHtml(_interpolated);
			};

			/**
			 * Helper function that returns the number of children that
			 * the passed item contains. If `recursive` is set to false,
			 * the function will return 1 if the item contains any number
			 * of children, without traversing all of them.
			 *
			 * @param {Object} item
			 * @param {boolean=} recursive
			 * @returns {number}
			 * @private
			 */
			$scope._hasChildren = function(item, recursive) {
				recursive = recursive || false;

				if(
					recursive === false &&
					item.hasOwnProperty(attrs.groupProperty) &&
					angular.isArray(item[attrs.groupProperty]) &&
					item[attrs.groupProperty].length > 0
				) {
					return 1;
				}

				var _n_children = -1;

				$scope._walk(item, attrs.groupProperty, function() {
					_n_children++;
					return true;
				});

				return _n_children;
			};

			/**
			 * Helper function that checks if a single element
			 * is checked.
			 * @param {Object} item
			 * @returns {boolean}
			 * @private
			 */
			$scope._isChecked = function(item) {
				return !!(item.hasOwnProperty(attrs.tickProperty) && item[attrs.tickProperty] === true);
			};

			/**
			 * Helper function that checks if all nested objects are
			 * checked. Returns:
			 * - +N if all are checked, N being the number of checked items.
			 * - 0 if none is checked.
			 * - -N if some are checked, N being the number of checked items.
			 *
			 * Note that this function won't count as checked the items that
			 * have children, no matter how many of their children are checked.
			 * @param {Array|Object} item
			 * @returns {number}
			 * @private
			 */
			$scope._areAllChecked = function(item) {
				var _checked = 0, _total = 0;

				$scope._walk(item, attrs.groupProperty, function(_item) {
					if($scope._hasChildren(_item, false) === 0) {
						if($scope._isChecked(_item)) {
							_checked++;
						}
						_total++;
					}
					return true;
				});

				return _total === _checked ? _checked : _checked > 0 ? -_checked : 0;
			};

			/**
			 * Helper function that will traverse all items and
			 * make sure that the following rules are applied:
			 *
			 * - if in 'single' select mode, none or 1 item is checked. If
			 *   that is not the case, all items will be unchecked.
			 * - if all children of an item are checked, the item itself is
			 *   checked (and vice versa).
			 * @param {Array} model
			 * @private
			 */
			$scope._enforceChecks = function(model) {
				var _n_checked = 0;
				var _leafs = $scope._getLeafs(model);

				var _break = false;
				angular.forEach(_leafs, function(_item) {
					if(_break === true) return;
					var _state = $scope._isChecked(_item);

					if(_state) _n_checked++;

					if(_n_checked > 1 && attrs.selectionMode === "single") {
						_break = true;
						$scope._uncheckAll(model);
					}
				});

				if(_break === true) return;

				var _nodes  = $scope._getNodes(model);
				angular.forEach(_nodes, function(_node) {
					_node[attrs.tickProperty] = $scope._areAllChecked(_node) !== 0;
				});
			};

			/**
			 * If an item without children is passed and if it's not
			 * checked or it doesn't have a check value, it will be
			 * checked; else it will be unchecked.
			 *
			 * If an item with children is passed, if none or more,
			 * but not all, of the children is checked, all children
			 * and the item itself will be set to true. If all
			 * children are checked, then they, and the item itself,
			 * will be unchecked.
			 * @param {Object} item
			 * @private
			 */
			$scope._flipCheck = function(item) {
				if($scope._hasChildren(item) > 0) {
					var _state = !($scope._areAllChecked(item) > 0);

					$scope._walk(item, attrs.groupProperty, function(_item) {
						_item[attrs.tickProperty] = _state;
						return true;
					});
				} else {
					item[attrs.tickProperty] = !$scope._isChecked(item);
				}
			};

			/**
			 * Helper function to uncheck all items
			 * @param {Array} model
			 * @private
			 */
			$scope._uncheckAll = function(model) {
				$scope._walk(model, attrs.groupProperty, function(item){
					item[attrs.tickProperty] = false;
					return true;
				});
			};

			/**
			 * Helper function to check all items
			 * @param {Array} model
			 * @private
			 */
			$scope._checkAll = function(model) {
				$scope._walk(model, attrs.groupProperty, function(item){
					item[attrs.tickProperty] = true;
					return true;
				});
			};

			/**
			 * Call this function when an item is clicked
			 * @param {Object} item
			 * @param {boolean=} resetFocus
			 */
			$scope.clickItem = function(item, resetFocus) {
				if(resetFocus === true) {
					$scope.kbFocusIndex = null;
				}

				if(attrs.selectionMode === 'single' && $scope._areAllChecked($scope._shadowModel) !== 0) {
					if (!(($scope._hasChildren(item, false) === 0 || $scope._hasChildren(item) === 1) && $scope._isChecked(item))) {
						$scope._uncheckAll($scope._shadowModel);
						$scope._uncheckAll($scope.filteredModel);
					}
				}

				$scope._flipCheck(item);
				$scope._enforceChecks($scope.filteredModel);

				//Run onItemClick callback
				$scope.onItemClick({
					item: angular.copy(item)
				});
			};

			/**
			 * Returns true if [attrs.searchProperty} matches the search input field (latinized, fuzzy match);
			 * @param {Object} obj
			 * @returns {boolean}
			 * @private
			 */
			$scope._filter = function(obj) {
				if(attrs.searchProperty === "" || $scope.searchInput.value === undefined || $scope.searchInput.value === "") {
					return true;
				}

				/**
				 * TODO: While this works, it's extremely slow. Waiting for
				 * https://github.com/a8m/angular-filter/issues/107 to get
				 * implemented so we can refactor this a little bit.
				 */
				var tmp_obj = angular.extend({}, obj);
				tmp_obj[attrs.searchProperty] = $filter('latinize')(tmp_obj[attrs.searchProperty]);

				var fltr = $scope.searchInput.value;
				fltr = $filter('latinize')(fltr);

				var match = $filter('fuzzyBy')([tmp_obj], attrs.searchProperty, fltr);
				return match.length > 0;
			};

			/**
			 * This will the ran when we get input data or when the
			 * input data is changed.
			 */
			$scope.fillShadowModel = function() {
				$scope._shadowModel = angular.copy($scope.inputModel);
				$scope._enforceIDs($scope._shadowModel);
				$scope._enforceChecks($scope._shadowModel);

				$scope.fillFilteredModel();
			};

			/**
			 * Called when the 'select all' button is clicked
			 */
			$scope.selectAll = function() {
				$scope._checkAll($scope.filteredModel);

				//Run onSelectAll callback
				$scope.onSelectAll();
			};

			/**
			 * Called when the 'select none' button is clicked
			 */
			$scope.selectNone = function() {
				$scope._uncheckAll($scope.filteredModel);

				//Run onSelectNone callback
				$scope.onSelectNone();
			};

			/**
			 * Called when the 'reset' button is clicked
			 */
			$scope.reset = function() {
				$scope.onReset();
				$scope.fillShadowModel();
			};

			/**
			 * Called when the 'clear' button is clicked
			 */
			$scope.clear = function() {
				$scope.searchInput.value = "";

				//Run onClear callback
				$scope.onClear();
			};

			/**
			 * When a selection or a filter change happens, we re-fill
			 * the filtered model and apply the filtering logic.
			 * Note that we don't perform neither an enforce-ID nor enforce-checks
			 * logic here as the shadow model (_shadowModel) is guaranteed to
			 * be sanitized.
			 */
			$scope.fillFilteredModel = function() {
				$scope.filteredModel = angular.copy($scope._shadowModel);
				$scope.filteredModel = $scope._walk($scope.filteredModel, attrs.groupProperty, $scope._filter);
			};

			/**
			 * When the data in our filtered model changes, we want to do several things:
			 *
			 * - update the button label
			 * - update our output model
			 * - fill the keyboard focus array helper
			 */
			$scope.$watch('filteredModel', function(_new) {
				if(_new) {
					var _n_selected = Math.abs($scope._areAllChecked($scope.filteredModel));
					$scope.buttonLabel =  _n_selected + " selected";
					$scope.buttonLabel = $sce.trustAsHtml( $scope.buttonLabel + '<span class="caret"></span>' );

					$scope._syncModels($scope._shadowModel, $scope.filteredModel);

					$scope.outputModel = $scope._walk(angular.copy($scope._shadowModel), attrs.groupProperty, function(_item) {
						$scope.kbFocus.push(_item[attrs.idProperty]);
						return $scope._isChecked(_item);
					});

					$scope.kbFocus = [];
					if($scope.helperStatus.all === true) {
						$scope.kbFocus.push("all");
					}
					if($scope.helperStatus.none === true) {
						$scope.kbFocus.push("none");
					}
					if($scope.helperStatus.reset === true) {
						$scope.kbFocus.push("reset");
					}
					if($scope.helperStatus.filter === true) {
						$scope.kbFocus.push("input");
						$scope.kbFocus.push("clear");
					}
					$scope._walk($scope.filteredModel, attrs.groupProperty, function(_item) {
						$scope.kbFocus.push(_item[attrs.idProperty]);
						return true;
					});
				}
			}, true);

			/**
			 * Watch for search input and trigger a re-fill of the filtered model.
			 * The shadow model (_shadowModel) is not modified here because we want
			 * to preserve the original state of the inputModel ('reset' button functionality)
			 */
			$scope.$watch('searchInput.value', function(_new, _old) {
				if(!angular.equals(_new, _old)) {
					if(_new.length > attrs.minSearchLength || (_new.length < _old.length && _old.length >= 0) ) {
						$scope.kbFocusIndex = null;
						$scope.fillFilteredModel();
					}

					//Run onSearchChange callback
					$scope.onSearchChange({
						input: _new
					});
				}
			});

			/**
			 * Watch for show/hide event
			 */
			$scope.$watch('visible', function(_new, _old) {
				if(!angular.equals(_new, _old) && _new === true) {

					//Make sure we focus the input when opened
					$scope.kbFocusIndex = $scope.kbFocus.indexOf("input") || 0;

					//Listen for mouse events
					$scope.stopListeningMouseEvents = $scope.$on('angular-multi-select-click', function(msg, obj) {
						var inside = false;
						angular.forEach($(obj.event.target).parents(), function(parent) {
							if(inside === true) return;
							if($(parent).attr("angular-multi-select") !== undefined) {
								inside = true;
							}
						});
						if(inside === false){
							$scope.visible = false;
							$scope.$apply();
						}
					});

					//Listen for keyboard events
					$scope.stopListeningKeyboardEvents = $scope.$on('angular-multi-select-keydown', function(msg, obj) {
						var key = obj.event.keyCode ? obj.event.keyCode : obj.event.which;
						var _current_index = $scope.kbFocusIndex;
						var _refocus_input = false;

						if(key === 27) {
							//ESC should close
							$scope.visible = false;
						} else if(key === 13 || key === 32) {
							//(Un)select the element
							var _current = $scope.kbFocus[$scope.kbFocusIndex];
							if(angular.isNumber(_current)) {
								$scope._walk($scope.filteredModel, attrs.groupProperty, function(item){
									if(item[attrs.idProperty] === _current) {
										$scope.clickItem(item);
									}
									return true;
								});
							}
						} else if(key === 40 || key === 39 || (!obj.event.shiftKey && key == 9)) {
							//Next element ( tab, down & right key )
							if ($scope.kbFocusIndex === null) {
								$scope.kbFocusIndex = -1;
							}

							if($scope.kbFocusIndex < $scope.kbFocus.length - 1 ) {
								$scope.kbFocusIndex++;
							} else {
								$scope.kbFocusIndex = 0;
							}
						} else if(key === 38 || key === 37 || (obj.event.shiftKey && key == 9)) {
							//Prev element ( shift+tab, up & left key )
							if ($scope.kbFocusIndex === null) {
								$scope.kbFocusIndex = 1;
							}

							if($scope.kbFocusIndex > 0) {
								$scope.kbFocusIndex--;
							} else {
								$scope.kbFocusIndex = $scope.kbFocus.length - 1
							}
						} else {
							_refocus_input = true;
						}

						$scope.$apply();

						if(_refocus_input === true) {
							$timeout(function() {
								$scope.kbFocusIndex = _current_index;
							}, 0);
						}

						//Run onOpen callback
						$scope.onOpen();
					});

				} else if (!angular.equals(_new, _old) && _new === false){

					//Stop listening for mouse events
					$scope.stopListeningMouseEvents();
					$scope.stopListeningMouseEvents = null;

					//Stop listening for  keyboard events
					$scope.stopListeningKeyboardEvents();
					$scope.stopListeningKeyboardEvents = null;

					//Run onClose callback
					$scope.onClose();
				}
			});

			$scope.fillShadowModel();
		}
	}
}]);

angular_multi_select.directive('angularMultiSelectKeyTrap', function() {
	return function(scope, elem) {
		elem.bind('keydown', function(event) {
			scope.$broadcast('angular-multi-select-keydown', { event: event } );
		});
	};
});

angular_multi_select.directive('angularMultiSelectMouseTrap', function() {
	return function(scope, elem) {
		elem.bind('click', function(event) {
			scope.$broadcast('angular-multi-select-click', { event: event } );
		});
	};
});

angular_multi_select.directive('setFocus', function($timeout) {
	return function(scope, element, attrs) {
		attrs.setFocus = attrs.setFocus || false;
		scope.$watch(attrs.setFocus, function(_new) {
			$timeout(function() {
				if(_new) {
					element.focus();
				} else {
					element.blur();
				}
			});
		},true);
	};
});

angular_multi_select.run(['$templateCache', function($templateCache) {
	var template = "" +
		"<div class='multiSelectItem' ng-click='clickItem(item, true);' ng-class='{selected: item[tickProperty], multiSelectGroup:_hasChildren(item, false) > 0, multiSelectFocus: kbFocus[kbFocusIndex] === item[idProperty]}'>" +
			"<div ng-bind-html='_createLabel(item)'></div>" +
			"<span class='tickMark' ng-if='item[tickProperty] === true' ng-bind-html='icon.tickMark'></span>"+
		"</div>" +

		"<ul ng-if='item.sub'>" +
			"<li ng-repeat='item in item[groupProperty]' ng-include=\"'angular-multi-select-item.htm'\" ></li>" +
		"</ul>" +
		"";
	$templateCache.put('angular-multi-select-item.htm', template);
}]);

angular_multi_select.run(['$templateCache', function($templateCache) {
	var template =
		'<span class="multiSelect inlineBlock">' +
			// main button
			'<button type="button" ng-click="visible = !visible" ng-bind-html="buttonLabel"></button>' +
			// overlay layer
			'<div class="checkboxLayer" ng-show="visible">' +
				// container of the helper elements
				'<div class="helperContainer" ng-if="helperStatus.filter || helperStatus.all || helperStatus.none || helperStatus.reset ">' +
					// container of the first 3 buttons, select all, none and reset
					'<div class="line" ng-if="helperStatus.all || helperStatus.none || helperStatus.reset ">' +
						// select all
						'<button type="button" class="helperButton"' +
							'ng-disabled="isDisabled" ng-if="helperStatus.all" ng-click="selectAll()" ng-bind-html="lang.selectAll" set-focus="kbFocus[kbFocusIndex] === \'all\'"">' +
						'</button>'+
						// select none
						'<button type="button" class="helperButton"' +
							'ng-disabled="isDisabled" ng-if="helperStatus.none" ng-click="selectNone()" ng-bind-html="lang.selectNone" set-focus="kbFocus[kbFocusIndex] === \'none\'">' +
						'</button>'+
						// reset
						'<button type="button" class="helperButton reset"' +
							'ng-disabled="isDisabled" ng-if="helperStatus.reset" ng-click="reset()" ng-bind-html="lang.reset" set-focus="kbFocus[kbFocusIndex] === \'reset\'">'+
						'</button>' +
					'</div>' +
					// the search box
					'<div class="line" style="position:relative" ng-if="helperStatus.filter">'+
						// textfield
						'<input placeholder="{{ lang.search }}" type="text"' +
							'ng-model="searchInput.value" class="inputFilter" set-focus="kbFocus[kbFocusIndex] === \'input\'"'+
						'/>'+
						// clear button
						'<button type="button" class="clearButton" ng-click="clear()" set-focus="kbFocus[kbFocusIndex] === \'clear\'">×</button> '+
					'</div> '+
				'</div> '+

				// selection items
				'<div class="checkBoxContainer">'+
					"<ul>" +
						"<li ng-repeat='item in filteredModel' ng-include=\"'angular-multi-select-item.htm'\"></li>" +
					"</ul>" +
				'</div>'+
			'</div>'+
		'</div>'+
	'</span>';
	$templateCache.put('angular-multi-select.htm', template);
}]);
