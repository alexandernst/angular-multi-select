sleep = require("sleep");

loki = require('lokijs')
var db = new loki();

// Add a collection to the database
var items = db.addCollection('items', {
    indices: ['id']
});

// Add some documents to the collection
var example_data = require("./data.js");
var data_transformer = require("./data_transformer.js");

internal_data = data_transformer.to_internal(example_data.orig_data);

for (var i = 0; i < internal_data.length; i++) {
    items.insert(internal_data[i]);
}

var utils = require("./utils.js");
var funcs = require("./funcs.js");

process.stdout.write('\033c');
utils.print_tree(funcs.get_open_tree(items));

return;

//Close R
sleep.sleep(3);
process.stdout.write('\033c');
funcs.close_node(items, 18);
utils.print_tree(funcs.get_open_tree(items));

//Close P
sleep.sleep(3);
process.stdout.write('\033c');
funcs.close_node(items, 16);
utils.print_tree(funcs.get_open_tree(items));

//Open P
sleep.sleep(3);
process.stdout.write('\033c');
funcs.open_node(items, 16);
utils.print_tree(funcs.get_open_tree(items));

//Open R
sleep.sleep(3);
process.stdout.write('\033c');
funcs.open_node(items, 18);
utils.print_tree(funcs.get_open_tree(items));
