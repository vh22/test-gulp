'use strict';

var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var paths = require('../../sliceart_modules/paths.js');

module.exports = function(options) {

    return function() {
        return gulp.src(options.src || paths.dev.jade.pathToFiles)
            .pipe($.plumber({
                errorHandler: $.notify.onError(function (err) {
                    return {
                        title: 'jade compile error',
                        message: err.message
                    };
                })
            }))
            .pipe($.changed(options.dest || paths.dev.folder, {extension: '.html'}))
            .pipe($.if(global.isWatching, $.cached('jadeFiles')))
            //------------------------------------------------------------------
            // if u need compile all files that relative with components file  |
            //----------| 1 string below |--------------------------------------
            .pipe($.if(options.relativeRefresh || false, $.jadeInheritance({basedir: options.jadeFolder || paths.dev.jade.pathToFolder})))
            .pipe($.filter(function (file) {
                return !/\/_/.test(file.path) && !/^_/.test(file.relative);
            }))
            .pipe($.jade(options.options || {
                    pretty: true
                }))
            .pipe(gulp.dest(options.dest || paths.dev.folder));
    };
};