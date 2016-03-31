"use strict";

var gulp = require('gulp');
var paths = require('./sliceart_modules/paths.js');
var autoprefixer = require('autoprefixer');

function lazyRequireTask(taskName, path, options) {
    options = options || {};
    options.taskName = taskName;
    gulp.task(taskName, function(callback) {
        var task = require(path).call(this, options);

        return task(callback);
    });
}

gulp.task('watch', function() {
    gulp.watch(paths.dev.sass.pathToFiles, gulp.series('styles:dev'));
});

//
// task for styles
//------------------------
lazyRequireTask('clean:styles', './tasks/clean', {
    dest: paths.dev.css.pathToFolder
});
lazyRequireTask('styles:assembly', './tasks/styles-assembly', {
    src: paths.dev.sass.pathToFiles,
    dest: paths.dev.css.pathToFolder,
    processors: [autoprefixer({browsers: ['last 2 versions', 'ie 9']})]
});
// main styles task
gulp.task('styles:dev', gulp.series(
    'clean:styles',
    gulp.parallel('styles:assembly')
));

gulp.task('default', function() {
    gulp.series('watch');
});