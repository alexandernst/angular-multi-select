var chalk = require('chalk');

exports.print_tree = function (data) {
	var last_level = 0;
	for (var i = 0; i < data.length; i++) {
	    var el = data[i];
	    var lvl = el.level * 4;

	    if(last_level < lvl) {
	        if(last_level == 0) {
	            console.log("└" + "─".repeat(lvl - 1) + "┐");
	        } else {
	            console.log(" ".repeat(last_level) + "└" + "─".repeat(lvl - last_level - 1) + "┐");
	        }
	    }

		var open_state = el.open ? "open" : "closed";
		if (Number.isInteger(el.checked)) {
			if (el.children === el.checked) {
				var check_state = chalk.green("✓");
			} else if (el.checked === 0) {
				var check_state = chalk.red("✗");
			} else {
				var check_state = chalk.yellow("~");
			}
		} else {
			var check_state = el.checked ? chalk.green("✓") : chalk.red("✗");
		}

		if(el.tree_visibility === true) {
			var label = chalk.green(el.text) + " (" + open_state + ") " + check_state;
		} else {
			var label = chalk.red(el.text) + " (" + open_state + ") " + check_state;
		}

		label += " | children -> " + el.children;

		label += " | parents_id -> " + el.parents_id.toString();

	    console.log(" ".repeat(lvl) + "├" + label);

	    last_level = lvl;
	}

}
