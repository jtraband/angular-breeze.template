var fs = require('fs');

// Change the webpack production configuration used by angular cli
// The `keep_fnames` setting is required to use classnames in the app
var file = "node_modules/@angular/cli/models/webpack-configs/production.js";
var search = "mangle: { screw_ie8: true, keep_fnames: true },";
var replace = "mangle: { screw_ie8: true },";

replaceInFile(file, search, replace);

function replaceInFile(filename, search, replace) {
    fs.readFile(filename, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(search, replace);
        if (result === data) {
            console.log("postinstall: no change to file " + file);
            return;
        }

        fs.writeFile(filename, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
        console.log("postinstall: changed file " + file);
    });
}
