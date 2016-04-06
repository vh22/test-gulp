'use strict';

var $ = require('gulp-load-plugins')();
var paths = require('../sliceart_modules/paths.js');
var gulp = require('gulp');

module.exports = function (options) {

    return function (cb) {
        gulp.src(paths.dev.sass.pathToFiles)
            .pipe($.csscomb())
            .pipe(gulp.dest(options.dest || paths.dev.sass.pathToFiles));
        cb();
    };

};