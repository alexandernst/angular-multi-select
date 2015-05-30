'use strict'; 

var myApp = angular.module( 'myApp' , [ 
    'ngRoute',
    'angular.filter',
    'angular-multi-select'
])
.config([ '$routeProvider', function( $routeProvider ) {          

    $routeProvider.when( '/main' , {
        templateUrl: 'views/main.htm', 
        controller: 'demoMinimal'
    });

    $routeProvider.when( '/getting-started' , {
        templateUrl: 'views/getting-started.htm'
    });

    $routeProvider.when( '/configs-options' , {
        templateUrl: 'views/configs-options.htm', 
    });        

    $routeProvider.when( '/demo-minimum' , {
        templateUrl: 'views/demo-minimum.htm', 
        controller: 'demoMinimum'
    });        

    $routeProvider.when( '/demo-dynamic-update' , {
        templateUrl: 'views/demo-dynamic-update.htm', 
        controller: 'demoDynamicUpdate'
    });        

    $routeProvider.when( '/demo-grouping' , {
        templateUrl: 'views/demo-grouping.htm', 
        controller: 'demoGrouping'
    });

    $routeProvider.when( '/demo-helper-elements' , {
        templateUrl: 'views/demo-helper-elements.htm', 
        controller: 'demoMinimal'
    });            

    $routeProvider.when( '/demo-callbacks' , {
        templateUrl: 'views/demo-callbacks.htm', 
        controller: 'demoCallbacks'
    });        

    $routeProvider.when( '/demo-single-selection-mode' , {
        templateUrl: 'views/demo-single-selection-mode.htm', 
        controller: 'demoSingleSelectionMode'
    });            

    $routeProvider.when( '/dependency-compatibility' , {
        templateUrl: 'views/dependency-compatibility.htm'
    });

    $routeProvider.when( '/issues-bug-reporting' , {
        templateUrl: 'views/issues-bug-reporting.htm'
    });

    $routeProvider.when( '/contributing' , {
        templateUrl: 'views/contributing.htm'
    });
    

    $routeProvider.when( '/breaking-changes' , {
        templateUrl: 'views/breaking-changes.htm'
    });
    
    $routeProvider.when( '/mit-license' , {
        templateUrl: 'views/mit-license.htm'
    });
    

    $routeProvider.otherwise( {
        redirectTo: '/main'
    });

}]);

