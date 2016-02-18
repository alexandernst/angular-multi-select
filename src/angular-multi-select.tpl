<div class="ams-button">
	<div class="">This is AMS</div>
	<div class="caret"></div>
</div>

<div class="container">

	<div
		ng-repeat="item in items"
		class="item level_{{ item.level }}
			{{ amssh.get_type_class(item) }}
			{{ amssh.get_open_class(item) }}"
	>
		<!-- Caret -->
		<div
			class="caret {{ amssh.get_open_class(item) }}"
			ng-click="amse.toggle_open_node(item)"
		></div>

		<!-- Text of the element -->
		<div>
			{{ item.text }} ({{ item.value }}) | Marcados {{ item.checked_children }} de {{ item.children_leafs }} leafs (y {{ item.children_nodes }} nodes) | {{ item.tree_visibility }}
		</div>

		<!-- Check holder -->
		<div
			class="check {{ amssh.get_checked_class(item) }}"
			ng-click="amse.toggle_check_node(item)"
		>
		</div>
	</div>

</div>
