'use strict';

var angular_multi_select_consts = angular.module('angular-multi-select-constants', []);

angular_multi_select_consts.constant("angularMultiSelectConstants", {
	/*
  * Default key names of the input data
  */
	ID_PROPERTY: 'id',
	OPEN_PROPERTY: 'open',
	CHECKED_PROPERTY: 'checked',
	CHILDREN_PROPERTY: 'children',

	/*
  * Internal data keys
  */
	INTERNAL_KEY_LEVEL: '$ams_level',
	INTERNAL_KEY_ORDER: '$ams_order',
	INTERNAL_KEY_PARENTS_ID: '$ams_parents_id',
	INTERNAL_KEY_CHILDREN_LEAFS: '$ams_children_leafs',
	INTERNAL_KEY_CHILDREN_NODES: '$ams_children_nodes',
	INTERNAL_KEY_CHECKED_CHILDREN: '$ams_checked_children',
	INTERNAL_KEY_TREE_VISIBILITY: '$ams_tree_visibility',
	INTERNAL_KEY_CHECKED_MODIFICATION: '$ams_checked_modification',

	/*
  * This gets injected while processing the stats, in the dropdown
  * label. This allows us to iterate over the output model when
  * generating the dropdown label.
  */
	INTERNAL_KEY_OUTPUT_MODEL_HACK: '$ams_output_model_hack',
	INTERNAL_KEY_OUTPUT_TYPE_HACK: '$ams_output_type_hack',

	/*
  * Possible values of the input/internal data
  */
	INPUT_DATA_OPEN: true,
	INPUT_DATA_CLOSED: false,
	INTERNAL_DATA_OPEN: true,
	INTERNAL_DATA_CLOSED: false,

	INPUT_DATA_CHECKED: true,
	INPUT_DATA_UNCHECKED: false,
	INTERNAL_DATA_LEAF_CHECKED: true,
	INTERNAL_DATA_LEAF_UNCHECKED: false,
	INTERNAL_DATA_NODE_CHECKED: 1,
	INTERNAL_DATA_NODE_MIXED: 0,
	INTERNAL_DATA_NODE_UNCHECKED: -1,
	INTERNAL_DATA_NODE_CHECK_UNDEFINED: null,

	INTERNAL_DATA_VISIBLE: true,
	INTERNAL_DATA_INVISIBLE: false,
	INTERNAL_DATA_VISIBILITY_UNDEFINED: null,

	INTERNAL_STATS_CHECKED_LEAFS: '$ams_stats_checked_leafs',
	INTERNAL_STATS_CHECKED_NODES: '$ams_stats_checked_nodes',
	INTERNAL_STATS_UNCHECKED_NODES: '$ams_stats_unchecked_nodes',
	INTERNAL_STATS_TOTAL_LEAFS: '$ams_stats_total_leafs',
	INTERNAL_STATS_TOTAL_NODES: '$ams_stats_total_nodes',

	/*
  * Possible values of the output type of data
  */
	OUTPUT_DATA_TYPE_OBJECTS: 'objects',
	OUTPUT_DATA_TYPE_ARRAYS: 'arrays',
	OUTPUT_DATA_TYPE_OBJECT: 'object',
	OUTPUT_DATA_TYPE_ARRAY: 'array',
	OUTPUT_DATA_TYPE_VALUES: 'values',
	OUTPUT_DATA_TYPE_VALUE: 'value',

	/*
  * CSS classes helpers
  */
	CSS_OPEN: 'open',
	CSS_CLOSED: 'closed',

	CSS_LEAF_CHECKED: 'checked',
	CSS_LEAF_UNCHECKED: 'unchecked',
	CSS_NODE_MIXED: 'mixed',
	CSS_NODE_CHECKED: 'checked',
	CSS_NODE_UNCHECKED: 'unchecked',

	CSS_LEAF: 'leaf',
	CSS_NODE: 'node',

	/*
  * Possible values for the output data query
  */
	FIND_LEAFS: 'leafs',
	FIND_LEAFS_MIXED_NODES: 'leafs_mixed_nodes',
	FIND_LEAFS_CHECKED_NODES: 'leafs_checked_nodes',
	FIND_LEAFS_MIXED_CHECKED_NODES: 'leafs_mixed_checked_nodes',
	FIND_MIXED_NODES: 'midex_nodes',
	FIND_CHECKED_NODES: 'checked_nodes',
	FIND_MIXED_CHECKED_NODES: 'mixed_checked_nodes'
});
