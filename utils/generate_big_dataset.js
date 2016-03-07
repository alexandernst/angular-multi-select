fs = require('fs');
DataFixture = require('datafixture.js');

var id = 0;
function getId() {
    return id++;
}

function randomString(len, an){
    an = an&&an.toLowerCase();
    var str="", i=0, min=an=="a"?10:0, max=an=="n"?10:62;
    for(;i++<len;){
      var r = Math.random()*(max-min)+min <<0;
      str += String.fromCharCode(r+=r>9?r<36?55:61:48);
    }
    return str;
}

var template = {
    text: function () { return randomString(10) },
    value: function () { return getId() },
    children: {
        '#': "0...15",
        text: function () { return randomString(10) },
        value: function () { return getId() },
        children: {
            '#': "0...10",
            text: function () { return randomString(10) },
            value: function () { return getId() },
            children: {
                '#': "0...5",
                text: function () { return randomString(10) },
                value: function () { return getId() }
            }
        }
    }
};

var res = DataFixture.generate(template, 300);

console.log("Total number of objects is", id);
fs.writeFile("big_dataset.js", "var big_dataset = " + JSON.stringify(res, null, '\t') );