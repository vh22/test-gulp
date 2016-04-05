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
        browserSync.watch('**/*').on('change', browserSync.reload);
        // browserSync.watch('**/*.css').on('change', function () {
        //     return browserSync.reload('all.css');
        // });
        // browserSync.watch('**/*.html').on('change', function () {
        //     return browserSync.reload('app/*.html');
        // });
        // browserSync.watch('**/*.bundle.js').on('change', function () {
        //     return browserSync.reload('app/js/*.bundle.js');
        // });
    };

};