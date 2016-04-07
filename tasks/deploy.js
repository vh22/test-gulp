'use strict';

var $ = require('gulp-load-plugins')();
var paths = require('../sliceart_modules/paths.js');
var host = require('../sliceart_modules/host.js');
var ftppass = require('../sliceart_modules/gulp.ftppass.js');
var gulp = require('gulp');

module.exports = function (options) {

  return function () {

      return gulp.src(options.src || paths.build.pathToAllFiles)
          .pipe($.ftp({
              host: host.name,
              user: ftppass.username,
              pass: ftppass.password,
              port: 21,
              remotePath: host.path
          }));

  };

};