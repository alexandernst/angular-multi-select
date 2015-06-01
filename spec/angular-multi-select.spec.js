describe('Testing directive in single mode', function() {
	var scope, element, directive, html, timeout;

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
			'item-label="{| name |}" ' +
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

			element.scope().items = test_data;
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
		expect($('div[ng-bind-html="_createLabel(item)"]')).toHaveLength(13);
	});

	it("Only 1 element (and all it's parents) should be checked", function() {
		expect($('.selected')).toHaveLength(3);
	});

	it("Should deselect all when clicked parent group", function() {
		$($("div.ng-binding:contains('Closed Source')")[0]).click();
		expect($('.selected')).toHaveLength(0);
	});

	it("Should not mark as checked a group with more than 1 element (even hidden elements block selection!)", function() {
		$($("div.ng-binding:contains('Closed Source')")[0]).click();
		expect($('.selected')).toHaveLength(0);

		$($("div.ng-binding:contains('Closed Source')")[0]).click();
		expect($('.selected')).toHaveLength(0);

		$($("div.ng-binding:contains('Open Source')")[0]).click();
		expect($('.selected')).toHaveLength(0);
	});

	it("Should filter correctly when searching", function() {
		$('input.inputFilter').val("chro");
		$('input.inputFilter').trigger("input");
		expect($('div[ng-bind-html="_createLabel(item)"]')).toHaveLength(5);
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

	it("Should focus elements when using arrows");
	it("Should react to 'select all'");
	it("Should react to 'select none'");
	it("Should react to 'reset'");
	it("Should react to 'clear'");

});
