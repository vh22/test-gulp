'use strict';

var browserSync = require('browser-sync').create();

module.exports = function(options) {

    return function() {

        browserSync.init({
            server: {
                baseDir: options.baseDir
            }
        });

        browserSync.watch(options.src + '**/*.*').on('change', browserSync.reload);
    };

};