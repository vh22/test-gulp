'use strict';

var $ = require('gulp-load-plugins')();
var paths = require('../../sliceart_modules/paths.js');
var gulp = require('gulp');
// var syntax_scss = require('postcss-scss');

module.exports = function (options) {

    var isProduction = options.isProduction || false;

    return function () {
        return gulp.src(options.src || paths.dev.sass.pathToFiles)
            .pipe($.plumber({
                errorHandler: $.notify.onError(function (err) {
                    return {
                        title: 'Styles assembly',
                        message: err.message
                    };
                })
            }))
            .pipe($.if(!isProduction, $.sourcemaps.init()))
            .pipe($.sassGlob())
            // .pipe($.postcss(options.linter || [], options.syntax || {syntax: syntax_scss}))
            .pipe($.sass())
            .pipe($.postcss(options.postProcessors || []))
            .pipe($.if(isProduction, $.csso()))
            .pipe($.if(!isProduction, $.sourcemaps.write()))
            .pipe(gulp.dest(options.dest || paths.dev.css.pathToFolder));
    };

};