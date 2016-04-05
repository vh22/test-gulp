'use strict';

var $ = require('gulp-load-plugins')();
var paths = require('../sliceart_modules/paths.js');
var gulp = require('gulp');
var bs = require('browser-sync').create();

module.exports = function (options) {

    var isProduction = options.isProduction || false;

    return function () {
        return gulp.src(options.src || paths.dev.sass.pathToFiles)
            .pipe($.if(!isProduction, $.sourcemaps.init()))
            .pipe($.sass())
            .pipe($.postcss(options.processors))
            .pipe($.if(isProduction, $.csso()))
            .pipe($.if(!isProduction, $.sourcemaps.write()))
            .pipe(gulp.dest(options.dest || paths.dev.css.pathToFolder))
            .pipe(bs.stream({
                once: true,
                match: '**/*.css'
            }));
    };

};