/*
 * Angular JS Multi Select
 * Creates a dropdown-like widget with check-able items.
 *
 * Project started on: 23 May 2015
 * Current version: 5.3.7
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

var angular_multi_select = angular.module('angular-multi-select', ['ng', 'angular.filter']);

angular_multi_select.directive('angularMultiSelect', ['$rootScope', '$sce', '$timeout', '$filter', '$interpolate', function ($rootScope, $sce, $timeout, $filter, $interpolate) {
	'use strict';
	return {
		restrict: 'AE',

		scope: {
			//api
			api: '=',

			// models
			inputModel: '=',
			outputModel: '=',

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

			attrs.idProperty = attrs.idProperty || "angular-multi-select-id";
			attrs.selectionMode = attrs.selectionMode || "multi";
			attrs.selectionMode = attrs.selectionMode.toLowerCase();
			attrs.helperElements = attrs.helperElements || "reset filter";
			attrs.searchProperty = attrs.searchProperty || "";
			attrs.hiddenProperty = attrs.hiddenProperty || "";
			attrs.buttonTemplate = attrs.buttonTemplate || "angular-multi-select-btn-count.htm";
			attrs.buttonLabelSeparator = attrs.buttonLabelSeparator || '[", ", ""]';
			attrs.minSearchLength = parseInt(attrs.minSearchLength, 10) || 3;

			$scope._shadowModel = [];
			$scope.filteredModel = [];
			$scope.searchInput = {
				value: ''  // Won't work if not an object. Why? Fuck me if I know...
			};
			$scope.kbFocus = [];
			$scope.kbFocusIndex = null;
			$scope.visible = false;
			$scope.tickProperty = attrs.tickProperty;
			$scope.idProperty = attrs.idProperty;
			$scope.groupProperty = attrs.groupProperty;
			$scope.itemLabel = element.attr(attrs.$attr.itemLabel);
			$scope._interpolatedItemLabel = $interpolate($scope.itemLabel);
			$scope.buttonLabel =  attrs.hasOwnProperty("buttonLabel") ? element.attr(attrs.$attr.buttonLabel) : "";
			$scope._interpolatedButtonLabel = $interpolate($scope.buttonLabel);
			$scope.buttonTemplate = attrs.buttonTemplate;
			$scope.buttonLabelSeparator = JSON.parse(attrs.buttonLabelSeparator);
			$scope.hiddenProperty = attrs.hiddenProperty;

			if($scope.api !== undefined) {
				$scope.api =  {
					select_all: function() {
						$scope.selectAll();
					},
					select_none: function() {
						$scope.selectNone();
					},
					select: function(id) {
						var item = $scope._getItemById(id);
						if(item !== null) {
							$scope.clickItem(item, true);
						}
					},
					reset: function() {
						$scope.reset();
					},
					clear: function() {
						$scope.clear();
					},
					open: function() {
						$timeout(function() {
							$scope.visible = true;
						}, 0);
					},
					close: function() {
						$timeout(function() {
							$scope.visible = false;
						}, 0);
					}
				};
			}

			$scope._trans = {
				selected: "selected",
				selectAll: "Select all",
				selectNone: "Select none",
				reset: "Reset",
				search: "Search..."
			};
			angular.extend($scope._trans, $scope.translation);

			$scope.lang = {
				selectAll: $sce.trustAsHtml($scope._trans.selectAll),
				selectNone: $sce.trustAsHtml($scope._trans.selectNone),
				reset: $sce.trustAsHtml($scope._trans.reset),
				search: $scope._trans.search
			};

			$scope.helperStatus     = {
				all     : attrs.helperElements.search(new RegExp(/\ball\b/)) !== -1 ? true : attrs.helperElements.search(new RegExp(/\bnoall\b/)) !== -1 ? false : attrs.selectionMode === "multi",
				none    : attrs.helperElements.search(new RegExp(/\bnone\b/)) !== -1 ? true : attrs.helperElements.search(new RegExp(/\bnonone\b/)) !== -1 ? false : attrs.selectionMode === "multi",
				reset   : attrs.helperElements.search(new RegExp(/\breset\b/)) !== -1 ? true : attrs.helperElements.search(new RegExp(/\bnoreset\b/)) === -1,
				filter  : attrs.helperElements.search(new RegExp(/\bfilter\b/)) !== -1 ? true : attrs.helperElements.search(new RegExp(/\bnofilter\b/)) === -1
			};

			$scope.Math = window.Math;

			/**
			 * Backport for Angular 1.3.x of Angular 1.4.x's "merge()" function.
			 * @param dst
			 * @param objs
			 * @param deep
			 * @returns {*}
			 */
			$scope.baseExtend = function(dst, objs, deep) {
				var h = dst.$$hashKey;

				for (var i = 0, ii = objs.length; i < ii; ++i) {
					var obj = objs[i];
					if (!angular.isObject(obj) && !angular.isFunction(obj)) continue;
					var keys = Object.keys(obj);
					for (var j = 0, jj = keys.length; j < jj; j++) {
						var key = keys[j];
						var src = obj[key];

						if (deep && angular.isObject(src)) {
							if (!angular.isObject(dst[key])) dst[key] = angular.isArray(src) ? [] : {};
							$scope.baseExtend(dst[key], [src], true);
						} else {
							dst[key] = src;
						}
					}
				}

				if (h) {
					dst.$$hashKey = h;
				} else {
					delete dst.$$hashKey;
				}
				return dst;
			};

			$scope.merge = function(dst) {
				return $scope.baseExtend(dst, [].slice.call(arguments, 1), true);
			};

			/**
			 * Helper function to inverse the result of a function called by a filter from a template
			 * @param f
			 * @returns {Function}
			 */
			$scope.not = function(f) {
				return function(v) {
					return !f(v);
				};
			};

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
				var _idx;
				if(angular.isArray(obj)) {
					var _objs = [];

					for(_idx in obj) {
						var _tmp_obj = $scope._walk(obj[_idx], key, fn);
						if (_tmp_obj !== null) {
							_objs.push(_tmp_obj);
						}
					}

					return _objs.length > 0 ? _objs : null;
				} else if(angular.isObject(obj)) {
					fn = fn || function(){ return true; };
					var should_be_returned = fn(obj);

					if (obj.hasOwnProperty(key) && angular.isArray(obj[key]) ) {
						var sub = [];

						for(_idx in obj[key]) {
							var new_obj = $scope._walk(obj[key][_idx], key, fn);
							if (new_obj !== null) {
								sub.push(new_obj);
							}
						}

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
				$scope.merge(dst, src);
			};

			/**
			 * Helper function that returns an item by matching the passed id.
			 * @param {String|int} id
			 * @param {mixed} model
			 * @returns {Object}
			 * @private
			 */
			$scope._getItemById = function(id, model) {
				/*
				 * This will make changes only to the filtered model, which is
				 * what 99% of the developers would expect. However, the other
				 * 1% might want to select and modify items from the shadow
				 * model. Does that makes sense? Should they be able to do that?
				 */
				model = model || $scope.filteredModel;

				var item = null;

				$scope._walk(model, attrs.groupProperty, function(_item) {
					if(_item[attrs.idProperty] === id) {
						item = _item;
					}
					return true;
				});

				return item;
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

			$scope._createButtonLabel = function(objs, index) {
				var _interpolate_obj = objs[index];
				var _parent = null;

				if($scope.hasOwnProperty("$parent") && $scope.$parent !== undefined) {
					_parent = $scope.$parent;

					while(_parent !== null) {

						var _scope = {};
						for(var p in _parent) {
							if(_parent.hasOwnProperty(p) && p !== "this" && p[0] !== "$" && typeof(_parent[p]) !== "function") {
								_scope[p] = _parent[p];
							}
						}

						_interpolate_obj = $scope.merge({}, _scope, _interpolate_obj);
						_parent = _parent.hasOwnProperty("$parent") && $scope.$parent !== undefined ? _parent.$parent : null;
					}
				}

				var _interpolated = $scope._interpolatedButtonLabel(_interpolate_obj);

				var _s = "";
				if(objs.length > 1) {
					_s += index == objs.length - 1 ? $scope.buttonLabelSeparator[1] : $scope.buttonLabelSeparator[0];
				}

				return $sce.trustAsHtml(_interpolated + _s);
			};

			/**
			 * Helper function to draw each item's label
			 * @param {Object} item
			 * @returns {String}
			 * @private
			 */
			$scope._createItemLabel = function(item) {
				var obj = item;
				var _parent = null;

				if($scope.hasOwnProperty("$parent") && $scope.$parent !== undefined) {
					_parent = $scope.$parent;

					while(_parent !== null) {

						var _scope = {};
						for(var p in _parent) {
							if(_parent.hasOwnProperty(p) && p !== "this" && p[0] !== "$" && typeof(_parent[p]) !== "function") {
								_scope[p] = _parent[p];
							}
						}

						obj = $scope.merge({}, _scope, obj);
						_parent = _parent.hasOwnProperty("$parent") && $scope.$parent !== undefined ? _parent.$parent : null;
					}
				}

				var _interpolated = $scope._interpolatedItemLabel(obj);

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
			 * Helper function that checks if a  single element is hidden.
			 * @param item
			 * @returns {boolean}
			 * @private
			 */
			$scope._isHidden = function(item) {
				return item[attrs.hiddenProperty] === true;
			};

			/**
			 * Helper function that checks if a single element is checked.
			 * @param {Object} item
			 * @returns {boolean}
			 * @private
			 */
			$scope._isChecked = function(item) {
				return item[attrs.tickProperty] === true;
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
			 * Helper function that ensures that all items have all properties.
			 * Because of this, we can stop using 'hasOwnProperty', which is very expensive.
			 * @param model
			 * @private
			 */
			$scope._enforceProps = function(model) {

				var ids = [];

				$scope._walk(model, attrs.groupProperty, function(_item){
					//ID property
					if(_item.hasOwnProperty(attrs.idProperty) === false || ids.indexOf(_item[attrs.idProperty]) !== -1) {
						_item[attrs.idProperty] = Math.floor((Math.random() * 100000000) + 1);
					}
					ids.push(_item[attrs.idProperty]);

					//Tick property
					_item[attrs.tickProperty] = _item[attrs.tickProperty] || false;

					//Hidden property
					_item[attrs.hiddenProperty] = _item[attrs.hiddenProperty] || false;
					return true;
				});
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
				for(var _idx in _leafs) {
					var _state = $scope._isChecked(_leafs[_idx]);

					if (_state) _n_checked++;

					if (_n_checked > 1 && attrs.selectionMode === "single") {
						_break = true;
						$scope._uncheckAll(model);
						break;
					}
				}

				if(_break === true) return;

				var _nodes  = $scope._getNodes(model);
				for(_idx in _nodes) {
					_nodes[_idx][attrs.tickProperty] = $scope._areAllChecked(_nodes[_idx]) !== 0;
				}
			};

			/**
			 * If an item without children is passed and if it's not
			 * checked or it doesn't have a check value, it will be
			 * checked; else it will be unchecked.
			 *
			 * If an item with children is passed, if none or more,
			 * but not all, of the children are checked, all children
			 * and the item itself will be checked. If all
			 * children are checked, then they, and the item itself,
			 * will be unchecked.
			 * @param {Object} item
			 * @private
			 */
			$scope._flipCheck = function(item) {
				if($scope._hasChildren(item) > 0) {
					var _state = Math.abs($scope._areAllChecked(item)) === 0;

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

				if(attrs.selectionMode === "single" && $scope._areAllChecked($scope._shadowModel) !== 0) {
					if (!(($scope._hasChildren(item, false) === 0 || $scope._hasChildren(item) === 1) && $scope._isChecked(item))) {
						$scope._uncheckAll($scope._shadowModel);
						$scope._uncheckAll($scope.filteredModel);
					}
				}

				$scope._flipCheck(item);

				//Close if in single mode
				if(attrs.selectionMode === "single") {
					$scope.visible = false;
				}

				//Run onItemClick callback
				$timeout(function() {
					$scope.onItemClick({
						item: angular.copy(item)
					});
				}, 0);
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
				$scope._enforceProps($scope._shadowModel);
				$scope._enforceChecks($scope._shadowModel);

				$scope.fillFilteredModel();
			};

			/**
			 * Called when the 'select all' button is clicked
			 */
			$scope.selectAll = function() {
				$scope._checkAll($scope.filteredModel);

				//Run onSelectAll callback
				$timeout(function() {
					$scope.onSelectAll();
				}, 0);
			};

			/**
			 * Called when the 'select none' button is clicked
			 */
			$scope.selectNone = function() {
				$scope._uncheckAll($scope.filteredModel);

				//Run onSelectNone callback
				$timeout(function() {
					$scope.onSelectNone();
				}, 0);
			};

			/**
			 * Called when the 'reset' button is clicked
			 */
			$scope.reset = function() {
				$scope.fillShadowModel();
				$timeout(function() {
					$scope.onReset();
				}, 0);
			};

			/**
			 * Called when the 'clear' button is clicked
			 */
			$scope.clear = function() {
				$scope.searchInput.value = "";

				//Run onClear callback
				$timeout(function() {
					$scope.onClear();
				}, 0);
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
			 * This is used to initially fill the shadow model and to
			 * handle input data change properly.
			 */
			$scope.$watch('inputModel', function(_new, _old) {
				if(!_new && angular.equals(_new, _old)) return;

				$scope.fillShadowModel();
			}, true);

			/**
			 * When the data in our filtered model changes, we want to do several things:
			 *
			 * - update the button label
			 * - update our output model
			 * - fill the keyboard focus array helper
			 */
			$scope.$watch('filteredModel', function(_new, _old) {
				if(_new) {
					$scope._enforceChecks($scope.filteredModel);
					$scope._syncModels($scope._shadowModel, $scope.filteredModel);

					var _tmp = $scope._walk(angular.copy($scope._shadowModel), attrs.groupProperty, function(_item) {
						$scope.kbFocus.push(_item[attrs.idProperty]);
						return $scope._isChecked(_item);
					});
					$scope.outputModel = _tmp === null ? [] : _tmp;

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
					$timeout(function() {
						$scope.onSearchChange({
							input: _new
						});
					}, 0);
				}
			});

			/**
			 * Watch for show/hide event
			 */
			$rootScope.$on('angular-multi-select-on-visible-change', function(msg, obj) {
				if($scope.$id !== obj.id && obj.visible === true && $scope.visible === true) {
					$scope.visible = !$scope.visible;
				}
			});
			$scope.$watch('visible', function(_new, _old) {
				if(!angular.equals(_new, _old) && _new === true) {

					//Make sure we focus the input when opened
					$scope.kbFocusIndex = $scope.kbFocus.indexOf("input") || 0;

					//Make sre to close other instances of the widget
					$rootScope.$emit('angular-multi-select-on-visible-change', {
						visible: $scope.visible,
						id: $scope.$id
					});

					//Listen for mouse events
					$scope.stopListeningMouseEvents = $scope.$on('angular-multi-select-click', function(msg, obj) {
						var inside = false;
						var el = obj.event.target;
						while(el) {
							if(angular.element(el).attr("angular-multi-select") !== undefined) {
								inside = true;
								break;
							}
							el = el.parentNode;
						}

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
								$scope.kbFocusIndex = $scope.kbFocus.length - 1;
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

					});

					//Run onOpen callback
					$timeout(function() {
						$scope._open_pos();
						$scope.onOpen();
					}, 0);
				} else if (!angular.equals(_new, _old) && _new === false){

					//Stop listening for mouse events
					$scope.stopListeningMouseEvents();
					$scope.stopListeningMouseEvents = null;

					//Stop listening for  keyboard events
					$scope.stopListeningKeyboardEvents();
					$scope.stopListeningKeyboardEvents = null;

					//Run onClose callback
					$timeout(function() {
						$scope._close_pos();
						$scope.onClose();
					}, 0);
				}
			});

			/**
			 * Destroy the directive and stop listening to events if the
			 * directive gets removed from the DOM
			 */
			element.on("$destroy", function() {
				if($scope.stopListeningMouseEvents) {
					$scope.stopListeningMouseEvents();
				}
				if($scope.stopListeningKeyboardEvents) {
					$scope.stopListeningKeyboardEvents();
				}
				$scope._shadowModel = [];
				$scope.filteredModel = [];
				$scope.$destroy();
			});

			/**
			 * Open the layer on top or to the left of the button if there is
			 * no enough space.
			 */
			$scope._open_pos = function() {
				var ams_layer = angular.element(element[0].querySelector(".ams_layer"));
				var _bounds = ams_layer[0].getBoundingClientRect();

				var body = document.body;
				var docElem = document.documentElement;
				var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
				var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

				var clientTop = docElem.clientTop || body.clientTop || 0;
				var clientLeft = docElem.clientLeft || body.clientLeft || 0;

				var _dist_to_top_border = Math.round(_bounds.top +  scrollTop - clientTop);
				var _dist_to_left_border = Math.round(_bounds.left + scrollLeft - clientLeft);

				var _dist_to_bottom_border = window.innerHeight - _dist_to_top_border - _bounds.height;
				var _dist_to_right_border = window.innerWidth - _dist_to_left_border - _bounds.width;

				var classes = "";
				if(_dist_to_bottom_border < 0 && _dist_to_top_border >= _bounds.height) {
					classes += "position_top ";
				}

				if(_dist_to_right_border < 0 && _dist_to_left_border > _bounds.width) {
					classes += "position_left ";
				}

				ams_layer.addClass(classes);
			};

			/**
			 * We need to remove the classes after closing and not before
			 * opening because we could hit a race condition while calculing
			 * the width/height of the layer
			 */
			$scope._close_pos = function() {
				var ams_layer = angular.element(element[0].querySelector(".ams_layer"));

				ams_layer.removeClass("position_top");
				ams_layer.removeClass("position_left");
			};

		} //end of link function
	}; //end of return
}]);

angular_multi_select.directive('angularMultiSelectKeyTrap', function() {
	'use strict';
	return function(scope, elem) {
		elem.bind('keydown', function(event) {
			scope.$broadcast('angular-multi-select-keydown', { event: event } );
		});
	};
});

angular_multi_select.directive('angularMultiSelectMouseTrap', function() {
	'use strict';
	return function(scope, elem) {
		elem.bind('click', function(event) {
			scope.$broadcast('angular-multi-select-click', { event: event } );
		});
	};
});

angular_multi_select.directive('setFocus', ["$timeout", function($timeout) {
	'use strict';
	return function(scope, element, attrs) {
		attrs.setFocus = attrs.setFocus || false;
		scope.$watch(attrs.setFocus, function(_new) {
			$timeout(function() {
				if(_new) {
					element[0].focus();
				} else {
					element[0].blur();
				}
			});
		}, true);
	};
}]);

angular_multi_select.run(['$templateCache', function($templateCache) {
	'use strict';
	var template = "" +
		"<div class='ams_btn_template_repeat'>{{ Math.abs(_areAllChecked(filteredModel)) }} {{ _trans.selected }}</div>" +
		"<span class='caret'></span>";
	$templateCache.put('angular-multi-select-btn-count.htm', template);
}]);

angular_multi_select.run(['$templateCache', function($templateCache) {
	'use strict';
	var template = "" +
		"<div class='ams_btn_template_repeat' ng-show='(_getLeafs(outputModel) | filter:search ).length === 0'>0 {{ _trans.selected }}</div>" +
		"<div class='ams_btn_template_repeat' ng-repeat='obj in objs = (_getLeafs(outputModel) | filter:search )' ng-bind-html='_createButtonLabel(objs, \$index)'></div>" +
		"<span class='caret'></span>";
	$templateCache.put('angular-multi-select-btn-data.htm', template);
}]);

angular_multi_select.run(['$templateCache', function($templateCache) {
	'use strict';
	var template = "" +
		"<div class='ams_item' ng-click='clickItem(item, true);' ng-class='{ams_selected: item[tickProperty], ams_group:_hasChildren(item, false) > 0, ams_focused: kbFocus[kbFocusIndex] === item[idProperty]}'>" +
			"<div ng-bind-html='_createItemLabel(item)'></div>" +
			"<span class='ams_tick' ng-if='item[tickProperty] === true'></span>" +
		"</div>" +

		"<ul ng-if='item.sub'>" +
			"<li ng-repeat='item in item[groupProperty] | filter: not(_isHidden)' ng-include=\"'angular-multi-select-item.htm'\"></li>" +
		"</ul>";
	$templateCache.put('angular-multi-select-item.htm', template);
}]);

angular_multi_select.run(['$templateCache', function($templateCache) {
	'use strict';
	var template =
		'<span class="ams">' +
			// main button
			"<button class='ams_btn' type='button' ng-click='visible = !visible'><div class='ams_btn_template' ng-include src='buttonTemplate'></div></button>" +
			// overlay layer
			'<div class="ams_layer" ng-show="visible">' +
				// container of the helper elements
				'<div class="ams_helpers_container" ng-if="helperStatus.filter || helperStatus.all || helperStatus.none || helperStatus.reset ">' +
					// container of the first 3 buttons, select all, none and reset
					'<div class="ams_row" ng-if="helperStatus.all || helperStatus.none || helperStatus.reset ">' +
						// select all
						'<button type="button" class="ams_helper_btn ams_selectall"' +
							'ng-if="helperStatus.all" ng-click="selectAll()" ng-bind-html="lang.selectAll" set-focus="kbFocus[kbFocusIndex] === \'all\'"">' +
						'</button>'+
						// select none
						'<button type="button" class="ams_helper_btn ams_selectnone"' +
							'ng-if="helperStatus.none" ng-click="selectNone()" ng-bind-html="lang.selectNone" set-focus="kbFocus[kbFocusIndex] === \'none\'">' +
						'</button>'+
						// reset
						'<button type="button" class="ams_helper_btn reset ams_reset"' +
							'ng-if="helperStatus.reset" ng-click="reset()" ng-bind-html="lang.reset" set-focus="kbFocus[kbFocusIndex] === \'reset\'">' +
						'</button>' +
					'</div>' +
					// the search box
					'<div class="ams_row ams_search" ng-if="helperStatus.filter">' +
						// textfield
						'<input placeholder="{{ lang.search }}" type="text"' +
							'ng-model="searchInput.value" class="inputFilter ams_filter" set-focus="kbFocus[kbFocusIndex] === \'input\'"' +
						'/>' +
						// clear button
						'<button type="button" class="ams_helper_btn ams_clear" ng-click="clear()" set-focus="kbFocus[kbFocusIndex] === \'clear\'"></button> ' +
					'</div> ' +
				'</div> ' +

				// selection items
				'<div class="ams_items_container">' +
					"<ul>" +
						"<li ng-repeat='item in filteredModel | filter: not(_isHidden)' ng-include=\"'angular-multi-select-item.htm'\"></li>" +
					"</ul>" +
				'</div>'+
			'</div>'+
		'</span>';
	$templateCache.put('angular-multi-select.htm', template);
}]);
