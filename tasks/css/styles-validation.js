'use strict';

var $ = require('gulp-load-plugins')();
var paths = require('../../sliceart_modules/paths.js');
var gulp = require('gulp');
var validate = require('gulp-w3c-css');

module.exports = function (options) {

    return function () {

        return gulp.src(options.src || paths.dev.css.pathToFiles)
            .pipe($.plumber({
                errorHandler: $.notify.onError(function (err) {
                    return {
                        title: 'Css w3c error',
                        message: err.message
                    };
                })
            }))
            .pipe(validate())
            .pipe(gulp.dest(options.dest || 'tmp/css'));

    };

};