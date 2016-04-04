'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var assign = require('lodash.assign');
var glob = require('glob');
var paths = require('../sliceart_modules/paths.js');

module.exports = function (options) {

    var isProduction = options.isProduction || false,
        settings = options.settings || {},
        opts = assign({}, watchify.args, settings);

    return function (done) {
        glob(options.src || paths.dev.js.pathToOurFiles, function (err, files) {
            if (err) {
                done(err);
            }

            files.map(function (entry) {
                var currentOpts = assign({}, opts, {entries: [entry]});
                browserify(currentOpts)
                    .bundle()
                    .pipe(source(entry))
                    .pipe($.rename({
                        extname: '.bundle.js'
                    }))
                    .pipe(buffer())
                    .pipe($.if(!isProduction, $.sourcemaps.init({loadMaps: true})))
                    .pipe($.if(!isProduction, $.sourcemaps.write()))
                    .pipe($.if(isProduction, $.uglify()))
                    .pipe($.debug({title: 'after'}))
                    .pipe($.if(!isProduction,
                        gulp.dest(options.dest || './'),
                        gulp.dest(options.dest || './')));
            });
            done();
        });
    };

};
