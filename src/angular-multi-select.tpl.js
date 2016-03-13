var angular_multi_select = angular.module('angular-multi-select');

angular_multi_select.run(function($templateCache) {
	$templateCache.put('angular-multi-select.tpl', `

		<div class="ams-button" ng-click="open = !open">
			<div class="ams-button-text" ng-bind-html="amssh.create_dropdown_label(stats)"></div>
			<div class="caret"></div>
		</div>

		<div class="ams-container ng-cloak" ng-show="open">

			<div class="ams-helpers">
				<div class="selects">
					<button class="all btn" type="button" ng-click="amse.check_all()">Check all</button>
					<button class="none btn" type="button" ng-click="amse.uncheck_all()">Check none</button>
				</div>

				<div class="resets">
					<button class="reset btn" type="button" ng-click="reset()">Reset data</button>
				</div>
			</div>

			<div class="ams-search" ng-show="search_field !== null">
				<input class="ams-search-field" type="text" name="ams-search-field" value="" ng-model="search" autofocus>
				<div class="ams-spinner" ng-show="search_spinner_visible"></div>
				<button class="clear btn" type="button" name="clear" ng-click="search = ''"></button>
			</div>

			<div class="ams-items">
				<div
					ng-repeat="item in items track by item[ops.ID_PROPERTY]"
					class="ams-item {{ amssh.get_level_class(item) }} {{ amssh.get_type_class(item) }} {{ amssh.get_open_class(item) }}"
				>
					<!-- Caret -->
					<div
						class="caret {{ amssh.get_open_class(item) }}"
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

});
