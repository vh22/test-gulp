'use strict';

var path = require('path');
var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var paths = require('../../sliceart_modules/paths.js');

module.exports = function(options) {

    return function() {
        function makeHashKey(file) {
            return path.basename(file);
        }
        return gulp.src(options.src || paths.dev.jade.pathToFiles)
            // .pipe($.plumber({
            //     errorHandler: $.notify.onError(function (err) {
            //         return {
            //             title: 'jade',
            //             message: err.message
            //         };
            //     })
            // }))
            .pipe($.cache($.jade(options.options || {pretty: true}), {
                key: makeHashKey,
                // What on the result indicates it was successful
                success: function (jadeReady) {
                    return console.log(makeHashKey(jadeReady));
                },
                // What to store as the result of the successful action
                value: function(jadeFile) {
                    // Will be extended onto the file object on a cache hit next time task is ran
                    return console.log('!!!!!!!!!!!!!!!', jadeFile);
                }
            }))
            .pipe(gulp.dest(options.dest || paths.dev.folder));
    };

};