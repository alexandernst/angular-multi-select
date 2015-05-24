/*
 * Angular JS Multi Select
 * Creates a dropdown-like button with checkboxes.
 *
 * Project started on: Tue, 14 Jan 2014 - 5:18:02 PM
 * Current version: 4.0.6
 *
 * Released under the MIT License
 * --------------------------------------------------------------------------------
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Ignatius Steven (https://github.com/isteven)
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
		restrict:
			'AE',

		scope: {
			// models
			inputModel      : '=',
			outputModel     : '=',

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

		/*
		 * The rest are attributes. They don't need to be parsed / binded, so we can safely access them by value.
		 * - buttonLabel, directiveId, helperElements, itemLabel, maxLabels, orientation, selectionMode,
		 *   tickProperty, disableProperty, groupProperty, searchProperty, maxHeight, outputProperties
		 */

		 templateUrl:
			'angular-multi-select.htm',

		link: function ( $scope, element, attrs ) {

			/**
			 * Globally used variables.
			 */
			$scope.filteredModel = [];
			//$scope.searchInput = "";
			attrs.idProperty = attrs.idProperty || "angular-multi-select-id";
			attrs.selectionMode = attrs.selectionMode || "multi";
			attrs.selectionMode = attrs.selectionMode.toLowerCase();

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

			$scope._test = function() {
				console.log($scope.searchInput);
			};

			$scope.fillInternalModel = function() {
				console.log("fillInternalModel!");

				$scope._shadowModel = [];

				var filter_fn = function(obj) {
					//console.log(obj);
					console.log($scope.searchInput);
					//return obj.name.indexOf($scope.searchInput) !== -1;
					return true;
				};

				$scope._shadowModel = $scope._walk($scope.inputModel, attrs.groupProperty, filter_fn);
				$scope._enforceIDs($scope._shadowModel);
				$scope.filteredModel = angular.copy($scope._shadowModel);
				delete $scope._shadowModel;
			};


			$scope.fillInternalModel();

			$scope.$watch('filteredModel', function(_new) {
				if(_new) {
					$scope._enforceChecks($scope.filteredModel);

					var _n_selected = Math.abs($scope._areAllChecked($scope.filteredModel));
					$scope.varButtonLabel =  _n_selected + " selected";
					$scope.varButtonLabel = $sce.trustAsHtml( $scope.varButtonLabel + '<span class="caret"></span>' );
				}
			}, true);

			/////////////////////////////// OLD CODE STARTS FROM HERE

			$scope.backUp           = [];
			$scope.varButtonLabel   = '';
			$scope.indexProperty    = '';
			$scope.orientationH     = false;
			$scope.orientationV     = true;
			$scope.tabIndex         = 0;
			$scope.lang             = {};
			$scope.helperStatus     = {
				all     : true,
				none    : true,
				reset   : true,
				filter  : true
			};

			var
				prevTabIndex        = 0,
				helperItems         = [],
				helperItemsLength   = 0,
				checkBoxLayer       = '',
				formElements        = [];

			// v3.0.0
			// clear button clicked
			$scope.clearClicked = function( e ) {
				return;
				//$scope.fillInternalModel();
				$scope.select( 'clear', e );
			};

			// List all the input elements. We need this for our keyboard navigation.
			// This function will be called every time the filter is updated.
			// Depending on the size of filtered mode, might not good for performance, but oh well..
			$scope.getFormElements = function() {
				formElements = [];

				var
					i,
					selectButtons   = [],
					inputField      = [],
					checkboxes      = [],
					clearButton     = [];

				// If available, then get select all, select none, and reset buttons
				if ( $scope.helperStatus.all || $scope.helperStatus.none || $scope.helperStatus.reset ) {
					selectButtons = element.children().children().next().children().children()[ 0 ].getElementsByTagName( 'button' );
					// If available, then get the search box and the clear button
					if ( $scope.helperStatus.filter ) {
						// Get helper - search and clear button.
						inputField =    element.children().children().next().children().children().next()[ 0 ].getElementsByTagName( 'input' );
						clearButton =   element.children().children().next().children().children().next()[ 0 ].getElementsByTagName( 'button' );
					}
				} else {
					if ( $scope.helperStatus.filter ) {
						// Get helper - search and clear button.
						inputField =    element.children().children().next().children().children()[ 0 ].getElementsByTagName( 'input' );
						clearButton =   element.children().children().next().children().children()[ 0 ].getElementsByTagName( 'button' );
					}
				}

				// Get checkboxes
				if ( !$scope.helperStatus.all && !$scope.helperStatus.none && !$scope.helperStatus.reset && !$scope.helperStatus.filter ) {
					checkboxes = element.children().children().next()[ 0 ].getElementsByTagName( 'input' );
				} else {
					checkboxes = element.children().children().next().children().next()[ 0 ].getElementsByTagName( 'input' );
				}

				// Push them into global array formElements[]
				for ( i = 0; i < selectButtons.length ; i++ )   { formElements.push( selectButtons[ i ] );  }
				for ( i = 0; i < inputField.length ; i++ )      { formElements.push( inputField[ i ] );     }
				for ( i = 0; i < clearButton.length ; i++ )     { formElements.push( clearButton[ i ] );    }
				for ( i = 0; i < checkboxes.length ; i++ )      { formElements.push( checkboxes[ i ] );     }
			};

			// update $scope.outputModel
			$scope.refreshOutputModel = function() {
				if ($scope.outputModel) {
					$scope.outputModel.length = 0;
				} else {
					$scope.outputModel = [];
				}
			};

			// Check if a checkbox is disabled or enabled. It will check the granular control (disableProperty) and global control (isDisabled)
			// Take note that the granular control has higher priority.
			$scope.itemIsDisabled = function( item ) {
				return false;
				if ( typeof attrs.disableProperty !== 'undefined' && item[ attrs.disableProperty ] === true ) {
					return true;
				} else {
					return $scope.isDisabled === true;
				}

			};

			// UI operations to show/hide checkboxes based on click event..
			$scope.toggleCheckboxes = function( e ) {

				// We grab the button
				var clickedEl = element.children()[0];

				// Just to make sure.. had a bug where key events were recorded twice
				angular.element( document ).off( 'click touchstart', $scope.externalClickListener );
				angular.element( document ).off( 'keydown', $scope.keyboardListener );

				// close
				if ( angular.element( checkBoxLayer ).hasClass( 'show' )) {

					angular.element( checkBoxLayer ).removeClass( 'show' );
					angular.element( clickedEl ).removeClass( 'buttonClicked' );
					angular.element( document ).off( 'click touchstart', $scope.externalClickListener );
					angular.element( document ).off( 'keydown', $scope.keyboardListener );

					// clear the focused element;
					$scope.removeFocusStyle( $scope.tabIndex );
					if ( typeof formElements[ $scope.tabIndex ] !== 'undefined' ) {
						formElements[ $scope.tabIndex ].blur();
					}

					// close callback
					$timeout( function() {
						$scope.onClose();
					}, 0 );

					// set focus on button again
					element.children().children()[ 0 ].focus();
				} else { // open
					// clear filter
					//$scope.fillInternalModel();

					helperItems = [];
					helperItemsLength = 0;

					angular.element( checkBoxLayer ).addClass( 'show' );
					angular.element( clickedEl ).addClass( 'buttonClicked' );

					// Attach change event listener on the input filter.
					// We need this because ng-change is apparently not an event listener.
					angular.element( document ).on( 'click touchstart', $scope.externalClickListener );
					angular.element( document ).on( 'keydown', $scope.keyboardListener );

					// to get the initial tab index, depending on how many helper elements we have.
					// priority is to always focus it on the input filter
					$scope.getFormElements();
					$scope.tabIndex = 0;

					var helperContainer = angular.element( element[ 0 ].querySelector( '.helperContainer' ) )[0];

					if ( typeof helperContainer !== 'undefined' ) {
						for ( var i = 0; i < helperContainer.getElementsByTagName( 'BUTTON' ).length ; i++ ) {
							helperItems[ i ] = helperContainer.getElementsByTagName( 'BUTTON' )[ i ];
						}
						helperItemsLength = helperItems.length + helperContainer.getElementsByTagName( 'INPUT' ).length;
					}

					// focus on the filter element on open.
					if ( element[ 0 ].querySelector( '.inputFilter' ) ) {
						element[ 0 ].querySelector( '.inputFilter' ).focus();
						$scope.tabIndex = $scope.tabIndex + helperItemsLength - 2;
						// blur button in vain
						angular.element( element ).children()[ 0 ].blur();
					} else { // if there's no filter then just focus on the first checkbox item
						if ( !$scope.isDisabled ) {
							$scope.tabIndex = $scope.tabIndex + helperItemsLength;
							if ( $scope.inputModel.length > 0 ) {
								formElements[ $scope.tabIndex ].focus();
								$scope.setFocusStyle( $scope.tabIndex );
								// blur button in vain
								angular.element( element ).children()[ 0 ].blur();
							}
						}
					}

					// open callback
					$scope.onOpen();
				}
			};

			// handle clicks outside the button / multi select layer
			$scope.externalClickListener = function( e ) {

				var targetsArr = element.find( e.target.tagName );
				for (var i = 0; i < targetsArr.length; i++) {
					if ( e.target == targetsArr[i] ) {
						return;
					}
				}

				angular.element( checkBoxLayer.previousSibling ).removeClass( 'buttonClicked' );
				angular.element( checkBoxLayer ).removeClass( 'show' );
				angular.element( document ).off( 'click touchstart', $scope.externalClickListener );
				angular.element( document ).off( 'keydown', $scope.keyboardListener );

				// close callback
				$timeout( function() {
					$scope.onClose();
				}, 0 );

				// set focus on button again
				element.children().children()[ 0 ].focus();
			};

			// select All / select None / reset buttons
			$scope.select = function( type, e ) {

				$scope.tabIndex = helperItems.indexOf( e.target );

				switch( type.toUpperCase() ) {
					case 'ALL':
						angular.forEach( $scope.filteredModel, function( value ) {
							if ( typeof value !== 'undefined' && value[ attrs.disableProperty ] !== true ) {
								if ( typeof value[ attrs.groupProperty ] === 'undefined' ) {
									value[ $scope.tickProperty ] = true;
								}
							}
						});
						$scope.refreshOutputModel();
						$scope.onSelectAll();
						break;
					case 'NONE':
						angular.forEach( $scope.filteredModel, function( value ) {
							if ( typeof value !== 'undefined' && value[ attrs.disableProperty ] !== true ) {
								if ( typeof value[ attrs.groupProperty ] === 'undefined' ) {
									value[ $scope.tickProperty ] = false;
								}
							}
						});
						$scope.refreshOutputModel();
						$scope.onSelectNone();
						break;
					case 'RESET':
						angular.forEach( $scope.filteredModel, function( value ) {
							if ( typeof value[ attrs.groupProperty ] === 'undefined' && typeof value !== 'undefined' && value[ attrs.disableProperty ] !== true ) {
								var temp = value[ $scope.indexProperty ];
								value[ $scope.tickProperty ] = $scope.backUp[ temp ][ $scope.tickProperty ];
							}
						});
						$scope.refreshOutputModel();
						$scope.onReset();
						break;
					case 'CLEAR':
						$scope.tabIndex = $scope.tabIndex + 1;
						$scope.onClear();
						break;
					case 'FILTER':
						$scope.tabIndex = helperItems.length - 1;
						break;
					default:
				}
			};

			// prepare original index
			$scope.prepareIndex = function() {
				var ctr = 0;
				angular.forEach( $scope.filteredModel, function( value ) {
					value[ $scope.indexProperty ] = ctr;
					ctr++;
				});
			};

			// navigate using up and down arrow
			$scope.keyboardListener = function( e ) {

				var key = e.keyCode ? e.keyCode : e.which;
				var isNavigationKey = false;

				// ESC key (close)
				if ( key === 27 ) {
					e.preventDefault();
					e.stopPropagation();
					$scope.toggleCheckboxes( e );
				} else if ( key === 40 || key === 39 || ( !e.shiftKey && key == 9 ) ) {
					// next element ( tab, down & right key )
					isNavigationKey = true;
					prevTabIndex = $scope.tabIndex;
					$scope.tabIndex++;
					if ( $scope.tabIndex > formElements.length - 1 ) {
						$scope.tabIndex = 0;
						prevTabIndex = formElements.length - 1;
					}
					while ( formElements[ $scope.tabIndex ].disabled === true ) {
						$scope.tabIndex++;
						if ( $scope.tabIndex > formElements.length - 1 ) {
							$scope.tabIndex = 0;
						}
						if ( $scope.tabIndex === prevTabIndex ) {
							break;
						}
					}
				} else if ( key === 38 || key === 37 || ( e.shiftKey && key == 9 ) ) {
					// prev element ( shift+tab, up & left key )
					isNavigationKey = true;
					prevTabIndex = $scope.tabIndex;
					$scope.tabIndex--;
					if ( $scope.tabIndex < 0 ) {
						$scope.tabIndex = formElements.length - 1;
						prevTabIndex = 0;
					}
					while ( formElements[ $scope.tabIndex ].disabled === true ) {
						$scope.tabIndex--;
						if ( $scope.tabIndex === prevTabIndex ) {
							break;
						}
						if ( $scope.tabIndex < 0 ) {
							$scope.tabIndex = formElements.length - 1;
						}
					}
				}

				if ( isNavigationKey === true ) {

					e.preventDefault();

					// set focus on the checkbox
					formElements[ $scope.tabIndex ].focus();
					var actEl = document.activeElement;

					if ( actEl.type.toUpperCase() === 'CHECKBOX' ) {
						$scope.setFocusStyle( $scope.tabIndex );
						$scope.removeFocusStyle( prevTabIndex );
					} else {
						$scope.removeFocusStyle( prevTabIndex );
						$scope.removeFocusStyle( helperItemsLength );
						$scope.removeFocusStyle( formElements.length - 1 );
					}
				}
			};

			// set (add) CSS style on selected row
			$scope.setFocusStyle = function( tabIndex ) {
				angular.element( formElements[ tabIndex ] ).parent().parent().parent().addClass( 'multiSelectFocus' );
			};

			// remove CSS style on selected row
			$scope.removeFocusStyle = function( tabIndex ) {
				angular.element( formElements[ tabIndex ] ).parent().parent().parent().removeClass( 'multiSelectFocus' );
			};

			/*********************
			 *********************
			 *
			 * 1) Initializations
			 *
			 *********************
			 *********************/

			// attrs to $scope - attrs-$scope - attrs - $scope
			// Copy some properties that will be used on the template. They need to be in the $scope.
			$scope.groupProperty    = attrs.groupProperty;
			$scope.tickProperty     = attrs.tickProperty;
			$scope.directiveId      = attrs.directiveId;

			// set orientation css
			if ( typeof attrs.orientation !== 'undefined' ) {

				if ( attrs.orientation.toUpperCase() === 'HORIZONTAL' ) {
					$scope.orientationH = true;
					$scope.orientationV = false;
				} else {
					$scope.orientationH = false;
					$scope.orientationV = true;
				}
			}

			// get elements required for DOM operation
			checkBoxLayer = element.children().children().next()[0];

			// set max-height property if provided
			if ( typeof attrs.maxHeight !== 'undefined' ) {
				var layer = element.children().children().children()[0];
				angular.element( layer ).attr( "style", "height:" + attrs.maxHeight + "; overflow-y:scroll;" );
			}

			// some flags for easier checking
			for ( var property in $scope.helperStatus ) {
				if ( $scope.helperStatus.hasOwnProperty( property )) {
					if (
						typeof attrs.helperElements !== 'undefined'
						&& attrs.helperElements.toUpperCase().indexOf( property.toUpperCase() ) === -1
					) {
						$scope.helperStatus[ property ] = false;
					}
				}
			}
			if ( typeof attrs.selectionMode !== 'undefined' && attrs.selectionMode.toUpperCase() === 'SINGLE' )  {
				$scope.helperStatus[ 'all' ] = false;
				$scope.helperStatus[ 'none' ] = false;
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

			/*******************************************************
			 *******************************************************
			 *
			 * 2) Logic starts here, initiated by watch 1 & watch 2
			 *
			 *******************************************************
			 *******************************************************/

			// watch1, for changes in input model property
			// updates multi-select when user select/deselect a single checkbox programatically
			// https://github.com/isteven/angular-multi-select/issues/8
			$scope.$watch( 'inputModel' , function( newVal ) {
				//return;
				if ( newVal ) {
					$scope.refreshOutputModel();
				}
			}, true );

			// watch2 for changes in input model as a whole
			// this on updates the multi-select when a user load a whole new input-model. We also update the $scope.backUp variable
			$scope.$watch( 'inputModel' , function( newVal ) {
				return;
				if ( newVal ) {
					$scope.backUp = angular.copy( $scope.inputModel );
					//$scope.fillInternalModel();
					//$scope.prepareIndex();
					$scope.refreshOutputModel();
				}
			});

			// watch for changes in directive state (disabled or enabled)
			/*
			$scope.$watch( 'isDisabled' , function( newVal ) {
				$scope.isDisabled = newVal;
			});
			*/

			// this is for touch enabled devices. We don't want to hide checkboxes on scroll.
			var onTouchStart = function() {
				$scope.$apply( function() {
					$scope.scrolled = false;
				});
			};
			angular.element( document ).bind( 'touchstart', onTouchStart);
			var onTouchMove = function() {
				$scope.$apply( function() {
					$scope.scrolled = true;
				});
			};
			angular.element( document ).bind( 'touchmove', onTouchMove);

			// unbind document events to prevent memory leaks
			$scope.$on( '$destroy', function () {
				angular.element( document ).unbind( 'touchstart', onTouchStart);
				angular.element( document ).unbind( 'touchmove', onTouchMove);
			});

		}
	}
}]);

