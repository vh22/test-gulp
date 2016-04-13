'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var paths = require('../sliceart_modules/paths.js');

module.exports = function(options) {

    return function() {
        browserSync.init({
            notify: options.notify,
            server: {
                baseDir: './'
            },
            startPath: options.src + options.startPage
        });
        gulp.watch(paths.dev.sass.pathToFiles, gulp.series('dev:styles', browserSync.reload));
        gulp.watch(paths.dev.jade.pathToFiles, gulp.series('dev:templates', browserSync.reload));
        gulp.watch([
            paths.dev.jade.pathToFolder + '**/*.json',
            '!' + paths.dev.jade.pathToFolder + 'index.json'
            ],
            gulp.series('dev:templates:config', 'dev:templates', browserSync.reload));
        gulp.watch(paths.dev.js.pathToBrowserifyFiles, browserSync.reload);
        gulp.watch(paths.dev.js.pathToFiles, gulp.series('dev:js:hint'));
        gulp.watch(paths.dev.images.pathToFiles, gulp.series('dev:img:min', browserSync.reload));
        gulp.watch(paths.dev.images.pathToSpriteFiles, gulp.series('dev:img:sprite', browserSync.reload));
        gulp.watch(paths.dev.fonts.pathToFiles, gulp.series(browserSync.reload));
    };

};