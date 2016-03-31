'use strict';

var $ = require('gulp-load-plugins')();
var paths = require('../sliceart_modules/paths.js');
var gulp = require('gulp');
var combine = require('stream-combiner2').obj;

module.exports = function(options) {

    return function() {
        return combine(
            gulp.src(options.src || paths.dev.sass.pathToFiles),
            $.sourcemaps.init(),
            $.sass(),
            $.postcss(options.processors),
            $.sourcemaps.write(),
            gulp.dest(options.dest || paths.dev.css.pathToFolder)
        ).on('sass error', $.notify.onError());
    };

};