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
        isBabel = options.isBabel || true,
        browserifyWatchifySettings = assign(options.browserifySettings || {}, watchify.args),
        bundleExtName = options.extname || '.bundle.js';

    return function (done) {
        var bundleFiles = paths.dev.js.pathToFolder + '*' + bundleExtName,
            excludeBundleFiles = '!' + bundleFiles;
        glob([options.src || paths.dev.js.pathToOurFiles, excludeBundleFiles], function (err, files) {
            if (err) {
                done(err);
            }

            files.map(function (entry) {
                var currentOpts = assign(browserifyWatchifySettings, {entries: [entry], plugin: [watchify]}),
                    b = browserify(currentOpts).transform('babelify', {presets: ['es2015']});

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
                        .pipe(gulp.dest(options.dest || './'))
                        .pipe($.if(isProduction, gulp.src(bundleFiles)
                            .pipe(gulp.dest(options.buildDest || paths.build.js.pathToFolder))
                        ));
                }
                b.on('update', function () {
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
