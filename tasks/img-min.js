'use strict';

var $ = require('gulp-load-plugins')();
var paths = require('../sliceart_modules/paths.js');
var gulp = require('gulp');
var combine = require('stream-combiner2').obj;

module.exports = function(options) {

    return function() {
        return combine(
            gulp.src(options.src || paths.dev.images.pathToFiles),
            $.newer(options.dest || paths.dev.images.pathToFolder),
            $.imagemin({
                optimizationLevel: 7,
                progressive: true,
                interlaced: true,
                multipass: true
            }),
            gulp.dest(options.dest || paths.dev.images.pathToFolder)
        ).on('image optimize error', $.notify.onError());
    };

};