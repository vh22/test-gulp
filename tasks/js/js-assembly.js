'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var assign = require('lodash.assign');
var glob = require('glob-all');
var paths = require('../../sliceart_modules/paths.js');

module.exports = function (options) {

    var isProduction = options.isProduction || false,
        browserifyWatchifySettings = assign(options.browserifySettings || {}, watchify.args),
        bundleExtName = options.extname || '.bundle.js';

    return function (done) {
        var excludedBundle = '!' + paths.dev.js.pathToFolder + '*' + bundleExtName;
        glob([options.src || paths.dev.js.pathToOurFiles, excludedBundle], function (err, files) {
            if (err) {
                done(err);
            }

            files.map(function (entry) {
                var currentOpts = assign(browserifyWatchifySettings, {entries: [entry], plugin: [watchify]}),
                    b = browserify(currentOpts);

                function bundle(entry) {
                    return b.bundle()
                        .pipe(source(entry))
                        .pipe($.rename({
                            extname: bundleExtName
                        }))
                        .pipe(buffer())
                        .pipe($.if(!isProduction, $.sourcemaps.init({loadMaps: true})))
                        .pipe($.if(!isProduction, $.sourcemaps.write()))
                        .pipe($.if(isProduction, $.uglify()))
                        .pipe($.if(!isProduction,
                            gulp.dest(options.dest || './'),
                            gulp.dest(options.dest || './')));
                }
                b.on('update', function () {
                    console.log('rebundle');
                    return bundle(entry);
                });
                b.on('log', function () {
                    return $.util.log;
                });
                return bundle(entry);
            });
            done();
        });
    };

};
