'use strict';

var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var combine = require('stream-combiner2').obj;
var del = require('del');

module.exports = function(options) {

    return function() {
        return combine(
            gulp.src(options.src),
            // $.cached('styles'),
            $.debug({title: 'scss'}),
            $.sourcemaps.init(),
            $.sass(),
            $.postcss(options.processors),
            $.sourcemaps.write(),
            $.debug({title: 'css'}),
            gulp.dest(options.dest)
        ).on('error', $.notify.onError());
    };

};