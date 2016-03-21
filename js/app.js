'use strict';

var demo = angular.module('demo', [
	'ngRoute',
	'angular-multi-select'
])

.run([
	'$rootScope', '$window', '$location', function($rootScope, $window, $location) {
		$rootScope.$on('$routeChangeSuccess', function() {
			$window.ga('send', 'pageview', {page: $location.url()});
		});
	}
])

.filter('prettify', function ($sce) {
	function syntaxHighlight(json) {
		if (json === null) return;
		json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		var res = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
			var cls = 'ams-json-number';
			if (/^"/.test(match)) {
				if (/:$/.test(match)) {
					cls = 'ams-json-key';
				} else {
					cls = 'ams-json-string';
				}
			} else if (/true|false/.test(match)) {
				cls = 'ams-json-boolean';
			} else if (/null/.test(match)) {
				cls = 'ams-json-null';
			}
			return '<span class="' + cls + '">' + match + '</span>';
		});

		return $sce.trustAsHtml(res);
	}

	return syntaxHighlight;
})

.config(['$routeProvider', function($routeProvider) {

	$routeProvider.when('/main' , {
		templateUrl: 'views/main.html',
		controller: 'demoMain'
	});

	$routeProvider.when('/getting-started', {
		templateUrl: 'views/getting-started.html'
	});

	$routeProvider.when('/under-the-hood', {
		templateUrl: 'views/under-the-hood.html'
	});

	$routeProvider.when('/config-options', {
		templateUrl: 'views/config-options.html',
	});

	$routeProvider.when('/demo-minimal', {
		templateUrl: 'views/demo-minimal.html',
		controller: 'demoMinimal'
	});

	$routeProvider.when('/demo-output-types', {
		templateUrl: 'views/demo-output-types.html',
		controller: 'demoOutputTypes'
	});

	$routeProvider.when('/demo-button-styling', {
		templateUrl: 'views/demo-button-styling.html',
		controller: 'demoButtonStyling'
	});

	$routeProvider.when('/demo-leafs-nodes-styling', {
		templateUrl: 'views/demo-leafs-nodes-styling.html',
		controller: 'demoLeafsNodesStyling'
	});

	$routeProvider.when('/demo-grouping', {
		templateUrl: 'views/demo-grouping.html',
		controller: 'demoGrouping'
	});

	$routeProvider.when('/demo-helper-elements', {
		templateUrl: 'views/demo-helper-elements.html',
		controller: 'demoHelperElements'
	});

	$routeProvider.when('/demo-searching', {
		templateUrl: 'views/demo-searching.html',
		controller: 'demoSearching'
	});

	$routeProvider.when('/demo-single-selection-mode', {
		templateUrl: 'views/demo-single-selection-mode.html',
		controller: 'demoSingleSelectionMode'
	});

	$routeProvider.when('/demo-preselecting-values', {
		templateUrl: 'views/demo-preselecting-values.html',
		controller: 'demoPreselectingValues'
	});

	$routeProvider.when('/breaking-changes', {
		templateUrl: 'views/breaking-changes.html'
	});

	$routeProvider.when('/dependency-compatibility', {
		templateUrl: 'views/dependency-compatibility.html'
	});

	$routeProvider.when('/issues-bug-reporting', {
		templateUrl: 'views/issues-bug-reporting.html'
	});

	$routeProvider.when('/contributing', {
		templateUrl: 'views/contributing.html'
	});

	$routeProvider.when('/mit-license', {
		templateUrl: 'views/mit-license.html'
	});

	$routeProvider.otherwise( {
		redirectTo: '/main'
	});
}]);

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-27952342-7', 'auto');
