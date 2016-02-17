var angular_multi_select_consts = angular.module('angular-multi-select-constants', []);

angular_multi_select_consts.constant("angularMultiSelectConstants", {
	/*
	 * Default key names of the input data
	 */
	ID_PROPERTY                        : 'id',
	OPEN_PROPERTY                      : 'open',
	CHECKED_PROPERTY                   : 'checked',
	CHILDREN_PROPERTY                  : 'children',

	/*
	 * Possible values of the input data
	 */
	INPUT_DATA_CHECKED                 : true,
	INPUT_DATA_UNCHECKED               : false,
	INPUT_DATA_OPEN                    : true,
	INPUT_DATA_CLOSED                  : false,

	INTERNAL_DATA_LEAF_CHECKED         : true,
	INTERNAL_DATA_LEAF_UNCHECKED       : false,
	INTERNAL_DATA_NODE_CHECKED         : 1,
	INTERNAL_DATA_NODE_MIXED           : 0,
	INTERNAL_DATA_NODE_UNCHECKED       : -1,
	INTERNAL_DATA_NODE_CHECK_UNDEFINED : null,

	INTERNAL_DATA_VISIBLE              : true,
	INTERNAL_DATA_INVISIBLE            : false,
	INTERNAL_DATA_VISIBILITY_UNDEFINED : null
});
