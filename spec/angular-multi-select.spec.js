describe('Testing directive', function() {
	var scope, elem, directive, compiled, html;

	beforeEach(function (){
		//load the module
		module('angular-multi-select');

		//set our view html.
		html = '<div angular-multi-select input-model="items"></div>';

		inject(function($compile, $rootScope) {
			//create a scope (you could just use $rootScope, I suppose)
			scope = $rootScope.$new();

			scope.items = [];

			//get the jqLite or jQuery element
			elem = angular.element(html);

			//compile the element into a function to process the view.
			compiled = $compile(elem)(scope);

			//call digest on the scope!
			scope.$apply();
		});
	});

	it('Should be able to create the directive.', function() {
		expect(elem).not.toBeEmpty();
	});

	it('Should create a button', function() {
		expect(elem).toContainElement('button[ng-bind-html="buttonLabel"]');
	});

	it('Should create the items layer', function() {
		expect(elem).toContainElement('div.checkboxLayer');
	});


});
