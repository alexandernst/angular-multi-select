var _ = require("lodash");

/*
 ██████  ███████ ████████     ██    ██ ██ ███████ ██ ██████  ██      ███████
██       ██         ██        ██    ██ ██ ██      ██ ██   ██ ██      ██
██   ███ █████      ██        ██    ██ ██ ███████ ██ ██████  ██      █████
██    ██ ██         ██         ██  ██  ██      ██ ██ ██   ██ ██      ██
 ██████  ███████    ██          ████   ██ ███████ ██ ██████  ███████ ███████
*/
exports.get_open_tree = function (db) {
	return db.chain()
		.find({})
		//.find({'tree_visibility': true})
		.simplesort("order", false)
		.data();
}

/*
 ██████  ███████ ████████     ███    ██  ██████  ██████  ███████     ████████ ██████  ███████ ███████
██       ██         ██        ████   ██ ██    ██ ██   ██ ██             ██    ██   ██ ██      ██
██   ███ █████      ██        ██ ██  ██ ██    ██ ██   ██ █████          ██    ██████  █████   █████
██    ██ ██         ██        ██  ██ ██ ██    ██ ██   ██ ██             ██    ██   ██ ██      ██
 ██████  ███████    ██        ██   ████  ██████  ██████  ███████        ██    ██   ██ ███████ ███████
*/
exports.get_node_tree = function (db, id) {
	return db.chain()
		.find({
			'$and': [
				{
					parents_id: {
						'$contains': id
					}
				}
			]
		})
		.simplesort("order", false)
		.data();
}

/*
 ██████  ██████  ███████ ███    ██     ███    ██  ██████  ██████  ███████
██    ██ ██   ██ ██      ████   ██     ████   ██ ██    ██ ██   ██ ██
██    ██ ██████  █████   ██ ██  ██     ██ ██  ██ ██    ██ ██   ██ █████
██    ██ ██      ██      ██  ██ ██     ██  ██ ██ ██    ██ ██   ██ ██
 ██████  ██      ███████ ██   ████     ██   ████  ██████  ██████  ███████
*/
exports.open_node = function (db, id) {
	db.chain()
		.find({
			'id': id
		})
		.update(function (obj) {
			obj.open = true;
			obj.tree_visibility = true;
			return obj;
		});

	db.chain()
		.find({
			'parents_id': {
				'$contains': id
			}
		})
		.simplesort("order", false)
		.mapReduce(function (obj) { //map
			return obj;
		}, function (objs) { //reduce
			var tree_open_ids = {};

			function has_any (obj, arr) {
				for (var i = 0; i < arr.length; i++) {
					if(obj.hasOwnProperty(arr[i])) return true;
				}

				return false;
			}

			for (var i = 0; i < objs.length; i++) {
				var obj = objs[i];

				if (obj.open === true) {
					tree_open_ids[obj.id] = true;
					obj.tree_visibility = true;
				} else if (obj.open === false && has_any(tree_open_ids, obj.parents_id)) {
					obj.tree_visibility = true;
					i += obj.children;
				} else {
					i += obj.children;
				}
			}
		});
}

/*
 ██████ ██       ██████  ███████ ███████     ███    ██  ██████  ██████  ███████
██      ██      ██    ██ ██      ██          ████   ██ ██    ██ ██   ██ ██
██      ██      ██    ██ ███████ █████       ██ ██  ██ ██    ██ ██   ██ █████
██      ██      ██    ██      ██ ██          ██  ██ ██ ██    ██ ██   ██ ██
 ██████ ███████  ██████  ███████ ███████     ██   ████  ██████  ██████  ███████
*/
exports.close_node = function (db, id) {
	db.chain()
		.find({
			'id': id
		})
		.update(function (obj) {
			obj.open = false;
			obj.tree_visibility = true;
			return obj;
		});

	db.chain()
		.find({
			'parents_id': {
				'$contains': id
			}
		})
		.update(function (obj) {
			obj.tree_visibility = false;
			return obj;
		});
}

/*
 ██████ ██   ██ ███████  ██████ ██   ██     ███    ██  ██████  ██████  ███████
██      ██   ██ ██      ██      ██  ██      ████   ██ ██    ██ ██   ██ ██
██      ███████ █████   ██      █████       ██ ██  ██ ██    ██ ██   ██ █████
██      ██   ██ ██      ██      ██  ██      ██  ██ ██ ██    ██ ██   ██ ██
 ██████ ██   ██ ███████  ██████ ██   ██     ██   ████  ██████  ██████  ███████
*/
exports.check_node = function (db, id) {

}
