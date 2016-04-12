'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var through2 = require('through2').obj;
var fs = require('fs');
var paths = require('../../sliceart_modules/paths.js');
var combine = require('stream-combiner2').obj;
var mkpath = require('mkpath');

module.exports = function (options) {

    return function () {

        var jshintResults = {};

        var cacheFilePath = options.cacheFilePath || process.cwd() + '/tmp/';

        var cacheFileName = options.cacheFileName || 'hintCache.json';

        var cacheFullName = cacheFilePath + cacheFileName;

        var ignoreBundle = options.ignoreBundle || '*.bundle.js';

        mkpath(cacheFilePath, function (err) {
            if (err) {
                throw err
            } else {
                fs.writeFile(cacheFileName);
            }
        });

        try {
            jshintResults = JSON.parse(fs.readFileSync(cacheFullName));
        } catch (e) {
        }

        return gulp.src(options.src || paths.dev.js.pathToFiles, {read: false})
            .pipe($.ignore.exclude(ignoreBundle))
            .pipe($.if(
                function (file) {
                    return jshintResults[file.path] && jshintResults[file.path].mtime === file.stat.mtime.toJSON();
                },
                through2(function (file, enc, callback) {
                    file.jshint = jshintResults[file.path].jshint;
                    callback(null, file);
                }),
                combine(
                    through2(function (file, enc, callback) {
                        file.contents = fs.readFileSync(file.path);
                        callback(null, file);
                    }),
                    $.jshint(),
                    through2(function (file, enc, callback) {
                        jshintResults[file.path] = {
                            jshint: file.jshint,
                            mtime: file.stat.mtime
                        };
                        callback(null, file);
                    })
                )
            ))
            .on('end', function () {
                fs.writeFileSync(cacheFullName, JSON.stringify((jshintResults)));
            })
            .pipe($.jshint.reporter('jshint-stylish'));

    };

};