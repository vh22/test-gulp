'use strict';

var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var paths = require('../../sliceart_modules/paths.js');
var merge = require('merge-stream');
var glob = require('glob-all');
var path = require('path');
var buffer = require('vinyl-buffer');

module.exports = function(options) {

    return function(done) {

        glob(path.join(options.src || paths.dev.images.pathToFolder, options.spriteFolderMask || 'ico-*'), function (err, files) {
            if (err) {
                done(err);
            }

            files.map(function (folder) {
                var foldersArr = folder.split('/'),
                    currentFolder = foldersArr[foldersArr.length - 1];

                function sprite(folder, options) {
                    var spriteData = gulp.src(path.join(folder, '*.png'))
                        .pipe($.spritesmith({
                            retinaSrcFilter: [path.join(folder, '*@2x.png')],
                            retinaImgName: [options.imgPrefix || 'sprite-'] + currentFolder + '@2x.png',
                            imgName: [options.imgPrefix || 'sprite-'] + currentFolder + '.png',
                            cssName: '_' + [options.stylesPrefix || 'sprite-'] + currentFolder + '.scss'
                        }));
                    var imgStream = spriteData.img
                        .pipe(buffer())
                        .pipe(gulp.dest(options.imgDest || paths.dev.images.pathToFolder));
                    var cssStream = spriteData.css
                        .pipe(gulp.dest(options.stylesDest || paths.dev.sass.pathToFolder));
                    return merge(imgStream, cssStream);
                }

                return sprite(folder, options);

            });
            done();
        });
    };

};