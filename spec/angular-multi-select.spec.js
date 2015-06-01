describe('Testing directive in single mode', function() {
	var scope, element, directive, html;

	beforeEach(function (){
		//load the module
		module('angular-multi-select');

		//set our view html.
		html = '<div angular-multi-select input-model="items" output-model="x" group-property="sub" tick-property="check" item-label="{| name |}" selection-mode="single"></div>';

		inject(function($compile, $rootScope) {
			//create a scope (you could just use $rootScope, I suppose)
			scope = $rootScope;

			//get the jqLite or jQuery element
			element = angular.element(html);

			//compile the element into a function to process the view.
			$compile(element)($rootScope);

			element.scope().items = test_data;
			element.scope().$digest();
		});
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
		expect($('div.checkboxLayer > div', element)).toHaveLength(2);
		expect($('div.checkBoxContainer > ul > li', element)).toHaveLength(3);
		expect($('div.checkBoxContainer > ul > li > div > div', element)).toContainText(test_data[0].name);
	});

	it("Should handle 'hidden' items correctly", function() {
		expect($('div.checkBoxContainer > ul > li > ul > li', element)[0]).toHaveLength(1);
		expect($('div.checkBoxContainer > ul > li > ul > li > ul > li div[ng-bind-html="_createLabel(item)"]', element)[0]).toContainText(test_data[0].sub[0].sub[0].name);
	});


});
