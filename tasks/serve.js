'use strict';

var browserSync = require('browser-sync').create();
var paths = require('../sliceart_modules/paths.js');

module.exports = function(options) {

    return function() {
        browserSync.init({
            notify: options.notify,
            server: {
                baseDir: './'
            },
            startPath: options.src + options.startPage
        });

        browserSync.watch(options.src + '**/*.*').on('change', browserSync.reload);
    };

};