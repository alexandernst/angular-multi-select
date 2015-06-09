describe('Testing directive in single mode', function() {
	var scope, element, html, timeout;

	beforeEach(function (){
		//load the module
		module('angular-multi-select');

		//set our view html.
		html = '<div angular-multi-select ' +
			'hidden-property="hidden" ' +
			'input-model="items" ' +
			'output-model="x" ' +
			'group-property="sub" ' +
			'tick-property="check" ' +
			'item-label="{{ name }}" ' +
			'helper-elements="all none reset filter"' +
			'selection-mode="single" ' +
			'min-search-length="3" ' +
			'search-property="name" ' +
		'></div>';

		inject(function($compile, $rootScope, $timeout) {
			//create a scope (you could just use $rootScope, I suppose)
			scope = $rootScope;
			timeout = $timeout;

			//get the jqLite or jQuery element
			element = angular.element(html);

			//compile the element into a function to process the view.
			$compile(element)($rootScope);

			element.scope().items = single_test_data;
			element.scope().$digest();

			$(document.body).append(element);
		});
	});

	afterEach(function() {
		element.remove();
		elementn = null;
	});

	it('Should be able to create the directive.', function() {
		expect(element).not.toBeEmpty();
	});

	it('Should create a button', function() {
		expect(element).toContainElement('button[ng-bind-html="buttonLabel"]');
	});

	it('Should create the items layer & container', function() {
		expect(element).toContainElement('div.checkboxLayer');
		expect(element).toContainElement('div.checkBoxContainer');
	});

	it('Should contain 3 main categories', function() {
		expect($('div.checkboxLayer > div')).toHaveLength(2);
		expect($('div.checkBoxContainer > ul > li')).toHaveLength(3);
		expect($('div.checkBoxContainer > ul > li > div > div')).toContainText("Modern browsers");
	});

	it("Should handle 'hidden' items correctly", function() {
		expect($('.multiSelectItem')).toHaveLength(13);
	});

	it("Only 1 element (and all it's parents) should be checked", function() {
		expect($('.selected')).toHaveLength(3);
	});

	it("Should deselect all when clicked parent group", function() {
		$(".multiSelectItem > div:contains('Closed Source')").click();
		expect($('.selected')).toHaveLength(0);
	});

	it("When a group is clicked, should not mark itself as checked if it contains more than 1 element (even hidden elements block selection!)", function() {
		$(".multiSelectItem > div:contains('Closed Source')").click();
		expect($('.selected')).toHaveLength(0);

		$(".multiSelectItem > div:contains('Closed Source')").click();
		expect($('.selected')).toHaveLength(0);

		$(".multiSelectItem > div:contains('Open Source')").click();
		expect($('.selected')).toHaveLength(0);
	});

	it("Should filter correctly when searching", function() {
		$('input.inputFilter').val("chro");
		$('input.inputFilter').trigger("input");
		expect($('.multiSelectItem')).toHaveLength(5);
	});

	it("Should be visible when the button is clicked", function() {
		$('button.ams_button').click();
		expect('div.checkboxLayer').toBeVisible();
	});

	it("Should focus the input when opened", function() {
		$('button.ams_button').click();
		timeout.flush();
		expect($('input.inputFilter')).toBeFocused();
	});

	it("Should focus elements when using arrows", function() {
		var event = document.createEvent("Events");
		event.initEvent("keydown", true, true);
		event.which = 40;

		$('button.ams_button').click();
		scope.$broadcast('angular-multi-select-keydown', { event: event } );
		scope.$broadcast('angular-multi-select-keydown', { event: event } );

		expect($('.multiSelectFocus')).toHaveLength(1);
	});

	it("Should react to 'select all' by unselecting everything (because we're in single mode)", function() {
		$('.ams_selectall').click();
		expect($('.selected')).toHaveLength(0);
	});

	it("Should react to 'select none'", function() {
		$('.ams_selectnone').click();
		expect($('.selected')).toHaveLength(0);
	});

	it("Should react to 'reset'", function() {
		$(".multiSelectItem > div:contains('Internet Explorer')").click();
		expect($('.selected')).toHaveLength(2);
		$('.ams_reset').click();
		expect($('.selected')).toHaveLength(3);
	});

	it("Should react to 'clear'", function() {
		$('input.inputFilter').val("chro");
		$('input.inputFilter').trigger("input");
		expect($('.multiSelectItem')).toHaveLength(5);

		$('.ams_clear').click();
		expect($('.multiSelectItem')).toHaveLength(13);
	});
});

describe('Testing directive in multi mode', function() {
	var scope, element, html, timeout;

	beforeEach(function (){
		//load the module
		module('angular-multi-select');

		//set our view html.
		html = '<div angular-multi-select ' +
			'hidden-property="hidden" ' +
			'input-model="items" ' +
			'output-model="x" ' +
			'group-property="sub" ' +
			'tick-property="check" ' +
			'item-label="{{ name }}" ' +
			'helper-elements="all none reset filter"' +
			'selection-mode="multi" ' +
			'min-search-length="3" ' +
			'search-property="name" ' +
		'></div>';

		inject(function($compile, $rootScope, $timeout) {
			//create a scope (you could just use $rootScope, I suppose)
			scope = $rootScope;
			timeout = $timeout;

			//get the jqLite or jQuery element
			element = angular.element(html);

			//compile the element into a function to process the view.
			$compile(element)($rootScope);

			element.scope().items = multi_test_data;
			element.scope().$digest();

			$(document.body).append(element);
		});
	});

	afterEach(function() {
		element.remove();
		elementn = null;
	});

	it('Should be able to create the directive.', function() {
		expect(element).not.toBeEmpty();
	});

	it("4 elements (and all their parents) should be checked", function() {
		expect($('.selected')).toHaveLength(8);
	});

	it("Should deselect all when clicked parent group", function() {
		$(".multiSelectItem > div:contains('Open Source')").click();
		expect($('.selected', ".multiSelectItem > div:contains('Open Source')" )).toHaveLength(0);
	});

	it("Should select all when a group with no checked children is clicked", function() {
		$(".multiSelectItem > div:contains('Modern browsers')").click().click();
		expect($('.selected', "li:contains('Modern browsers')" )).toHaveLength(7);
	});

	it("Should deselect all when a group is clicked, if all elements are selected", function() {
		$(".multiSelectItem > div:contains('Modern browsers')").click();
		expect($('.selected', "li:contains('Modern browsers')" )).toHaveLength(0);
	});

	it("Should react to 'select all' by selecting everything", function() {
		$('.ams_selectall').click();
		expect($('.selected')).toHaveLength(13);
	});

	it("Should react to 'select none' by unselecting everything", function() {
		$('.ams_selectnone').click();
		expect($('.selected')).toHaveLength(0);
	});
});
