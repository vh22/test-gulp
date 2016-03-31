'use strict';

var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var paths = require('../sliceart_modules/paths.js');
var merge = require('merge-stream');

module.exports = function(options) {

    return function(cb) {

        return $.folders('./app/images', function (folder) {

            var folderCheck = new RegExp(options.spriteFolderPrefix, 'g'),
                imgStream,
                cssStream,
                spriteStream;

            if (folder.match(folderCheck)) {

                var spriteData = gulp.src('app/images/ico-first/*.png')
                    .pipe($.spritesmith({
                        imgName: options.imgPrefix + folder + '.png',
                        cssName: options.stylesPrefix + folder + '.scss'
                    }));
                imgStream = spriteData.img
                    .pipe(gulp.dest(options.imgDest));
                cssStream = spriteData.css
                    .pipe(gulp.dest(options.stylesDest));

                spriteStream = merge(imgStream, cssStream);

                return spriteStream;
            }
            
        }, cb())();
    };

};