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

			$scope.input_data = to_internal_data_1;
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


describe('Testing AMS with different name properties', function() {
	var $scope, element;

	beforeEach(function (){
		module('angular-multi-select');

		jasmine.getFixtures().fixturesPath = 'specs/ams';
		jasmine.getFixtures().load('demo_simple_2.html');
		element = document.getElementById('demo_container');

		inject(function($rootScope, $compile) {
			$scope = $rootScope.$new();

			$compile(element)($scope);

			$scope.input_data = to_internal_data_2;
			$scope.output_data = [];

			$scope.$digest();
		});
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

describe('Testing AMS with URL string as input data', function() {
	var $scope, element, httpBackend;

	beforeEach(function (){
		module('angular-multi-select');

		jasmine.getFixtures().fixturesPath = 'specs/ams';
		jasmine.getFixtures().load('demo_url.html');
		element = document.getElementById('demo_container');

		inject(function($rootScope, $compile, $httpBackend) {
			$scope = $rootScope.$new();
			httpBackend = $httpBackend;

			$httpBackend
				.whenGET('http://localhost:8080/foo/bar.json')
				.respond(200, to_internal_data_1);

			$compile(element)($scope);

			$scope.output_data = [];

			$scope.$digest();
		});
	});

	it('It should be able to handle URL string as input data', function () {
		httpBackend.flush();

		expect($scope.output_data.length).toEqual(5);
	});
});

describe('Testing AMS output-related fields', function() {
	var $scope, compile, element;

	beforeEach(function (){
		module('angular-multi-select');

		jasmine.getFixtures().fixturesPath = 'specs/ams';

		inject(function($rootScope, $compile) {
			$scope = $rootScope.$new();
			compile = $compile;

			$scope.input_data = to_internal_data_1;
			$scope.output_data = [];
		});
	});

	it('It should be able to handle "output-keys" property correctly', function () {
		jasmine.getFixtures().load('demo_output_keys.html');
		element = angular.element('div');

		compile(element)($scope);
		$scope.$digest();

		expect($scope.output_data).toEqual(demo_output_keys);
	});

	it('It should be able to handle "output-type" of type OUTPUT_DATA_TYPE_OBJECTS', function () {
		jasmine.getFixtures().load('demo_output_type_objects.html');
		element = angular.element('div');

		compile(element)($scope);
		$scope.$digest();

		expect($scope.output_data).toEqual(demo_output_type_objects);
	});

	it('It should be able to handle "output-type" of type OUTPUT_DATA_TYPE_OBJECT', function () {
		jasmine.getFixtures().load('demo_output_type_object.html');
		element = angular.element('div');

		compile(element)($scope);
		$scope.$digest();

		expect($scope.output_data).toEqual(demo_output_type_object);
	});

	it('It should be able to handle "output-type" of type OUTPUT_DATA_TYPE_ARRAYS', function () {
		jasmine.getFixtures().load('demo_output_type_arrays.html');
		element = angular.element('div');

		compile(element)($scope);
		$scope.$digest();

		expect($scope.output_data).toEqual(demo_output_type_arrays);
	});

	it('It should be able to handle "output-type" of type OUTPUT_DATA_TYPE_ARRAY', function () {
		jasmine.getFixtures().load('demo_output_type_array.html');
		element = angular.element('div');

		compile(element)($scope);
		$scope.$digest();

		expect($scope.output_data).toEqual(demo_output_type_array);
	});

	it('It should be able to handle "output-type" of type OUTPUT_DATA_TYPE_VALUE', function () {
		jasmine.getFixtures().load('demo_output_type_value.html');
		element = angular.element('div');

		compile(element)($scope);
		$scope.$digest();

		expect($scope.output_data).toEqual(demo_output_type_value);
	});
});
