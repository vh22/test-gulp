
'use strict';

var $ = require('gulp-load-plugins')();
var paths = require('../sliceart_modules/paths.js');
var gulp = require('gulp');
var nowDate = new Date();
var nameOfArchive = 'GULP-test' + '-' + nowDate.toISOString().split('T')[0] + '.zip';

module.exports = function(options) {

    return function() {
        return gulp.src(options.src || paths.build.folder + '**/*')
            .pipe($.zip(nameOfArchive.toLowerCase().replace(/-/g, '_')))
            .pipe(gulp.dest(options.dest || process.cwd()));
    };

};