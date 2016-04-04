'use strict';

var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var paths = require('../sliceart_modules/paths.js');

module.exports = function(options) {

    return function() {
        return gulp.src(options.src || [paths.dev.jade.pathToFiles, '!**/_*/**'])
            .pipe($.jade(options.options || {}))
            .pipe($.debug({title: 'jade'}))
            .pipe(gulp.dest(options.dest || paths.dev.folder));
    };

};