'use strict';

var $ = require('gulp-load-plugins')();
var paths = require('../sliceart_modules/paths.js');
var gulp = require('gulp');

module.exports = function (options) {

    return function () {
        return gulp.src(options.src || paths.dev.images.pathToFiles)
            .pipe($.plumber({
                errorHandler: $.notify.onError(function (err) {
                    return {
                        title: 'Image copy error',
                        message: err.message
                    };
                })
            }))
            .pipe(gulp.dest(options.dest || paths.build.images.pathToFolder));
    };

};