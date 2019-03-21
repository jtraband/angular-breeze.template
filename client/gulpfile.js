var gulp = require('gulp');
var gutil = require('gulp-util');
var taskListing = require('gulp-task-listing');
var fs = require('fs');
var path = require('canonical-path');
var xSpawn = require('cross-spawn');
var Q = require('q');

var _ = require('lodash');

var tsGen = require('./tools/entity-generator/tsgen-core');

// Public tasks

gulp.task('default', ['help']);

gulp.task('help', taskListing.withFilters(function (taskName) {
    var isSubTask = taskName.substr(0, 1) == "_";
    return isSubTask;
}, function (taskName) {
    var shouldRemove = taskName === 'default';
    return shouldRemove;
}));

gulp.task('generate-entities', function () {
    tsGen.generate({
        inputFileName: './src/app/model/entities/SCInsight-Site.metadata.json',
        outputFolder: './src/app/model/entities/site',
        camelCase: true,
        kebabCaseFileNames: true,
        baseClassName: 'BaseEntity',
        codePrefix: 'Site'
    });
    tsGen.generate({
        inputFileName: './src/app/model/entities/SCInsight-Company.metadata.json',
        outputFolder: './src/app/model/entities/company',
        camelCase: true,
        kebabCaseFileNames: true,
        baseClassName: 'BaseEntity',
        codePrefix: 'Company'
    });
});

gulp.task('generate-metadata', function() {
    // assumes that the 'breeze.tooling' github repo exists on disk as a sibling of this repo
    // var exe = fs.realpathSync('./tools/metadata-generator/MetadataGenerator.exe');
    var exe = fs.realpathSync('/git/Breeze/breeze.tooling/MetadataGenerator/MetadataGenerator/bin/Debug/MetadataGenerator.exe');
    var spawnInfo1 = spawnExt(exe,
      ['-i', '../SCInsight/SCInsight.Data.Company/bin/debug/SCInsight.Data.Company.dll', 
      '-o', './src/app/model/entities/SCInsight-Company.metadata.json' ]);
    var spawnInfo2 = spawnExt(exe,
      ['-i', '../SCInsight/SCInsight.Data.Site/bin/debug/SCInsight.Data.Site.dll', 
      '-o', './src/app/model/entities/SCInsight-Site.metadata.json' ]);      
    return Q.promise.all([spawnInfo1.promise, spawnInfo2.promise])  ;
});

// Not currently needed.
// gulp.task('watch-less', function () {
//     gulp.watch('./app/styles/*.less', ['less']);  // Watch all the .less files, then run the less task
// });

// gulp.task('less', function () {
//     return gulp.src(['./app/styles/*.less'])
//         .pipe(plumber({
//             errorHandler: function (err) {
//                 console.log(err);
//                 this.emit('end');
//             }
//         }))
//         .pipe(less({
//             paths: [path.join(__dirname, 'less', 'includes')]
//         }))
//         .pipe(gulp.dest(function (file) {
//             return file.base;
//         }));
// });




// returns both a promise and the spawned process so that it can be killed if needed.
function spawnExt(command, args, options) {
  var deferred = Q.defer();
  var descr = command + " " + args.join(' ');
  var proc;
  gutil.log('running: ' + descr);
  try {
    proc = xSpawn.spawn(command, args, options);
  } catch(e) {
    gutil.log(e);
    deferred.reject(e);
    return { proc: null, promise: deferred.promise };
  }
  proc.stdout.on('data', function (data) {
    gutil.log(data.toString());
  });
  proc.stderr.on('data', function (data) {
    gutil.log(data.toString());
  });
  proc.on('close', function (data) {
    gutil.log('completed: ' + descr);
    deferred.resolve(data);
  });
  proc.on('error', function (data) {
    gutil.log('completed with error:' + descr);
    gutil.log(data.toString());
    deferred.reject(data);
  });
  return { proc: proc, promise: deferred.promise };
}

