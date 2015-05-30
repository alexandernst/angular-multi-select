myApp.controller( 'demoDynamicUpdate' , [ '$scope' , function ($scope) {               

    // This will be our input model
    $scope.dynamicData = [];

    // Just a function to switch the model
    $scope.switchSource = function( data ) {
        $scope.dynamicData = angular.copy( $scope[ data ] );
    }    

    // Modern browsers
    $scope.modernBrowsers = [
        { 
            icon: '<img src="https://cdn1.iconfinder.com/data/icons/fatcow/32/opera.png" />',
            name: 'Opera',
            checked: true
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
            checked: true
        }
    ];

    // Old browsers
    $scope.oldBrowsers = [
        { 
            icon: '<img  src="http://www.ucdmc.ucdavis.edu/apps/error/nojavascript/images/netscape_icon.jpg" />',
            name: 'Netscape Navigator',
            checked: true
        },
        { 
            icon: '<img  src="http://upload.wikimedia.org/wikipedia/en/thumb/f/f4/Amaya_logo_65x50.png/48px-Amaya_logo_65x50.png" />',             
            name: 'Amaya',
            checked: true
        },
        {
            icon: '<img  src="http://upload.wikimedia.org/wikipedia/commons/8/8c/WorldWideWeb_Icon.png" />',
            name: 'WorldWideWeb Nexus',
            checked: false
        }
    ];

    // Initially we'll use the modern browsers
    $scope.switchSource('modernBrowsers');
}]);
