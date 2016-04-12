'use strict';

var $ = require('gulp-load-plugins')();
var paths = require('../../sliceart_modules/paths.js');
var gulp = require('gulp');
var validate = require('gulp-w3c-html');

module.exports = function (options) {

    return function () {

        return gulp.src(options.src || paths.dev.html.pathToFiles)
            .pipe($.plumber({
                errorHandler: $.notify.onError(function (err) {
                    return {
                        title: 'Html w3c error',
                        message: err.message
                    };
                })
            }))
            .pipe(validate());
            // .pipe($.rename({
            //     basename: 'htmlValidationResult',
            //     extname: '.json'
            // }))
            // .pipe(gulp.dest(options.dest || 'tmp/'));

    };

};