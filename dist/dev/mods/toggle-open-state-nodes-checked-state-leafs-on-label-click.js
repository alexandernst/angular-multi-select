'use strict';

var angular_multi_select = angular.module('angular-multi-select');

angular_multi_select.run(['$templateCache', function ($templateCache) {
	var tpl = $templateCache.get('angular-multi-select.tpl');

	tpl = tpl.replace(/(class="(?:.*?)ams-item-text(?:.*?)")/gi, '$1 ng-click="item[amsc.INTERNAL_KEY_CHILDREN_LEAFS] === 0 && amse.toggle_check_node(item) || amse.toggle_open_node(item)"');

	$templateCache.put('angular-multi-select.tpl', tpl);
}]);
