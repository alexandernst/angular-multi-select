myApp.controller( 'demoSingleSelectionMode' , [ '$scope' , function ($scope) {

	$scope.modernBrowsers = [
		{
			icon: '<img src="https://cdn1.iconfinder.com/data/icons/fatcow/32/opera.png" />',
			name: 'Opera',
			checked: false
		},
		{
			icon: '<img  src="https://cdn1.iconfinder.com/data/icons/fatcow/32/internet_explorer.png" />',
			name: 'Internet Explorer',
			checked: false
		},
		{
			icon: '<img  src="https://cdn1.iconfinder.com/data/icons/humano2/32x32/apps/firefox-icon.png" />',
			name: 'Firefox',
			checked: true
		},
		{
			icon: '<img  src="https://cdn1.iconfinder.com/data/icons/fatcow/32x32/safari_browser.png" />',
			name: 'Safari',
			checked: false
		},
		{
			icon: '<img  src="https://cdn1.iconfinder.com/data/icons/google_jfk_icons_by_carlosjj/32/chrome.png" />',
			name: 'Chrome',
			checked: false
		}
	];
}]);
