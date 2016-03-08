describe('Testing basic functionality of AMS', function() {
	var $scope, element;

	beforeEach(function (){
		module('angular-multi-select');

		jasmine.getFixtures().fixturesPath = 'specs/ams';
		jasmine.getFixtures().load('demo_simple.html');
		element = document.getElementById('demo_container');

		inject(function($rootScope, $compile) {
			$scope = $rootScope.$new();

			$compile(element)($scope);

			$scope.input_data = to_internal_data_2;
			$scope.output_data = [];

			$scope.$digest();
		});
	});

	it('It should be able to create itself and attach to DOM', function () {
		expect(element).toContainElement('.ams-button');
		expect(element).toContainElement('.ams-container');
	});

	it('It should render visible items correctly', function () {
		expect($('.ams-item')).toHaveLength(15);
		expect($('.ams-item.leaf')).toHaveLength(7);
		expect($('.ams-item.node')).toHaveLength(8);
	});

	it('It should correctly render open/close carets', function () {
		expect($('.caret.open')).toHaveLength(4);
		expect($('.caret.closed')).toHaveLength(4);
	});

	it('It should correctly render checked/unchecked/mixed carets', function () {
		expect($('.check.checked')).toHaveLength(4);
		expect($('.check.mixed')).toHaveLength(4);
		expect($('.check.unchecked')).toHaveLength(7);
	});

	it('It should hide the search field if no search field is provided', function () {
		expect($('.ams-search-field')).toBeHidden();
	});

	it('It should render texts of leafs/nodes correctly', function () {
		var items = $('.ams-item-text');
		expect(items[0]).toContainText('A (a)');
		expect($(items[1]).text().replace(/\s{2,}/g, ' ')).toEqual('B (checked 1 / 1)');
		expect($(items[5]).text().replace(/\s{2,}/g, ' ')).toEqual('N (checked 1 / 5)');
		expect($(items[8]).text().replace(/\s{2,}/g, ' ')).toEqual('Q (checked 1 / 2)');
		expect($(items[14]).text().replace(/\s{2,}/g, ' ')).toEqual('X (checked 2 / 2)');
	});

	it('It should render text of button correctly', function () {
		expect($('.ams-button-text')).toContainText('5 checked items');
	});

});
