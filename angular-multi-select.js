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

var angular_multi_select = angular.module( 'angular-multi-select', ['ng'] );

angular_multi_select.directive( 'angularMultiSelect' , [ '$sce', '$timeout', function ( $sce, $timeout ) {
	return {
		restrict: 'AE',

		scope: {
			// models
			inputModel      : '=',

			// settings based on attribute
			isDisabled      : '=',

			// callbacks
			onClear         : '&',
			onClose         : '&',
			onItemClick     : '&',
			onOpen          : '&',
			onReset         : '&',
			onSelectAll     : '&',
			onSelectNone    : '&',

			// i18n
			translation     : '='
		},

		templateUrl: 'angular-multi-select.htm',

		link: function ( $scope, element, attrs ) {

			/**
			 * Globally used variables.
			 */
			$scope._shadowModel = [];
			$scope.filteredModel = [];
			$scope.searchInput = { value: '' }; // Won't work if not an object. Why? Fuck me if I know...
			attrs.idProperty = attrs.idProperty || "angular-multi-select-id";
			attrs.selectionMode = attrs.selectionMode || "multi";
			attrs.selectionMode = attrs.selectionMode.toLowerCase();
			$scope.helperStatus     = {
				all     : attrs.selectionMode === "multi",
				none    : attrs.selectionMode === "multi",
				reset   : true,
				filter  : true
			};
			$scope.visible = false;
			$scope.buttonLabel = '';
			$scope.tickProperty = attrs.tickProperty;

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
			 * @param obj
			 * @param key
			 * @param fn (obj)
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
			 * @param modelA
			 * @param modelB
			 * @private
			 */
			$scope._syncModels = function(modelA, modelB) {

			};

			/**
			 * Helper function that will ensure that all items
			 * have an unique ID.
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
			 * @param model
			 * @param item
			 * @returns {*}
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
			 * @param model
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
			 * @param model
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
			 * Helper function that returns the number of children that
			 * the passed item contains. If `recursive` is set to false,
			 * the function will return 1 if the item contains any number
			 * of children, without traversing all of them.
			 *
			 * @param item
			 * @param recursive
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
			 * @param item
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
			 * @param item
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
			 * @param item
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
			 * @private
			 */
			$scope._uncheckAll = function(model){
				$scope._walk(model, attrs.groupProperty, function(item){
					item[attrs.tickProperty] = false;
					return true;
				});
			};

			//Call this function when an item is clicked
			$scope.clickItem = function(item) {
				if(attrs.selectionMode === 'single') {
					if(($scope._hasChildren(item, false) === 0 || $scope._hasChildren(item) === 1) && $scope._isChecked(item)) {
						$scope._flipCheck(item);
					} else {
						$scope._uncheckAll($scope.filteredModel);
						$scope._flipCheck(item);
					}
				} else {
					$scope._flipCheck(item);
				}

				//Trigger the onItemClick callback
				$timeout(function() {
					$scope.onItemClick({
						data: angular.copy(item)
					});
				}, 0);
			};

			$scope.fillInternalModel = function() {
				console.log("fillInternalModel!");

				$scope._shadowModel = [];

				var filter_fn = function(obj) {
					//console.log(obj);
					if($scope.searchInput.value === undefined || $scope.searchInput.value === "") {
						return true;
					}
					return obj.name.indexOf($scope.searchInput.value) !== -1;
					//return true;
				};

				$scope._shadowModel = angular.copy($scope.inputModel);
				$scope._shadowModel = $scope._walk($scope._shadowModel, attrs.groupProperty, filter_fn);
				$scope._enforceIDs($scope._shadowModel);
				$scope.filteredModel = angular.copy($scope._shadowModel);
				delete $scope._shadowModel;
			};


			$scope.fillInternalModel();

			$scope.$watch('filteredModel', function(_new) {
				if(_new) {
					$scope._enforceChecks($scope.filteredModel);

					var _n_selected = Math.abs($scope._areAllChecked($scope.filteredModel));
					$scope.buttonLabel =  _n_selected + " selected";
					$scope.buttonLabel = $sce.trustAsHtml( $scope.buttonLabel + '<span class="caret"></span>' );
				}
			}, true);

			//Watch for search input
			$scope.$watch('searchInput.value', function(_new, _old) {
				if(!angular.equals(_new, _old)) {
					$scope.fillInternalModel();
				}
			});

			//Watch for show/hide event
			$scope.$watch('visible', function(_new, _old) {
				if(!angular.equals(_new, _old) && _new === true) {

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

						//ESC should close
						if ( key === 27 ) {

						// next element ( tab, down & right key )
						} else if ( key === 40 || key === 39 || ( !obj.event.shiftKey && key == 9 ) ) {

						// prev element ( shift+tab, up & left key )
						} else if ( key === 38 || key === 37 || ( obj.event.shiftKey && key == 9 ) ) {

						}
						console.log("kb!");
						/*
						$scope.keys.forEach(function(o) {
							if(o.code !== obj.event.code) {
								return;
							}
							o.action();
							$scope.$apply();
						});
						*/
					});

				} else if (!angular.equals(_new, _old) && _new === false){

					//Stop listening for mouse events
					$scope.stopListeningMouseEvents();
					$scope.stopListeningMouseEvents = null;

					//Stop listening for  keyboard events
					$scope.stopListeningKeyboardEvents();
					$scope.stopListeningKeyboardEvents = null;
				}
			});

			/////////////////////////////// OLD CODE STARTS FROM HERE
			$scope.lang             = {};

			// attrs to $scope - attrs-$scope - attrs - $scope
			// Copy some properties that will be used on the template. They need to be in the $scope.
			$scope.directiveId      = attrs.directiveId;

			// set max-height property if provided
			if ( typeof attrs.maxHeight !== 'undefined' ) {
				var layer = element.children().children().children()[0];
				angular.element( layer ).attr( "style", "height:" + attrs.maxHeight + "; overflow-y:scroll;" );
			}

			// helper button icons.. I guess you can use html tag here if you want to.
			$scope.icon        = {};
			$scope.icon.selectAll  = '&#10003;';    // a tick icon
			$scope.icon.selectNone = '&times;';     // x icon
			$scope.icon.reset      = '&#8630;';     // undo icon
			// this one is for the selected items
			$scope.icon.tickMark   = '&#10003;';    // a tick icon

			// configurable button labels
			if ( typeof attrs.translation !== 'undefined' ) {
				$scope.lang.selectAll       = $sce.trustAsHtml( $scope.icon.selectAll  + '&nbsp;&nbsp;' + $scope.translation.selectAll );
				$scope.lang.selectNone      = $sce.trustAsHtml( $scope.icon.selectNone + '&nbsp;&nbsp;' + $scope.translation.selectNone );
				$scope.lang.reset           = $sce.trustAsHtml( $scope.icon.reset      + '&nbsp;&nbsp;' + $scope.translation.reset );
				$scope.lang.search          = $scope.translation.search;
				$scope.lang.nothingSelected = $sce.trustAsHtml( $scope.translation.nothingSelected );
			} else {
				$scope.lang.selectAll       = $sce.trustAsHtml( $scope.icon.selectAll  + '&nbsp;&nbsp;Select All' );
				$scope.lang.selectNone      = $sce.trustAsHtml( $scope.icon.selectNone + '&nbsp;&nbsp;Select None' );
				$scope.lang.reset           = $sce.trustAsHtml( $scope.icon.reset      + '&nbsp;&nbsp;Reset' );
				$scope.lang.search          = 'Search...';
				$scope.lang.nothingSelected = 'None Selected';
			}
			$scope.icon.tickMark = $sce.trustAsHtml( $scope.icon.tickMark );


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

angular_multi_select.run(['$templateCache', function($templateCache) {
	var template = "" +
		"<div class='multiSelectItem' ng-click='clickItem(item);' " +
			"ng-class='{selected: item[tickProperty], multiSelectGroup:_hasChildren(item, false) > 0}'" +
		">" +
			"{{ item.name }}" +
			'<span class="tickMark" ng-if="item[tickProperty] === true" ng-bind-html="icon.tickMark"></span>'+
		"</div>" +

		"<ul ng-if='item.sub'>" +
			"<li ng-repeat='item in item.sub' ng-include=\"'angular-multi-select-item.htm'\" >" +

			"</li>" +
		"</ul>" +
		"";
	$templateCache.put('angular-multi-select-item.htm', template);
}]);

angular_multi_select.run(['$templateCache', function($templateCache) {
	var template =
		'<span class="multiSelect inlineBlock">' +
			// main button
			'<button id="{{directiveId}}" type="button"' +
				'ng-click="visible = !visible"' +
				'ng-bind-html="buttonLabel"' +
				'ng-disabled="disable-button"' +
			'>' +
			'</button>' +
			// overlay layer
			'<div class="checkboxLayer" ng-show="visible">' +
				// container of the helper elements
				'<div class="helperContainer" ng-if="helperStatus.filter || helperStatus.all || helperStatus.none || helperStatus.reset ">' +
					// container of the first 3 buttons, select all, none and reset
					'<div class="line" ng-if="helperStatus.all || helperStatus.none || helperStatus.reset ">' +
						// select all
						'<button type="button" class="helperButton"' +
							'ng-disabled="isDisabled" ng-if="helperStatus.all" ng-click="" ng-bind-html="lang.selectAll">' +
						'</button>'+
						// select none
						'<button type="button" class="helperButton"' +
							'ng-disabled="isDisabled" ng-if="helperStatus.none" ng-click="" ng-bind-html="lang.selectNone">' +
						'</button>'+
						// reset
						'<button type="button" class="helperButton reset"' +
							'ng-disabled="isDisabled" ng-if="helperStatus.reset" ng-click="" ng-bind-html="lang.reset">'+
						'</button>' +
					'</div>' +
					// the search box
					'<div class="line" style="position:relative" ng-if="helperStatus.filter">'+
						// textfield
						'<input placeholder="{{ lang.search }}" type="text"' +
							'ng-model="searchInput.value" class="inputFilter"'+
						'/>'+
						// clear button
						'<button type="button" class="clearButton" ng-click="searchInput.value = \'\'" >×</button> '+
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
