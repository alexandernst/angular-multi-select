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
			onSearchChange  : '&',
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
		 * - buttonLabel, directiveId, helperElements, itemLabel, maxLabels, orientation, selectionMode, minSearchLength,
		 *   tickProperty, disableProperty, groupProperty, searchProperty, maxHeight, outputProperties
		 */

		 templateUrl:
			'angular-multi-select.htm',

		link: function ( $scope, element, attrs ) {

			$scope.backUp           = [];
			$scope.varButtonLabel   = '';
			$scope.spacingProperty  = '';
			$scope.indexProperty    = '';
			$scope.orientationH     = false;
			$scope.orientationV     = true;
			$scope.filteredModel    = [];
			$scope.inputLabel       = { labelFilter: '' };
			$scope.tabIndex         = 0;
			$scope.lang             = {};
			$scope.helperStatus     = {
				all     : true,
				none    : true,
				reset   : true,
				filter  : true
			};

			attrs.idProperty = attrs.idProperty || "angular-multi-select-id";
			attrs.selectionMode = attrs.selectionMode || "multi";
			attrs.selectionMode = attrs.selectionMode.toLowerCase();

			var
				prevTabIndex        = 0,
				helperItems         = [],
				helperItemsLength   = 0,
				checkBoxLayer       = '',
				formElements        = [],
				vMinSearchLength    = 0,
				clickedItem         = null;

			// v3.0.0
			// clear button clicked
			$scope.clearClicked = function( e ) {
				$scope.inputLabel.labelFilter = '';
				$scope.updateFilter();
				$scope.select( 'clear', e );
			};

			// Call this function when user type on the filter field
			$scope.searchChanged = function() {
				if ( $scope.inputLabel.labelFilter.length < vMinSearchLength && $scope.inputLabel.labelFilter.length > 0 ) {
					return false;
				}
				$scope.updateFilter();
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
			 * @param obj
			 * @param key
			 * @param fn (obj)
			 * @returns {*}
			 * @private
			 */
			$scope._walk = function(obj, key, fn) {

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
			};

			/**
			 * Helper function that returns `true` if the passed item contains
			 * a key called `attrs.groupProperty` and that key's value is an array
			 * with at least 1 item.
			 * @param item
			 * @returns {boolean}
			 * @private
			 */
			$scope._hasChildren = function(item) {
				return item.hasOwnProperty(attrs.groupProperty) &&
					angular.isArray(item[attrs.groupProperty]) &&
					item[attrs.groupProperty].length > 0;
			};

			/**
			 * Helper function that checks if a single element
			 * is checked. Note that this function will check the
			 * passed item if it has nested items and some or all
			 * of them are checked.
			 * @param item
			 * @returns {boolean}
			 * @private
			 */
			$scope._isChecked = function(item) {
				if ($scope._hasChildren(item) && $scope._areAllChecked(item) !== 0) {
					item[attrs.tickProperty] = true;
				}
				return !(!item.hasOwnProperty(attrs.tickProperty) || item[attrs.tickProperty] === false);
			};

			/**
			 * Helper function that checks if all nested objects are
			 * checked. Returns:
			 * 1 if all are checked
			 * 0 if none is checked
			 * -1 if some are checked
			 * Note that this function will check the passed item if it
			 * has nested items and some or all of them are checked.
			 * @param item
			 * @private
			 */
			$scope._areAllChecked = function(item) {
				var checked = [];

				angular.forEach(item[attrs.groupProperty], function(v) {
					$scope._walk(v, attrs.groupProperty, function(sub_v) {
						var tmp_checked = $scope._isChecked(sub_v);
						if(checked.length === 0) {
							checked.push(tmp_checked);
						} else if(checked.length === 1 && checked[0] !== tmp_checked) {
							checked.push(tmp_checked);
						}
						return true;
					});
				});

				var state;
				if(checked.length < 2) {
					state = checked[0] === true ? 1 : 0;
				} else if(checked[0] === true && checked[0] === checked[1]) {
					state = 1;
				} else if(checked[0] === false && checked[0] === checked[1]) {
					state = 0;
				} else {
					state = -1;
				}

				item[attrs.tickProperty] = state !== 0;
				return state;
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
				if($scope._hasChildren(item)) {
					var check_state = $scope._areAllChecked(item);
					check_state = !!(check_state === -1 || check_state === -0);

					angular.forEach(item[attrs.groupProperty], function(v) {
						$scope._walk(v, attrs.groupProperty, function(sub_v) {
							sub_v[attrs.tickProperty] = check_state;
							return true;
						});
					});
				} else {
					item[attrs.tickProperty] = !!(!item.hasOwnProperty(attrs.tickProperty) || item[attrs.tickProperty] === false);
				}
			};

			/**
			 * Helper function to uncheck all items
			 * @private
			 */
			$scope._uncheckAll = function(){
				angular.forEach($scope.filteredModel, function(v) {
					$scope._walk(v, attrs.groupProperty, function(item){
						item[attrs.tickProperty] = false;
						return true;
					});
				});
			};



			$scope.updateFilter = function() {

				$scope.filteredModel = [];

				var filter_fn = function(obj) {
					//console.log(obj);
					return true;
				};

				angular.forEach($scope.inputModel, function(v) {
					var new_obj = $scope._walk(v, attrs.groupProperty, filter_fn);
					if ( new_obj !== null ) {
						$scope.filteredModel.push( new_obj );
					}
				});


				/////////////////////////////////////////////////////////////////
				return;

				var i, key;

				if ( typeof $scope.inputModel === 'undefined' ) {
					return false;
				}

				for( i = $scope.inputModel.length - 1; i >= 0; i-- ) {

					// if it's group end, we push it to filteredModel[];
					if ( typeof $scope.inputModel[ i ][ attrs.groupProperty ] !== 'undefined' && $scope.inputModel[ i ][ attrs.groupProperty ] === false ) {
						$scope.filteredModel.push( $scope.inputModel[ i ] );
					}

					// if it's data
					var gotData = false;
					if ( typeof $scope.inputModel[ i ][ attrs.groupProperty ] === 'undefined' ) {

						// If we set the search-key attribute, we use this loop.
						if ( typeof attrs.searchProperty !== 'undefined' && attrs.searchProperty !== '' ) {

							for ( key in $scope.inputModel[ i ]  ) {
								if (
									typeof $scope.inputModel[ i ][ key ] !== 'boolean'
									&& String( $scope.inputModel[ i ][ key ] ).toUpperCase().indexOf( $scope.inputLabel.labelFilter.toUpperCase() ) >= 0
									&& attrs.searchProperty.indexOf( key ) > -1
								) {
									gotData = true;
									break;
								}
							}
						} else { // if there's no search-key attribute, we use this one. Much better on performance.
							for ( key in $scope.inputModel[ i ]  ) {
								if (
									typeof $scope.inputModel[ i ][ key ] !== 'boolean'
									&& String( $scope.inputModel[ i ][ key ] ).toUpperCase().indexOf( $scope.inputLabel.labelFilter.toUpperCase() ) >= 0
								) {
									gotData = true;
									break;
								}
							}
						}

						if ( gotData === true ) {
							$scope.filteredModel.push( $scope.inputModel[ i ] );
						}
					}

					// if it's group start
					if ( typeof $scope.inputModel[ i ][ attrs.groupProperty ] !== 'undefined' && $scope.inputModel[ i ][ attrs.groupProperty ] === true ) {
						if ( typeof $scope.filteredModel[ $scope.filteredModel.length - 1 ][ attrs.groupProperty ] !== 'undefined'
								&& $scope.filteredModel[ $scope.filteredModel.length - 1 ][ attrs.groupProperty ] === false ) {
							$scope.filteredModel.pop();
						} else {
							$scope.filteredModel.push( $scope.inputModel[ i ] );
						}
					}
				}

				$scope.filteredModel.reverse();

				$timeout( function() {

					$scope.getFormElements();

					// Callback: on filter change
					if ( $scope.inputLabel.labelFilter.length > vMinSearchLength ) {

						var filterObj = [];

						angular.forEach( $scope.filteredModel, function( value ) {
							if ( typeof value !== 'undefined' ) {
								if ( typeof value[ attrs.groupProperty ] === 'undefined' ) {
									var tempObj = angular.copy( value );
									var index = filterObj.push( tempObj );
									delete filterObj[ index - 1 ][ $scope.indexProperty ];
									delete filterObj[ index - 1 ][ $scope.spacingProperty ];
								}
							}
						});

						$scope.onSearchChange({
							data: {
								keyword: $scope.inputLabel.labelFilter,
								result: filterObj
							}
						});
					}
				}, 0);
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

			// check if an item has attrs.groupProperty (be it true or false)
			$scope.isGroupMarker = function( item , type ) {
				return !!(typeof item[attrs.groupProperty] !== 'undefined' && item[attrs.groupProperty] === type);
			};

			$scope.removeGroupEndMarker = function( item ) {
				return !(typeof item[attrs.groupProperty] !== 'undefined' && item[attrs.groupProperty] === false);
			};

			// call this function when an item is clicked
			$scope.clickItem = function( item, e ) {

				if(typeof attrs.selectionMode !== 'undefined' && attrs.selectionMode.toUpperCase() === 'SINGLE') {
					if($scope._hasChildren(item) === false) {
						$scope._uncheckAll();
					}
				}

				$scope._flipCheck(item);

				return;

				console.log(item, e);
				if($scope._hasChildren(item) === true){
					//De/select all children
					return;
				}

				item[attrs.tickProperty] = item[attrs.tickProperty] === undefined ? true : !item[attrs.tickProperty];


				//attrs.selectionMode.toUpperCase() === 'SINGLE'
				return;


				var index = $scope.filteredModel.indexOf( item );
				var inputModelIndex;

				// if the start of group marker is clicked ( only for multiple selection! )
				// how it works:
				// - if, in a group, there are items which are not selected, then they all will be selected
				// - if, in a group, all items are selected, then they all will be de-selected
				if ( typeof item[ attrs.groupProperty ] !== 'undefined' && item[ attrs.groupProperty ] === true ) {

					// this is only for multiple selection, so if selection mode is single, do nothing
					if ( typeof attrs.selectionMode !== 'undefined' && attrs.selectionMode.toUpperCase() === 'SINGLE' ) {
						return false;
					}

					var i,j;
					var startIndex = 0;
					var endIndex = $scope.filteredModel.length - 1;
					var tempArr = [];

					// nest level is to mark the depth of the group.
					// when you get into a group (start group marker), nestLevel++
					// when you exit a group (end group marker), nextLevel--
					var nestLevel = 0;

					// we loop throughout the filtered model (not whole model)
					for( i = index ; i < $scope.filteredModel.length ; i++) {

						// this break will be executed when we're done processing each group
						if ( nestLevel === 0 && i > index ) {
							break;
						}

						if ( typeof $scope.filteredModel[ i ][ attrs.groupProperty ] !== 'undefined' && $scope.filteredModel[ i ][ attrs.groupProperty ] === true ) {
							// To cater multi level grouping
							if ( tempArr.length === 0 ) {
								startIndex = i + 1;
							}
							nestLevel = nestLevel + 1;
						} else if ( typeof $scope.filteredModel[ i ][ attrs.groupProperty ] !== 'undefined' && $scope.filteredModel[ i ][ attrs.groupProperty ] === false ) {
							// if group end
							nestLevel = nestLevel - 1;

							// check if all are ticked or not
							if ( tempArr.length > 0 && nestLevel === 0 ) {

								var allTicked = true;

								endIndex = i;

								for ( j = 0; j < tempArr.length ; j++ ) {
									if ( typeof tempArr[ j ][ $scope.tickProperty ] !== 'undefined' &&  tempArr[ j ][ $scope.tickProperty ] === false ) {
										allTicked = false;
										break;
									}
								}

								for ( j = startIndex; j <= endIndex ; j++ ) {
									if ( typeof $scope.filteredModel[ j ][ attrs.groupProperty ] === 'undefined' &&
										( typeof attrs.disableProperty === 'undefined' || $scope.filteredModel[ j ][ attrs.disableProperty ] !== true )
									) {
										 $scope.filteredModel[ j ][ $scope.tickProperty ] = !allTicked;
										 // we refresh input model as well
										 inputModelIndex = $scope.filteredModel[ j ][ $scope.indexProperty ];
										 $scope.inputModel[ inputModelIndex ][ $scope.tickProperty ] = !allTicked;
									}

								}
							}
						} else { // if data
							tempArr.push( $scope.filteredModel[ i ] );
						}
					}
				} else { // if an item (not group marker) is clicked

					// If it's single selection mode
					if ( typeof attrs.selectionMode !== 'undefined' && attrs.selectionMode.toUpperCase() === 'SINGLE' ) {

						// first, set everything to false
						for( i=0 ; i < $scope.filteredModel.length ; i++) {
							$scope.filteredModel[ i ][ $scope.tickProperty ] = false;
						}
						for( i=0 ; i < $scope.inputModel.length ; i++) {
							$scope.inputModel[ i ][ $scope.tickProperty ] = false;
						}

						// then set the clicked item to true
						$scope.filteredModel[ index ][ $scope.tickProperty ] = true;
					} else { // Multiple
						$scope.filteredModel[ index ][ $scope.tickProperty ] = !$scope.filteredModel[ index ][ $scope.tickProperty ];
					}

					// we refresh input model as well
					inputModelIndex = $scope.filteredModel[ index ][ $scope.indexProperty ];
					$scope.inputModel[ inputModelIndex ][ $scope.tickProperty ] = $scope.filteredModel[ index ][ $scope.tickProperty ];
				}

				// we execute the callback function here
				clickedItem = angular.copy( item );
				if ( clickedItem !== null ) {
					$timeout( function() {
						delete clickedItem[ $scope.indexProperty ];
						delete clickedItem[ $scope.spacingProperty ];
						$scope.onItemClick( { data: clickedItem } );
						clickedItem = null;
					}, 0 );
				}

				$scope.refreshOutputModel();
				$scope.refreshButton();

				// We update the index here
				prevTabIndex = $scope.tabIndex;
				$scope.tabIndex = ng_repeat_index + helperItemsLength;

				// Set focus on the hidden checkbox
				e.target.focus();

				// set & remove CSS style
				$scope.removeFocusStyle( prevTabIndex );
				$scope.setFocusStyle( $scope.tabIndex );

				if ( typeof attrs.selectionMode !== 'undefined' && attrs.selectionMode.toUpperCase() === 'SINGLE' ) {
					// on single selection mode, we then hide the checkbox layer
					$scope.toggleCheckboxes( e );
				}
			};

			// update $scope.outputModel
			$scope.refreshOutputModel = function() {

				if ($scope.outputModel) {
					$scope.outputModel.length = 0;
				} else {
					$scope.outputModel = [];
				}

				// v4.0.0
				var outputProps = typeof attrs.outputProperties !== 'undefined' ? attrs.outputProperties.split(' ') : false;
				var temp = {};

				angular.forEach( $scope.inputModel, function( value ) {
					if (
						typeof value !== 'undefined'
						&& typeof value[ attrs.groupProperty ] === 'undefined'
						&& value[ $scope.tickProperty ] === true
					) {

						if (outputProps === false) {
							temp = angular.copy( value );
						} else {
							angular.forEach( value, function( value1, key1 ) {
								if ( outputProps.indexOf( key1 ) > -1 ) {
									temp[ key1 ] = value1;
								}
							});
						}

						var index = $scope.outputModel.push( temp );
						delete $scope.outputModel[ index - 1 ][ $scope.indexProperty ];
						delete $scope.outputModel[ index - 1 ][ $scope.spacingProperty ];
					}
				});

			};

			// refresh button label
			$scope.refreshButton = function() {

				$scope.varButtonLabel   = '';
				var ctr                 = 0;

				// refresh button label...
				if ( $scope.outputModel.length === 0 ) {
					// https://github.com/isteven/angular-multi-select/pull/19
					$scope.varButtonLabel = $scope.lang.nothingSelected;
				} else {
					var tempMaxLabels = $scope.outputModel.length;
					if ( typeof attrs.maxLabels !== 'undefined' && attrs.maxLabels !== '' ) {
						tempMaxLabels = attrs.maxLabels;
					}

					// if max amount of labels displayed..
					$scope.more = $scope.outputModel.length > tempMaxLabels;

					angular.forEach( $scope.inputModel, function( value ) {
						if ( typeof value !== 'undefined' && value[ attrs.tickProperty ] === true ) {
							if ( ctr < tempMaxLabels ) {
								$scope.varButtonLabel += ( $scope.varButtonLabel.length > 0 ? '</div>, <div class="buttonLabel">' : '<div class="buttonLabel">') + $scope.writeLabel( value, 'buttonLabel' );
							}
							ctr++;
						}
					});

					if ( $scope.more === true ) {
						// https://github.com/isteven/angular-multi-select/pull/16
						if (tempMaxLabels > 0) {
							$scope.varButtonLabel += ', ... ';
						}
						$scope.varButtonLabel += '(' + $scope.outputModel.length + ')';
					}
				}
				$scope.varButtonLabel = $sce.trustAsHtml( $scope.varButtonLabel + '<span class="caret"></span>' );
			};

			// Check if a checkbox is disabled or enabled. It will check the granular control (disableProperty) and global control (isDisabled)
			// Take note that the granular control has higher priority.
			$scope.itemIsDisabled = function( item ) {

				if ( typeof attrs.disableProperty !== 'undefined' && item[ attrs.disableProperty ] === true ) {
					return true;
				} else {
					return $scope.isDisabled === true;
				}

			};

			// A simple function to parse the item label settings. Used on the buttons and checkbox labels.
			$scope.writeLabel = function( item, type ) {

				// type is either 'itemLabel' or 'buttonLabel'
				var temp    = attrs[ type ].split( ' ' );
				var label   = '';

				angular.forEach( temp, function( value ) {
					if (item[value]) {
						label += '&nbsp;' + item[value];
					} else if ( value.split( '.').length !== 1 ) {
						var tmp_v = value.split( '.' ).reduce( function( prev, current ) {
							return prev[ current ];
						}, item );
						label += tmp_v === undefined ? value : '&nbsp;' + tmp_v;
					} else {
						label += value;
					}
				});

				if ( type.toUpperCase() === 'BUTTONLABEL' ) {
					return label;
				}
				return $sce.trustAsHtml( label );
			};

			// UI operations to show/hide checkboxes based on click event..
			$scope.toggleCheckboxes = function( e ) {

				// We grab the button
				var clickedEl = element.children()[0];

				// Just to make sure.. had a bug where key events were recorded twice
				angular.element( document ).off( 'click touchstart', $scope.externalClickListener );
				angular.element( document ).off( 'keydown', $scope.keyboardListener );

				// The idea below was taken from another multi-select directive - https://github.com/amitava82/angular-multiselect
				// His version is awesome if you need a more simple multi-select approach.

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
					$scope.inputLabel.labelFilter = '';
					$scope.updateFilter();

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
						$scope.refreshButton();
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
						$scope.refreshButton();
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
						$scope.refreshButton();
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

			// just to create a random variable name
			function genRandomString( length ) {
				var possible    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
				var temp        = '';
				for( var i=0; i < length; i++ ) {
					 temp += possible.charAt( Math.floor( Math.random() * possible.length ));
				}
				return temp;
			}

			// count leading spaces
			$scope.prepareGrouping = function() {
				var spacing     = 0;
				angular.forEach( $scope.filteredModel, function( value ) {
					value[ $scope.spacingProperty ] = spacing;
					if ( value[ attrs.groupProperty ] === true ) {
						spacing+=2;
					} else if ( value[ attrs.groupProperty ] === false ) {
						spacing-=2;
					}
				});
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

			// Unfortunately I need to add these grouping properties into the input model
			var tempStr = genRandomString( 5 );
			$scope.indexProperty = 'idx_' + tempStr;
			$scope.spacingProperty = 'spc_' + tempStr;

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

			// min length of keyword to trigger the filter function
			if ( typeof attrs.MinSearchLength !== 'undefined' && parseInt( attrs.MinSearchLength, 10 ) > 0 ) {
				vMinSearchLength = Math.floor( parseInt( attrs.MinSearchLength, 10 ) );
			}

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
				if ( newVal ) {
					$scope.refreshOutputModel();
					$scope.refreshButton();
				}
			}, true );

			// watch2 for changes in input model as a whole
			// this on updates the multi-select when a user load a whole new input-model. We also update the $scope.backUp variable
			$scope.$watch( 'inputModel' , function( newVal ) {
				if ( newVal ) {
					$scope.backUp = angular.copy( $scope.inputModel );
					$scope.updateFilter();
					$scope.prepareGrouping();
					$scope.prepareIndex();
					$scope.refreshOutputModel();
					$scope.refreshButton();
				}
			});

			// watch for changes in directive state (disabled or enabled)
			$scope.$watch( 'isDisabled' , function( newVal ) {
				$scope.isDisabled = newVal;
			});

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
			"ng-class='{selected: item[tickProperty], horizontal: orientationH, vertical: orientationV, multiSelectGroup:_hasChildren(item), disabled:itemIsDisabled(item)}'" +
		">" +
			"{{ item.name }}" +
			'<span class="tickMark" ng-if="(_hasChildren(item) === true && _areAllChecked(item) === 1 ) || item[tickProperty] === true" ng-bind-html="icon.tickMark"></span>'+
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
				'ng-click="toggleCheckboxes( $event ); refreshSelectedItems(); refreshButton(); prepareGrouping; prepareIndex();"' +
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
						'<input placeholder="{{lang.search}}" type="text"' +
							'ng-click="select( \'filter\', $event )" '+
							'ng-model="inputLabel.labelFilter" '+
							'ng-change="searchChanged()" class="inputFilter"'+
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
