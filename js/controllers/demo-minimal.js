myApp.controller( 'demoMinimal' , [ '$scope' , function ($scope) {

	$scope.modernBrowsers = [
		{
			icon: '<img  src="https://cdn1.iconfinder.com/data/icons/google_jfk_icons_by_carlosjj/32/chrome.png" />',
			name: "Chrome"
		},
		{
			icon: '<img  src="https://cdn0.iconfinder.com/data/icons/fatcow/32x32/safari_browser.png" />',
			name: "Safari"
		},
		{
			icon: '<img  src="https://cdn2.iconfinder.com/data/icons/humano2/32x32/apps/firefox-icon.png" />',
			name: "Firefox",
			check: true
		},
		{
			icon: '<img  src="https://cdn2.iconfinder.com/data/icons/new_google_product_icons_by_carlosjj-dwke/32/chromium.png" />',
			name: "Chromium",
			check: true
		},
		{
			icon: '<img  src="https://cdn1.iconfinder.com/data/icons/logotypes/32/opera-32.png" />',
			name: "Opera",
			check: true
		},
		{
			icon: '<img src="https://cdn1.iconfinder.com/data/icons/fs-icons-ubuntu-by-franksouza-/32/epiphany-icon.png" />',
			name: "Epiphany"
		},
		{
			icon: '<img  src="https://cdn1.iconfinder.com/data/icons/CrystalClear/32x32/apps/netscape.png" />',
			name: "Netscape"
		},
		{
			icon: '<img src="https://cdn1.iconfinder.com/data/icons/CrystalClear/32x32/apps/konqueror.png" />',
			name: "Konqueror"
		},
		{
			icon: '<img src="https://cdn4.iconfinder.com/data/icons/iconsimple-logotypes/512/internet_explorer-32.png" />',
			name: "Internet Explorer"
		}
	];
}]);
