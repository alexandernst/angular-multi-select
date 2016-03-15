var angular_multi_select = angular.module('angular-multi-select');

angular_multi_select.run(['$templateCache', function($templateCache) {
	$templateCache.put('angular-multi-select.tpl', `

		<div class="ams-button" ng-click="open = !open">
			<div class="ams-button-text" ng-bind-html="amssh.create_dropdown_label(stats)"></div>
			<div class="ams-caret"></div>
		</div>

		<div class="ams-container ng-cloak" ng-show="open">

			<div class="ams-helpers">
				<div class="selects">
					<button class="all ams-btn" type="button" accesskey="a" ng-click="amse.check_all()" ng-hide="hide_helpers.indexOf('check_all') > -1">Check all</button>
					<button class="none ams-btn" type="button" accesskey="n" ng-click="amse.uncheck_all()" ng-hide="hide_helpers.indexOf('check_none') > -1">Check none</button>
				</div>

				<div class="resets">
					<button class="reset ams-btn" type="button" accesskey="r" ng-click="reset()" ng-hide="hide_helpers.indexOf('reset') > -1">Reset data</button>
				</div>
			</div>

			<div class="ams-search" ng-show="search_field !== null">
				<input class="ams-search-field" type="text" name="ams-search-field" value="" ng-model="search" autofocus>
				<div class="ams-spinner" ng-show="search_spinner_visible"></div>
				<button class="clear ams-btn" type="button" accesskey="c" name="clear" ng-click="search = ''"></button>
			</div>

			<div class="ams-items">
				<div
					ng-repeat="item in items track by item[ops.ID_PROPERTY]"
					class="ams-item {{ amssh.get_level_class(item) }} {{ amssh.get_type_class(item) }} {{ amssh.get_open_class(item) }}"
				>
					<!-- Caret -->
					<div
						class="ams-caret {{ amssh.get_open_class(item) }}"
						ng-click="amse.toggle_open_node(item)"
					></div>

					<!-- Text of the element -->
					<div class="ams-item-text" ng-bind-html="amssh.create_label(item)"></div>

					<!-- Check holder -->
					<div
						class="check {{ amssh.get_checked_class(item) }}"
						ng-click="amse.toggle_check_node(item)"
					>
					</div>
				</div>
			</div>

		</div>

	`);
}]);
