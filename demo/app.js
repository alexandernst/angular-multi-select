var app = angular.module('app', ["angular-multi-select"]);

app.controller('MainCtrl', function($scope, $timeout) {

	$scope.modernBrowsers = [
		{
			name: "Group A",
			sub: [
				{
					icon: '<img  src="https://cdn1.iconfinder.com/data/icons/google_jfk_icons_by_carlosjj/32/chrome.png" />',
					name: "Chrome"
				},
				{
					id: 2,
					icon: '<img  src="https://cdn2.iconfinder.com/data/icons/humano2/32x32/apps/firefox-icon.png" />',
					name: "Firefox"
				},
				{
					icon: '<img  src="https://cdn2.iconfinder.com/data/icons/new_google_product_icons_by_carlosjj-dwke/32/chromium.png" />',
					name: "Chromium"
				}
			]
		},
		{
			name: "Group B",
			sub: [
				{
					icon: '<img  src="https://cdn0.iconfinder.com/data/icons/fatcow/32x32/safari_browser.png" />',
					name: "Safari",
					checked: true
				},
				{
					icon: '<img  src="https://cdn1.iconfinder.com/data/icons/logotypes/32/opera-32.png" />',
					name: "Opera",
					checked: true
				}
			]
		}
	];

	$scope.$watch("outputBrowsers", function(_new, _old) {
		if(_new && !angular.equals(_new, _old)) {
			//console.log(_new);
		}
	}, true);

	$scope.localLang = {
		selected: " seleccionado",
		selectAll: "Todo",
		selectNone: "Nada",
		reset: "Resetear",
		search: "Escribe aqui para buscar..."
	}

	$scope.clicked = function(item) {
		//console.log($scope.outputBrowsers);
		//console.log(item);
	}

	$scope.api = {};

	$timeout(function() {
		$scope.api.open();
	}, 2000);

	$timeout(function() {
		$scope.api.select_none();
	}, 2700);

	$timeout(function() {
		$scope.api.select(2);
	}, 3500);

});