angular_multi_select.run( [ '$templateCache' , function( $templateCache ) {
	var template = "" +
		"<div class='multiSelectItem' ng-click='clickItem(item);' " +
			"ng-class='{selected: item[tickProperty], horizontal: orientationH, vertical: orientationV, multiSelectGroup:_hasChildren(item, false) > 0, disabled:itemIsDisabled(item)}'" +
		">" +
			"{{ item.name }}" +
			'<span class="tickMark" ng-if="item[tickProperty] === true" ng-bind-html="icon.tickMark"></span>'+
		"</div>" +

		"<ul ng-if='item.sub'>" +
			"<li ng-repeat='item in item.sub' ng-include=\"'angular-multi-select-item.htm'\" >" +

			"</li>" +
		"</ul>" +
		"";
	$templateCache.put( 'angular-multi-select-item.htm' , template );
}]);
angular_multi_select.run( [ '$templateCache' , function( $templateCache ) {
	var template =
		'<span class="multiSelect inlineBlock">' +
			// main button
			'<button id="{{directiveId}}" type="button"' +
				'ng-click="toggleCheckboxes( $event ); refreshSelectedItems(); prepareIndex();"' + //
				'ng-bind-html="varButtonLabel"' +
				'ng-disabled="disable-button"' +
			'>' +
			'</button>' +
			// overlay layer
			'<div class="checkboxLayer">' +
				// container of the helper elements
				'<div class="helperContainer" ng-if="helperStatus.filter || helperStatus.all || helperStatus.none || helperStatus.reset ">' +
					// container of the first 3 buttons, select all, none and reset
					'<div class="line" ng-if="helperStatus.all || helperStatus.none || helperStatus.reset ">' +
						// select all
						'<button type="button" class="helperButton"' +
							'ng-disabled="isDisabled"' +
							'ng-if="helperStatus.all"' +
							'ng-click="select( \'all\', $event );"' +
							'ng-bind-html="lang.selectAll">' +
						'</button>'+
						// select none
						'<button type="button" class="helperButton"' +
							'ng-disabled="isDisabled"' +
							'ng-if="helperStatus.none"' +
							'ng-click="select( \'none\', $event );"' +
							'ng-bind-html="lang.selectNone">' +
						'</button>'+
						// reset
						'<button type="button" class="helperButton reset"' +
							'ng-disabled="isDisabled"' +
							'ng-if="helperStatus.reset"' +
							'ng-click="select( \'reset\', $event );"' +
							'ng-bind-html="lang.reset">'+
						'</button>' +
					'</div>' +
					// the search box
					'<div class="line" style="position:relative" ng-if="helperStatus.filter">'+
						// textfield
						'<input placeholder="{{ lang.search }}" type="text"' +
							//'ng-click="select( \'filter\', $event )" '+
							'ng-model="searchInput" '+
							'ng-change="_test()" class="inputFilter"'+
							'/>'+
						// clear button
						'<button type="button" class="clearButton" ng-click="clearClicked( $event )" >×</button> '+
					'</div> '+
				'</div> '+
				// selection items

				'<div class="checkBoxContainer">'+
					/*
					'<div '+
						'ng-repeat="item in filteredModel | filter:removeGroupEndMarker" class="multiSelectItem"'+
						'ng-class="{selected: item[ tickProperty ], horizontal: orientationH, vertical: orientationV, multiSelectGroup:item[ groupProperty ], disabled:itemIsDisabled( item )}"'+
						'ng-click="syncItems( item, $event, $index );" '+
						'ng-mouseleave="removeFocusStyle( tabIndex );"> '+
						// this is the spacing for grouped items
						'<div class="acol" ng-if="item[ spacingProperty ] > 0" ng-repeat="i in numberToArray( item[ spacingProperty ] ) track by $index">'+
					'</div>  '+
					'<div class="acol">'+
						'<label>'+
							// input, so that it can accept focus on keyboard click
							'<input class="checkbox focusable" type="checkbox" '+
								'ng-disabled="itemIsDisabled( item )" '+
								'ng-checked="item[ tickProperty ]" '+
								'ng-click="syncItems( item, $event, $index )" />'+
							// item label using ng-bind-hteml
							'<span '+
								'ng-class="{disabled:itemIsDisabled( item )}" '+
								'ng-bind-html="writeLabel( item, \'itemLabel\' )">'+
							'</span>'+
						'</label>'+
					'</div>'+
					// the tick/check mark
					'<span class="tickMark" ng-if="item[ groupProperty ] !== true && item[ tickProperty ] === true" ng-bind-html="icon.tickMark"></span>'+
					*/

					"<ul>" +
						"<li ng-repeat='item in filteredModel' ng-include=\"'angular-multi-select-item.htm'\"></li>" +
					"</ul>" +
				'</div>'+
			'</div>'+
		'</div>'+
	'</span>';
	$templateCache.put( 'angular-multi-select.htm' , template );
}]);
