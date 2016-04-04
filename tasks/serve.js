'use strict';

var browserSync = require('browser-sync').create();

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