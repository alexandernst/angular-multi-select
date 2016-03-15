describe('Testing basic functionality of AMS', function () {
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
		expect($('.ams-caret.open')).toHaveLength(4);
		expect($('.ams-caret.closed')).toHaveLength(4);
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

describe('Testing AMS with different name properties', function () {
	var $scope, element, timeout;

	beforeEach(function (){
		module('angular-multi-select');

		jasmine.getFixtures().fixturesPath = 'specs/ams';
		jasmine.getFixtures().load('demo_simple_2.html');
		element = document.getElementById('demo_container');

		inject(function($rootScope, $compile, $timeout) {
			$scope = $rootScope.$new();
			timeout = $timeout;

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
		expect($('.ams-caret.open')).toHaveLength(4);
		expect($('.ams-caret.closed')).toHaveLength(4);
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

describe('Testing AMS positioning capabilities', function () {
	var $scope, element, timeout;

	beforeEach(function (){
		module('angular-multi-select');

		jasmine.getFixtures().fixturesPath = 'specs/ams';
		jasmine.getFixtures().load('demo_positioning.html');
		element = document.getElementById('demo_container');

		inject(function($rootScope, $compile, $timeout) {
			$scope = $rootScope.$new();
			timeout = $timeout;

			$compile(element)($scope);

			$scope.input_data = to_internal_data_1;
			$scope.output_data = [];

			$scope.$digest();
		});
	});

	it('It should place the container on top of the button if there is not enough space below', function () {
		var el = $('#demo_container');
		el.css("bottom", "10px");

		var btn = $('.ams-button');
		btn.triggerHandler("click");

		$scope.$digest();
		timeout.flush();

		var container = $('.ams-container');
		var btn_rect = el[0].getBoundingClientRect();
		var container_rect = container[0].getBoundingClientRect();

		var translate = container[0].style.transform.split(/[()]/)[1].split(",").map(function (n) {
			return parseFloat(n);
		});

		expect(container_rect.top + translate[1]).toEqual(btn_rect.top - container_rect.height);
	});

	it('It should place the container below the button if there is not enough space below and above the button', function () {
		var el = $('#demo_container');
		el.css("bottom", "280px");

		var btn = $('.ams-button');
		btn.triggerHandler("click");

		$scope.$digest();
		timeout.flush();

		var container = $('.ams-container');
		var btn_rect = el[0].getBoundingClientRect();
		var container_rect = container[0].getBoundingClientRect();

		expect(container_rect.top).toEqual(btn_rect.top + btn_rect.height);
	});

	it('It should place the container on the left of the button if there is no enough space on the right', function () {
		var el = $('#demo_container');
		el.css("right", "80px");

		var btn = $('.ams-button');
		btn.triggerHandler("click");

		$scope.$digest();
		timeout.flush();

		var container = $('.ams-container');
		var btn_rect = el[0].getBoundingClientRect();
		var container_rect = container[0].getBoundingClientRect();

		var translate = container[0].style.transform.split(/[()]/)[1].split(",").map(function (n) {
			return parseFloat(n);
		});

		expect(container_rect.right + translate[0]).toEqual(btn_rect.right);
	});

	it('It should place the container on the right of the button if there is no enough space on the left and on the right', function () {
		var el = $('#demo_container');
		el.css("right", "200px");

		var btn = $('.ams-button');
		btn.triggerHandler("click");

		$scope.$digest();
		timeout.flush();

		var container = $('.ams-container');
		var btn_rect = el[0].getBoundingClientRect();
		var container_rect = container[0].getBoundingClientRect();

		expect(container_rect.left).toEqual(btn_rect.left);
		expect(container[0].style.transform).toEqual("");
	});
});

describe('Testing multiple AMS instances', function () {
	var $scope, element;

	beforeEach(function (){
		module('angular-multi-select');

		jasmine.getFixtures().fixturesPath = 'specs/ams';
		jasmine.getFixtures().load('demo_multiple.html');
		element = document.getElementById('demo_container');

		inject(function($rootScope, $compile) {
			$scope = $rootScope.$new();

			$compile(element)($scope);

			$scope.input_data_1 = to_internal_data_1;
			$scope.output_data_1 = [];

			$scope.input_data_2 = to_internal_data_2;
			$scope.output_data_2 = [];

			$scope.$digest();
		});
	});

	it('It should be able to isolate each instance from the rest', function () {
		expect($scope.output_data_1.length).toEqual(2);
		expect($scope.output_data_2.length).toEqual(3);
	});
});

describe('Testing AMS preselect functionality', function () {
	var $scope, element;

	beforeEach(function (){
		module('angular-multi-select');

		jasmine.getFixtures().fixturesPath = 'specs/ams';
		jasmine.getFixtures().load('demo_preselect.html');
		element = document.getElementById('demo_container');

		inject(function($rootScope, $compile) {
			$scope = $rootScope.$new();

			$compile(element)($scope);

			$scope.input_data = to_internal_data_1;
			$scope.output_data = [];

			$scope.$digest();
		});
	});

	it('It should be able to preselect', function () {
		expect($scope.output_data[3].value).toEqual('w');
	});
});

describe('Testing AMS with URL string as input data', function () {
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

describe('Testing AMS search capabilities', function () {
	var $scope, timeout, element;

	beforeEach(function (){
		module('angular-multi-select');

		jasmine.getFixtures().fixturesPath = 'specs/ams';
		jasmine.getFixtures().load('demo_search.html');
		element = document.getElementById('demo_container');

		inject(function($rootScope, $compile, $timeout) {
			$scope = $rootScope.$new();
			timeout = $timeout;

			$compile(element)($scope);

			$scope.input_data = to_internal_data_1;
			$scope.output_data = [];

			$scope.$digest();
		});
	});

	it('It should perform a search correctly', function () {
		angular.element('.ams-search-field').val('A').trigger('input');

		timeout.flush();

		expect($('.ams-item')).toHaveLength(1);
		expect($('.ams-item-text').text()).toEqual("A (a)");
	});
});

describe('Testing AMS hide_helper attribute', function () {
	var $scope, compile;

	beforeEach(function () {
		module('angular-multi-select');

		inject(function ($rootScope, $compile) {
			$scope = $rootScope.$new();
			compile = $compile;
		});
	});

	it('It should be able to hide the "Check all" button', function () {
		var element = angular.element('<div angular-multi-select hide-helpers="check_all"></div>');
		compile(element)($scope);
		$scope.$digest();

		expect($('.ams-btn.all', element).hasClass('ng-hide')).toEqual(true);
		expect($('.ams-btn.none', element).hasClass('ng-hide')).toEqual(false);
		expect($('.ams-btn.reset', element).hasClass('ng-hide')).toEqual(false);
	});

	it('It should be able to hide the "Check none" button', function () {
		element = angular.element('<div angular-multi-select hide-helpers="check_none"></div>');
		compile(element)($scope);
		$scope.$digest();

		expect($('.ams-btn.all', element).hasClass('ng-hide')).toEqual(false);
		expect($('.ams-btn.none', element).hasClass('ng-hide')).toEqual(true);
		expect($('.ams-btn.reset', element).hasClass('ng-hide')).toEqual(false);
	});

	it('It should be able to hide the "Reset" button', function () {
		element = angular.element('<div angular-multi-select hide-helpers="reset"></div>');
		compile(element)($scope);
		$scope.$digest();

		expect($('.ams-btn.all', element).hasClass('ng-hide')).toEqual(false);
		expect($('.ams-btn.none', element).hasClass('ng-hide')).toEqual(false);
		expect($('.ams-btn.reset', element).hasClass('ng-hide')).toEqual(true);
	});

	it('It should be able to hide multiple helper buttons', function () {
		element = angular.element('<div angular-multi-select hide-helpers="check_all, reset"></div>');
		compile(element)($scope);
		$scope.$digest();

		expect($('.ams-btn.all', element).hasClass('ng-hide')).toEqual(true);
		expect($('.ams-btn.none', element).hasClass('ng-hide')).toEqual(false);
		expect($('.ams-btn.reset', element).hasClass('ng-hide')).toEqual(true);
	});
});

describe('Testing AMS output-related fields', function () {
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
