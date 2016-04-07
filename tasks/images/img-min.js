'use strict';

var $ = require('gulp-load-plugins')();
var paths = require('../../sliceart_modules/paths.js');
var gulp = require('gulp');

module.exports = function (options) {

    return function () {

        return gulp.src(options.src || paths.dev.images.pathToFiles)
            .pipe($.plumber({
                errorHandler: $.notify.onError(function (err) {
                    return {
                        title: 'Images error',
                        message: err.message
                    };
                })
            }))
            // .pipe($.debug({title: 'beforeNewer'}))
            // .pipe($.newer(paths.dev.images.pathToFolder))
            // .pipe($.debug({title: 'afterNewer'}))
            .pipe($.imagemin({
                optimizationLevel: 7,
                progressive: true,
                interlaced: true,
                multipass: true
            }))
            // .pipe($.debug({title: 'onExit'}))
            .pipe(gulp.dest(paths.dev.images.pathToFolder));

    };

};